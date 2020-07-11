import React, { useEffect } from 'react'
import PlayerList from './components/PlayerList'
import firebase from 'firebase'
import Type from '@material-ui/core/Typography';


const Spectator = ({docSnapshot, name}) => {
    const MafiaPlayers = docSnapshot.data().MafiaPlayers;
    const DetectivePlayers = docSnapshot.data().DetectivePlayers;
    const NursePlayers = docSnapshot.data().NursePlayers;
    const CivilianPlayers = docSnapshot.data().CivilianPlayers;

    return (
        <Type variant='h4' align='center'>
            <h1>WELCOME TO SPECTATOR MODE (WIP)</h1>
            Name: {name}
            
            ? <br/>
            : <Type >

                Your current Mafia are: {MafiaPlayers}
                Your current Detectives are: {DetectivePlayers}
                Your current Nurses are: {NursePlayers}
                Your current Civilians are: {CivilianPlayers}
                </Type>
            
        </Type>

    )
}

export default Spectator;