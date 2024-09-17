'use client';

import { AlarmOutlined, MoreVert, Archive, ArchiveOutlined, Bolt, Brush, ChevronLeft, ImageOutlined, NoteAddOutlined, NoteOutlined, PushPin, PushPinOutlined, RedoOutlined, UndoOutlined, DeleteForever, DeleteForeverOutlined, RestoreOutlined, RestoreFromTrashOutlined, Close } from '@mui/icons-material';
import { Box, Button, IconButton, TextField, MenuItem, Divider } from '@mui/material';
import { useRouter } from 'next/navigation'
import styles from "./projectStyles.module.css";

export default function ProjectSelector({
    mode,
    project
}) {

    const router = useRouter();

    return (
        <div className={mode === "create" ? styles.projectSelectorCreate : styles.projectSelectorRead}>
            {
                (mode === 'read' && project.name.length > 0) && (
                    <TextField
                        inputProps={{
                            readOnly: true,
                            style: {
                                fontSize: 20,
                                cursor: 'pointer',
                            },
                        }}
                        onClick={() => router.push(`/projects/${project.id}`)}
                        sx={{
                    
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { border: 'none' },
                                '&:hover fieldset': { border: 'none' },
                                '&.Mui-focused fieldset': { border: 'none' },
                            },
                        }}
                        value={project.name}
                    />
                )
            }
            {
                (mode === 'create' || project.description.length > 0) && (
                    <TextField
                        inputProps={{
                            readOnly: true,
                            style: {
                                fontSize: 16,
                                cursor: 'pointer',
                            },
                        }}
                        onClick={() => router.push(`/projects/${project.id}`)}
                        placeholder='Create a project...'
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { border: 'none' },
                                '&:hover fieldset': { border: 'none' },
                                '&.Mui-focused fieldset': { border: 'none' },
                            },
                        }}
                        value={mode === 'read' ? project.description : null}
                    />
                )
            }
        </div >
    );
}