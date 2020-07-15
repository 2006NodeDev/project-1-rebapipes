import express, { Request, Response, NextFunction } from 'express'
import { sessionMiddleware } from './middleware/session-middleware'
import { userRouter } from './routers/user-router'
import { bookingRouter } from './routers/booking-router'
import { loginByUsernameAndPassword } from './daos/user-dao'
import { AuthenticationError } from './errors/AuthenticationError'
import { loggingMiddleware } from './middleware/logging-middleware'
import { corsFilter } from './middleware/cors-filter'

const app = express() //Creates complete express application
app.use(express.json({limit:'50mb'}))//this is an example of middle ware
//increase the maximum size of a body we can parse
// the idea of middle ware is to run requests through partial processing and let them move forward through our application
//express.json is a function that takes in the request - turns the body into a js object - and then we let the request go to the next function that it matches

app.use(loggingMiddleware) //Logs out request method, ip address making request, and path of request
app.use(sessionMiddleware) //Attaches a session object to the request where each unique connection to the server has a unique session
//app.use(authenticationMiddleware)
app.use(corsFilter) // make sure request is in allowed origins and types
app.use('/users', userRouter) //Redirect all requests on /users to user-router
app.use('/bookings', bookingRouter) //Redirect all requests on /bookings to booking-router

app.get('/health', (req:Request,res:Response)=>{
    res.sendStatus(200)
})

// Login 
app.post('/login', async (req:Request, res:Response, next:NextFunction) => {
    let username = req.body.username
    let password = req.body.password

    if(!username || !password) {
        throw new AuthenticationError();
    }
    else { 
        try {
            let user = await loginByUsernameAndPassword(username, password)
            req.session.user = user
            res.json(user)
        } catch (e) {
            next(e)
        }
    }
})

// Error Handling
app.use((err, req, res, next) => {
    if(err.statusCode) { //if it's one of my custom HTTP errors
        res.status(err.statusCode).send(err.message) //send custom error
    }
    else { //not ready for this specific error, debug whatever comes out here
        console.log(err);
        res.status(500).send('Oops, something went wrong')
    }
})

//Set port for sending/receiving requests
app.listen(2006, () => {
    console.log('Server Is Running');
})
