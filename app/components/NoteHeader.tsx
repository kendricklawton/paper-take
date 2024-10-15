'use client';

import { NoteHeaderTextField } from './Styled';

export interface NoteHeaderProps {
    title: string,
    initialOperation: 'read' | 'create';
    isEditMode: boolean,
    isModalMode: boolean,
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

    // const handleFocus = () => {
    //     if (!readOnlyMode) {
    //         toggleModeTrue();
    //     }
    // };

    const handleClick = () => {
        if (readOnlyMode) {
            toggleModeTrue();
        }
    };

    return (
        <>
            {(isEditMode || title.length > 0) && (            
                <NoteHeaderTextField
                    autoComplete='off'
                    inputProps={{
                        readOnly: readOnlyMode,
                    }}
                    multiline
                    onChange={handleTitleChange}
                    onClick={initialOperation === 'create' ? undefined : handleClick}
                    // onFocus={handleFocus}
                    placeholder={placeholderText}
                    value={title}
                    sx={{
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