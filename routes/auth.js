const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { ApiResponse } = require('../models/response')
const User = require('../models/user.model')

const router = express.Router()

router.post('/register', validateRegister, async (req, res) => {
    const email = req.body.email
    const fullName = req.body.fullName
    const userPassword = req.body.password

    try {
        const password = await bcrypt.hash(userPassword, 10)
        const usr = new User({
            email, fullName, password, created: new Date()
        })
        await usr.save()
        return res.status(201).json(new ApiResponse())
    } catch(err) {
        let msg = err.message
        return res.status(201).json(new ApiResponse(500, 'ServerError', null, msg, msg))
    }
})

router.post('/login', validateLogin, async (req, res) => {
    const user = req.user
    try {
        const match = await bcrypt.compare(req.body.password, user.password)
        if (!match) {
            let msg = `Wrong password`
            return res.status(403).json(new ApiResponse(403, 'Forbidden', null, msg, msg))
        }
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)

        res.header('Access-Control-Expose-Headers', 'JWT-Token')
        res.header('JWT-Token', token).json(new ApiResponse(200, '', {email: user.email}, 'Logged in successfully'))

    } catch(err) {
        let msg = err.message
        return res.status(500).json(new ApiResponse(500, 'ServerError', null, msg, msg))
    }
})


async function validateLogin(req, res, next) {
    if (!req.body.email) {
        let msg = `Email field is required`
        return res.status(400).json(new ApiResponse(400, 'BadRequest', msg))
    }
    if (!req.body.password) {
        let msg = `Password field is required`
        return res.status(400).json(new ApiResponse(400, 'BadRequest', msg))
    }
    let usr = await User.findOne({email: req.body.email})
    if (!usr) {
        let msg = `Wrong email or password`
        return res.status(403).json(new ApiResponse(400, 'Forbidden', null, msg, msg))
    }
    req.user = usr
    next()
}

async function validateRegister(req, res, next) {
    if (!req.body.email) {
        let msg = `Email field is required`
        return res.status(400).json(new ApiResponse(400, 'BadRequest', msg))
    }
    if (!req.body.password) {
        let msg = `Password field is required`
        return res.status(400).json(new ApiResponse(400, 'BadRequest', msg))
    }
    if (!req.body.fullName) {
        let msg = `Full Name field is required`
        return res.status(400).json(new ApiResponse(400, 'BadRequest', msg))
    }

    const reg = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/
    if (!req.body.password.match(reg)) {
        let msg = `Too weak password`
        return res.status(417).json(new ApiResponse(417, 'ExpectationFaild', null, msg, msg))
    }

    const exists = await User.findOne({ email: req.body.email })
    if (exists) {
        let msg = `Email already registered`
        return res.status(417).json(new ApiResponse(417, 'ExpectationFaild', msg))
    }
    next()
}

module.exports = router
