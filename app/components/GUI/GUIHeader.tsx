'use client';

import React from 'react';
import { NoteHeaderTextField } from '../Styled';
import { useAppContext } from "../../providers/AppProvider";

export interface GUIHeaderProps {
    focus: 'title' | 'content' | '',
    title: string,
    initialOperation: 'read' | 'create';
    isEditMode: boolean,
    isModalMode: boolean,
    isTrashMode: boolean,
    handleTitleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    setFocus: React.Dispatch<React.SetStateAction<'title' | 'content' | ''>>,
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>,
    setIsModalMode: React.Dispatch<React.SetStateAction<boolean>>,
    setScrollPosition: React.Dispatch<React.SetStateAction<number>>;
}

export default function GUIHeader({
    focus,
    initialOperation,
    isEditMode,
    isModalMode,
    isTrashMode,
    title,
    handleTitleChange,
    setFocus,
    setIsEditMode,
    setIsModalMode,
    setScrollPosition,
}: GUIHeaderProps) {
    const { setInfo } = useAppContext();

    const readOnlyMode = initialOperation === 'read' && !isModalMode;
    const placeholderText = 'Title...';
    const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
        event.preventDefault();
        setFocus('title');
    };

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        
        if (isTrashMode) {
            setInfo('Cannot edit a trashed note');
            return;
        }
        if (initialOperation === 'read') {
            setIsEditMode(true);
            setIsModalMode(true);
            setScrollPosition(window.scrollY);
        }
        setFocus('title');
    };

    return (
        <React.Fragment>
            {(isEditMode || title.length > 0) && (
                <NoteHeaderTextField
                    autoComplete='off'
                    inputProps={{
                        readOnly: readOnlyMode,
                    }}
                    multiline
                    onChange={handleTitleChange}
                    onClick={initialOperation === 'create' ? undefined : handleClick}
                    onFocus={handleFocus}
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

                    inputRef={input => {
                        if (input && isEditMode && focus === 'title') {
                            input.focus();   
                        }
                    }}
                />
            )}
        </React.Fragment>
    );
}