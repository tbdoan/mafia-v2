import React from 'react'
import PlayerList from './components/PlayerList'
import Type from '@material-ui/core/Typography';


const Spectator = ({docSnapshot}) => {
    const MafiaPlayers = docSnapshot.data().MafiaPlayers;
    const DetectivePlayers = docSnapshot.data().DetectivePlayers;
    const NursePlayers = docSnapshot.data().NursePlayers;
    const CivilianPlayers = docSnapshot.data().CivilianPlayers;

    return (
        <Type variant='h4' align='center'>
            <h4>WELCOME TO SPECTATOR MODE</h4>

             <Type >
                Your current Mafia are: <br/>
                <PlayerList players={MafiaPlayers}/>
                Your current Detectives are: <br/>
                <PlayerList players={DetectivePlayers}/>
                Your current Nurses are: <br/>
                <PlayerList players={NursePlayers}/>
                Your current Civilians are: <br/>
                <PlayerList players={CivilianPlayers}/>
                </Type>

        </Type>

    )
}

export default Spectator;