'use client'

import styles from "./page.module.css";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useAppContext } from "./providers/AppProvider";
import GUI from "./components/GUI";
import { Note, Project } from "./models";
import { v4 as uuidv4 } from 'uuid';

const toggleButtonStyles = {
    fontSize: 'x-large',
    fontWeight: 'lighter',
    fontFamily: 'monospace',
    color: 'inherit',
    border: 'none',
    borderRadius: '0px',
    textTransform: 'none'
};

const Notes =()=> {
        const { notes } = useAppContext();
        const activeNotes = notes.filter(note => !note.isArchived && !note.isTrash);

        return (
            <>
                <GUI operation={'create'} object={new Note(
                    new Date(),
                    uuidv4(),
                    '',
                    '',
                    false,
                    false,
                    false
                )} />
                {activeNotes.length === 0 ? (
                    <div className={styles.pageText}>
                        <p>Notes you create will appear here</p>
                    </div>
                ) :
                    (
                        activeNotes.map(note => (
                            <GUI key={note.id} operation={'read'} object={note} />
                        ))
                    )}
            </>
        );
    }
const Projects =()=> {
    const { projects } = useAppContext();
    const activeProjects = projects.filter(project => !project.isArchived && !project.isTrash);

    return (
        <>
            <GUI operation={'create'} object={new Project(
                new Date(),
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
                    <p>Projects you create will appear here</p>
                </div>
            ) :
                (
                    activeProjects.map(project => (
                        <GUI key={project.id} operation={'read'} object={project} />
                    ))
                )}
        </>
    );
}

export default function Home() {
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
                color="primary"
                value={currentList}
                exclusive={true}
                onChange={handleChange}
                aria-label="Platform"
                sx={{
                    border: 'none',
                    borderRadius: '0px',
                }}>
                <ToggleButton value="notes" sx={toggleButtonStyles}>
                    Notes
                </ToggleButton>
                <ToggleButton value="projects" sx={toggleButtonStyles}>
                    Projects
                </ToggleButton>
            </ToggleButtonGroup>
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