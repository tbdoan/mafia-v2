import React, {useState, useEffect} from 'react';

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
    //who got voted
    const [target, setTarget] = useState(null);
    const [voteReady, setVoteReady] = useState(3);
    const doc = db.collection('games').doc(gameID);

    useEffect(() => {
        const players = [].concat(docSnapshot.data().MafiaPlayers,
                                    docSnapshot.data().NursePlayers,
                                    docSnapshot.data().DetectivePlayers,
                                    docSnapshot.data().CivilianPlayers);
        if(docSnapshot.data().MafiaPlayers.length !== 0) {
            setVoteReady(voteReady-1);
        }
        if(docSnapshot.data().NursePlayers.length !== 0) {
            setVoteReady(voteReady-1);
        }
        if(docSnapshot.data().DetectivePlayers.length !== 0) {
            setVoteReady(voteReady-1);
        }
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
        let voteArray = docSnapshot.data()[`${player.role}Vote`];
        voteArray.push(target);
        doc.update({
            [`${player.role}Vote`]: voteArray
        });
        //if vote is complete
        if(allies.length === voteArray.length) {
            const votedPlayer = mode(voteArray);
            if(player.role === 'Mafia') {
                doc.update({mafiaTarget: votedPlayer});
            } else if(player.role === 'Nurse') {
                doc.update({nurseTarget: votedPlayer});
            } else if(player.role === 'Detective') {
                doc.update({detectiveTarget: votedPlayer});
            }
            setTarget(votedPlayer);
        }

        //finds most common occurrence and returns it
        function mode(arr){
            return arr.sort((a,b) =>
                  arr.filter(v => v.name===a.name).length
                - arr.filter(v => v.name===b.name).length
            ).pop();
        }

    }

    const CivilianUI = () => {
        return <Type> You're sleeping. </Type>
    }
    const NonCivilianUI = () => {
        return (
        <Type> Your {player.role}'s are:
            <PlayerList players={allies} />
            { !target
            ? <Type>
                Who would you like to {action}?
                <PlayerButtons
                    players={players}
                    customClick={vote}
                />
            </Type>
            : <Type> The {player.role}s have voted for {target}</Type>
            }
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