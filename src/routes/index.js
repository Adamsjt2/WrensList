const router = require('express').Router();
let list = require('../models/list.model.js')


router.get('/list', function(req, res, next) {
    list.find({}, function(err, lists) {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        res.json(lists);
    });
});
  
router.post('/list', function(req, res, next) {
    const listData = {
        description: req.body.description,
        feeling: req.body.feeling,
    };
    list.create(listData, function(err, newListItem) {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }

        res.json(newListItem);
    })

});

router.put('/list/:itemId', function(req, res, next) {
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
  
router.delete('/list/:listId', function(req, res, next) {
    res.end(`Deleting a list item '${req.params.listId}'`);
});
  
router.get('/list/:itemId', function(req, res, next) {
    const {itemId} = req.params;

    const list = LIST.find(entry => entry.id === itemId);
    if (!list) {
        return res.status(404).end(`Could not find the list item '${listId}'`);
    }
    res.json(list);
});
  
module.exports = router;