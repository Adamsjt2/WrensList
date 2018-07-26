//sets up the Schema for the database items

const mongoose = require('mongoose');

const listitemSchema = new mongoose.Schema({
    description: String,
    feeling: String,
    created_at: { type: Date, default: Date.now },
    deleted: { type: Boolean },
});

const List = mongoose.model('List', listitemSchema);

module.exports = List;

