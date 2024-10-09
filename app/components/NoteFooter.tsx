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
    isArchived: boolean;
    isEditMode: boolean;
    isNoteOptionsMenuOpen: boolean;
    isTrash: boolean;
    initialOperation: 'read' | 'create';
    noteOptionsMenuRef: React.RefObject<HTMLDivElement>;
    noteOptionsMenuRefButton: React.RefObject<HTMLButtonElement>;
    nestedIndex: React.MutableRefObject<number>;
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
    isArchived,
    isEditMode,
    isNoteOptionsMenuOpen,
    isTrash,
    initialOperation,
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
                            <IconButton aria-label="Delete note forever" onClick={() => handleDeleteNote()}>
                                <DeleteForeverOutlined className={styles.icon} />
                            </IconButton>
                            <IconButton aria-label="Restore from trash" onClick={() => toggleDelete()}>
                                <RestoreFromTrashOutlined className={styles.icon} />
                            </IconButton>
                        </div>
                    </div>
                </div>
            )}

            {((isEditMode && !isTrash) || (initialOperation === 'read' && !isTrash)) && (
                <div className={styles.footerWrapper}>
                    <div className={styles.footerContainer}>
                        <div className={styles.footerLeading}>
                            <div>
                                <IconButton
                                    ref={noteOptionsMenuRefButton}
                                    className={styles.noteOptionsMenuButton}
                                    onClick={() => setIsNoteOptionsMenu(!isNoteOptionsMenuOpen)}
                                >
                                    <MoreVert className={styles.icon} />
                                </IconButton>
                                {isNoteOptionsMenuOpen && (
                                    <div className={styles.noteOptionsMenu} ref={noteOptionsMenuRef}>
                                        <div className={styles.menuItem} onClick={toggleDelete}>Delete Note</div>
                                    </div>
                                )}
                            </div>
                            {initialOperation !== 'create' && (
                                <IconButton aria-label="Archive" onClick={() => toggleArchive()}>
                                    {isArchived ? <Archive className={styles.icon} /> : <ArchiveOutlined className={styles.icon} />}
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

// 'use client';

// import {
//     Archive,
//     ArchiveOutlined,
//     ChevronLeft,
//     DeleteForeverOutlined,
//     MoreVert,
//     NoteAddOutlined,
//     RedoOutlined,
//     UndoOutlined,
//     RestoreFromTrashOutlined,
//     RestoreOutlined,
//     NoteOutlined,
// } from '@mui/icons-material';
// import { Button, IconButton } from '@mui/material';
// import styles from "./GUI.module.css"

// interface NoteFooterProps {
//     contentArray: string[];
//     isArchived: boolean;
//     isEditMode: boolean;
//     isNestedMode: boolean;
//     isNoteOptionsMenuOpen: boolean;
//     isTrash: boolean;
//     isUndoNestedNote: boolean;
//     initialOperation: 'read' | 'create';
//     nestedContentArray: string[];
//     noteOptionsMenuRef: React.RefObject<HTMLDivElement>;
//     noteOptionsMenuRefButton: React.RefObject<HTMLButtonElement>;
//     nestedIndex: React.MutableRefObject<number>;
//     index: React.MutableRefObject<number>;
//     handleDeleteNote: () => void;
//     handleDeleteNestedNote: () => void;
//     handleNestedNote: () => void;
//     handleRedo: (event: React.MouseEvent<HTMLButtonElement>) => void;
//     handleUndo: (event: React.MouseEvent<HTMLButtonElement>) => void;
//     handleUndoDeletedNestedNote: () => void;
//     setIsNestedMode: React.Dispatch<React.SetStateAction<boolean>>;
//     setIsNoteOptionsMenu: React.Dispatch<React.SetStateAction<boolean>>;
//     toggleArchive: () => void;
//     toggleDelete: () => void;
// }

// export default function NoteFooter({
//     contentArray,
//     isArchived,
//     isEditMode,
//     isNestedMode,
//     isNoteOptionsMenuOpen,
//     isTrash,
//     isUndoNestedNote,
//     initialOperation,
//     nestedContentArray,
//     noteOptionsMenuRef,
//     noteOptionsMenuRefButton,
//     nestedIndex,
//     index,
//     handleDeleteNote,
//     handleDeleteNestedNote,
//     handleUndoDeletedNestedNote,
//     handleNestedNote,
//     handleRedo,
//     handleUndo,
//     setIsNestedMode,
//     setIsNoteOptionsMenu,
//     toggleArchive,
//     toggleDelete
// }: NoteFooterProps) {

//     return (
//         <>
//             {isTrash && (
//                 <div className={styles.footerWrapper}>
//                     <div className={styles.footerContainer}>
//                         <div>
//                             <IconButton aria-label="Delete note forever" onClick={() => handleDeleteNote()}>
//                                 <DeleteForeverOutlined className={styles.icon} />
//                             </IconButton>
//                             <IconButton aria-label="Restore from trash" onClick={() => toggleDelete()}>
//                                 <RestoreFromTrashOutlined className={styles.icon} />
//                             </IconButton>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {((isEditMode && !isTrash) || (initialOperation === 'read' && !isTrash)) && (
//                 <div className={styles.footerWrapper}>
//                     <div className={styles.footerContainer}>
//                         <div className={styles.footerLeading}>
//                             {isEditMode && (
//                                 <>
//                                     {isNestedMode ? (
//                                         <IconButton
//                                             aria-label="Add Note"
//                                             onClick={handleNestedNote}
//                                         >
//                                             <ChevronLeft className={styles.icon} />
//                                         </IconButton>
//                                     ) : (
//                                         <IconButton
//                                             aria-label="Set Nested Mode"
//                                             onClick={() => setIsNestedMode(true)}
//                                         >
//                                             <NoteAddOutlined className={styles.icon} />
//                                         </IconButton>
//                                     )}
//                                 </>
//                             )}
//                             <div>
//                                 <IconButton
//                                     ref={noteOptionsMenuRefButton}
//                                     className={styles.noteOptionsMenuButton}
//                                     onClick={() => setIsNoteOptionsMenu(!isNoteOptionsMenuOpen)}
//                                 >
//                                     <MoreVert className={styles.icon} />
//                                 </IconButton>
//                                 {isNoteOptionsMenuOpen && (
//                                     <div className={styles.noteOptionsMenu} ref={noteOptionsMenuRef}>
//                                         <div className={styles.menuItem} onClick={toggleDelete}>Delete Note</div>
//                                     </div>
//                                 )}
//                             </div>
//                             {initialOperation !== 'create' && (
//                                 <IconButton aria-label="Archive" onClick={() => toggleArchive()}>
//                                     {isArchived ? <Archive className={styles.icon} /> : <ArchiveOutlined className={styles.icon} />}
//                                 </IconButton>
//                             )}
//                             {isEditMode && (
//                                 <>
//                                     {isNestedMode ? (
//                                         <>
//                                             <IconButton
//                                                 aria-label="Undo"
//                                                 onClick={handleUndo}
//                                                 disabled={nestedIndex.current === 0}
//                                             >
//                                                 <UndoOutlined
//                                                 />
//                                             </IconButton>
//                                             <IconButton
//                                                 aria-label="Redo"
//                                                 onClick={handleRedo}
//                                                 sx={{
//                                                     color: 'gray'
//                                                 }}
//                                                 disabled={nestedIndex.current === nestedContentArray.length - 1}
//                                             >
//                                                 <RedoOutlined />
//                                             </IconButton>
//                                             <IconButton
//                                                 aria-label="Delete nested note forever"
//                                                 onClick={handleDeleteNestedNote}
//                                                 sx={{
//                                                     color: 'gray'
//                                                 }}
//                                             >
//                                                 <DeleteForeverOutlined className={styles.icon} />
//                                             </IconButton>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <IconButton
//                                                 aria-label="Undo"
//                                                 onClick={handleUndo}
//                                                 disabled={index.current === 0}
//                                                 sx={{
//                                                     color: 'gray'
//                                                 }}
//                                             >
//                                                 <UndoOutlined
//                                                 />
//                                             </IconButton>
//                                             <IconButton
//                                                 aria-label="Redo"
//                                                 onClick={handleRedo}
//                                                 disabled={index.current === contentArray.length - 1}
//                                                 sx={{
//                                                     color: 'gray'
//                                                 }}
//                                             >
//                                                 <RedoOutlined
//                                                 />
//                                             </IconButton>
//                                             {
//                                                 isUndoNestedNote && (
//                                                     <IconButton
//                                                         aria-label="Undo Deleted Nested Note"
//                                                         onClick={handleUndoDeletedNestedNote}
//                                                     >
//                                                         <RestoreOutlined className={styles.icon} />
//                                                     </IconButton>
//                                                 )
//                                             }
//                                         </>
//                                     )}
//                                 </>
//                             )}
//                         </div>
//                         {isEditMode ? (
//                             <Button sx={{
//                                 borderRadius: '0px'
//                             }} type="submit">
//                                 Close
//                             </Button>
//                         ) : (
//                             isTrash && (
//                                 <IconButton disabled={true}
//                                     sx={{
//                                         color: 'gray',
//                                         '&.Mui-disabled': {
//                                             color: 'gray'
//                                         }
//                                     }}>
//                                     <NoteOutlined />
//                                 </IconButton>
//                             )
//                         )
//                         }
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }
