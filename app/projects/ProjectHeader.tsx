'use client';

import styles from './Project.module.css';
import { Button, IconButton, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Add, Close, SettingsOutlined } from '@mui/icons-material';

const toggleButtonStyles = {
    fontSize: 'large',
    fontWeight: 'lighter',
    fontFamily: 'monospace',
    color: 'inherit',
    border: 'none',
    borderRadius: '0px',
    textTransform: 'none'
};

interface ProjectHeaderProps {
    description: string;
    isProjectSettingsOpen: boolean;
    projectSettingsMenuRef: React.RefObject<HTMLDivElement>;
    projectSettingsMenuButtonRef: React.RefObject<HTMLButtonElement>;
    title: string;
    handleClose: () => void;
    handleProjectSettingsMenu: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = (
    {
        description,
        isProjectSettingsOpen,
        projectSettingsMenuRef,
        projectSettingsMenuButtonRef,
        title,
        handleClose,
        handleProjectSettingsMenu
    }
) => {
    console.log('Project Header:', title, description);
    return (
        <div className={styles.header}>
            <div className={styles.headerTop}>
                <TextField
                    autoComplete='off'
                    inputProps={{
                        style: {
                            fontSize: 'large',
                            fontWeight: 'lighter',
                            fontFamily: 'monospace',
                            color: 'inherit',
                            cursor: 'default',

                        }
                    }}
                    // onChange={handleTitleChange}
                    // onClick={initialOperation === 'create' ? undefined : handleClick}
                    // onFocus={handleFocus}
                    placeholder={'Create a project...'}
                    sx={{
                        width: '100%',
                        maxWidth: '600px',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { border: 'none' },
                            '&:hover fieldset': { border: 'none' },
                            '&.Mui-focused fieldset': { border: 'none' },
                        },
                    }}
                    value={title}
                />
                <div className={styles.headerTopTrailing}>
                    <Button variant="contained" startIcon={<Add />}
                        sx={{
                            borderRadius: '0px',
                            minWidth: '150px',
                        }}
                    >
                        Add New Item
                    </Button>
                    <IconButton onClick={handleClose}>
                        <Close />
                    </IconButton>
                </div>
            </div>
            <div className={styles.headerBottom}>
                <ToggleButtonGroup
                    color="primary"
                    // value={currentList}
                    exclusive={true}
                    // onChange={handleChange}
                    aria-label="Platform"
                    sx={{
                        border: 'none',
                        borderRadius: '0px',
                        justifyContent: 'start',
                        width: '100%',
                        // backgroundColor: 'yellow',
                    }}>
                    <ToggleButton value="Taskboard"
                        sx={toggleButtonStyles}
                    >
                        Taskboard
                    </ToggleButton>
                    <ToggleButton value="Backlog"
                        sx={toggleButtonStyles}
                    >
                        Backlog
                    </ToggleButton>
                    <ToggleButton value="capacity"
                        sx={toggleButtonStyles}
                    >
                        Capacity
                    </ToggleButton>
                    <ToggleButton value="analytics"
                        sx={toggleButtonStyles}
                    >
                        Analytics
                    </ToggleButton>
                    <ToggleButton value="goal"
                        sx={toggleButtonStyles}
                    >
                        Goal
                    </ToggleButton>
                </ToggleButtonGroup>
                <div className={styles.headerBottomTrailing}>
                    <div className={styles.projectSettingsMenuAnchor}>

                        <IconButton
                            ref={projectSettingsMenuButtonRef}
                            onClick={handleProjectSettingsMenu}>
                            <SettingsOutlined />
                        </IconButton>
                        {
                            isProjectSettingsOpen &&
                            (
                                <div className={styles.projectSettingsMenu} ref={projectSettingsMenuRef}>
                                    <div className={styles.menuItem}>Add Column</div>
                                    <div className={styles.menuItem}>Share</div>
                                    <div className={styles.menuItem}>Delete</div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectHeader;