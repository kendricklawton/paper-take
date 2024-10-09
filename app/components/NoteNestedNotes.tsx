'use client';

import { IconButton, Tooltip } from "@mui/material";
import { NoteOutlined } from "@mui/icons-material";
import styles from "./GUI.module.css"
import { NestedNote } from "../models";

interface NoteNestedNotesProps {
    isNestedMode: boolean;
    nestedNotes: NestedNote[];
    handlePushToNestedNote: (note: NestedNote) => void;
    toggleModeTrue: () => void;
};

export default function NoteNestedNotes({
    isNestedMode,
    nestedNotes,
    handlePushToNestedNote,
    toggleModeTrue
}: NoteNestedNotesProps) {
    const handlehandlePushToNestedNote = (note: NestedNote) => {
        handlePushToNestedNote(note);
        toggleModeTrue();
    };

    return (
        nestedNotes.length > 0 && !isNestedMode && (
            <div className={styles.nestedNotesWrapper} onClick={toggleModeTrue}>
                <div className={styles.nestedNotesContainer}>
                    {nestedNotes.map((note: NestedNote, index: number) => (
                        <Tooltip key={index} title={ note.title ? note.title.substring(0, 6) : note.content.substring(0, 6)}
                            slotProps={{
                                popper: {
                                    modifiers: [
                                        {
                                            name: 'offset',
                                            options: {
                                                offset: [0, -6],
                                            },
                                        },
                                    ],
                                },
                            }}>
                            <IconButton onClick={
                                () => handlehandlePushToNestedNote(note)
                            }>
                                <NoteOutlined />
                            </IconButton>
                        </Tooltip>
                    ))}
                </div>
            </div>
        )
    );
}