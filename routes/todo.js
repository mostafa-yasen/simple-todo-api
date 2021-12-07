const express = require('express')
const router = express.Router()
const Todo = require('../models/todo')
const ApiResponse = require('../models/response').ApiResponse


const authenticate = require('./auth.middleware')

// GET all
router.get('/', authenticate, async (req, res) => {
    try {
        const allItems = await Todo.find({owner: req.user.email})
        return res.json(new ApiResponse(200, null, allItems))
    } catch(err) {
        let msg = err.message
        return res.status(500).json(new ApiResponse(
            code=500, errorCode="InternalServerError",
            data=null, message=msg, _message=msg))
    }
})

// GET One
router.get('/:id', authenticate, getTodoItem, (req, res) => {
    return res.json(new ApiResponse(200, null, res.todoItem))
})

// Create One
router.post('/', authenticate, async (req, res) => {
    const body = req.body
    if (!body.title) {
        let msg = `Title field can not be empty`
        return res.status(400).json(new ApiResponse(400, 'BadRequest', null, msg, msg))
    }
    try {
        let newItem = new Todo({ title: body.title, owner: req.user.email })
        if (body.done) {
            newItem.done = body.done
        }
        newItem = await newItem.save()
        res.status(201).json(new ApiResponse(201, null, newItem, 'Item Created'))

    } catch(err) {
        let msg = err.message
        return res.status(500).json(new ApiResponse(400, 'BadRequest', null, msg, msg))
    }
})

// Update One
router.patch('/:id', authenticate, getTodoItem, async (req, res) => {
    let body = req.body
    if (body.title === "") {
        let msg = `Title field can not be empty`
        res.status(400).json(new ApiResponse(400, 'BadRequest', null, msg, msg))
    }

    if (body.title.length) {
        res.todoItem.title = body.title
    }
    res.todoItem.done = body.done || false
    let updatedItem = await res.todoItem.save()
    res.json(new ApiResponse(200, null, updatedItem, "Item updated"))
})

// Delete One
router.delete('/:id', authenticate, getTodoItem, async (req, res) => {
    try {
        await res.todoItem.remove()
        let msg = `Item removed`
        return res.json(new ApiResponse(200, null, null, msg, msg))
    } catch(err) {
        let msg = err.message
        return res.status(500).json(new ApiResponse(500, 'ServerError', null, msg, msg))
    }
})

// Middleware
async function getTodoItem(req, res, next) {
    let todoItem
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            let msg = `Can not find item ${req.params.id}`
            return res.status(404).json(new ApiResponse(404, 'NotFound', null, msg, msg))
        }
        todoItem = await Todo.findById(req.params.id)
        if (!todoItem) {
            let msg = `Can not find item ${req.params.id}`
            return res.status(404).json(new ApiResponse(404, 'NotFound', null, msg, msg))
        }
        if (todoItem.owner != req.user.email) {
            let msg = `You are not authorized on this item`
            return res.status(401).json(new ApiResponse(401, 'Unauthorized', null, msg, msg))
        }
    } catch (err) {
        let msg = err.message
        return res.status(500).json(new ApiResponse(500, 'ServerError', null, msg, msg))
    }
    res.todoItem = todoItem
    next()
}

module.exports = router