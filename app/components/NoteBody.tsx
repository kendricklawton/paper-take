'use client';

import { styled, TextField } from '@mui/material';

const StyledTextField = styled(TextField)({
    width: '100%',
    '& .MuiInputBase-input': {
        color: 'black',
        fontSize: 'normal',
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

interface NoteBodyProps {
    content: string;
    initialOperation: 'read' | 'create';
    isEditMode: boolean;
    isModalMode: boolean;
    handleContentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    toggleModeTrue: () => void;
}

export default function NoteBody({
    content,
    initialOperation,
    isEditMode,
    isModalMode,
    handleContentChange,
    toggleModeTrue
}: NoteBodyProps) {
    const readOnlyMode = initialOperation === 'read' && !isModalMode;
    const placeholderText = 'Create a note...';

    const handleFocus = () => {
        if (!readOnlyMode) {
            toggleModeTrue();
        }
    };

    const handleClick = () => {
        if (readOnlyMode) {
            toggleModeTrue();
        }
    };



    return (
        <>
            {((initialOperation === "create" || content.length > 0 || isEditMode) && (
                <StyledTextField
                    inputProps={{
                        readOnly: readOnlyMode,
                    }}
                    autoComplete='off'
                    multiline
                    onChange={handleContentChange}
                    onClick={handleClick}
                    onFocus={handleFocus}
                    placeholder={placeholderText}
                    sx={{
                        '& .MuiInputBase-input': {
                            cursor: isEditMode ? 'text' : 'default',
                        },
                        '& .MuiOutlinedInput-root': {
                            cursor: isEditMode ? 'text' : 'default',
                        },
                    }}
                    value={content}
                />
            ))}
        </>
    );
}
