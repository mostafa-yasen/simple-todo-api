const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const { ApiResponse } = require('../models/response')

async function authenticate(req, res, next) {
    const token = req.header('JWT-Token')
    try {
        if (!token) {
            let msg = `You are not authorized`
            return res.status(401).json(new ApiResponse(401, 'Unauthorized', null, msg, msg))
        }
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        if (!verified) {
            let msg = `You are not authorized`
            return res.status(401).json(new ApiResponse(401, 'Unauthorized', null, msg, msg))
        }
        const user = await User.findById(verified._id)
        if (!user) {
            let msg = `User not found`
            return res.status(404).json(new ApiResponse(404, 'NotFound', null, msg, msg))
        }
        req.user = user
        next()
    } catch(err) {
        let msg = `You are not authorized`
        return res.status(401).json(new ApiResponse(401, 'Unauthorized', null, msg, msg))
    }
}

module.exports = authenticate
