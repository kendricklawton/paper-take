'use client';

import {
    Archive,
    ArchiveOutlined,
    DeleteForeverOutlined,
    PaletteOutlined,
    MoreVert,
    RedoOutlined,
    UndoOutlined,
    RestoreFromTrashOutlined,
    NoteOutlined,
    AlarmAddOutlined,
    PushPinOutlined,
} from '@mui/icons-material';
import styles from "./GUI.module.css"
import React from 'react';
import { BackgroundCircle, BackgroundIconButton, StyledIconButton, StyledTextButton, StyledNoteButton, TransparentIconButton, TransparentIcon, StyledTooltip } from './Styled';

interface GUIFooterProps {
    type: 'note' | 'project';
    backgroundColorInUse: string;
    contentArray: string[];
    initialOperation: 'read' | 'create';
    isDarkMode: boolean;
    isArchived: boolean;
    isEditMode: boolean;
    isHovering: boolean;
    isBackgroundMenuOpen: boolean;
    isFontMenuOpen: boolean;
    isOptionsMenuOpen: boolean;
    isTrash: boolean;
    backgroundMenuRef: React.RefObject<HTMLDivElement>;
    backgroundMenuRefButton: React.RefObject<HTMLButtonElement>;
    fontMenuRef: React.RefObject<HTMLDivElement>;
    fontMenuRefButton: React.RefObject<HTMLButtonElement>;
    optionsMenuRef: React.RefObject<HTMLDivElement>;
    optionsMenuRefButton: React.RefObject<HTMLButtonElement>;
    index: React.MutableRefObject<number>;
    handleBackgroundColor: (color: '' | '#fff59c' | '#aaf0d1' | '#aaf0d1' | '#b2dfdb' | '#f5f5f5') => void;
    handleDeleteNote: () => void;
    handleRedo: (event: React.MouseEvent<HTMLButtonElement>) => void;
    handleUndo: (event: React.MouseEvent<HTMLButtonElement>) => void;
    setIsBackgroundMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setIsFontMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOptionsMenu: React.Dispatch<React.SetStateAction<boolean>>;
    toggleArchive: () => void;
    toggleDelete: () => void;
}

export default function GUIFooter({
    type,
    backgroundColorInUse,
    contentArray,
    isArchived,
    isDarkMode,
    isEditMode,
    isBackgroundMenuOpen,
    isHovering,
    // isFontMenuOpen,
    isOptionsMenuOpen,
    isTrash,
    initialOperation,
    backgroundMenuRef,
    backgroundMenuRefButton,
    // fontMenuRef,
    // fontMenuRefButton,
    optionsMenuRef,
    optionsMenuRefButton,
    index,
    handleBackgroundColor,
    handleDeleteNote,
    handleRedo,
    handleUndo,

    setIsBackgroundMenu,
    // setIsFontMenu,
    setIsOptionsMenu,
    toggleArchive,
    toggleDelete
}: GUIFooterProps) {

    const showFooter = isEditMode || initialOperation === 'read';
    const showFooterIcons = isEditMode || (isHovering && initialOperation === 'read') || isBackgroundMenuOpen || isOptionsMenuOpen;
    const showCloseButton = initialOperation === 'create' || isEditMode;

    return (
        <React.Fragment>
            {isTrash ?
                (<div className={styles.footerWrapper}>
                    <div className={styles.footerContainer}>
                        <div className={styles.footerLeading}>
                            {
                                showFooterIcons && (
                                    <React.Fragment>
                                        <StyledTooltip title={type === 'note' ? 'Delete note forever' : 'Delete project forever'}>
                                                <StyledIconButton aria-label="Delete note forever" onClick={() => handleDeleteNote()}>
                                                    <DeleteForeverOutlined />
                                                </StyledIconButton>                                    
                                        </StyledTooltip>
                                        <StyledIconButton aria-label="Delete note forever" onClick={() => handleDeleteNote()}>
                                            <DeleteForeverOutlined />
                                        </StyledIconButton>
                                        <StyledIconButton aria-label="Restore from trash" onClick={() => toggleDelete()}>
                                            <RestoreFromTrashOutlined />
                                        </StyledIconButton>
                                    </React.Fragment>
                                )
                            }
                        </div>
                        <StyledTooltip title={type === 'note' ? 'Note' : 'Project'}>
                            <span>
                                <StyledIconButton disabled={true}>
                                    <NoteOutlined sx={{ color: 'gray' }} />
                                </StyledIconButton>
                            </span>
                        </StyledTooltip>
                    </div>
                </div>)
                :
                showFooter && (
                    <div className={styles.footerWrapper}>
                        <div className={styles.footerContainer}>
                            {
                                showFooterIcons ? (
                                    <div className={styles.footerLeading}>
                                        <StyledTooltip placement="top" title={'Pin note'}>
                                            <StyledIconButton ref={backgroundMenuRefButton} className={styles.menuButton}
                                            // onClick={() => setIsBackgroundMenu(prev => !prev)}
                                            >
                                                <PushPinOutlined />
                                            </StyledIconButton>
                                        </StyledTooltip>
                                        <StyledTooltip placement="top"  title={'Reminder'}>
                                            <StyledIconButton ref={backgroundMenuRefButton} className={styles.menuButton}
                                                onClick={() => setIsBackgroundMenu(prev => !prev)}>
                                                <AlarmAddOutlined />
                                            </StyledIconButton>
                                        </StyledTooltip>
                                        <div className={styles.backgroundAnchor}>
               
                                            <StyledTooltip 
                                                placement="top"
                                            title={'Background options'}>
                                                <StyledIconButton ref={backgroundMenuRefButton} className={styles.menuButton}
                                                    onClick={() => setIsBackgroundMenu(prev => !prev)}>
                                                    <PaletteOutlined />
                                                </StyledIconButton>
                                            </StyledTooltip>

                                            {isBackgroundMenuOpen && (
                                                <div className={styles.backgroundMenu}
                                                    ref={backgroundMenuRef}>
                                                    <BackgroundIconButton isButtonSelected={backgroundColorInUse === ''} onClick={() => handleBackgroundColor('')}>
                                                        <BackgroundCircle isButtonSelected={backgroundColorInUse === ''} />
                                                    </BackgroundIconButton>
                                                    <BackgroundIconButton isButtonSelected={backgroundColorInUse === '#fff59c' || backgroundColorInUse === '#e6db81'} onClick={() => handleBackgroundColor('#fff59c')}>
                                                        <BackgroundCircle isButtonSelected={backgroundColorInUse === '#fff59c' || backgroundColorInUse === '#e6db81'} bgcolor={isDarkMode ? '#e6db81' : '#fff59c'} />
                                                    </BackgroundIconButton>
                                                    <BackgroundIconButton isButtonSelected={backgroundColorInUse === '#aaf0d1' || backgroundColorInUse === '#8ad5b4'} onClick={() => handleBackgroundColor('#aaf0d1')}>
                                                        <BackgroundCircle isButtonSelected={backgroundColorInUse === '#aaf0d1' || backgroundColorInUse === '#8ad5b4'} bgcolor={isDarkMode ? '#8ad5b4' : '#fff59c'} />
                                                    </BackgroundIconButton>
                                                    <BackgroundIconButton isButtonSelected={backgroundColorInUse === '#b2dfdb' || backgroundColorInUse === '#91c4bf'} onClick={() => handleBackgroundColor('#b2dfdb')}>
                                                        <BackgroundCircle isButtonSelected={backgroundColorInUse === '#b2dfdb' || backgroundColorInUse === '#91c4bf'} bgcolor={isDarkMode ? '#91c4bf' : '#b2dfdb'} />
                                                    </BackgroundIconButton>
                                                    <BackgroundIconButton isButtonSelected={backgroundColorInUse === '#f5f5f5' || backgroundColorInUse === '#d6d6d6'} onClick={() => handleBackgroundColor('#f5f5f5')}>
                                                        <BackgroundCircle isButtonSelected={backgroundColorInUse === '#f5f5f5' || backgroundColorInUse === '#d6d6d6'} bgcolor={isDarkMode ? '#d6d6d6' : '#f5f5f5'} />
                                                    </BackgroundIconButton>
                                                </div>
                                            )}
                                        </div>
                                        {initialOperation !== 'create' && (
                                            <StyledTooltip title={'Archive note'} placement="top">
                                                <StyledIconButton aria-label="Archive" onClick={() => toggleArchive()}>
                                                    {isArchived ? <Archive /> : <ArchiveOutlined />}
                                                </StyledIconButton>
                                            </StyledTooltip>
                                        )}
                                        {isEditMode && (
                                            <React.Fragment>
                                                <StyledTooltip title={'Undo'} placement="top">
                                                    <StyledIconButton aria-label="Undo" onClick={handleUndo} disabled={index.current === 0}>
                                                        <UndoOutlined />
                                                    </StyledIconButton>
                                                </StyledTooltip>
                                                <StyledTooltip title={'Redo'} placement="top">
                                                    <StyledIconButton aria-label="Redo" onClick={handleRedo} disabled={index.current === contentArray.length - 1}>
                                                        <RedoOutlined />
                                                    </StyledIconButton>
                                                </StyledTooltip>
                                            </React.Fragment>
                                        )}
                                        <div className={styles.settingsAnchor} >
                                            <StyledTooltip title={'Options'} placement="top">
                                                <StyledIconButton ref={optionsMenuRefButton} className={styles.menuButton}
                                                    onClick={() => setIsOptionsMenu(prev => !prev)}>
                                                    <MoreVert />
                                                </StyledIconButton>
                                            </StyledTooltip>
                                            {isOptionsMenuOpen && (
                                                <div className={styles.menu} ref={optionsMenuRef}>
                                                    <StyledNoteButton type="button" onClick={toggleDelete}>Delete</StyledNoteButton>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                                : (
                                    <div className={styles.footerLeading}>
                                        <TransparentIconButton>
                                            <TransparentIcon />
                                        </TransparentIconButton>
                                    </div>)
                            }
                            <React.Fragment>
                                {showCloseButton && (
                                    <StyledTextButton type="submit">Close</StyledTextButton>
                                )}
                            </React.Fragment>
                            {
                                (initialOperation === 'read' && !isEditMode) && (
                                    <StyledTooltip title={type === 'note' ? 'Note' : 'Project'} placement="top">
                                        <span>
                                            <StyledIconButton disabled={true}>
                                                <NoteOutlined sx={{ color: 'gray' }} />
                                            </StyledIconButton>
                                        </span>
                                    </StyledTooltip>
                                )
                            }
                        </div>
                    </div>
                )
            }
        </React.Fragment>
    );
}