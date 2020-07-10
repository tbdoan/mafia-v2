import React from 'react';
import Type from '@material-ui/core/Typography';

/**
 * List of Players
 *
 */
const PlayerList = ({players}) => {
    console.log(players);
  return players.map((player, index) => {
    return (
      <Type variant='h6' key={index}>
        {player.name}
      </Type>
    )
  })
};

export default PlayerList;