import React, { useState } from 'react';
import Form from './components/Form'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import './App.css';

const useStyles = makeStyles({
    footer: {
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        color: 'black',
        fontSize: 'small',
        textAlign: 'center',
        padding: '1vh'
    }
})

const Landing = ({ db, setGameID }) => {
    const classes = useStyles();
    const [showGameCodeForm, setShowGameCodeForm] = useState(false);

    const GameOptions = () => {
        return (
            <div>
                <Button onClick={createNewGame}>Create Game</Button>
                <Button onClick={() => { setShowGameCodeForm(true) }}>Join Game</Button>
            </div>
        )
    }

    const createNewGame = async () => {
        //creates new game
        const docRef = db.collection('games').doc();
        await docRef.set({
            gameState: 'pregame',
            players: [],
        });
        //sets gameID on client side
        setGameID(docRef.id);
    }

    const joinGame = (gameCode) => {
        //remove whitespace
        gameCode = gameCode.replace(/\s/g, '');
        //allow only alphanumeric
        if (/[^a-zA-Z0-9]/.test(gameCode)) {
            return 'Game Not Found';
        }
        const docRef = db.collection('games').doc(gameCode);
        return docRef.get()
            .then((docSnapshot) => {
                if (docSnapshot.exists) {
                    setGameID(docRef.id);
                    return null;
                } else {
                    return 'Game Not Found';
                }
            });
    }

    return (
        <Container maxWidth="sm" align='center' >
            <Box my={5}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome to Mafia
                </Typography>
                {!showGameCodeForm
                    ? <GameOptions />
                    : <Form label={'Enter Game Code'} customSubmit={joinGame} />
                }
            </Box>
            <Container maxWidth={false} className={classes.footer}>
                Source code <a href='https://github.com/tbdoan/mafia-v2'>here</a>
            </Container>
        </Container>
    )
}

export default Landing;