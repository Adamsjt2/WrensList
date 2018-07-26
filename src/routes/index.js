const router = require('express').Router();
let item = require('../models/item.model.js')


router.get('/item', function(req, res, next) {
    item.find({deleted: {$ne: true}}, function(err, lists) {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        res.json(lists);
    });
});

router.get('/item/:itemId', function (req, res, next) {
    const itemId = req.params.itemId

    item.findById(itemId, function (err, item) {
        if (err) {
            return res.status(500).json(err)
        }
        res.json(item)
    })
})

//route for adding a new item to the database
router.post('/item', function(req, res, next) {
    const listData = {
        description: req.body.description,
        feeling: req.body.feeling,
    };
    item.create(listData, function(err, newListItem) {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }

        res.json(newListItem);
    })

});

//route for updating an item in the database
router.put('/item/:itemId', function(req, res, next) {
    const itemId = req.params.itemId;

    item.findById(itemId, function(err, item) {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        if (!item) {
            return res.status(404).json({message: "couldn't find the item"});
        }

        item.description = req.body.description;
        item.feeling = req.body.feeling;
        
        item.save(function(err, saveditem) {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }
            res.json(saveditem);
        })
    })
});


//route for marking an item in the data base as being deleted: true
router.delete('/item/:itemId', function(req, res, next) {
    const itemId = req.params.itemId

    item.findById(itemId, function (err, item) {
        if (err) {
            console.log(err)
            return res.status(500).json(err)
        }
        if (!item) {
            return res.status(404).json({message: 'Item not found'})
        }

        item.deleted = true

        item.save(function (err, deletedItem) {
            res.json(deletedItem)
        })
    })
});
  
module.exports = router;