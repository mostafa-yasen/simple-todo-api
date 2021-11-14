
exports.ApiResponse = class ApiResponse {
    constructor(code, errorCode, data, message, _message) {
        this.code = code || 200
        this.errorCode = errorCode || null
        this.data = data || null
        this.message = message || null
        this._message = _message || null
    }
}
