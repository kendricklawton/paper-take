'use client';

import { TextField } from '@mui/material';

interface NoteBodyProps {
    content: string;
    initialOperation: 'read' | 'create';
    isEditMode: boolean;
    isNestedMode: boolean;
    isModalMode: boolean;
    nestedNoteContent: string;
    handleContentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    toggleModeTrue: () => void;
}

export default function NoteBody({
    content,
    initialOperation,
    isEditMode,
    isNestedMode,
    isModalMode,
    nestedNoteContent,
    handleContentChange,
    toggleModeTrue
}: NoteBodyProps) {
    const readOnlyMode = initialOperation === 'read' && !isModalMode;
    const placeholderText = isNestedMode ? 'Nested - Create a note...' : 'Create a note...';

    const handleFocus = () => {
        if (!readOnlyMode && !isNestedMode) {
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
                    <TextField
                        inputProps={{
                            autoComplete: 'off',
                            readOnly: readOnlyMode,
                            style:
                            {
                                fontSize: 'normal',
                                fontWeight: 'lighter',
                                fontFamily: 'monospace',
                                color: 'inherit',
                                cursor: 'default',
                            },
                        }}
                        multiline
                        onChange={handleContentChange}
                        onClick={handleClick}
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
                        value={isNestedMode ? nestedNoteContent : content}
                    />
            ))}
        </>
    );
}
