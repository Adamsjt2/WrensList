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

router.put('/list/:listId', function(req, res, next) {
    const {listId} = req.params;
    const list = LIST.find(entry => entry.id === listId);
    if (!list) {
        return res.status(404).end(`Could not find list '${listId}'`);
    }

    list.description = req.body.description;
    list.feeling = req.body.feeling;
    res.json(list);
});
  
router.delete('/list/:listId', function(req, res, next) {
    res.end(`Deleting a list item '${req.params.listId}'`);
});
  
router.get('/list/:listId', function(req, res, next) {
    const {listId} = req.params;

    const list = LIST.find(entry => entry.id === listId);
    if (!list) {
        return res.status(404).end(`Could not find the list item '${listId}'`);
    }
    res.json(list);
});
  
module.exports = router;