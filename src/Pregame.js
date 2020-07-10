import React, {useState} from 'react'
import PlayerList from './components/PlayerList'
import firebase from 'firebase'

import Form from './components/Form';
import Button from '@material-ui/core/Button'
import Type from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert'

const Pregame = ({gameID, db, name, setName, players}) => {

    const [nameEntered, setNameEntered] = useState(false);
    const [showError, setShowError] = useState(false);

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
            while(i < numMafia) {
                players[i].role = 'Mafia';
                i++
            }
            while(i < numMafia + numNurse) {
                players[i].role = 'Nurse';
                i++
            }
            while(i < numMafia + numNurse + numDetec) {
                players[i].role = 'Detec';
                i++
            }
            while(i < players.length) {
                players[i].role = 'Civil';
                i++
            }
            const gameRef = db.collection('games').doc(gameID);
            await gameRef.update({
                gameState : 'night',
                players : players
            })
        } else {
            setShowError(true);
        }
        console.log(players);
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
                        Welcome to Mafia, <Type display='inline'
                                            variant='h4'
                                            color='secondary'>{name}</Type>. <br/>
                        <Button m={10} variant='contained' onClick={assignRoles}> Start Game </Button>
                        <Type variant='h5'>Here are your players:</Type>
                        {showError
                            ? <Alert severity="error"> Requires 6 players to play.
                            You have {players.length} </Alert>
                            : <div/>
                        }
                        <PlayerList players={players}/>
                    </Type>
                }
            </Box>
        </Container>

    )
}

export default Pregame;