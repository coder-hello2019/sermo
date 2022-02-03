import './App.css';
import { useEffect, useState, useRef } from 'react';



// FIREBASE CONFIGS
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push } from "firebase/database";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from "firebase/auth";
import { stringify } from '@firebase/util';

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
  const [user, setUser] = useState(null);

  if (user) {
    return(
      <div className="App">
        <Sidebar userName={user.displayName} user={user} onUserChange={setUser}></Sidebar>
        <New userName={user.displayName}></New>
        <Dash></Dash>
      </div>
    )
  } 
  else {
    return(
      <div className="App">
        <Sidebar userName={null}></Sidebar>
        <New userName={null}></New>
        <Dash></Dash>
        <SignIn user={user} onUserChange={setUser}></SignIn>
      </div>
    )
  }
}


// an exmple component!
function Sidebar({userName, user, onUserChange}) {
  if (userName != null) {
    return (
      <div className="sidebar">
        <h1>Sermo</h1>
        <p className="small-text"><i>Like discord but worse and with a pretentious Latin name :) </i></p>
        <p>{userName}</p>
        <button className="send-button" onClick={() => googleSignOut(user, onUserChange)}>Sign out</button>
      </div>
    );
  }
  else {
    return (
      <div className="sidebar">
        <h1>Sermo</h1>
        <p className="small-text"><i>Like discord but worse and with a pretentious Latin name :) </i></p>
      </div>
    );
  }
  
}

const googleSignOut = (user, onUserChange) => {
  const auth = getAuth();
  signOut(auth).then(() => {
    onUserChange(null);
    console.log("signout successful");
  // Sign-out successful.
  }).catch((error) => {
  // An error happened.
    console.log(error);
  });
}

// component for signing in
function SignIn({user, onUserChange}) {

  return(
    <div className="paywall">
      <h3>Sign in with Google</h3>
      <p className="auth-button"><a className='auth-button' href="#" onClick={() => googleSignIn(user, onUserChange)}>Sign in with Google</a></p>
    </div>
  )
}


// to display the main view with all the messages in the database
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
            <img src={message.picURL}></img>
            <div key={message.text} className="message-content">
                <h3 className="message-text">{message.text}</h3>
                <p className="message-name">{message.user} on<i>{message.date}</i></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  );

}

const googleSignIn = (user, setUser) => {

  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const newUser = result.user;
    setUser(newUser)

    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    return(null);
    // ...
  }); // signInWithPopup ends here
}

// function for submitting new messages to the server
const submitMessage = (messageText, username) => {
  return event => {
    event.preventDefault();
    let options = { year: 'numeric', month: 'numeric', day: 'numeric' };

    const db = getDatabase();
    push(ref(db, 'newMessages/'), {
        text: messageText,
        user: username,
        date: Date().toLocaleString('en-US', options).slice(0, 24)
    });
  }
}

// component for sending new messages
function New({userName}) {
  const [newMsg, updateMsg] = useState("");
  // const [username, updateUsername] = useState("");

  if (userName != null) {
    return (

      <div className="send-message-container">
        <form id="new" className ="form-input" onSubmit={submitMessage(newMsg, userName)}>
          <input className="input-text" type="text" placeholder="Say something nice :)" id="newMsg" autoComplete="off" onChange={(e) => updateMsg(e.target.value)}></input>
          {/* <input type="text" placeholder="Your name" id="username" autoComplete="off" onChange={(e) => updateUsername(e.target.value)}></input> */}
          <button type="submit" className="send-button" form="new" value="Submit">Send</button>
        </form>
      </div>
    );
  }
  else {
    return(
      <div className='send-message-container'>
        <h2>Please sign in to access the chat</h2>
      </div>
    );
  }

  
  
}


export default App;