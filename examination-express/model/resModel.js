class BeseModel {
    constructor (date, message) {
        if (typeof data === 'string') {
            this.data = null;
            this.message = null;
        }
        if (date) {
            this.data = date
        }
        if (message) {
            this.message = message
        }
    }
}

// 返回成功状态
class SuccessModel extends BeseModel {
    constructor(data, message) {
        super(data, message);
        this.errno = 0
    }
}

// 返回失败状态
class ErrorModel extends BeseModel {
    constructor(data, message) {
        super(data, message);
        this.errno = -1
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}