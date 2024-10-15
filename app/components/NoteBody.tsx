'use client';

import { InputAdornment } from "@mui/material";
import { NoteBodyTextField, StyledNoteButton } from "./Styled";
import { AccountTreeOutlined, AddOutlined, NoteOutlined } from "@mui/icons-material";
import React from "react";

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
    const placeholderText = 'Create an idea...';

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
                startIcon={< AddOutlined/>}
                // endIcon={<NoteOutlined />}
                >
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
                startIcon={< AddOutlined />} 
                // endIcon={<AccountTreeOutlined />}
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
                    InputProps={{
                        endAdornment: endAdornment, // End adornment for the icons
                    }}
                    value={content}
                />
            )}
        </>
    );
}
