import React, {useEffect,useState} from 'react';
import logo from './logo.svg';
import './App.css';
import SignupLogin from './containers/SignupLogin'
import SignupForm from './components/SignupForm'
import LoginForm from './components/LoginForm'
import Account from './containers/Dashboard'
import Dashboard from './containers/Dashboard'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import FindMatches from './containers/FindMatches'
import {URL} from './constants/URL'
import configObj from './helpers/configObj'
import NavBar from './components/NavBar'
import Landing from './components/Landing'
import Footer from './components/Footer'
import {connect} from 'react-redux'
import {setCurrentUser} from './actions/currentUser'
import {setDisabilities} from './actions/disabilities'
import {setInterests} from './actions/interests'
import {setMatches} from './actions/matches'


const App = (props) => {

  const [logged,setLogged] = useState()
  const testSetLogged = (val) =>
  {
    console.log("setting logged to ", val);
    setLogged(val);
    console.log("logged is now ", logged);
  }
  useEffect(() => {
    if(!!localStorage.token)
      {
        console.log("Setting User.");
        fetchAndSetUser();
        setLogged(true);
      } 
  }, []);

  const fetchAndSetUser = () => {
    fetch(URL + "find_user/", configObj("GET", true))
    .then(r => r.json())
    .then(data => {
      const userData = data.data.attributes
      props.setCurrentUser(userData)
      if (userData.account_type === "standard") {
        let interests = []
        let disabilities = []
        data.included.forEach((record) => {
          const { type } = record;
          const { name } = record.attributes;
          if (type === "disability")
            disabilities.push(name);
          else if (type === "interest")
            interests.push(name);
        })
        props.setInterests(interests);
        props.setDisabilities(disabilities);
          fetch( URL+'matches/' , configObj("GET",true))
          .then(r => r.json())
          .then(({ matches }) => props.setMatches(matches)); 
      }
    })
  }

  return (
    
    <BrowserRouter>
    <NavBar logged={logged} setLogged={setLogged}/>
      <Switch>
        <Route path='/find_matches'>
          <FindMatches/>
        </Route>
        <Route path='/dashboard'>
          <Dashboard/>
        </Route>
        <Route path='/login'>
          <SignupLogin content={<LoginForm setLogged={testSetLogged} logged={logged}/>} />
        </Route>
        <Route path='/signup'>
          <SignupLogin content={<SignupForm setLogged={setLogged} />} />
        </Route>
        <Route path='/'>
          <Landing/>
        </Route>
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

const mapStateToProps = state => {
  return {currentUser: state.currentUser};
}

export default connect(mapStateToProps,{setCurrentUser,setDisabilities,setInterests,setMatches})(App);
