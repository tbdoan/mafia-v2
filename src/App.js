/* eslint-disable */
import React, {useState, useEffect} from 'react';
import firebase from 'firebase'

import Landing from './Landing'
import Pregame from './Pregame'
import Night from './Night'
import Spectator from './Spectator'
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [gameID, setGameID] = useState('');
  const [gameState, setGameState] = useState('landing');
  const [db, setDb] = useState({});

  //"constructor"
  useEffect(() => {
    // Initialize Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyAhZRf4M9fDkkIXNrkwOfzyX7udTXqBcv0",
        authDomain: "mafia-cd461.firebaseapp.com",
        databaseURL: "https://mafia-cd461.firebaseio.com",
        projectId: "mafia-cd461",
        storageBucket: "mafia-cd461.appspot.com",
        messagingSenderId: "637219728793",
        appId: "1:637219728793:web:3a9d9eec3720931204b708",
        measurementId: "G-S1BBNY2Q5P"
    };

    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    const db = firebase.firestore();
    setDb(db);
  }, []);

  useEffect(() => {
    if(gameID !== '') {
      const doc = db.collection('games').doc(gameID);
      doc.onSnapshot(docSnapshot => {
        setGameState(docSnapshot.data().gameState);
      }, err => {
        console.log(`Encountered error: ${err}`);
      });
    }
  }, [gameID]);

  if (gameState === 'landing') {
    return (
      <Landing
          db={db}
          setGameID={setGameID} />
    );
  } else if(gameState === 'pregame') {
    return (
      <Pregame
        db={db}
        gameID={gameID}
        name={name}
        setName={setName}
        />
    );
  } else if(name === '') {
    return (
      <Spectator />
    )
  } else if(gameState === 'night') {
    return (
      <Night
        gameID={gameID}
        name={name}
        db={db}/>
    )
  }
}

export default App;
