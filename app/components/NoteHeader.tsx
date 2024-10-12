'use client';

import { styled, TextField } from '@mui/material';


const StyledTextField = styled(TextField)({
    width: '100%',
    '& .MuiInputBase-input': {
        fontSize: 'large',
        fontFamily: 'monospace',
        fontWeight: 'lighter',
        color: 'inherit',
        // cursor: isEditMode ? 'text' : 'default',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': { border: 'none' },
        '&:hover fieldset': { border: 'none' },
        '&.Mui-focused fieldset': { border: 'none' },
        // cursor: isEditMode ? 'text' : 'default',
    },
});

export interface NoteHeaderProps {
    initialOperation: string,
    isEditMode: boolean,
    isModalMode: boolean,
    title: string,
    handleTitleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    toggleModeTrue: () => void,
}

export default function NoteHeader({
    initialOperation,
    isEditMode,
    isModalMode,
    title,
    handleTitleChange,
    toggleModeTrue
}: NoteHeaderProps) {
    const readOnlyMode = initialOperation === 'read' && !isModalMode;
    const placeholderText = 'Title...';


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
            {(isEditMode || title.length > 0) && (            
                <StyledTextField
                    autoComplete='off'
                    inputProps={{
                        readOnly: readOnlyMode,
                    }}
                    multiline
                    onChange={handleTitleChange}
                    onClick={initialOperation === 'create' ? undefined : handleClick}
                    onFocus={handleFocus}
                    placeholder={placeholderText}
                    value={title}
                    sx={{
                        color: 'inherit',
                        '& .MuiInputBase-input': {
                            cursor: isEditMode ? 'text' : 'default',
                        },
                        '& .MuiOutlinedInput-root': {
                            cursor: isEditMode ? 'text' : 'default',
                        },
                    }}
                />

            )}
        </>
    );
}