import React from 'react';

/**
 * List of Players
 * 
 */
const PlayerList = ({players}) => {
  return players.map((player, index) => {
    return (
      <div key={index}>
        <h3>{player.name}</h3>
      </div>
    )
  })
};

export default PlayerList;