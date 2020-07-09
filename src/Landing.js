import React, {useState} from 'react';
import Form from './components/Form'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import './App.css';


const Landing = ({db, setGameID}) => {
    const [showGameCodeForm, setShowGameCodeForm] = useState(false);

    const GameOptions = () => {
        return (
            <div>
                <Button onClick={createNewGame}>Create Game</Button>
                <Button onClick={() => {setShowGameCodeForm(true)}}>Join Game</Button>
            </div>
        )
    }

    const createNewGame = async () => {
        const docRef = db.collection('games').doc();

        await docRef.set({
            gameState: 'pregame',
            players: []
        });
        setGameID(docRef.id);
    }

    const joinGame = (gameCode) => {
        gameCode = gameCode.replace(/\s/g, '');
        const docRef = db.collection('games').doc(gameCode);
        docRef.get()
            .then((docSnapshot) => {
                if (docSnapshot.exists) {
                    setGameID(docRef.id);
                } else {
                    return false;
                }
            });
    }

    return (
        <Container maxWidth="sm" align='center' >
            <Box my={5}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome to Mafia
                </Typography>
                { !showGameCodeForm
                    ? <GameOptions/>
                    : <Form label={'Enter Game Code'} customSubmit={joinGame}/>
                }
            </Box>
        </Container>
    )
}

export default Landing;