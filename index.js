const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MongoDb,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('success');
    }).catch(err => {
        console.log(err);
    })

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 10
    }
})

const books = mongoose.model('books', bookSchema)

app.get('/get/books', async (req, res) => {
    res.status(200).send(await books.find())
})
app.post('/create/book', async (req, res) => {
    const book = new books({
        name: req.body.name
    })
    await book.save()
    // const newBook = await books.create(req.body)
    res.status(201).send(book)
})

app.put('/update/book/:id', async (req, res) => {
    const book = await books.findById(req.params.id)
    book.name = req.body.name
    await book.save()
    res.status(200).send({
        message: "Book successfully updated",
        book
    })
})

app.delete('/delete/book/:id', async (req, res) => {
    const book = await books.findByIdAndDelete(req.params.id)
    res.status(200).send({
        message: "Book successfully deleted",
        book
    })
})

app.listen(PORT, () => {
    console.log('http://localhost:' + PORT + ' is running');
})