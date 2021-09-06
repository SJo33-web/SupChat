import logo from './logo.svg';
import './App.css';
import Sidebar from './Sidebar';
import MainChat from './MainChat'
import Login from "./Login"
import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useStateValue } from "./StateProvider"
import { auth } from "./firebase"
function App() {
  const [{ user }, dispatch] = useStateValue()
  // hook to keep check whether user is logged in or not, if logged in app should redirect them to chats and messages
  //if not logged in, the app should take them to login screen

  useEffect(() => {
    const sub = auth.onAuthStateChanged(authuser => {
      if (authuser) {
        dispatch({
          type: "SET_USER",
          user: authuser
        })
      }
      else {
        dispatch({
          type: "SET_USER",
          user: null
        })
      }
    })

    return () => {
      sub();
    }
  }, [])

  console.log(user)

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="main-body">
          <Router>
            <Switch>
              <Route exact path="/">
                <Sidebar />
                <MainChat />
              </Route>
              <Route exact path="/rooms/:roomId">
                <Sidebar />
                <MainChat />
              </Route>
            </Switch>
          </Router>
        </div>
      )
      }

    </div>
  );
}

export default App;