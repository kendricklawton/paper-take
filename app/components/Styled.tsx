import { Button, IconButton, styled, TextField, ToggleButton, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import { Circle } from "@mui/icons-material";

const defaultBorderRadius = '0px';

export const StyledIconButton = styled(IconButton)({
    color: 'gray',
    '@media (prefers-color-scheme: dark)': {
        color: 'lightgray',
        '&.Mui-disabled': {
            color: 'gray'
        }
    }
});

interface BackgroundIconButtonProps {
    selected?: boolean;
}

export const TransparentIconButton = styled(IconButton)<BackgroundIconButtonProps>(({ }) => ({
    color: 'inherit',
    backgroundColor: 'transparent',
    '&:hover': {
        backgroundColor: 'transparent',
    }
}));

export const TransparentIcon = styled(Circle)({
    color: 'transparent',
    border: 'none',
});
export const BackgroundIconButton = styled(IconButton)<BackgroundIconButtonProps>(({ selected }) => ({
    padding: '0.25rem',
    '&:hover': {
        backgroundColor: 'transparent',
        '& .MuiSvgIcon-root': {
            borderColor: selected ? 'purple' : '#222',
        },
    },
    '@media (prefers-color-scheme: dark)': {
        '&:hover': {
            backgroundColor: 'transparent',
            '& .MuiSvgIcon-root': {
                borderColor: selected ? 'purple' : 'white',
            },
        },
    },
}));

interface BackgroundCircleProps {
    selected?: boolean;
    bgcolor?: string;
    color?: string;
}

export const BackgroundCircle = styled(Circle)<BackgroundCircleProps>(({ selected }) => ({
    fontSize: '2rem',
    backgroundColor: '#ffffff',
    color: '#ffffff',
    border: `2px solid ${selected ? 'purple' : 'lightgray'}`,
    borderRadius: '50%',
    '&:hover': {
        borderColor: 'inherit',
    },
    '@media (prefers-color-scheme: dark)': {
        backgroundColor: '#121212',
        color: 'transparent',
        border: `2px solid ${selected ? 'purple' : 'lightgray'}`,
    },
}));

export const BackgroundCircleYellow = styled(Circle)<BackgroundCircleProps>(({ selected }) => ({
    fontSize: '2rem',
    backgroundColor: '#fff59c',
    color: 'transparent',
    border: `2px solid ${selected ? 'purple' : '#fff59c'}`,
    borderRadius: '50%',
    '&:hover': {
        borderColor: 'inherit',
    },
    '@media (prefers-color-scheme: dark)': {
        backgroundColor: '#9c955c',
        color: 'transparent',
        border: `2px solid ${selected ? 'purple' : '#9c955c'}`,
    },
}));

export const BackgroundCircleMintyGreen = styled(Circle)<BackgroundCircleProps>(({ selected }) => ({
    fontSize: '2rem',
    backgroundColor: '#aaf0d1',
    color: 'transparent',
    border: `2px solid ${selected ? 'purple' : '#aaf0d1'}`,
    borderRadius: '50%',
    '&:hover': {
        borderColor: 'inherit',
    },
    '@media (prefers-color-scheme: dark)': {
        backgroundColor: '#5f8775',
        color: 'transparent',
        border: `2px solid ${selected ? 'purple' : '#5f8775'}`,
    },
}));

export const BackgroundCircleTeal = styled(Circle)<BackgroundCircleProps>(({ selected }) => ({
    fontSize: '2rem',
    backgroundColor: '#B2DFDB',
    color: 'transparent',
    border: `2px solid ${selected ? 'purple' : '#B2DFDB'}`,
    borderRadius: '50%',
    '&:hover': {
        borderColor: 'inherit',
    },
    '@media (prefers-color-scheme: dark)': {
        backgroundColor: '#005c5a',
        color: 'transparent',
        border: `2px solid ${selected ? 'purple' : '#005c5a'}`,
    },
}
));

export const BackgroundCircleChalk = styled(Circle)<BackgroundCircleProps>(({ selected }) => ({
    fontSize: '2rem',
    backgroundColor: 'lightgray',
    color: 'transparent',
    border: `2px solid ${selected ? 'purple' : 'lightgray'}`,
    borderRadius: '50%',
    '&:hover': {
        borderColor: 'inherit',
    },
    '@media (prefers-color-scheme: dark)': {
        backgroundColor: '#8a8a8a',
        color: 'transparent',
        border: `2px solid ${selected ? 'purple' : '#8a8a8a'}`,
    },
}
));

export const NoteHeaderTextField = styled(TextField)({
    width: '100%',
    '& .MuiInputBase-input': {
        fontSize: 'large',
        fontFamily: 'monospace',
        fontWeight: 'lighter',
        WebkitTapHighlightColor: 'transparent',
        WebkitUserSelect: 'none',
        color: '#121212',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': { border: 'none' },
        '&:hover fieldset': { border: 'none' },
        '&.Mui-focused fieldset': { border: 'none' },
    },
    '@media (prefers-color-scheme: dark)': {
        '& .MuiInputBase-input': {
            color: 'lightgray',
        }
    },
});

export const NoteBodyTextField = styled(TextField)({
    width: '100%',
    '& .MuiInputBase-input': {
        fontFamily: 'monospace',
        fontWeight: 'lighter',
        WebkitTapHighlightColor: 'transparent',
        WebkitUserSelect: 'none',
        color: '#121212',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': { border: 'none' },
        '&:hover fieldset': { border: 'none' },
        '&.Mui-focused fieldset': { border: 'none' },
    },
    '@media (prefers-color-scheme: dark)': {
        '& .MuiInputBase-input': {
            color: 'lightgray',
        }
    },

});

export const StyledButton = styled(Button)({
    width: '100%',
    fontFamily: 'monospace',
    fontWeight: 'lighter',
    color: 'white',
    backgroundColor: 'black',
    borderRadius: defaultBorderRadius,
    '&:disabled': {
        backgroundColor: '#f0f0f0',
        color: 'gray',
        border: 'none',
        cursor: 'not-allowed'
    },
    '@media (prefers-color-scheme: dark)': {
        color: 'black',
        backgroundColor: 'lightgray',
    },
});

export const StyledNoteButton = styled(Button)({
    width: '100%',
    fontFamily: 'monospace',
    fontWeight: 'lighter',
    color: 'grey',
    backgroundColor: 'transparent',
    borderRadius: defaultBorderRadius,
    '@media (prefers-color-scheme: dark)': {
        color: 'grey',
        backgroundColor: 'transparent',
    },
});

export const StyledNoteButtonTwo = styled(Button)({
    width: '90px',
    fontFamily: 'monospace',
    fontWeight: 'lighter',
    color: '#121212',
    backgroundColor: 'transparent',

    borderRadius: defaultBorderRadius,
    '@media (prefers-color-scheme: dark)': {
        color: 'lightgray',
        backgroundColor: 'transparent',
        border: '0.5px solid gray',
    },
});

export const FormTextField = styled(TextField)({
    width: '100%',
    '& .MuiFilledInput-root': {
        backgroundColor: 'transparent',
    },
    '& .MuiInputBase-input': {
        fontFamily: 'monospace',
        fontWeight: 'lighter',
        color: 'inherit',
        transition: 'color 0.3s ease',
    },
    '& label': {
        fontFamily: 'monospace',
        fontWeight: 'lighter',
        transition: 'color 0.3s ease',
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
            },
        },
        '& .MuiFilledInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
        '& .MuiInputBase-input': {
            color: 'lightgray',
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
    borderRadius: defaultBorderRadius,
    '@media (prefers-color-scheme: dark)': {
        color: 'lightgray',
    }
});

export const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        fontFamily: 'monospace',
        backgroundColor: 'gray',
        borderRadius: defaultBorderRadius,
        color: 'white',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        fontSize: '1rem',
        '@media (prefers-color-scheme: dark)': {
            // backgroundColor: '#121212',
            // color: 'white',
        },
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: 'white',
        '@media (prefers-color-scheme: dark)': {
            color: 'gray', // Dark mode arrow color
        },
    },
}));