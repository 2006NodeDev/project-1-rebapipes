import React, { FunctionComponent, SyntheticEvent, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core'
import { Button } from '@material-ui/core'
import { User } from "../../models/User";
import { newUserServer } from "../../remote/roadey-api/roadey-create-user";
import { toast } from "react-toastify";
import '../../App.css'

const useStyles = makeStyles((theme) => ({
    root:{
        alignItems: 'center',
        justifyContent: 'center'
    },
    media:{
        height: 0,
        paddingTop: '56.25%',
        maxWidth: "400px",
        maxHeight: "400px",
    },
    textField: {
        alignSelf: 'center',
        width: '50%',
        marginLeft: 'auto',
        marginRight: 'auto',            
        paddingBottom: 0,
        paddingRight: 1,
        paddingLeft:2,
        marginTop: 0,
        fontWeight: 500
    },
    input: {
        color: 'white'
    }
}))

export const NewUserComponent:FunctionComponent<any> = (props) => {

    let[username, changeUsername] = useState('')
    let[password, changePassword] = useState('')
    let[confirmPassword, changeConfirmPassword] = useState('')
    let[firstName, changeFirstName] = useState('')
    let[lastName, changeLastName] = useState('')
    let[email, changeEmail] = useState('')
    let[image, changeImage] = useState(undefined)

    const classes = useStyles();

    const updateUsername = (e:any) => {
        e.preventDefault()
        changeUsername(e.currentTarget.value)
    }

    const updatePassword = (e:any) => {
        e.preventDefault()
        changePassword(e.currentTarget.value)
    }

    const updateConfirmPassword = (e:any) => {
        e.preventDefault()
        changeConfirmPassword(e.currentTarget.value)
    }

    const updateFirstName = (e:any) => {
        e.preventDefault()
        changeFirstName(e.currentTarget.value)
    }

    const updateLastName = (e:any) => {
        e.preventDefault()
        changeLastName(e.currentTarget.value)
    }

    const updateEmail = (e:any) => {
        e.preventDefault()
        changeEmail(e.currentTarget.value)
    }

    const updateImage = (e:any) => {
        // e.preventDefault()
        let file:File = e.currentTarget.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            changeImage(reader.result)
        }
    }

    const submitUser = async (e:SyntheticEvent) => {
        e.preventDefault()
        if(password !== confirmPassword){
            toast.error('Passwords Do Not Match')
        }
        let newUser:User = {
            userId:0,
            username,
            password,
            firstName,
            lastName,
            email,
            image,
            role: {
                roleId: 3,
                role: 'User'
            }
        }
        await newUserServer(newUser)
        props.history.push(`/login`)
    }

    return(
        <div className={classes.root}>
            <form onSubmit={submitUser}>
                <TextField className={classes.textField} label='username' value={username} onChange={updateUsername} margin='normal'></TextField>
                <TextField className={classes.textField} label='password' type='password' value={password} onChange={updatePassword}></TextField>
                <TextField className={classes.textField} label='confirm password' type='password' value={confirmPassword} onChange={updateConfirmPassword}></TextField>
                <TextField className={classes.textField} label='firstName' value={firstName} onChange={updateFirstName}></TextField>
                <TextField className={classes.textField} label='lastName' value={lastName} onChange={updateLastName}></TextField>
                <TextField className={classes.textField} label='email' value={email} onChange={updateEmail}></TextField><br/><br/>
                
                <label className={classes.textField} htmlFor='file'>Profile Pic:     </label>
                <input type='file' name='file' accept='image/*' onChange={updateImage}/>
                <img src={image || ''} alt=''/><br/>
                <Button variant="contained" type='submit'>Submit</Button>
            </form>
        </div>
    )
}
