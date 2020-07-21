import React, { FunctionComponent, useState, SyntheticEvent } from 'react';
import { User } from '../../models/User';
import { Grid, TextField, Button, createStyles, Theme, makeStyles, IconButton } from '@material-ui/core';
import { useParams } from 'react-router';
import { editUser } from '../../remote/roadey-api/edit-user';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
    },
    button: {
        color: '#ff5722',
        borderColor: '#ff5722'
    },
    input: {
        display: 'none',
        width: '10',
        height: '25'
    },
  }),
);

//export const EditProfile: FunctionComponent<EditUserProps> = (props) => {
export const EditProfile: FunctionComponent<any> = (props) => {
    const classes = useStyles();

    //let [userProfile, changeUserProfile] = useState<null | User>(null)
    const {userId} = useParams()//come from match.params which is provided by router
    let [username, changeUsername] = useState('')
    let [password, changePassword] = useState('')
    let [firstName, changeFirstName] = useState('')
    let [lastName, changeLastName] = useState('')
    let [email, changeEmail] = useState('')
    let [image, changeImage] = useState(undefined)

    const updateUsername = (e: any) => {
        e.preventDefault()
        if (e.currentTarget.value !== undefined) {
            changeUsername(e.currentTarget.value)
        }
        else {
            changeUsername(e.currentTarget.username)
        }
    }
    const updatePassword = (e: any) => {
        e.preventDefault()
        if (e.currentTarget.value !== undefined) {
            changePassword(e.currentTarget.value)
        }
        else {
            changePassword(e.currentTarget.password)
        }
    }
    const updateFirstName = (e: any) => {
        e.preventDefault()
        if (e.currentTarget.value !== undefined) {
            changeFirstName(e.currentTarget.value)
        }
        else {
            changeFirstName(e.currentTarget.firstName)
        }
    }
    const updateLastName = (e: any) => {
        e.preventDefault()
        if (e.currentTarget.value !== undefined) {
            changeLastName(e.currentTarget.value)
        }
        else {
            changeLastName(e.currentTarget.lastName)
        }
    }
    const updateEmail = (e: any) => {
        e.preventDefault()
        if (e.currentTarget.value !== undefined) {
            changeEmail(e.currentTarget.value)
        }
        else {
            changeEmail(e.currentTarget.email)
        }
    }
    const updateImage = (e: any) => {
        let file: File = e.currentTarget.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = () => {
            console.log(reader.result)
            changeImage(reader.result)
        }
    }
    const updateUser = async (e: SyntheticEvent) => {
        e.preventDefault()
        
        let updatedUser: User = { //*** not sure why this id isnt working */
            userId: userId, //props.user.userId, //userProfile.userId,
            username,
            password,
            firstName,
            lastName,
            email,
            image,
            role: { role: 'User', roleId: 2 },
        }
        try { 

            //let res = await editUser(updatedUser)
            await editUser(updatedUser)
            console.log(updatedUser);
            //props.history.push(`/profile/${res.userId}`)
            props.history.push(`/profile/${userId}`)

        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div>
            <form onSubmit={updateUser}>
                <br /><br /><br /><br /><br /><br />
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                >
                    <input accept="image/*" className={classes.input} id="icon-button-file" type="file" onChange={updateImage} />
                    <label htmlFor='icon-button-file'>
                        <IconButton
                            color="default"
                            aria-label="upload picture"
                            component="span"
                        >
                            <PhotoCamera />
                        </IconButton>
                    </label>
                    <img src={image || ''} width={5} height={15} />
                    
                    <TextField required id="standard-basic" label="Username" value={username} onChange={updateUsername} />
                    <TextField id="standard-basic" type='password' label="Update Password" value={password} onChange={updatePassword} />
                    <TextField id="standard-basic" label="Update First Name" value={firstName} onChange={updateFirstName} />
                    <TextField id="standard-basic" label="Update Last Name" value={lastName} onChange={updateLastName} />
                    <TextField id="standard-basic" type='email' label="Update Email" value={email} onChange={updateEmail} />
                </Grid>
                <br /><br />
                <Button type='submit' variant="outlined" className={classes.button}>Save</Button>
                {/* <Button variant="contained" type="submit">Submit</Button> */}
            </form>
        </div>
    );
}
