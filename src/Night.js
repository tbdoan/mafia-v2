import React, {useState, useEffect} from 'react';

import PlayerList from './components/PlayerList';
import PlayerButtons from './components/PlayerButtons'
import Type from '@material-ui/core/Typography';

const Night = ({doc, name, setGameState, docSnapshot}) => {
    //who i am
    const [player, setPlayer] = useState(null);
    //ppl with same role as me
    const [allies, setAllies] = useState([]);
    //everyone
    const [players, setPlayers] = useState([]);
    const [action, setAction] = useState('');
    //who got voted
    const [target, setTarget] = useState(null);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        const players = [].concat(docSnapshot.data().MafiaPlayers,
                                    docSnapshot.data().NursePlayers,
                                    docSnapshot.data().DetectivePlayers,
                                    docSnapshot.data().CivilianPlayers);
        setPlayers(players);
        const player = players.find(p => p.name === name);
        if(typeof player === 'undefined') {
            setGameState('dead');
        } else {
        setAllies(docSnapshot.data()[`${player.role}Players`]);
        setPlayer(player);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(player) {
            if(player.role === 'Mafia') {setAction('kill')}
            else if(player.role === 'Nurse') {setAction('rescue')}
            else if(player.role === 'Detective') {setAction('investigate')}
        }
    }, [player])

    useEffect(() => {
        let voteReady = true;

        if(docSnapshot.data().MafiaPlayers.length !== 0
            && !('MafiaTarget' in docSnapshot.data())) {
            voteReady = false;
        }
        if(docSnapshot.data().NursePlayers.length !== 0
            && !('NurseTarget' in docSnapshot.data())) {
                voteReady = false;
        }
        if(docSnapshot.data().DetectivePlayers.length !== 0
            && !('DetectiveTarget' in docSnapshot.data())) {
                voteReady = false;
        }
        if(voteReady) {
            setTimeout(() => {
                doc.update({
                    MafiaVote: [],
                    NurseVote: [],
                    DetectiveVote: [],
                    gameState: 'day'
                });
            }, 2000);
        } // eslint-disable-next-line
    }, [docSnapshot])

    const vote = async (target) => {
        setDisabled(true);
        let voteArray = docSnapshot.data()[`${player.role}Vote`];
        voteArray.push(target);
        doc.update({
            [`${player.role}Vote`]: voteArray
        });

        //if vote is complete
        if(allies.length === voteArray.length) {
            const votedPlayer = mode(voteArray);
            doc.update({
                [`${player.role}Target`] : votedPlayer
            });
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
                Who would you like to {action}? <br/>
                <PlayerButtons
                    players={players}
                    customClick={vote}
                    disabled={disabled}
                />
            </Type>
            : <Type> The {player.role}s have chosen to {action} {target.name}.
                {player.role==='Detective' ? <Type display='inline'> ({target.role})</Type> : <br/> }</Type>
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