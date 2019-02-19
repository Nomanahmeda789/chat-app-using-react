import React, { Component } from 'react';
import firebase from 'firebase';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import './CSS.css';
class Signup extends Component {
  constructor(){
    super();
    this.state = {
      email:"",
      name:"",
      password:"",
    };
  }
  signin(){
    console.log('going to signin')
    this.props.history.push("/")
  }
  signup(e){
    e.preventDefault(e);
    firebase.auth().createUserWithEmailAndPassword(this.state.email , this.state.password)
    .then((user)=>{
      console.log('signed up')
      this.props.history.push("/chats")
      firebase.database().ref('User').child(user.uid).set({Name : this.state.name,Email : this.state.email,
        Password : this.state.password,Uid : user.uid})
        // window.localStorage.setItem("uid",user.uid)
        // console.log(window.localStorage.getItem("uid"))
    })
    .catch(
      (error) => alert(error) 
    );
  }
  render() {
    return (
      <div>
        <AppBar
          title="Sign Up"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          iconElementRight={<FlatButton label="Sign In" onClick={this.signin.bind(this)} />}
        />
        <form onSubmit={this.signup.bind(this)}>
          <Paper style={{margin: "100px",textAlign: 'center',display: 'inline-block',padding: "3%"}} zDepth={5}>
            <TextField
              hintText="John Doe" floatingLabelText="User Name"
              onChange={(val) => {this.setState({name: val.target.value})}} className="name-up"/>
            <br />
            <TextField
              hintText="someone@example.com" floatingLabelText="E-Mail"
              onChange={(val) => {this.setState({email: val.target.value})}} className="email-up"/>
            <br />
            <TextField
              hintText="Key Word" floatingLabelText="Password"
              type="password"
              onChange={(val) =>{this.setState({password: val.target.value})}} className="password-up"/>
            <br />
            <RaisedButton label="Sign Up" primary={true} 
            onClick={this.signup.bind(this)} />
          </Paper>
        </form>
      </div>
    );
  }
}
export default Signup;