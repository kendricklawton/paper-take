'use client';

import { InputAdornment } from "@mui/material";
import { NoteBodyTextField, StyledNoteButtonTwo } from "./Styled";
import React from "react";
import { useRouter } from "next/navigation";

interface GUIBodyProps {
    focus: 'title' | 'content' | '',
    title: string;
    content: string;
    initialOperation: 'read' | 'create';
    isEditMode: boolean;
    isModalMode: boolean;
    handleContentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    setFocus: React.Dispatch<React.SetStateAction<'title' | 'content' | ''>>,
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    setIsModalMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GUIBody({
    focus,
    title,
    content,
    initialOperation,
    isEditMode,
    isModalMode,
    handleContentChange,
    setFocus,
    setIsEditMode,
    setIsModalMode, 
}: GUIBodyProps) {
    const readOnlyMode = !isEditMode && !isModalMode;
    const placeholderText = (initialOperation === 'create' || isEditMode) ? 'Create an idea...' : 'Empty note...';
    const router = useRouter();
    const dontShow = content.length === 0 && !isEditMode && title.length > 0;

    const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
        event.preventDefault();
        setFocus('content');
    };

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
  
        if (initialOperation === 'create') {
            setIsEditMode(true);
        }
        if (initialOperation === 'read') {
            setIsEditMode(true);
            setIsModalMode(true);
        }
        setFocus('content');
    };

    const handleNoteButton = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIsEditMode(true);
        setIsModalMode(true);
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

                        inputRef={input => {
                            if (input && isEditMode && focus === 'content') {
                                input.focus();
                            }
                        }}
                    />
                )}
        </React.Fragment>
    );
}