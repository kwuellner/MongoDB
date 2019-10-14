let mongoose = require("mongoose");

// save reference to Schema 
let Schema = mongoose.Schema;

// creating a new user schema object 
let SchemaArticle = new Schema({
    title: {
        type: String,
        required: true
    },

    link: {
        type: String,
        required: true
    },

    summary: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    saved: {
        type: Boolean
    },

    // note stores the note id 
    // this allows us to populae the article with the note associated to it
    note: {
        type: Schema.Types.ObjectId,
        ref: "note"
    }
});

// creating model from above schema
let article = mongoose.model("Article", SchemaArticle);

module.exports = article;