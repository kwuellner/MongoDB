let mongoose = require("mongoose");

// save reference to Schema constructor
let Schema = mongoose.Schema;

// creating new note using schema constructor
let SchemaNote = new Schema({
    title: String,
    body: String
});

//creating our model from the schema
let Note = mongoose.model("Note", SchemaNote);

module.exports = Note;

