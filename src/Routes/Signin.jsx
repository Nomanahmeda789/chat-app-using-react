import React, { Component } from 'react';
import firebase from 'firebase';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import './CSS.css';
class Signin extends Component {
    constructor(){
    super();
    this.state = {
      email:"",
      password:"",
      margin:12,
    };
  }
  signin(e){
    e.preventDefault(e);
    firebase.auth().signInWithEmailAndPassword(this.state.email , this.state.password)
    .then(()=>{
      this.props.history.push("/chats")
    })
    .catch(
      (error) => alert(error)
    )
  }
  signup(){
    this.props.history.push("/signup")
  }
  render() {
    return (
      <div>
        <AppBar
          title="Sign In"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          iconElementRight={<FlatButton label="Sign Up" onClick={this.signup.bind(this)} />}
        />
        <form onSubmit={this.signin.bind(this)}>
          <Paper style={{margin: "100px",textAlign: 'center',display: 'inline-block',padding: "3%"}} zDepth={5}>
            <TextField
              hintText="someone@example.com" floatingLabelText="E-Mail"
              onChange={(val) => {this.setState({email: val.target.value})}} className="email-in"/>
            <br />
            <TextField
              hintText="Password Field" floatingLabelText="Password"
              type="password"
              onChange={(val) =>{this.setState({password: val.target.value})}} className="password-in"/>
            <br />
            <RaisedButton label="Sign In" primary={true} onClick={this.signin.bind(this)} />
          </Paper>
        </form>
      </div>
    );
  }
}
export default Signin;