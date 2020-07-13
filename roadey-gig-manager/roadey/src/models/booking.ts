import { ReimbursementStatus } from "./booking-status"
import { ReimbursementType } from "./booking-type"

export class Booking {
    bookingId: number //primary key
    author: number //foreign key -> user not null
    payment: number //not null
    dateSubmitted: Date //not null
    dateResolved: Date //allowed this to be null for Pending reimbursements
    description: string //not null
    resolver: number // foreign key -> User, allowed this to be null for Pending reimbursements
    status: ReimbursementStatus //foreign key -> ReimbursementStatus, not null
    type: ReimbursementType //foreign key -> ReimbursementType
}
