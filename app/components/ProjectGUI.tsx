'use client';

// import { useState } from 'react';
import { useRouter } from 'next/navigation'
// import { useAppContext } from '../providers/AppProvider';
import {
    Project,
} from '../models';
import styles from "./GUI.module.css"
import { TextField } from '@mui/material';

interface ProjectGUIProps {
    operation: 'read' | 'create';
    project: Project;
}

const ProjectGUI: React.FC<ProjectGUIProps> = ({ operation, project }) => {
    // const { createProject, deleteProject, updateProject, setInfo } = useAppContext();

    // State for UI properties
    const initialOperation = operation;
    // const [isEditMode, setIsEditMode] = useState(false);
    // const [isProjectOptionsMenuOpen, setIsProjectOptionsMenu] = useState(false);

    // State for note properties
    // const isArchived = project.isArchived;
    // const isPinned = project.isPinned;
    // const isTrash = project.isTrash;
    // const [title, setTitle] = useState(project.title);
    // const [description, setDescription] = useState(project.description);

    const router = useRouter();

    const handleClick = () => {
        router.push(`/projects/${project.id}`);
    };

    return (
        <div className={styles.container}>
            <form className={initialOperation === 'create' ? styles.create : styles.read}>
                <div className={styles.infoContainerRead}>
                    <TextField
                        inputProps={{
                            autoComplete: 'off',
                            readOnly: true,
                            style:
                            {
                                fontSize: 'normal',
                                fontWeight: 'lighter',
                                fontFamily: 'monospace',
                                color: 'inherit',
                                cursor: 'default',
                            },
                        }}
                        onClick={handleClick}
                        placeholder={'Create a project...'}
                        sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { border: 'none' },
                                '&:hover fieldset': { border: 'none' },
                                '&.Mui-focused fieldset': { border: 'none' },
                            },
                        }}
                        value={initialOperation === 'read' ? project.title : ''}
                    />
                </div>
            </form >
        </div>
    );
}

export default ProjectGUI;