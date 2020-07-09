import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField'

const Form = ({customSubmit, label}) => {
    const [input, setInput] = useState('');
    const [error, setError] = useState(null);

    const handleNameInput = (e) => {
        setInput(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(input === '') {
            setError('Pls type something');
        } else if ( !customSubmit(input) ) {
            setTimeout(() => setError('Game not found'), 500);
        }
    }


    return(
        <div>
            <form className='App' onSubmit={handleSubmit}>
                <TextField
                    error={error}
                    helperText={error ? error : ''}
                    label={label}
                    type="text"
                    onChange={handleNameInput} />
            </form>
        </div>
    );

}

export default Form;