'use client';

import { TextField } from '@mui/material';

export interface NoteHeaderProps {
    initialOperation: string,
    isEditMode: boolean,
    isModalMode: boolean,
    isNestedMode: boolean,
    nestedNoteTitle: string,
    title: string,
    handleTitleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    toggleModeTrue: () => void,
}

export default function NoteHeader({
    initialOperation,
    isEditMode,
    isModalMode,
    isNestedMode,
    nestedNoteTitle,
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
                <TextField
                    autoComplete='off'
                    inputProps={{
                        readOnly: readOnlyMode,
                        style:
                        {
                            fontSize: 'large',
                            fontWeight: 'lighter',
                            fontFamily: 'monospace',
                            color: 'inherit',
                            cursor: 'default',
                        },
                    }}
                    multiline
                    onChange={handleTitleChange}
                    onClick={initialOperation === 'create' ? undefined : handleClick}
                    onFocus={handleFocus}
                    placeholder={placeholderText}
                    sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { border: 'none' },
                            '&:hover fieldset': { border: 'none' },
                            '&.Mui-focused fieldset': { border: 'none' },
                        },
                    }}
                    value={isNestedMode ? nestedNoteTitle : title}
                />

            )}
        </>
    );
}