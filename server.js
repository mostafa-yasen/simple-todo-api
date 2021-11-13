const PORT = 9090
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')



mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection

db.on('error', (err) => {
    console.error(err)
})

db.once('open', () => {
    console.log('Connected to Database')
})

const app = express()

app.use(express.json())
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`)
})
