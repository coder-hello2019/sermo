import './App.css';
import { useEffect, useState } from 'react';


// FIREBASE CONFIGS
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from "firebase/database";
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
    <div>
      <h1>Sermo</h1>
      <h2><i>Like discord but worse</i></h2>
    </div>
  );
}


function Dash() {
  const [messages, setMessages] = useState([]);

  const db = getDatabase();
  const dbRef = ref(db, 'messages')

  useEffect(() => {
    onValue(dbRef, (snapshot) => {
      console.log("onValue called")
      const data = snapshot.val();
          
      var newMessages = messages.splice();
      const len = Object.keys(data).length;
      for(var i = 0; i < len; i++){
        newMessages.push(data[i].text);
      }
      setMessages(newMessages);
    }) // onValue ends here
  }, []) // useEffect ends here

  return(

    <div>
      {messages.map((message) => (
          <h3>{message}</h3>
      ))}
      </div>
  );

}

// an exmple component!
function New() {


  return (
    <div>
      <form id="new">
        <label for="newMsg">Say something nice:</label>
        <input type="text" id="newMsg"></input>
        <button type="submit" form="new" value="Submit">Submit</button>
      </form>
    </div>
  );
}


export default App;
