import express, { Request, Response, NextFunction } from 'express'
import { UserInputError } from '../errors/UserInputError'
import { saveOneUserService, getUserByIdService, getAllUsersService, updateUserService } from '../services/user-service'
import { User } from '../models/User'
import { authenticationMiddleware } from '../middleware/authentication-middleware'
import { authorizationMiddleware } from '../middleware/authorization-middleware'
// our base path is /users

export const userRouter = express.Router()
// this applies this middleware to the entire router beneath it
//userRouter.use(authenticationMiddleware) 

//Create New Users
userRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    let { username,
        password,
        firstName,
        lastName,
        email,
        image } = req.body
    if (username && password && firstName && lastName && email) {
        let newUser: User = {
            userId: 0,
            username,
            password,
            firstName,
            lastName,
            email,
            role: {
                role: 'User',
                roleId: 2
            },
            image
        }
        newUser.image = image || undefined
        try {
            let savedUser = await saveOneUserService(newUser)
            res.json(savedUser)
        } catch (e) {
            next(e)
        }
    }
    else {
        next(new UserInputError)
    }
})

//Update User, we assume that Admin will have access to UserId for each user
//*** have to change this to for only Current users to change their own profiles, maybe with username instead of userId?
// 'Admin'
userRouter.patch('/', async (req: Request, res: Response, next: NextFunction) => {
    let { userId,
        username,
        password,
        firstName,
        lastName,
        email,
        role,
        image } = req.body
    if (!userId) { //update request must contain a userId
        res.status(400).send('User Updates Require UserId and at Least One Other Field')
    }
    else if (isNaN(+userId)) { //check if userId is valid
        res.status(400).send('Id must be a number')
    }
    else {
        let updatedUserInfo: User = {
            userId,
            username,
            password,
            firstName,
            lastName,
            email,
            image,
            role   
        }
        updatedUserInfo.username = username || undefined
        updatedUserInfo.password = password || undefined
        updatedUserInfo.firstName = firstName || undefined
        updatedUserInfo.lastName = lastName || undefined
        updatedUserInfo.email = email || undefined
        updatedUserInfo.image = image || undefined
        updatedUserInfo.role = role || undefined
        try {
            let result = await updateUserService(updatedUserInfo)
            res.json(result)
        } catch (e) {
            next(e)
        }
    }
})

userRouter.use(authenticationMiddleware)

//Find All Users 
userRouter.get('/', authorizationMiddleware(['Admin']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        let allUsers = await getAllUsersService()
        res.json(allUsers)
    } catch (e) {
        next(e)
    }
})

//Find Users By Id ***Admin still cant search for themself, 
//might be okay for this project since searching for other users is not mandatory 
//'Admin',
userRouter.get('/:id', authorizationMiddleware(['Current']), async (req: Request, res: Response, next: NextFunction) => {
    let { id } = req.params
    if (isNaN(+id)) {
        res.status(400).send('Id Needs to be a Number')
    }
    else {
        try {
            let userById = await getUserByIdService(+id)
            res.json(userById)
        } catch (e) {
            next(e)
        }
    }
})
