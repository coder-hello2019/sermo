import './App.css';
import { useEffect, useState, useRef } from 'react';


// FIREBASE CONFIGS
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, push } from "firebase/database";
//import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';


// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0Qg09DVoxyOqkDt_yAWIpNjgqsNXyEfM",
  authDomain: "sermo-9ef4b.firebaseapp.com",
  databaseURL: "https://sermo-9ef4b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sermo-9ef4b",
  storageBucket: "sermo-9ef4b.appspot.com",
  messagingSenderId: "152221395283",
  appId: "1:152221395283:web:3af2ac17e235db762ed9a6"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase();


function App() {

  return (
    <div className="App">
      <Header></Header>
      <New></New>
      <Dash></Dash>
    </div>
  );
}


// an exmple component!
function Header() {
  return (
    <div class="sidebar">
      <h1>Sermo</h1>
      <p><i>Like discord but worse and with a pretentious Latin name :) </i></p>
    </div>
  );
}


function Dash() {
  const [messages, setMessages] = useState([]);

  const db = getDatabase();
  const dbRef = ref(db, 'newMessages')

  useEffect(() => {
    onValue(dbRef, (snapshot) => {
      console.log("onValue called")
      const data = snapshot.val();

      console.log(data)
          
      var newMessages = messages.splice();
      // const len = Object.keys(data).length;
      // for(var i = 1; i < len + 1; i++){
      //   newMessages.push(data[i]);
      // }

      for(const item in data){
        newMessages.push(data[item]);
      }
      setMessages(newMessages);

    }) // onValue ends here
  }, []) // useEffect ends here

  return(
    <div className='main-container'>
      <div className='main'>
        {messages.map((message) => (
          <div className="message-container-hover">
            <div className="message-wrapper">
            <div key={message.text} className="message-content">
                <h3 className="message-text">{message.text}</h3>
                <p className="message-name">{message.user} on {message.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  );

}

// function for submitting new messages to the server
const submitMessage = (messageText, username) => {
  return event => {
    event.preventDefault();

    const db = getDatabase();
    push(ref(db, 'newMessages/'), {
        text: messageText,
        user: username,
        date: "23/01/2022"
    });
  }
}

// an exmple component!
function New() {
  const [newMsg, updateMsg] = useState("");
  const [username, updateUsername] = useState("");

  return (

    <div className="send-message-container">
      <form id="new" className ="form-input" onSubmit={submitMessage(newMsg, username)}>
        <input className="input-text" type="text" placeholder="Say something nice :)" id="newMsg" autoComplete="off" onChange={(e) => updateMsg(e.target.value)}></input>
        <input type="text" placeholder="Your name" id="username" autoComplete="off" onChange={(e) => updateUsername(e.target.value)}></input>
        <button type="submit" className="send-button" form="new" value="Submit">Send</button>
      </form>
    </div>
  );
}


export default App;
