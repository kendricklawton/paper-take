'use client';

import { TextField } from '@mui/material';
import styles from "./noteStyles.module.css"


export interface NoteBodyProps {
    content: string,
    handleContentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    initialMode: string,
    isEditMode: boolean,
    isViewMode: boolean,
    toggleEditModeTrue: () => void,
}

export default function NoteBody({
    content,
    handleContentChange,
    initialMode,
    isEditMode,
    isViewMode,
    toggleEditModeTrue
}: NoteBodyProps) {
    const readOnlyMode = initialMode === 'read' && !isViewMode;
    const placeholderText = 'Create a note...';

    const handleFocus = () => {
        if (!readOnlyMode) {
            toggleEditModeTrue();
        }
    };

    const handleClick = () => {
        if (readOnlyMode) {
            toggleEditModeTrue();
        }
    };

    return (
        <>
            {((initialMode === "create" || content.length > 0 || isEditMode) && (
                <div className={styles.contentContainer}>
                    <TextField
                        inputProps={{
                            autoComplete: 'off',
                            readOnly: readOnlyMode,
                            style: { fontSize: 16 },
                        }}
                        className={styles.textField}
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
                        value={content}
                    />
                </div>
            ))}
        </>
    );
}