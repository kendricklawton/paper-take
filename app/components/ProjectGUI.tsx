'use client';

import React from 'react';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation'
// import { useAppContext } from '../providers/AppProvider';
import {
    Project,
} from '../models';
import styles from "./GUI.module.css"
import { styled, TextField } from '@mui/material';

const StyledTextField = styled(TextField)({
    width: '100%',
    '& .MuiInputBase-input': {
        fontSize: 'normal',
        fontFamily: 'monospace',
        fontWeight: 'lighter',
        cursor: 'default',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': { border: 'none' },
        '&:hover fieldset': { border: 'none' },
        '&.Mui-focused fieldset': { border: 'none' },
    },
    '@media (prefers-color-scheme: dark)': {
        '& .MuiInputBase-input': {
            color: 'white',
        }
    },
});

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

    // const router = useRouter();

    // const handleClick = () => {
    //     router.push(`/projects/${project.id}`);
    // };

    return (
        <div className={styles.container}>
            <form className={initialOperation === 'create' ? styles.create : styles.read}>
                <div className={styles.infoContainerRead}>
                    <StyledTextField
                        autoComplete='off'
                        inputProps={{
                            readOnly: true,
                        }}
                        // onClick={handleClick}
                        placeholder={'Create a project...'}
                        value={initialOperation === 'read' ? project.title : ''}
                    />
                </div>
            </form >
            <React.Fragment>
                {/* {isTrash ?
                    (
                        <div className={styles.footerWrapper}>
                            <div className={styles.footerContainer}>
                                <div className={styles.footerLeading}>
                                    <StyledIconButton aria-label="Delete note forever" onClick={() => handleDeleteNote()}>
                                        <DeleteForeverOutlined />
                                    </StyledIconButton>
                                    <StyledIconButton aria-label="Restore from trash" onClick={() => toggleDelete()}>
                                        <RestoreFromTrashOutlined />
                                    </StyledIconButton>
                                </div>
                                <StyledIconButton disabled={true}>
                                    <NoteOutlined sx={{ color: 'gray' }} />
                                </StyledIconButton>
                            </div>
                        </div>
                    )
                    :
                    showFooter && (
                        <div className={styles.footerWrapper}>
                            <div className={styles.footerContainer}>
                                <div className={styles.footerLeading}>
                                    <div className={styles.backgroundAnchor}>
                                        <StyledIconButton ref={backgroundMenuRefButton} className={styles.menuButton}
                                            onClick={() => setIsBackgroundMenu(prev => !prev)}>
                                            <PaletteOutlined />
                                        </StyledIconButton>
                                        {isBackgroundMenuOpen && (
                                            <div className={styles.backgroundMenu} ref={backgroundMenuRef}>
                                                <BackgroundIconButton selected={backgroundColor === ''} onClick={() => handleBackgroundColor('')}>
                                                    <BackgroundCircle selected={backgroundColor === ''} />
                                                </BackgroundIconButton>
                                                <BackgroundIconButton selected={backgroundColor === '#fff59c'} onClick={() => handleBackgroundColor('#fff59c')}>
                                                    <BackgroundCircle selected={backgroundColor === '#fff59c'} bgcolor={'#fff59c'} />
                                                </BackgroundIconButton>
                                                <BackgroundIconButton selected={backgroundColor === '#aaf0d1'} onClick={() => handleBackgroundColor('#aaf0d1')}>
                                                    <BackgroundCircle selected={backgroundColor === '#aaf0d1'} bgcolor={'#aaf0d1'} />
                                                </BackgroundIconButton>
                                                <BackgroundIconButton selected={backgroundColor === '#b2dfdb'} onClick={() => handleBackgroundColor('#b2dfdb')}>
                                                    <BackgroundCircle selected={backgroundColor === '#b2dfdb'} bgcolor={'#b2dfdb'} />
                                                </BackgroundIconButton>
                                                <BackgroundIconButton selected={backgroundColor === '#f5f5f5'} onClick={() => handleBackgroundColor('#f5f5f5')}>
                                                    <BackgroundCircle selected={backgroundColor === '#f5f5f5'} bgcolor={'#f5f5f5'} />
                                                </BackgroundIconButton>
                                            </div>
                                        )}
                                    </div>
                                    {initialOperation !== 'create' && (
                                        <StyledIconButton aria-label="Archive" onClick={() => toggleArchive()}>
                                            {isArchived ? <Archive /> : <ArchiveOutlined />}
                                        </StyledIconButton>
                                    )}
                                    {isEditMode && (
                                        <React.Fragment>
                                            <StyledIconButton aria-label="Undo" onClick={handleUndo} disabled={index.current === 0}>
                                                <UndoOutlined />
                                            </StyledIconButton>
                                            <StyledIconButton aria-label="Redo" onClick={handleRedo} disabled={index.current === contentArray.length - 1}>
                                                <RedoOutlined />
                                            </StyledIconButton>
                                        </React.Fragment>
                                    )}
                                    <div className={styles.settingsAnchor}>
                                        <StyledIconButton ref={optionsMenuRefButton} className={styles.menuButton}
                                            onClick={() => setIsOptionsMenu(prev => !prev)}>
                                            <MoreVert />
                                        </StyledIconButton>
                                        {isOptionsMenuOpen && (
                                            <div className={styles.menu} ref={optionsMenuRef}>
                                                <div className={styles.menuItem} onClick={toggleDelete}>Delete Note</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Button sx={{ borderRadius: '0px' }} type="submit">Close</Button>
                            </div>
                        </div>
                    )
                } */}
            </React.Fragment>
        </div>
    );
}

export default ProjectGUI;