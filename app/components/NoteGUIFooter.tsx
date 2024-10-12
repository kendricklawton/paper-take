'use client';

import {
    Archive,
    ArchiveOutlined,
    DeleteForeverOutlined,
    MoreVert,
    RedoOutlined,
    UndoOutlined,
    RestoreFromTrashOutlined,
    NoteOutlined,
} from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import styles from "./GUI.module.css"

interface NoteFooterProps {
    contentArray: string[];
    initialOperation: 'read' | 'create';
    isArchived: boolean;
    isEditMode: boolean;
    isNoteOptionsMenuOpen: boolean;
    isTrash: boolean;
    noteOptionsMenuRef: React.RefObject<HTMLDivElement>;
    noteOptionsMenuRefButton: React.RefObject<HTMLButtonElement>;
    index: React.MutableRefObject<number>;
    handleDeleteNote: () => void;
    handleRedo: (event: React.MouseEvent<HTMLButtonElement>) => void;
    handleUndo: (event: React.MouseEvent<HTMLButtonElement>) => void;
    setIsNoteOptionsMenu: React.Dispatch<React.SetStateAction<boolean>>;
    toggleArchive: () => void;
    toggleDelete: () => void;
}

export default function NoteFooter({
    contentArray,
    initialOperation,
    isArchived,
    isEditMode,
    isNoteOptionsMenuOpen,
    isTrash,
    noteOptionsMenuRef,
    noteOptionsMenuRefButton,
    index,
    handleDeleteNote,
    handleRedo,
    handleUndo,
    setIsNoteOptionsMenu,
    toggleArchive,
    toggleDelete
}: NoteFooterProps) {

    return (
        <>
            {isTrash && (
                <div className={styles.footerWrapper}>
                    <div className={styles.footerContainer}>
                        <div>
                            <IconButton aria-label="Delete note forever" onClick={() => handleDeleteNote()}

                                >
                                <DeleteForeverOutlined sx={{
                                    color: 'gray'
                                }} />
                            </IconButton>
                            <IconButton aria-label="Restore from trash" onClick={() => toggleDelete()} >
                                <RestoreFromTrashOutlined sx={{
                                    color: 'gray'
                                }} />
                            </IconButton>
                        </div>
                    </div>
                </div>
            )}

            {((isEditMode && !isTrash) || (initialOperation === 'read' && !isTrash)) && (
                <div className={styles.footerWrapper} >

                    <div className={styles.footerContainer}>
                        <div className={styles.footerLeading}>

                            <div>
                                <IconButton
                                    ref={noteOptionsMenuRefButton}
                                    className={styles.noteOptionsMenuButton}
                                    onClick={() => setIsNoteOptionsMenu(!isNoteOptionsMenuOpen)}
               
                                >
                                    <MoreVert 
                                        sx={{
                                            color: 'gray'
                                        }}
                                    />
                                </IconButton>
                                {isNoteOptionsMenuOpen && (
                                    <div className={styles.noteOptionsMenu} ref={noteOptionsMenuRef}>
                                        <div className={styles.menuItem} onClick={toggleDelete}>Delete Note</div>
                                    </div>
                                )}
                            </div>
                            {initialOperation !== 'create' && (
                                <IconButton aria-label="Archive" 
                        
                                onClick={() => toggleArchive()}>
                                    {isArchived ? <Archive sx={{
                                        color: 'gray'
                                    }} /> : <ArchiveOutlined sx={{
                                        color: 'gray'
                                    }} />}
                                </IconButton>
                            )}
                            {isEditMode && (

                                <>
                                    <IconButton
                                        aria-label="Undo"
                                        onClick={handleUndo}
                                        disabled={index.current === 0}
                                        sx={{
                                            color: 'gray'
                                        }}
                                    >
                                        <UndoOutlined
                                        />
                                    </IconButton>
                                    <IconButton
                                        aria-label="Redo"
                                        onClick={handleRedo}
                                        disabled={index.current === contentArray.length - 1}
                                        sx={{
                                            color: 'gray'
                                        }}
                                    >
                                        <RedoOutlined
                                        />
                                    </IconButton>

                                </>

                            )}
                        </div>
                        {isEditMode ? (
                            <Button sx={{
                                borderRadius: '0px'
                            }} type="submit">
                                Close
                            </Button>
                        ) : (
                            isTrash && (
                                <IconButton disabled={true}
                                    sx={{
                                        color: 'gray',
                                        '&.Mui-disabled': {
                                            color: 'gray'
                                        }
                                    }}>
                                    <NoteOutlined />
                                </IconButton>
                            )
                        )
                        }
                    </div>
                </div>
            )}
        </>
    );
}
