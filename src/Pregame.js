import React, {useState, useEffect} from 'react'
import PlayerList from './components/PlayerList'
import firebase from 'firebase'

import Form from './components/Form';
import Button from '@material-ui/core/Button'
import Type from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert'

const Pregame = ({gameID, db, name, setName}) => {
    const [players, setPlayers] = useState([]);
    const [nameEntered, setNameEntered] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if(gameID !== '') {
          const doc = db.collection('games').doc(gameID);
          doc.onSnapshot(docSnapshot => {
            setPlayers(docSnapshot.data().players);
          }, err => {
            console.log(`Encountered error: ${err}`);
          });
        }
      }, [gameID, db]);

    const addPlayer = async (name) => {
        if( typeof players.find(p => p.name === name) === 'undefined' ) {
            const gameRef = db.collection('games').doc(gameID);
            await gameRef.update({
                players: firebase.firestore.FieldValue.arrayUnion({
                    'name': `${name}`,
                    'role': 'Civil',
                    'alive': true
                })
            });
            setName(name);
            setNameEntered(true);
        } else {
            return 'Name Already Taken';
        }
    }

    const assignRoles = async () => {
        if( players.length >= 6 ) {
            players.sort(() => Math.random() - 0.5);
            const numMafia = Math.floor(players.length/3);
            const numNurse = Math.floor(players.length/4);
            const numDetec = Math.floor(players.length/4);
            let i = 0;
            const gameRef = db.collection('games').doc(gameID);
            let MafiaPlayers = [];
            let NursePlayers = [];
            let DetectivePlayers = [];
            let CivilianPlayers = [];

            while(i < numMafia) {
                players[i].role = 'Mafia';
                MafiaPlayers.push(players[i]);
                i++;
            }
            while(i < numMafia + numNurse) {
                players[i].role = 'Nurse';
                NursePlayers.push(players[i]);
                i++;
            }
            while(i < numMafia + numNurse + numDetec) {
                players[i].role = 'Detective';
                DetectivePlayers.push(players[i]);
                i++;
            }
            while(i < players.length) {
                players[i].role = 'Civilian';
                CivilianPlayers.push(players[i]);
                i++;
            }

            await gameRef.update({
                gameState: 'night',
                //TODO: UNCOMMENT LATER
                //players: firebase.firestore.FieldValue.delete(),
                MafiaPlayers: MafiaPlayers,
                NursePlayers: NursePlayers,
                DetectivePlayers: DetectivePlayers,
                CivilianPlayers: CivilianPlayers,
                MafiaVote: [],
                NurseVote: [],
                DetectiveVote: []
            });

        } else {
            setShowError(true);
        }
    }

    return (
        <Container maxWidth="sm" align='center' >
            <Box my={5}>
                <Type variant='h5' align='center' gutterBottom>
                    Your game code is <Type display='inline'
                                            variant='h5'
                                            color='primary'>{gameID}</Type>
                </Type>
                { !nameEntered
                    ? <Form label='Enter Name' customSubmit={addPlayer}/>
                    : <Type variant='h4' align='center'>
                        {/*TODO: delete following line*/}
                        <Form label='Enter Name' customSubmit={addPlayer}/>
                        Welcome to Mafia, <Type display='inline'
                                            variant='h4'
                                            color='secondary'>{name}</Type>. <br/>
                        <Button m={10} variant='contained' onClick={assignRoles}> Start Game </Button>
                        {showError
                            ? <Alert severity="error"> Requires 6 players to play.
                            You have {players.length} </Alert>
                            : <div/>
                        }
                    </Type>
                }
                <Type variant='h5'>Here are your players:</Type>
                <PlayerList players={players}/>
            </Box>
        </Container>

    )
}

export default Pregame;