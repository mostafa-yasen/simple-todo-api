const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Todo', todoSchema)
