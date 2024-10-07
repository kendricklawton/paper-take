// 'use client';

// import { Button, TextField } from '@mui/material';
// import styles from "./GUI.module.css"

// export interface ProjectHeaderProps {
//     initialOperation: string,
//     isEditMode: boolean,
//     title: string,
//     description: string,
//     handleTitleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
//     handleDescriptionChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
//     setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>,
// }

// export default function ProjectHeader({
//     initialOperation,
//     isEditMode,
//     title,
//     description,
//     handleTitleChange,
//     handleDescriptionChange,
//     setIsEditMode,
// }: ProjectHeaderProps) {
//     const readOnlyMode = initialOperation === 'read' && !isEditMode;
//     const placeholderTitle = 'Project title...';
//     const placeholderDescription = initialOperation === 'create' && !isEditMode ? 'Create a project...' : 'Project description...';

//     const handleFocus = () => {
//         if (!readOnlyMode) {
//             setIsEditMode(true);
//         }
//     };

//     const handleClick = () => {
//         if (readOnlyMode) {
//             setIsEditMode(true);
//         }
//     };

//     return (
//         initialOperation === 'create' && isEditMode ? (
//             <div className={styles.projectHeader}>
//                 <div className={styles.projectHeaderLeading}>
//                     <TextField
//                         autoComplete='off'
//                         inputProps={{
//                             readOnly: readOnlyMode,
//                             style:
//                             {
//                                 fontSize: 'large',
//                                 fontWeight: 'lighter',
//                                 fontFamily: 'monospace',
//                                 color: 'inherit',
//                                 cursor: 'default',
//                             },
//                         }}
//                         multiline
//                         onChange={handleTitleChange}
//                         onClick={initialOperation === 'create' ? undefined : handleClick}
//                         onFocus={handleFocus}
//                         placeholder={placeholderTitle}
//                         sx={{
//                             width: '100%',
//                             '& .MuiOutlinedInput-root': {
//                                 '& fieldset': { border: 'none' },
//                                 '&:hover fieldset': { border: 'none' },
//                                 '&.Mui-focused fieldset': { border: 'none' },
//                             },
//                         }}
//                         value={title}
//                     />
//                 </div>
//                 <div className={styles.projectHeaderTrailing}>
//                         <Button sx={{
//                             fontSize: 'large',
//                             fontWeight: 'lighter',
//                         }}>Add Item</Button>
//                     <Button sx={{
//                         fontSize: 'large',
//                         fontWeight: 'lighter',
//                     }}
//                     onClick={()=> setIsEditMode(false)}>Close</Button>
//                 </div>
//             </div>
//         ) :
//             (
//                 <TextField
//                     inputProps={{
//                         autoComplete: 'off',
//                         readOnly: readOnlyMode,
//                         style:
//                         {
//                             fontSize: 'normal',
//                             fontWeight: 'lighter',
//                             fontFamily: 'monospace',
//                             color: 'inherit',
//                             cursor: 'default',
//                         },
//                     }}
//                     multiline
//                     onChange={handleDescriptionChange}
//                     onClick={handleClick}
//                     onFocus={handleFocus}
//                     placeholder={placeholderDescription}
//                     sx={{
//                         width: '100%',
//                         '& .MuiOutlinedInput-root': {
//                             '& fieldset': { border: 'none' },
//                             '&:hover fieldset': { border: 'none' },
//                             '&.Mui-focused fieldset': { border: 'none' },
//                         },
//                     }}
//                     value={description}
//                 />
//             )
//     );
// }

'use client';

// import { useState } from 'react';
import styles from './Project.module.css';

import { Button, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Add } from '@mui/icons-material';


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
    title: string;
}


const ProjectHeader: React.FC<ProjectHeaderProps> = ({description, title}) => {
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
                            },
                        }}
                        // onChange={handleTitleChange}
                        // onClick={initialOperation === 'create' ? undefined : handleClick}
                        // onFocus={handleFocus}
                        placeholder={'Create a project...'}
                        sx={{
                            width: '100%',
                            maxWidth: '600px',
                            backgroundColor: 'yellow',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { border: 'none' },
                                '&:hover fieldset': { border: 'none' },
                                '&.Mui-focused fieldset': { border: 'none' },
                            },
                        }}
                        value={title}

                    />
                    <Button variant="contained" startIcon={<Add />}
                        //  endIcon={<ArrowDownwardOutlined/>}
                        sx={{
                            borderRadius: '0px',
                        }}
                    >
                        Add New Work Item
                    </Button>
                </div>


                <ToggleButtonGroup
                    color="primary"
                    // value={currentList}
                    exclusive={true}
                    // onChange={handleChange}
                    aria-label="Platform"
                    sx={{
                        border: 'none',
                        borderRadius: '0px',
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

            </div>

        
    )

}

export default ProjectHeader;