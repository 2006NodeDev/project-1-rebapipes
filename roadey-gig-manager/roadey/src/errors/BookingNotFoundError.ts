import { HttpError } from "./HttpError";

export class BookingNotFoundError extends HttpError {
    constructor () {
        super(400,'Booking Not Found')
    }
}
