'use client'

import React, {useState} from 'react';
import styles from "../page.module.css";
import { ToggleButtonGroup } from "@mui/material";
import { StyledToggleButton } from '../components/Styled';
import { useAppContext } from "../providers/AppProvider";
import NoteGUI from "../components/NoteGUI";
import ProjectGUI from "../components/ProjectGUI";
import { Note, Project } from "../models";
import { v4 as uuidv4 } from 'uuid';

const Notes: React.FC = () => {
    const { notes,
        noteService 
    } = useAppContext();
    const activeNotes = notes.filter(note => !note.isArchived && !note.isTrash);
    const [draggingNoteIndex, setDraggingNoteIndex] = useState<number | null>(null);

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
        const dragDiv = event.currentTarget.cloneNode(true) as HTMLDivElement;
        dragDiv.style.pointerEvents = 'none';
        document.body.appendChild(dragDiv);
        const rect = event.currentTarget.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        event.dataTransfer.setDragImage(dragDiv, offsetX, offsetY);
        setTimeout(() => {
            document.body.removeChild(dragDiv);
        }, 0);
        setDraggingNoteIndex(index);
    };


    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
   
        console.log('Drag Over Index:', index);
    };

    const handleDrop = async (index: number) => {
        if (draggingNoteIndex !== null) {
            const newNotes = [...activeNotes];
            const [draggingNote] = newNotes.splice(draggingNoteIndex, 1);
            newNotes.splice(index, 0, draggingNote);
            noteService(newNotes);
        }
        setDraggingNoteIndex(null);

    };

    const newNote = new Note(
        undefined,
        '',
        uuidv4(),
        '',
        '',
        false,
        false,
        false,
        [],
        undefined
    )

    return (
        <React.Fragment>
            <NoteGUI operation={'create'} note={newNote} />
            {activeNotes.length === 0 ? (
                <React.Fragment>
                    <div className={styles.pageText}>
                        <p>Features Coming Soon</p>
                    </div>
                    <div className={styles.pageText}>
                        <p>List Layout</p>
                    </div>
                    <div className={styles.pageText}>
                        <p>App Settings</p>
                    </div>
                    <div className={styles.pageText}>
                        <p>Notes you create will appear here</p>
                    </div>
                </React.Fragment>

            ) : (
                activeNotes.map((note, index) => (
                    <React.Fragment key={index}>
                        <div className={styles.spacer} />
                        { /* Todo - Create Draggable List */}
                        <NoteGUI
                            key={note.id}
                            operation={'read'}
                            note={note}
        
                        draggable={true}
                        handleDragOver={handleDragOver}
                        handleDrop={handleDrop}
                        noteIndex={index}
                        handleDragStart={handleDragStart}
                        />

                    </React.Fragment>
                ))
            )}
        </React.Fragment>
    );
};

const Projects = () => {
    const { projects } = useAppContext();
    const activeProjects = projects.filter(project => !project.isArchived && !project.isTrash);

    return (
        <React.Fragment>
            <ProjectGUI operation={'create'} project={new Project(
                undefined,
                uuidv4(),
                'New Project',
                '',
                undefined,
                false,
                false,
                false,
            )} />
            {activeProjects.length === 0 ? (
                <div className={styles.pageText}>
                    <p>Projects are currently under construction</p>
                    {/* <p>Projects you create will appear here</p> */}
                </div>
            ) :
                (
                    activeProjects.map(project => (
                        <ProjectGUI key={project.id} operation={'read'} project={project} />
                    ))
                )}
        </React.Fragment>
    );
}

export default function Ideas() {
    const { currentList, setCurrentList } = useAppContext();

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newList: ("notes" | "projects") | null,
    ) => {
        if (newList !== null) {
            setCurrentList(newList);
        }
    };

    return (
        <main className={styles.page}>
            <ToggleButtonGroup
                color='primary'
                value={currentList}
                exclusive={true}
                onChange={handleChange}
                aria-label="Platform"
                sx={{
                    border: 'none',
                    borderRadius: '0px',
                }}>
                <StyledToggleButton value="notes">Notes</StyledToggleButton>
                <StyledToggleButton value="projects">Projects</StyledToggleButton>
            </ToggleButtonGroup>
            <div className={styles.spacer} />
            {
                currentList === 'notes'
                    ?
                    <Notes />
                    :
                    <Projects />
            }
        </main>
    );
}

