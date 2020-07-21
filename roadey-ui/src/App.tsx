import React, { useState } from 'react';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
//import { FirstComponent } from './components/FirstComponent/FirstComponent';
//import { TitleComponent } from './components/TitleComponent/TitleComponent';
//import { FancyBorder } from './components/FancyBorderComponent/FancyBorderComponent';
import { NavBarComponent } from './components/NavBarComponent/NavBarComponent';
import { LoginComponent } from './components/LoginComponent/LoginComponent';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { User } from './models/User';
//import { UserDisplayComponent } from './components/UserDisplayComponent/UserDisplay';
import { ProfileComponent } from './components/ProfileComponent/ProfileComponent';
import { AllUsersComponent } from './components/AllUserComponent/AllUsersComponent';
import { NewUserComponent } from './components/NewUserComponent/NewUserComponent';
import {ToastContainer} from 'react-toastify';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "column",
    minHeight: '100vh',
    textAlign: 'center',
  }
}))

function App() {
  const [currentUser, changeCurrentUser] = useState<null | User>(null)
  const classes = useStyles()
  return (
    <div className={classes.root} style={ {border: '3px solid #ff5722' } }>
      <Router>
        <header><NavBarComponent user={currentUser}/></header>
        {/* <NavBarComponent user={currentUser}/> */}
        {/* <Route path='title' render={(props) => ( <TitleComponent title={'First Title'} size='large'/> )} /> */}
        <Route path='/login' render={(props) => ( <LoginComponent changeCurrentUser={changeCurrentUser} {...props} /> )} />
        <Route path='/profile/:userId' component={ProfileComponent} />
        <Route path='/users' component={AllUsersComponent} /> 
        <Route path='/new-user' component={NewUserComponent} />
        {/* <Route path='/location' component={AllUsersInLocationComponent} /> */}
        {/* <Route path='/location' render={(props) => ( <LocationComponent city={city, state} {...props} /> )} /> */}
        <ToastContainer position='bottom-right'/>
      </Router>
    </div>
  );
}

export default App;
