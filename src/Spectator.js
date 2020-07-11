import React from 'react'
import PlayerList from './components/PlayerList'
import firebase from 'firebase'


const Spectator = ({docSnapshot, name}) => {
    return (
        <Type variant='h4' align='center'>
            <h1>WELCOME TO SPECTATOR MODE (WIP)</h1>
            Name: {name}
            {player === null
            ? <br/>
            : <Type >
                Role: {player.role}. <br/>
                Your current Mafia are:
                <PlayerList players={MafiaPlayers}/>
                Your current Detectives are:
                <PlayerList players={DetectivePlayers}/>
                Your current Nurses are:
                <PlayersList players={NursePlayers}/>
                Your current Civilians are:
                <PlayersList players={CivilianPlayers}/>
                </Type>
            }
        </Type>

    )
}

export default Spectator;