import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import PlayerButtons from './components/PlayerButtons'
import Type from '@material-ui/core/Typography';

const Day = ({name, doc, docSnapshot, setGameState}) => {
    const [players, setPlayers] = useState([]);
    const [nightTarget, setNightTarget] = useState('');
    const [target, setTarget] = useState(null);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        const players = [].concat(docSnapshot.data().MafiaPlayers,
                                    docSnapshot.data().NursePlayers,
                                    docSnapshot.data().DetectivePlayers,
                                    docSnapshot.data().CivilianPlayers);
        const player = players.find(p => p.name === name);
        if(typeof player === 'undefined') {
            setGameState('dead');
        }
        const nightTarget = docSnapshot.data().MafiaTarget;
        if(!('NurseTarget' in docSnapshot.data())
            || nightTarget.name !== docSnapshot.data().NurseTarget.name)
        {
            //night target is killed
            if(typeof nightTarget === 'undefined' || name === nightTarget.name) {
                setGameState('dead');
            } else {
                doc.update({
                    [`${nightTarget.role}Players`]: firebase.firestore.FieldValue.arrayRemove(nightTarget),
                    Spectators: firebase.firestore.FieldValue.arrayUnion(nightTarget),
                    MafiaTarget: firebase.firestore.FieldValue.delete(),
                    NurseTarget: firebase.firestore.FieldValue.delete(),
                    DetectiveTarget: firebase.firestore.FieldValue.delete(),
                });
                nightTarget.alive = false;
                setNightTarget(nightTarget);
            }
        } else {
            //night target is saved
            setNightTarget(nightTarget)
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const players = [].concat(docSnapshot.data().MafiaPlayers,
        docSnapshot.data().NursePlayers,
        docSnapshot.data().DetectivePlayers,
        docSnapshot.data().CivilianPlayers);
        setPlayers(players);
    }, [docSnapshot])

    const vote = async (target) => {
        setDisabled(true);
        let voteArray = docSnapshot.data().AllVote;
        voteArray.push(target);
        doc.update({
            AllVote: voteArray
        });

        //if vote is complete
        if(players.length === voteArray.length) {
            const votedPlayer = mode(voteArray);
            doc.update({
                [`${votedPlayer.role}Players`]: firebase.firestore.FieldValue.arrayRemove(votedPlayer),
                Spectators: firebase.firestore.FieldValue.arrayUnion(votedPlayer),
                AllVote: []
            });
            setTarget(votedPlayer);
            setTimeout(() => {
                doc.update({
                gameState: 'night'
                })
            }, 3000);
        }

        //finds most common occurrence and returns it
        function mode(arr){
            return arr.sort((a,b) =>
                  arr.filter(v => v.name===a.name).length
                - arr.filter(v => v.name===b.name).length
            ).pop();
        }
    }

    return (
        <Type variant='h4' align='center'>
            Name: {name}
            {nightTarget === '' || typeof nightTarget === 'undefined'
                ? <div/>
                : nightTarget.alive
                ? <Type> {nightTarget.name} was targeted but was saved. </Type>
                : <Type> {nightTarget.name} was killed in the night. ( {nightTarget.role} ) </Type>
            }
            {target
                ? <Type> You have chosen to mob {target.name} ({target.role}) </Type>
                : <Type>
                    Who would you like to mob? <br/>
                    <PlayerButtons
                        players={players}
                        customClick={vote}
                        disabled={disabled} />
                    </Type>
            }
        </Type>
    )
}

export default Day;