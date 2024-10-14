import { Button, IconButton, styled, TextField, ToggleButton } from "@mui/material";
import { Circle } from "@mui/icons-material";

const selectBorderColor = 'purple';

export const StyledIconButton = styled(IconButton)({
    color: 'gray',
});

interface BackgroundIconButtonProps {
    selected?: boolean;
}

export const BackgroundIconButton = styled(IconButton)<BackgroundIconButtonProps>(({ selected }) => ({
    padding: '0.25rem',
    '&:hover': {
        backgroundColor: 'transparent',
        '& .MuiSvgIcon-root': {
            borderColor: selected ? selectBorderColor : '#222',
        },
    },
    '@media (prefers-color-scheme: dark)': {
        '&:hover': {
            backgroundColor: 'transparent',
            '& .MuiSvgIcon-root': {
                borderColor: selected ? selectBorderColor : 'white',
            },
        },
    },
}));

interface BackgroundCircleProps {
    selected?: boolean;
    bgcolor?: string;
    color?: string;
}

export const BackgroundCircle = styled(Circle)<BackgroundCircleProps>(({ selected, bgcolor }) => ({
    fontSize: '2rem',
    backgroundColor: bgcolor || 'transparent',
    color: 'transparent',
    border: `2px solid ${selected ? selectBorderColor : bgcolor || 'gray'}`,
    borderRadius: '50%',
    '&:hover': {
        borderColor: 'inherit',
    },
}));

export const NoteHeaderTextField = styled(TextField)({
    width: '100%',
    '& .MuiInputBase-input': {
        fontSize: 'large',
        fontFamily: 'monospace',
        fontWeight: 'lighter',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
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
        WebkitTapHighlightColor: 'transparent', 
        touchAction: 'manipulation',
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

export const StyledToggleButton = styled(ToggleButton)({
    fontSize: 'x-large',
    fontWeight: 'lighter',
    fontFamily: 'monospace',
    color: 'inherit',
    border: 'none',
    borderRadius: '0px',
    textTransform: 'none',
    backgroundColor: 'transparent',
    '&.Mui-selected': {
        backgroundColor: 'transparent',
    },
    '&:hover': {
        backgroundColor: 'transparent',
    },
    '&:focus': {
        backgroundColor: 'transparent',
    },
    '&:active': {
        backgroundColor: 'transparent',
    }
});

export const StyledTextButton = styled(Button)({
    // color: 'inherit',
    borderRadius: '0px',
    // borderRadius:'24px',
    // '&:hover': {
    //     backgroundColor: 'transparent',
    // },
});