const router = require('express').Router();
let item = require('../models/item.model.js')

//route that returns all the items in the database that aren't marked as deleted
router.get('/item', function(req, res, next) {
    item.find({deleted: {$ne: true}}, function(err, lists) {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        res.json(lists);
    });
});

//route that will return an item based on it's Id
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

//route for updating an item based on it's Id in the database
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