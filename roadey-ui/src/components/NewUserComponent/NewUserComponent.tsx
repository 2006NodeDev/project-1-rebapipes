import React, { FunctionComponent, SyntheticEvent, useState } from 'react';
import { Button, TextField, FormControl, InputLabel, Select, makeStyles, createStyles, Theme, FormHelperText, Grid, Paper, IconButton } from '@material-ui/core';
import { saveUser } from '../../remote/roadey-api/save-user';
import { toast } from 'react-toastify';
import { User } from '../../models/User';
import classes from '*.module.css';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
        button: {
            //backgroundColor: '#ff5722',
            color: '#ff5722',
            borderColor: '#ff5722'
        },
        input: {
            display: 'none',
        },
    }),
);

export const NewUserComponent: FunctionComponent<any> = (props) => {
    let [username, changeUsername] = useState('')
    let [password, changePassword] = useState('')
    let [confirmPassword, changeConfirmPassword] = useState('')
    let [firstName, changeFirstName] = useState('')
    let [lastName, changeLastName] = useState('')
    let [email, changeEmail] = useState('')
    let [city, changeCity] = useState('')
    let [state, changeState] = useState('')
    //let [country, changeCountry] = useState('')
    let [dogName, changeDogName] = useState('')
    //let [dogSex, changeDogSex] = useState('')
    let [breed, changeBreed] = useState('')
    let [image, changeImage] = useState(undefined)

    const classes = useStyles();

    const updateUsername = (e: any) => {
        e.preventDefault()
        changeUsername(e.currentTarget.value)
    }
    const updatePassword = (e: any) => {
        e.preventDefault()
        changePassword(e.currentTarget.value)
    }
    const updateConfirmPassword = (e: any) => {
        e.preventDefault()
        changeConfirmPassword(e.currentTarget.value)
    }
    const updateEmail = (e: any) => {
        e.preventDefault()
        changeEmail(e.currentTarget.value)
    }
    const updateFirstName = (e: any) => {
        e.preventDefault()
        changeFirstName(e.currentTarget.value)
    }
    const updateLastName = (e: any) => {
        e.preventDefault()
        changeLastName(e.currentTarget.value)
    }
    const updateCity = (e: any) => {
        e.preventDefault()
        changeCity(e.currentTarget.value)
    }
    const updateState = (e: any) => {
        e.preventDefault()
        changeState(e.currentTarget.value)
    }
    // const updateCountry = (e: any) => {
    //     e.preventDefault()
    //     changeCountry(e.currentTarget.value)
    // }
    const updateDogName = (e: any) => {
        e.preventDefault()
        changeDogName(e.currentTarget.value)
    }
    // const updateDogSex = (e: any) => {
    //     e.preventDefault()
    //     changeDogSex(e.currentTarget.value)
    // }
    const updateBreed = (e: any) => {
        e.preventDefault()
        changeBreed(e.currentTarget.value)
    }
    const updateImage = (e: any) => {
        let file: File = e.currentTarget.files[0]// the tag contains an array of files, we want the first and only
        //blast to the past and utiliza an old school FileReader
        let reader = new FileReader()
        //we start an async function on the reader object
        reader.readAsDataURL(file)
        //set a callback function for when the reader finishes
        reader.onload = () => {
            console.log(reader.result)
            changeImage(reader.result)
        }
    }
    const submitUser = async (e: SyntheticEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error('Passwords Do Not Match')
        }
        else {
            let newUser: User = {
                userId: 0,
                username,
                password,
                firstName,
                lastName,
                email,
                image,
                role: { role: 'User', roleId: 2 }
            }
            //let res = await reactSaveUser(newUser)
            await saveUser(newUser)
            props.history.push(`/login`)
            //props.history.push('/login')
        }
    }

    return (
        <div>
            <form onSubmit={submitUser}>
                <br /><br /><br /><br /><br /><br />
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                >
                    <input accept="image/*" className={classes.input} id="icon-button-file" type="file" onChange={updateImage}/>
                    <label htmlFor='icon-button-file'>
                        <IconButton
                            color="default"
                            aria-label="upload picture"
                            component="span"
                        >
                            <PhotoCamera />
                        </IconButton>
                    </label>
                    <img src={image || ''} />  {/****this needs restrictions so picture does not fill whole screen*/}

                    <TextField required id="standard-basic" label="Username" value={username} onChange={updateUsername} />
                    <TextField required id="standard-basic" type='password' label="Password" value={password} onChange={updatePassword} />
                    <TextField required id="standard-basic" type='password' label="Confirm Password" value={confirmPassword} onChange={updateConfirmPassword} />
                    <TextField required id="standard-basic" label="First Name" value={firstName} onChange={updateFirstName} />
                    <TextField required id="standard-basic" label="Last Name" value={lastName} onChange={updateLastName} />
                    <TextField required id="standard-basic" type='email' label="Email" value={email} onChange={updateEmail} />
                    <TextField required id="standard-basic" label="City" value={city} onChange={updateCity} />
                    <TextField required id="standard-basic" label="State" value={state} onChange={updateState} />
                    <TextField required id="standard-basic" label="Pet Name" value={dogName} onChange={updateDogName} />
                    <TextField required id="standard-basic" label="Breed" value={breed} onChange={updateBreed} />

                </Grid>
                <br /><br />
                <Button type='submit' variant="outlined" className={classes.button}>Register</Button>
            </form>
        </div>
    )
}

{/*    <FormControl required className={classes.formControl}>
                        <InputLabel htmlFor="state-native-required">State</InputLabel>
                        <Select
                            native
                            value={state}
                            onChange={updateState}
                            name="state"
                            inputProps={{
                                id: 'state-native-required',
                            }}
                        >
                            <option aria-label="None" value="" />
                            <option value={1}>Alabama</option>
                            <option value={2}>Alaska</option>
                            <option value={3}>Arizona</option>
                            <option value={4}>Arkansas</option>
                            <option value={5}>California</option>
                            <option value={6}>Colorado</option>
                            <option value={7}>Connecticut</option>
                            <option value={8}>Delaware</option>
                            <option value={9}>Florida</option>
                            <option value={10}>Georgia</option>
                            <option value={11}>Hawaii</option>
                            <option value={12}>Idaho</option>
                            <option value={13}>Illinois</option>
                            <option value={14}>Indiana</option>
                            <option value={15}>Iowa</option>
                            <option value={16}>Kansas</option>
                            <option value={17}>Kentucky</option>
                            <option value={18}>Louisiana</option>
                            <option value={19}>Maine</option>
                            <option value={20}>Maryland</option>
                            <option value={21}>Massachusetts</option>
                            <option value={22}>Michigan</option>
                            <option value={23}>Minnesota</option>
                            <option value={24}>Mississippi</option>
                            <option value={25}>Missouri</option>
                            <option value={26}>Montana</option>
                            <option value={27}>Nebraska</option>
                            <option value={28}>Nevada</option>
                            <option value={29}>New Hampshire</option>
                            <option value={30}>New Jersey</option>
                            <option value={31}>New Mexico</option>
                            <option value={32}>New York</option>
                            <option value={33}>North Carolina</option>
                            <option value={34}>North Dakota</option>
                            <option value={35}>Ohio</option>
                            <option value={36}>Oklahoma</option>
                            <option value={37}>Oregon</option>
                            <option value={38}>Pennsylvania</option>
                            <option value={39}>Rhode Island</option>
                            <option value={40}>South Carolina</option>
                            <option value={41}>South Dakota</option>
                            <option value={42}>Tennessee</option>
                            <option value={43}>Texas</option>
                            <option value={44}>Utah</option>
                            <option value={45}>Vermont</option>
                            <option value={46}>Virginia</option>
                            <option value={47}>Washington</option>
                            <option value={48}>West Virginia</option>
                            <option value={49}>Wisconsin</option>
                            <option value={50}>Wyoming</option>
                        </Select>
                        <FormHelperText>Required</FormHelperText>
                    </FormControl>
                    <FormControl required className={classes.formControl}>
                        <InputLabel htmlFor="sex-native-required">Sex of Dog</InputLabel>
                        <Select
                            native
                            value={dogSex}
                            onChange={updateDogSex}
                            name="sex"
                            inputProps={{
                                id: 'state-native-required',
                            }}
                        >
                            <option aria-label="None" value="" />
                            <option value={1}>Female</option>
                            <option value={2}>Male</option>
                        </Select>
                        <FormHelperText>Required</FormHelperText>
                    </FormControl>
                    */}
