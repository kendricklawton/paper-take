'use client';

import styles from './Project.module.css';
import { styled, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { StyledNoteButton } from '../components/Styled';

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
    // currentPage: "taskboard" | "backlog" | "capacity" | "analytics" | "goal";
    currentPage: 'taskboard';
    description: string;
    title: string;
    // handlePageChange: (event: React.MouseEvent<HTMLElement>, newAlignment: "taskboard" | "backlog" | "capacity" | "analytics" | "goal") => void;
    handlePageChange: (event: React.MouseEvent<HTMLElement>, newAlignment: 'taskboard') => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = (
    {
        description,
        title,
        currentPage,
        handlePageChange,
    }
) => {
    console.log('Project Header:', title, description);

    const StyledTextField = styled(TextField)({
        maxWidth: '600px',
        width: '100%',
        '& .MuiInputBase-input': {
            fontSize: 'normal',
            fontFamily: 'monospace',
            fontWeight: 'lighter',
            color: 'inherit',
            // cursor: isEditMode ? 'text' : 'default',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': { border: 'none' },
            '&:hover fieldset': { border: 'none' },
            '&.Mui-focused fieldset': { border: 'none' },
            // cursor: isEditMode ? 'text' : 'default',
        },
    });

    return (
        <div className={styles.header}>
            <div className={styles.headerTop}>
                <StyledTextField
                    autoComplete='off'
                    // onChange={handleTitleChange}
                    // onClick={initialOperation === 'create' ? undefined : handleClick}
                    // onFocus={handleFocus}
                    placeholder={'Create a project...'}
                    value={title}
                />
                <div className={styles.headerTopTrailing}>
                    <StyledNoteButton variant="contained"
                        sx={{
                            borderRadius: '0px',
                            minWidth: '90px',
                        }}
                    >
                        Add Task
                    </StyledNoteButton>
                </div>
            </div>
            <div className={styles.headerBottom}>
                <ToggleButtonGroup
                    color="primary"
                    value={currentPage}
                    exclusive={true}
                    onChange={handlePageChange}
                    aria-label="Platform"
                    sx={{
                        border: 'none',
                        borderRadius: '0px',
                        justifyContent: 'center',
                        width: '100%',
                        // backgroundColor: 'yellow',
                    }}>
                    <ToggleButton value="taskboard"
                        sx={toggleButtonStyles}
                    >
                        Taskboard
                    </ToggleButton>
                    <ToggleButton value="backlog"
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
    
            </div>
        </div>
    )
}

export default ProjectHeader;