const express = require("express");
const router = new express.Router();
const Book = require("../models/book");
const ExpressError = require("../expressError");

const jsonschema = require('jsonschema');
const createbookSchema = require('../schemas/createbook.json');
const updatebookSchema = require('../schemas/update.json');

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, createbookSchema);

    if(!result.valid){
      let listOfErrors = result.errors.map(error => error.stack);
      throw new ExpressError (listOfErrors, 400);
    }

    const book = await Book.create(req.body);
    return res.status(201).json({ book });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:isbn", async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, updatebookSchema);

    if(!result.valid){
      let listOfErrors = result.errors.map(error => error.stack);
      throw new ExpressError(listOfErrors, 400)
    }

    const book = await Book.update(req.params.isbn, req.body);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
