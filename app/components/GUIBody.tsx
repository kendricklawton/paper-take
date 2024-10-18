'use client';

import { InputAdornment } from "@mui/material";
import { NoteBodyTextField, StyledNoteButtonTwo } from "./Styled";
import React from "react";
import { useRouter } from "next/navigation";

interface GUIBodyProps {
    focus: 'title' | 'body',
    setFocus: React.Dispatch<React.SetStateAction<'title' | 'body'>>,
    title: string;
    content: string;
    initialOperation: 'read' | 'create';
    isEditMode: boolean;
    isModalOpen: boolean;
    isModalMode: boolean;
    handleContentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    toggleModeTrue: () => void;
}

export default function GUIBody({
    focus,
    setFocus,
    title,
    content,
    initialOperation,
    isEditMode,
    isModalOpen,
    isModalMode,
    handleContentChange,
    setIsEditMode,
    toggleModeTrue
}: GUIBodyProps) {
    const readOnlyMode = initialOperation === 'read' && !isModalMode;
    const placeholderText = (initialOperation === 'create'  || isEditMode )? 'Create an idea...' : 'Empty note...';
    const router = useRouter();

    const dontShow = content.length === 0 && !isEditMode && title.length > 0;


    const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
        event.preventDefault();
        setFocus('body');
        // if (!readOnlyMode) {
        //     toggleModeTrue();
        // }
    };

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isModalOpen) {
            return;
        }
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
                <StyledNoteButtonTwo variant="contained" onClick={handleNoteButton}>
                    Note
                </StyledNoteButtonTwo>
            </InputAdornment>
            <InputAdornment position="end">
                <StyledNoteButtonTwo variant="contained" onClick={handleProjectButton}>
                    Project
                </StyledNoteButtonTwo>
            </InputAdornment>
        </React.Fragment>
    ) : null;

    return (
        <React.Fragment>
            {(
                !dontShow
            // initialOperation === "create" || 
            // content.length > 0 || 
            // isEditMode
            // true
        ) && (
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
                  
                    inputRef={inputBody => {
                        if (inputBody && isEditMode && focus === 'body') {
                            inputBody.focus();
                        }
                    }}
                />
            )}
        </React.Fragment>
    );
}
