const express = require('express')
const router = express.Router()
const Todo = require('../models/todo')
const ApiResponse = require('../models/response').ApiResponse

// GET all
router.get('/', async (req, res) => {
    try {
        const allItems = await Todo.find()
        return res.json(new ApiResponse(data=allItems))
    } catch(err) {
        let msg = err.message
        return res.status(500).json(new ApiResponse(
            code=500, errorCode="InternalServerError",
            data=null, message=msg, _message=msg))
    }
})

// GET One
router.get('/:id', getTodoItem, (req, res) => {
    res.send('Get one ' + req.params.id)
})

// Create One
router.post('/', async (req, res) => {
    const body = req.body
    if (!body.title) {
        let msg = `Title field can not be empty`
        return res.status(400).json(new ApiResponse(400, 'BadRequest', null, msg, msg))
    }
    try {
        let newItem = new Todo({ title: body.title })
        if (body.done) {
            newItem.done = body.done
        }
        newItem = await newItem.save()
        res.status(201).json(new ApiResponse(201, null, newItem))

    } catch(err) {
        let msg = err.message
        return res.status(500).json(new ApiResponse(400, 'BadRequest', null, msg, msg))
    }
})

// Update One
router.patch('/:id', getTodoItem, (req, res) => {
    res.send('Update One ' + req.params.id)
})

// Delete One
router.delete('/:id', getTodoItem, (req, res) => {
    res.send('Delete One ' + req.params.id)
})

// Middleware
async function getTodoItem(req, res, next) {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            let msg = `Can not find item ${req.params.id}`
            return res.status(404).json(new ApiResponse(404, 'NotFound', null, msg, msg))
        }
        let todoItem = await Todo.findById(req.params.id)
        if (!todoItem) {
            let msg = `Can not find item ${req.params.id}`
            return res.status(404).json(new ApiResponse(404, 'NotFound', null, msg, msg))
        }
    } catch (err) {
        let msg = err.message
        return res.status(500).json(new ApiResponse(500, 'ServerError', null, msg, msg))
    }
    res.todoItem = todoItem
    next()
}

module.exports = router