import React, {useState, useEffect} from 'react';
import PlayerList from './components/PlayerList';
import PlayerButtons from './components/PlayerButtons'
import Type from '@material-ui/core/Typography';

const Night = ({gameID, name, db}) => {
    const [player, setPlayer] = useState(null);
    const [allies, setAllies] = useState([]);
    const [players, setPlayers] = useState([]);
    const [action, setAction] = useState('');

    const doc = db.collection('games').doc(gameID);

    useEffect(() => {
        doc.onSnapshot(ds => {
            const players = [].concat(ds.data().MafiaPlayers,
                                        ds.data().NursePlayers,
                                        ds.data().DetectivePlayers,
                                        ds.data().CivilianPlayers);
            setPlayers(players);
            const player = players.find(p => p.name === name);
            setAllies(ds.data()[`${player.role}Players`]);
            setPlayer(player);
        }, err => {
        console.log(`Encountered error: ${err}`);
        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(player) {
            if(player.role === 'Mafia') {setAction('kill')}
            else if(player.role === 'Nurse') {setAction('rescue')}
            else if(player.role === 'Detective') {setAction('investigate')}
        }
    }, [player])

    return (
        <Type variant='h4' align='center'>
            Name: {name}
            {player === null
            ? <br/>
            : <Type >
                Role: {player.role}. <br/>
                Your fellow {player.role}'s are:
                <PlayerList players={allies} />
                Who would you like to {action}?
                <PlayerButtons
                    players={players}
                    doc={doc}
                    role={player.role}/>
                </Type>
            }
        </Type>
    )
}

export default Night;