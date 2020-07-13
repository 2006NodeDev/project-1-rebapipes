import { HttpError } from "./HttpError";

export class BookingInputError extends HttpError {
    constructor() {
        super(400, 'Please fill out all fields')
    }
}
