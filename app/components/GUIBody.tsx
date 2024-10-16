'use client';

import { InputAdornment } from "@mui/material";
import { NoteBodyTextField, StyledNoteButton } from "./Styled";
import { 
    // AccountTreeOutlined, 
    // AddOutlined,
    //  NoteOutlined 
    } from "@mui/icons-material";
import React, { useEffect, useRef } from "react";
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
    const textFieldRef = useRef<HTMLTextAreaElement | null>(null); 
    
    useEffect(() => {
        if (isEditMode && textFieldRef.current) {
            textFieldRef.current.focus();
        }
    }, [isEditMode]);

    // Conditional rendering for the end adornment
    const endAdornment = initialOperation === "create" && !isEditMode ? (
        <React.Fragment>
            <InputAdornment position="end">
                {/* <Tooltip arrow title={<Typography sx={{ fontSize: "normal" }}>Create a note</Typography>}>
                    <StyledIconButton>
                        <NoteOutlined />
                    </StyledIconButton>
                </Tooltip> */}
                <StyledNoteButton variant="contained" 
                // startIcon={< AddOutlined/>}
                // endIcon={<NoteOutlined />}
                onClick={handleNoteButton}>
                    Note
                </StyledNoteButton>
            </InputAdornment>
            <InputAdornment position="end">
                {/* <Tooltip arrow title={<Typography sx={{ fontSize: "normal" }}>Create a project</Typography>} >
                    <StyledIconButton>
                        <AccountTreeOutlined />
                    </StyledIconButton>
                </Tooltip> */}
                <StyledNoteButton variant="contained" 
                // startIcon={< AddOutlined />} 
                // endIcon={<AccountTreeOutlined />}
                onClick={handleProjectButton}
                >
                    Project
                </StyledNoteButton>
            </InputAdornment>
        </React.Fragment>
    ) : null;

    return (
        <>
            {(initialOperation === "create" || content.length > 0 || isEditMode) && (
                <NoteBodyTextField
                    inputProps={{
                        readOnly: readOnlyMode
                    }}
                    autoComplete='off'
                    multiline={content.length > 0}
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
                    inputRef={textFieldRef}
                />
            )}
        </>
    );
}
