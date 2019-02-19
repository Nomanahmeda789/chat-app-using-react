import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import Signup from './Routes/Signup';
import Signin from './Routes/Signin';
// import Home from './Routes/Home';
import Chats from './Routes/Chats';
class App extends Component {
  constructor(){
    super();
    let config = {
      apiKey: "<API_KEY>",
      authDomain: "<PROJECT_ID>.firebaseapp.com",
      databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
      storageBucket: "<BUCKET>.appspot.com",
      messagingSenderId: "<SENDER_ID>",
    };
    firebase.initializeApp(config);
  }
  componentDidMount(){
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          console.log("signed in")
      } else {
        console.log("please sign in")
      }
    });
  }
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Route path='/signup' component={Signup} />
            <Route exact path='/' component={Signin} />
            {/* <Route path="/home" component={Home} /> */}
            <Route path="/chats" component={Chats} />
          </div>
        </Router>
      </div>
    );
  }
}
export default App;