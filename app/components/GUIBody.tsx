'use client';

import { InputAdornment } from "@mui/material";
import { NoteBodyTextField, StyledNoteButtonTwo } from "./Styled";
import { 
    // AccountTreeOutlined, 
    // AddOutlined,
    //  NoteOutlined 
    } from "@mui/icons-material";
import React from "react";
import { useRouter } from "next/navigation";

interface GUIBodyProps {
    content: string;
    initialOperation: 'read' | 'create';
    isEditMode: boolean;
    isModalMode: boolean;
    handleContentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    toggleModeTrue: () => void;
}

export default function GUIBody({
    content,
    initialOperation,
    isEditMode,
    isModalMode,
    handleContentChange,
    setIsEditMode,
    toggleModeTrue
}: GUIBodyProps) {
    const readOnlyMode = initialOperation === 'read' && !isModalMode;
    const placeholderText = 'Create an idea...';
    const router = useRouter();

    const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
        event.preventDefault();
        if (!readOnlyMode) {
            toggleModeTrue();
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (readOnlyMode) {
            toggleModeTrue();   
        }
    };

    const handleNoteButton = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        toggleModeTrue();
    }

    const handleProjectButton = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIsEditMode(false);
        router.push('/projects/create');
    }

    const endAdornment = initialOperation === "create" && !isEditMode ? (
        <React.Fragment>
            <InputAdornment position="end">
                <StyledNoteButtonTwo variant="contained" 
                onClick={handleNoteButton}>
                    Note
                </StyledNoteButtonTwo>
            </InputAdornment>
            <InputAdornment position="end">
                <StyledNoteButtonTwo variant="contained" 
                onClick={handleProjectButton}
                >
                    Project
                </StyledNoteButtonTwo>
            </InputAdornment>
        </React.Fragment>
    ) : null;

    return (
        <React.Fragment>
            {(initialOperation === "create" || content.length > 0 || isEditMode) && (
                <NoteBodyTextField
                    inputProps={{
                        readOnly: readOnlyMode
                    }}
                    autoComplete='off'
                    multiline={isEditMode || content.length > 0}
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
                    slotProps={{
                        input: {
                            endAdornment: endAdornment,
                        },
                    }}
                    value={content}
                    inputRef={input => {
                        if (input && isEditMode) {
                            input.focus();
                            // Move the cursor to the end of the content
                            input.setSelectionRange(content.length, content.length);
                        }
                    }}
                />
            )}
        </React.Fragment>
    );
}
