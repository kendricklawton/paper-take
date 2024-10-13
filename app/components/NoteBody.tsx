'use client';

import { NoteBodyTextField } from "./Styled";

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
                <NoteBodyTextField
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
