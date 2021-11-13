const express = require('express')
const router = express.Router()
const Todo = require('../models/todo')

// GET all
router.get('/', async (req, res) => {
    try {
        const allItems = await Todo.find()
    } catch(err) {
        res.status(500).send()
    }
    res.send('Get All')
})

// GET One
router.get('/:id', (req, res) => {
    res.send('Get one ' + req.params.id)
})

// Create One
router.post('/', (req, res) => {
    res.send('Create one')
})

// Update One
router.patch('/:id', (req, res) => {
    res.send('Update One ' + req.params.id)
})

// Delete One
router.delete('/:id', (req, res) => {
    res.send('Delete One ' + req.params.id)
})

module.exports = router