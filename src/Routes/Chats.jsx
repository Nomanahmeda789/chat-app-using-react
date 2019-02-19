import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FolderIcon from 'material-ui/svg-icons/file/folder-open';
import LinearProgress from 'material-ui/LinearProgress';
import Paper from 'material-ui/Paper';
import firebase from 'firebase';
import './CSS.css';
class Chats extends Component {
  constructor(props) {
    super(props);
    this.date = null ;
    this.time = null ;
    this.style = {
      borderColor: "black",
      borderBottomWidth: "2px",
    };
    this.state = {
      value : 0 ,
      image : false ,
      open: false ,
      object : {} ,
      current : {} ,
      id : false ,
      message : '' ,
      list : null ,
      months : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",],
      display : 'none',
    };
  }
  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        let uid = user.uid;
        firebase.database().ref("User/").on('value', (use) => {
          let obj = use.val();
          let asd = obj[uid]
          this.setState({
            object: obj ,
            current: asd ,
          })
        })
      } else {
        this.props.history.push("/")
        // window.localStorage.setItem("uid",user.uid)
        // console.log(window.localStorage.getItem("uid"))
      }
    })
  }
  send(e){
    e.preventDefault()
    if(this.state.id !== null){
      if( this.state.message !== ''){
        firebase.database().ref('User/'+this.state.current.Uid).child(this.state.id).push({message : this.state.message,
          Name : this.state.current.Name , time : this.time , date : this.date , image : this.state.image })
        firebase.database().ref('User/'+this.state.id).child(this.state.current.Uid).push({message : this.state.message,
          Name : this.state.current.Name , time : this.time , date : this.date , image : this.state.image })
        this.setState({
          message : '' ,
          image : false ,
        })
        document.getElementById("asd").value = null ;
      } else {
        alert("Please Type A Message")
      }
    } else{
      alert("please select a user")
    }    
  }
  signout(){
    firebase.auth().signOut();
    console.log("Signed Out")
    this.props.history.push("/")
  }
  handleToggle(){
    this.setState({
      open: !this.state.open
    })
  }
  select(key){
    let his = this.state.object[key].Uid
    firebase.database().ref("User/"+this.state.current.Uid+"/"+his).on('value' , (li) => {
      let msg = li.val()
      if (msg !== undefined) {
        if (msg !== null) {
        msg = Object.values(msg)
        this.setState({list: msg})
        let Div = document.getElementById('idid');
        setTimeout( () => {Div.scrollTop = 999999999999999} , 100 )
        }else{
          this.setState({list: null})
        }
      }
    })
    this.setState({
      id: his,
      open: false,
      display: 'inline',
    })
  }
  this(e){
    e.preventDefault()
    let Div = document.getElementById('idid');
    Div.scrollTop = 999999999999999
  }
  img(e){
        //Progress Bar
        this.setState({image:true})
        let a = document.getElementById("progress") ;
        // Get File
        let file = e.target.files[0];
        // Create A Storage Ref
        let storage = firebase.storage().ref().child( 'try_out/' + file.name );
        // Upload File
        let task = storage.put(file)
        let that = this;      
        // Update Progress Bar
        task.on('state_changed',
          // Handle Progress
          function progress(snapshot) {
            let percentage = ( snapshot.bytesTransferred /
            snapshot.totalBytes ) * 100 ;
            that.setState({value:percentage})
          },
          // Handle Error
          function error(err) {
          },
          // After Complete
          function complete() {
            storage.getDownloadURL().then(function(urlm) {
              firebase.database().ref('User/'+that.state.current.Uid).child(that.state.id).push({message : urlm,
                Name : that.state.current.Name , time : that.time , date : that.date , image : that.state.image })
              firebase.database().ref('User/'+that.state.id).child(that.state.current.Uid).push({message : urlm,
                Name : that.state.current.Name , time : that.time , date : that.date , image : that.state.image })
              that.setState({
                message : '' ,
                image : false ,
              })
              document.getElementById("asd").value = null ;
            }).catch(function(error) {
              // Handle any errors
              console.log(error)
            });
          },
        )
  }
  render() {
    this.date = (new Date().getDate()+"-"+this.state.months[new Date().getMonth()]+"-"+new Date().getFullYear()) ;
    if(new Date().getHours() > 12){
      if (new Date().getMinutes() <= 9) {
        this.time = (new Date().getHours()-12+":0"+new Date().getMinutes()+" PM") ;        
      } else {
        this.time = (new Date().getHours()-12+":"+new Date().getMinutes()+" PM") ;        
      }
    }else{
      if (new Date().getMinutes() <= 9) {
        this.time = (new Date().getHours()+":0"+new Date().getMinutes()+" AM") ;        
      } else {
        this.time = (new Date().getHours()+":"+new Date().getMinutes()+" AM") ;        
      }     
    }
    return (
      <div className="main" >
        <div className="Drawer">
          <Drawer 
            docked={false}
            width={200}
            open={this.state.open}
            onRequestChange={(open) => this.setState({open})}
          >
            <RaisedButton label="Close" primary={true} fullWidth={true}
              onClick={this.handleToggle.bind(this)}
            />
            <div className="current">{this.state.current.Name}</div>
            {Object.keys(this.state.object).map((key)=>{
              if(this.state.object[key].Name !== this.state.current.Name)
              return (
                <MenuItem key={key} onClick={this.select.bind(this,key)}>
                  {this.state.object[key].Name}
                </MenuItem>
              )
            })}
          </Drawer>
        </div>
        <div className="barMenu" >
          <AppBar
            title="Chat App"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
            onLeftIconButtonClick={this.handleToggle.bind(this)}
            iconElementRight={<FlatButton label="Sign Out" 
            onClick={this.signout.bind(this)}/>}
          />
          <div className="selected">{this.state.id ? (this.state.object[this.state.id].Name): null }</div>
        </div>
        <div className="Chat" style={{display:this.state.display}}>
          <div className="message-container" id="idid">
            {this.state.list ? Object.keys(this.state.list).map((key)=>{
              if(this.state.list[key].Name === this.state.current.Name){
                return (<div className="dr"><div className="right">{this.state.list[key].image 
                  ? <img src={this.state.list[key].message} alt="" style={{borderRadius: "28px 0px 0px 0px"}}/>
                  : <p>{this.state.list[key].message}</p>}<hr/>
                  <h6>{this.state.list[key].time} <br/> {this.state.list[key].date}</h6></div></div>
                )
              }else{
                return (<div className="dl"><div className="left">{this.state.list[key].image 
                  ? <img src={this.state.list[key].message} alt="" style={{borderRadius: "0px 28px 0px 0px"}}/>
                  : <p>{this.state.list[key].message}</p>}<hr/>
                  <h6>{this.state.list[key].time} <br/> {this.state.list[key].date}</h6></div></div>
                )                
              }
            }): null }
          </div>
          <div className="text-field" >
            {
              this.state.image 
            ? 
              <LinearProgress
                style={{width:'80%',margin:"15px auto",height:"15px"}}
                id="progress"
                mode="determinate"
                value={this.state.value}
                max="100"
              />
            :
              <form onSubmit={this.send.bind(this)}>
                <Paper style={{width: "-webkit-fill-available",textAlign: 'center',display: 'inline-block',}} zDepth={5}>
                  <TextField
                    id="msgText"
                    onFocus={this.this.bind(this)}
                    placeholder="Message"
                    style={{width:'60%'}}
                    onChange={(val) => {this.setState({message: val.target.value})}}
                    value={this.state.message}
                    underlineStyle={this.style}
                  />
                  <RaisedButton
                    labelPosition="before"
                    style={{margin:"0px 12px",minWidth:"36px"}}
                    primary={true}
                    icon={<FolderIcon />}
                    containerElement="label"
                  >
                    <input type="file" style={{cursor: 'pointer',position: 'absolute',
                      top: 0,bottom: 0,right: 0,left: 0,width: '100%',opacity: 0,}}
                      onChange={this.img.bind(this)} id="asd" accept="image/*"
                    />
                  </RaisedButton>
                  <RaisedButton label="Send" primary={true} onClick={this.send.bind(this)}/>
                </Paper>
              </form>
            }
          </div>
        </div>
      </div>
    );
  }
}
export default Chats;
