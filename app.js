
/********************************************************************************* 
 * ITE5315 – Assignment 4 * 
 * I declare that this assignment is my own work in accordance with Humber Academic Policy. 
 *  No part of this assignment has been copied manually or electronically from any other source 
 *  (including web sites) or distributed to other students. *
 * Name: Abin Mathew Student ID: N01579677 Date: 2024-03-26 * 
 * * ********************************************************************************/

var express = require("express");
var mongoose = require("mongoose");
var app = express();
var database = require("./config/database");
var bodyParser = require("body-parser"); // pull information from HTML POST (express4)

var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ extended: "true" })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json

mongoose.connect(database.url);

var book = require("./models/Book");  


//get all book data from db
app.get("/api/books", function (req, res) {
  book.find()
    .then((books) => {
      res.json(books); // return all books in JSON format
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});


// get a book with ID of 1
app.get("/api/books/:book_id", function (req, res) {
  let id = req.params.book_id;
  book.findById(id)
    .then((book) => {
      res.json(book);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});


// create book and send back all books after creation
app.post('/api/books', function(req, res) {
    console.log(req.body);
    
    // Using the promise returned by Model.create()
    book
      .create({
        title: String,
        author: String,
        price: mongoose.Schema.Types.Mixed,
        "price (including used books)": mongoose.Schema.Types.Mixed,
        pages: Number,
        avg_reviews: Number,
        n_reviews: Number,
        star: String,
        dimensions: String,
        weight: String,
        language: String,
        publisher: String,
        ISBN_13: String,
        complete_link: String
      })
      .then((book) => {
        // If successful, we now fetch all books to return
        return book.find();
      })
      .then((books) => {
        res.json(books);
      })
      .catch((err) => {
        res.send(err);
      });
});

// update an book and send back updated book details
app.put('/api/books/:book_id', function(req, res) {
    console.log(req.body);

    let id = req.params.book_id;
    var data = {
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      "price (including used books)": req.body["price (including used books)"],
      pages: req.body.pages,
      avg_reviews: req.body.avg_reviews,
      n_reviews: req.body.n_reviews,
      star: req.body.star,
      dimensions: req.body.dimensions,
      weight: req.body.weight,
      language: req.body.language,
      publisher: req.body.publisher,
      ISBN_13: req.body.ISBN_13,
      complete_link: req.body.complete_link
    };
    
    // Using the promise returned by findByIdAndUpdate()
    book.findByIdAndUpdate(id, data, { new: true }).then(book => {
        res.send('Successfully! book updated - ' + book.name);
    }).catch(err => {
        res.send(err);
    });
});

// delete a book by id
app.delete("/api/books/:book_id", function (req, res) {
  console.log(req.params.book_id);
  let id = req.params.book_id;
  book.deleteOne(
    {
      _id: id,
    }).then(() => {
        res.send("Successfully! book has been Deleted.");
    }).catch(err => {
        res.status(500).send(err);
    })
});

app.listen(port);
console.log("App listening on port : " + port);
