import React from 'react'
import firebase from 'firebase'

import Form from './components/Form'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

const Pregame = ({gameID, db}) => {
    const addPlayer = async (name) => {
        const gameRef = db.collection('games').doc(gameID);
        await gameRef.update({
            players: firebase.firestore.FieldValue.arrayUnion(
                {
                    'name': `${name}`,
                    'role': 'Civilian',
                    'alive': true
                }
            )
        })
    }

    return (
        <Container maxWidth="sm" align='center' >
            <Box my={5}>
                <Typography variant='h5' align='center'>
                    Your game code is <Typography display='inline'
                                            variant='h5'
                                            color='primary'>{gameID}</Typography>
                </Typography>
                <Form label='Enter Name' customSubmit={addPlayer}/>
            </Box>
        </Container>

    )
}

export default Pregame;