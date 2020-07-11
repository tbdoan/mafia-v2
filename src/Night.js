import React, {useState, useEffect} from 'react';
import firebase from 'firebase'

import PlayerList from './components/PlayerList';
import PlayerButtons from './components/PlayerButtons'
import Type from '@material-ui/core/Typography';

const Night = ({gameID, name, db, docSnapshot}) => {
    //who i am
    const [player, setPlayer] = useState(null);
    //ppl with same role as me
    const [allies, setAllies] = useState([]);
    //everyone 
    const [players, setPlayers] = useState([]);
    const [action, setAction] = useState('');

    const doc = db.collection('games').doc(gameID);

    useEffect(() => {
        const players = [].concat(docSnapshot.data().MafiaPlayers,
                                    docSnapshot.data().NursePlayers,
                                    docSnapshot.data().DetectivePlayers,
                                    docSnapshot.data().CivilianPlayers);
        setPlayers(players);
        const player = players.find(p => p.name === name);
        setAllies(docSnapshot.data()[`${player.role}Players`]);
        setPlayer(player);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(player) {
            if(player.role === 'Mafia') {setAction('kill')}
            else if(player.role === 'Nurse') {setAction('rescue')}
            else if(player.role === 'Detective') {setAction('investigate')}
        }
    }, [player])

    const vote = async (target) => {
        doc.update({
            [`${player.role}Vote`]: firebase.firestore.FieldValue.arrayUnion(
                target
            )
        });
    }

    const CivilianUI = () => {
        return <Type> You're sleeping. </Type>
    }
    const NonCivilianUI = () => {
        return (
        <Type> Your {player.role}'s are:
            <PlayerList players={allies} />
            Who would you like to {action}?
            <PlayerButtons
                players={players}
                customClick={vote} />
        </Type>
        )
    }

    return (
        <Type variant='h4' align='center'>
            Name: {name}
            {player === null
            ? <br/>
            : <Type >
                Role: {player.role} <br/>
                {player.role === 'Civilian'
                    ? <CivilianUI />
                    : <NonCivilianUI />
                }
                </Type>
            }
        </Type>
    )
}

export default Night;