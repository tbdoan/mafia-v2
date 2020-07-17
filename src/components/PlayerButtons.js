import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

/**
 * List of Players
 *
 */
const PlayerButtons = ({players, customClick, disabled}) => {
    if(!Array.isArray(players)) {return <br/>}

    const compare = ( a, b ) => {
        if ( a.name < b.name ){
          return -1;
        }
        if ( a.name > b.name ){
          return 1;
        }
        return 0;
    }
    players.sort( compare );
    return (
        <ButtonGroup
        orientation="vertical"
        color="primary"
        aria-label="vertical contained primary button group"
        variant="text"
        disabled={disabled}
      >
        {
            players.map((player, index) => {
                return (
                    <Button
                        onClick={() => {customClick(player); }}
                        key={index}
                        >
                    {player.name}
                    </Button>
                )
            })
        }
      </ButtonGroup>

    )

};

export default PlayerButtons;