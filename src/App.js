/* eslint-disable */
import React, { useState, useEffect } from 'react';
import firebase from 'firebase'

import Landing from './Landing'
import Pregame from './Pregame'
import Night from './Night'
import Day from './Day'
import Spectator from './Spectator'
import Type from '@material-ui/core/Typography'

import './App.css';

function App() {
  const [name, setName] = useState('');
  const [gameID, setGameID] = useState('');
  const [gameState, setGameState] = useState('landing');
  const [db, setDb] = useState({});
  const [doc, setDoc] = useState();
  const [docSnapshot, setDocSnapshot] = useState(null);

  /**
   * alerts user when they leave the page
   */
  useEffect(() => {
    window.addEventListener("beforeunload", function (e) {
      var confirmationMessage = 'It looks like you have been editing something. '
        + 'If you leave before saving, your changes will be lost.';

      (e || window.event).returnValue = confirmationMessage; //Gecko + IE
      return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    })
  }, []);

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
    if (gameID !== '') {
      const doc = db.collection('games').doc(gameID);
      setDoc(doc);
      doc.onSnapshot(docSnapshot => {
        if ('MafiaPlayers' in docSnapshot.data() && docSnapshot.data().MafiaPlayers.length === 0) {
          setGameState('civilianwin');
        } else if ('NursePlayers' in docSnapshot.data() && docSnapshot.data().NursePlayers.length === 0
          && 'DetectivePlayers' in docSnapshot.data() && docSnapshot.data().DetectivePlayers.length === 0
          && 'CivilianPlayers' in docSnapshot.data() && docSnapshot.data().CivilianPlayers.length === 0
        ) {
          setGameState('mafiawin');
        } else {
          setDocSnapshot(docSnapshot);
          setGameState(docSnapshot.data().gameState);
        }
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
  } else if (gameState === 'pregame') {
    return (
      <Pregame
        db={db}
        doc={doc}
        gameID={gameID}
        name={name}
        setName={setName} />
    );
  } else if (name === '' || gameState === 'dead') {
    return (
      <Type>
        {gameState === 'dead'
          ? <Type align='center' variant='h1' color='primary'>You have died</Type>
          : <div />}
        <Spectator
          docSnapshot={docSnapshot} />
      </Type>
    )
  } else if (gameState === 'night') {
    return (
      <Night
        docSnapshot={docSnapshot}
        doc={doc}
        name={name}
        setGameState={setGameState} />
    )
  } else if (gameState === 'day') {
    return (
      <Day
        docSnapshot={docSnapshot}
        name={name}
        doc={doc}
        setGameState={setGameState}
      />
    )
  } else if (gameState === 'civilianwin') {
    return (
      <Type align='center' variant='h1'>
        Civilians Win!
        <Spectator
          docSnapshot={docSnapshot} />
      </Type>
    )
  } else if (gameState === 'mafiawin') {
    return (
      <Type align='center' variant='h1'>
        Mafia Win!
        <Spectator
          docSnapshot={docSnapshot} />
      </Type>
    )
  } else {
    return (
      <h1>error 404</h1>
    )
  }

}

export default App;
