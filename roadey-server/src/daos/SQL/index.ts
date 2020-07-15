import { Pool } from 'pg'

export const connectionPool:Pool = new Pool({
    host: process.env['roadey_HOST'],
    user: process.env['roadey_USER'],
    password: process.env['roadey_PASSWORD'],
    database: process.env['roadey_DATABASE'],
    port:5432,
    max:5
})
