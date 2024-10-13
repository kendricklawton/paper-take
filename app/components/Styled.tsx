import { Button, styled, TextField } from "@mui/material";

export const NoteHeaderTextField = styled(TextField)({
    width: '100%',
    '& .MuiInputBase-input': {
        fontSize: 'large',
        fontFamily: 'monospace',
        fontWeight: 'lighter',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': { border: 'none' },
        '&:hover fieldset': { border: 'none' },
        '&.Mui-focused fieldset': { border: 'none' },
    },
    '@media (prefers-color-scheme: dark)': {
        '& .MuiInputBase-input': {
            color: 'white',
        }
    },
});

export const NoteBodyTextField = styled(TextField)({
    width: '100%',
    '& .MuiInputBase-input': {
        fontFamily: 'monospace',
        fontWeight: 'lighter',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': { border: 'none' },
        '&:hover fieldset': { border: 'none' },
        '&.Mui-focused fieldset': { border: 'none' },
    },
    '@media (prefers-color-scheme: dark)': {
        '& .MuiInputBase-input': {
            color: 'white',
        }
    },
});

export const FormButton = styled(Button)({
    width: '100%',
    fontFamily: 'monospace',
    fontWeight: 'lighter',
    color: 'white',
    backgroundColor: 'black',
    borderRadius: '0px',
    '&:disabled': {
        backgroundColor: '#f0f0f0',
        color: 'gray',
        border: 'none',
        cursor: 'not-allowed'
    },
    '@media (prefers-color-scheme: dark)': {
        color: 'black',
        backgroundColor: 'white',
    },
});

export const FormTextField = styled(TextField)({
    width: '100%',
    '& .MuiInputBase-input': {
        fontFamily: 'monospace',
        fontWeight: 'lighter',
        color: 'inherit',
    },
    '& label': {
        fontFamily: 'monospace',
        fontWeight: 'lighter',
    },
    '& label.Mui-focused': {
        fontFamily: 'monospace',
        fontWeight: 'lighter',
        color: 'inherit',
    },
    '@media (prefers-color-scheme: dark)': {
        '& .MuiInput-underline': {
            '&:before': {
                borderBottom: '1px solid gray',
            },
            '&:hover:before': {
                borderBottom: '2px solid gray',
            }
        },
        '& .MuiInputBase-input': {
            color: 'white',
        },
        '& label': {
            color: 'gray',
        },
        '& label.Mui-focused': {
            color: 'gray',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                border: '1px solid gray',
            },
        },
    },
});
