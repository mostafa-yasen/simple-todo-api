
exports.Respons = class Response {
    constructor(code=200, error_code=null, data=null, message=null, _message=null) {
        this.code = code || null
        this.error_code = error_code || null
        this.data = data || null
        this.message = message || null
        this._message = _message || null
    }
}
