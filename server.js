let express = require("express");
let bodyParser = require("body-parser");
let logger = require("morgan");
let mongoose = require("mongoose");
let exphbs = require("express-handlebars");

//port
let PORT = process.env.PORT || 27017;

//app express
let app = express();

//Connection
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// mongoose.connect(MONGODB_URI);

// mongoose.connect("mongodb://localhost:27017/WiredTiger", { useNewUrlParser: true });

// scrapping tools
let axios = require("axios");
let cheerio = require("cheerio");

let db = require("./models");


// middleware
// morgan
app.use(logger("dev"));
// body-parser for form submissions
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// static server
app.use(express.static(process.cwd() + "/public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// routes
// scraping articles
app.get("/scrape", function (req, res) {
    axios.get("https://www.npr.org/music/").then(function (response) {
        let $ = cheerio.load(response.data);
        $("article.story").each(function (i, element) {
            let result = {};

            result.link = $(this).find("a").attr("href");
            result.title = $(this).find("h2").text().trim();
            result.title = $(this).find("p.summary").text();
            result.image = $(this).find("a").find("img").attr("src");
            result.saved = false;
            db.Article.create(result)
                .then(function (dbArticle) {
                    res.json(dbArticle)
                })
                .catch(function (err) {
                    res.json(err);
                });
        });
    });
});

// route for saved articles
app.get("/", function (req, res) {
    db.Article.find({ saved: false })
        .then(function (dbArticle) {
            let expObject = {
                articles: dbArticle
            };
            res.render("index", expObject);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// updating article status to saved
app.post("/save/:id", function (req, res) {
    db.Article.update({ _id: req.params.id }, { $set: { saved: true } })
        .then(function (dbArticle) {
            res.json("dbArticle");
        })
        .catch(function (err) {
            res.json(err);
        });
});

// updating article status to unsaved
app.post("/unsave/:id", function (req, res) {
    db.Article.update({ _id: req.params.id }, { $set: { saved: false } })
        .then(function (dbArticle) {
            res.json("dbArticle");
        })
        .catch(function (err) {
            res.json(err);
        });
});

//saved articles
app.get("/saved", function (req, res) {
    dbArticle.find({ saved: true })
        .then(function (dbArticles) {
            let expObject = {
                articles: dbArticles
            };
            res.render("saved", expObject);
        })
        .catch(function (err) {
            res.json(err);
        });
});

//getting comments for article
app.get("/getComments/:id", function (req, res) {
    db.article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// creating new comment in db
app.post("/createNote/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
            res.json(err)
        });
});

// server start
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!")
});