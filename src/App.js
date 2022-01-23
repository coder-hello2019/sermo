import './App.css';
import { useEffect, useState } from 'react';


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
  const [lastID, setCount] = useState(0)
  const increment = (c) => setCount(c)

  return (
    <div className="App">
      <Header></Header>
      <New lastID={lastID}></New>
      <Dash increment={increment}></Dash>
    </div>
  );
}


// an exmple component!
function Header() {
  return (
    <div>
      <h1>Sermo</h1>
      <h2><i>Like discord but worse</i></h2>
    </div>
  );
}


function Dash({lastID, increment}) {
  const [messages, setMessages] = useState([]);

  const db = getDatabase();
  const dbRef = ref(db, 'messages')

  useEffect(() => {
    onValue(dbRef, (snapshot) => {
      console.log("onValue called")
      const data = snapshot.val();

      var latestID = 0;
          
      var newMessages = messages.splice();
      const len = Object.keys(data).length;
      for(var i = 1; i < len + 1; i++){
        newMessages.push(data[i]);
        if(i == len){
          latestID = i;
        }
      }
      setMessages(newMessages);
      increment(latestID);

    }) // onValue ends here
  }, []) // useEffect ends here

  return(

    <div>
      {messages.map((message) => (
        <div key={message.text}>
          <h3>{message.text}</h3>
          <p>{message.user} on {message.date}</p>
        </div>
      ))}
      </div>
  );

}

// function for submitting new messages to the server
const submitMessage = (lastID, messageText) => {
  return event => {
    event.preventDefault();

    const db = getDatabase();
    push(ref(db, 'newMessages/'), {
        text: messageText,
        user: "jedcal",
        date: "23/01/2022"
    });

    // console.log("fake-submitte msg!");
    // console.log(lastID.lastID);
  }
}

// an exmple component!
function New(lastID) {

  return (
    <div>
      <form id="new" onSubmit={submitMessage(lastID, "M83")}>
        <label for="newMsg">Say something nice:</label>
        <input type="text" id="newMsg"></input>
        <button type="submit" form="new" value="Submit">Submit</button>
      </form>
    </div>
  );
}


export default App;
