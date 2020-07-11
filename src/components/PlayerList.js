import React from 'react';
import Type from '@material-ui/core/Typography';

/**
 * List of Players
 *
 */
const PlayerList = ({players}) => {
    if(!Array.isArray(players)) {return <br/>}
    return players.map((player, index) => {
        return (
            <Type variant='h6' key={index}>
            {player.name}
            </Type>
        )
    })
};

export default PlayerList;