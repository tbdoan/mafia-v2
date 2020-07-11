import React from 'react';
import firebase from 'firebase'
import Button from '@material-ui/core/Button';

/**
 * List of Players
 *
 */
const PlayerButtons = ({players, doc, role}) => {
    if(!Array.isArray(players)) {return <br/>}

    const vote = async (player) => {
        const roleVotesRef = doc.collection('votes').doc(role);
        await roleVotesRef.update({
            players: firebase.firestore.FieldValue.arrayUnion(
                player
            )
        });
    }

    const compare = ( a, b ) => {
        if ( a.name < b.name ){
          return -1;
        }
        if ( a.name > b.name ){
          return 1;
        }
        return 0;
    }
    players.sort( compare );
    console.log(players);
    return players.map((player, index) => {
            return (
                <Button variant='outlined' onClick={() => vote(player)} key={index}>
                {player.name}
                </Button>
            )
        })

};

export default PlayerButtons;