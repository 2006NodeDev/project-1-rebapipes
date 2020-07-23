import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { TitleComponent } from './components/TitleComponent/TitleComponent';
import { NavBarComponent } from './components/NavBarComponent/NavBarComponent';
import { LoginComponent } from './components/LoginComponent/LoginComponent';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { User } from './models/User';
import { UserDisplayComponent } from './components/UserDisplayComponent/UserDisplay';
import { ProfileComponent } from './components/ProfileComponent/ProfileComponent';
import { AllUsersComponent } from './components/AllUserComponent/AllUsersComponent';
import { NewUserComponent } from './components/NewUserComponent/NewUserComponent';
import {ToastContainer} from 'react-toastify';
import { makeStyles } from '@material-ui/core';
import './App.css';

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
    <div className={classes.root} style={ {border: '4px solid #e85555' } }>
      <Router>
        <header><NavBarComponent user={currentUser}/></header>
        {/* <NavBarComponent user={currentUser}/> */}
        {/* <Route path='title' render={(props) => ( <TitleComponent title={'First Title'} size='large'/> )} /> */}
        <Route path='/login' render={(props) => ( <LoginComponent changeCurrentUser={changeCurrentUser} {...props} /> )} />
        <Route path='/profile/:userId' component={ProfileComponent} />
        <Route path='/users' component={AllUsersComponent} /> 
        <Route path='/new-user' component={NewUserComponent} />
        <ToastContainer position='bottom-right'/>
      </Router>
    </div>
  );
}

export default App;
