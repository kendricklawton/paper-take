'use client';

import { Note, Project } from "../models";
import NoteGUI from "./NoteGUI";
import ProjectGUI from "./ProjectGUI";

interface GUIProps {
    operation: 'read' | 'create';
    object: Note | Project;
}

const GUI: React.FC<GUIProps> = ({ operation, object }) => {
    return (
        <>
            {
                object instanceof Note
                    ?
                    <NoteGUI operation={operation} note={object} />
                    :
                    <ProjectGUI operation={operation} project={object} />
            }
        </>
    );
}

export default GUI;
