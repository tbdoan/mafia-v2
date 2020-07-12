import React, {useState} from 'react';
import Button from '@material-ui/core/Button';

/**
 * List of Players
 *
 */
const PlayerButtons = ({players, customClick}) => {
    const [disabled, setDisabled] = useState(false);

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
    console.log(players);
    return players.map((player, index) => {
            return (
                <Button variant='outlined'
                    disabled={disabled}
                    onClick={() => {customClick(player); setDisabled(true)}}
                    key={index}>
                {player.name}
                </Button>
            )
        })

};

export default PlayerButtons;