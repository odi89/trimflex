export function LoggerError(message) {
    this.name = this.constructor.name;
    this.message = message;
    Error.captureStackTrace(this, this.message)
}

export function ChalkError(message) {
    this.name = this.constructor.name;
    this.message = message;
    Error.captureStackTrace(this, this.message)
}

export function SomeError(message) {
    this.name = this.constructor.name;
    this.message = message;
    Error.captureStackTrace(this, this.message)
}

