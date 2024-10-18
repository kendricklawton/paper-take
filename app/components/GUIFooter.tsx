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
import {
    BackgroundCircle, BackgroundIconButton, StyledIconButton, StyledTextButton,  TransparentIconButton, TransparentIcon,
    StyledTooltip,
    BackgroundCircleYellow,
    BackgroundCircleMintyGreen,
    BackgroundCircleTeal,
    BackgroundCircleChalk
} from './Styled';
import {  MenuItem } from '@mui/material';

interface GUIFooterProps {
    type: 'note' | 'project';
    backgroundColor: string;
    contentArray: string[];
    initialOperation: 'read' | 'create';
    isArchived: boolean;
    isEditMode: boolean;
    isHovering: boolean;
    isBackgroundMenuOpen: boolean;
    isFontMenuOpen: boolean;
    isReminderMenuOpen: boolean;
    isOptionsMenuOpen: boolean;
    isTrash: boolean;
    backgroundMenuRef: React.RefObject<HTMLDivElement>;
    backgroundMenuRefButton: React.RefObject<HTMLButtonElement>;
    fontMenuRef: React.RefObject<HTMLDivElement>;
    fontMenuRefButton: React.RefObject<HTMLButtonElement>;
    optionsMenuRef: React.RefObject<HTMLDivElement>;
    optionsMenuRefButton: React.RefObject<HTMLButtonElement>;
    reminderMenuRef: React.RefObject<HTMLDivElement>;
    reminderMenuRefButton: React.RefObject<HTMLButtonElement>;
    index: React.MutableRefObject<number>;
    toggleBackgroundColor: (
        backgroundColor: "#ffffff" | "#fff59c" | "#aaf0d1" | "#b2dfdb" | "#f5f5f5", 
        backgroundColorDark: "#121212" | "#a68f00" | "#4c8c7d" | "#005c5a" | "#004d40" 
    ) => Promise<void>;
    handleDeleteNote: () => void;
    handleRedo: (event: React.MouseEvent<HTMLButtonElement>) => void;
    handleUndo: (event: React.MouseEvent<HTMLButtonElement>) => void;
    setIsBackgroundMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setIsFontMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setIsReminderMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOptionsMenu: React.Dispatch<React.SetStateAction<boolean>>;
    toggleArchive: () => void;
    toggleDelete: () => void;
}

export default function GUIFooter({
    type,
    backgroundColor,
    contentArray,
    isArchived,
    // isDarkMode,
    isEditMode,
    isBackgroundMenuOpen,
    isHovering,
    // isFontMenuOpen,
    isReminderMenuOpen,
    isOptionsMenuOpen,
    isTrash,
    initialOperation,
    backgroundMenuRef,
    backgroundMenuRefButton,
    // fontMenuRef,
    // fontMenuRefButton,
    reminderMenuRef,
    reminderMenuRefButton,
    optionsMenuRef,
    optionsMenuRefButton,
    index,

    handleDeleteNote,
    handleRedo,
    handleUndo,
    setIsBackgroundMenu,
    // setIsFontMenu,
    setIsOptionsMenu,
    setIsReminderMenu,
    toggleArchive,
    toggleBackgroundColor,
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
                                        <StyledTooltip title='Delete forever'>
                                            <StyledIconButton aria-label="Delete forever" onClick={() => handleDeleteNote()}>
                                                <DeleteForeverOutlined />
                                            </StyledIconButton>
                                        </StyledTooltip>
                                        <StyledTooltip title='Restore'>
                                            <StyledIconButton aria-label="Restore" onClick={() => toggleDelete()}>
                                                <RestoreFromTrashOutlined />
                                            </StyledIconButton>
                                        </StyledTooltip>
                                    </React.Fragment>
                                )
                            }
                        </div>
                        <StyledTooltip title={type === 'note' ? 'Note' : 'Project'}>
                            <span>
                                <StyledIconButton disabled={true}>
                                    <NoteOutlined/>
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
                                        <StyledTooltip  title={'Pin note'}>
                                            <StyledIconButton className={styles.menuButton}
                                            // onClick={() => setIsBackgroundMenu(prev => !prev)}
                                            >
                                                <PushPinOutlined />
                                            </StyledIconButton>
                                        </StyledTooltip>
                                        <div  className={styles.anchor}>

                                        {/* <StyledTooltip  title={'Reminder'}> */}
                                            <StyledIconButton ref={reminderMenuRefButton} className={styles.menuButton}
                                                onClick={() => setIsReminderMenu(prev => !prev)}>
                                                <AlarmAddOutlined />
                                            </StyledIconButton>
                                        {/* </StyledTooltip> */}

                                            {isReminderMenuOpen && (
                                                <div className={styles.menu} ref={reminderMenuRef}>
                                                    {/* <Button sx={MenuButtonStyles} type="button" >In 6 hours</Button>
                                                    <Button sx={MenuButtonStyles} type="button" >In 12 hours</Button>
                                                    <Button sx={MenuButtonStyles} type="button" >In 24 hours</Button>
                                                    <Button sx={MenuButtonStyles} type="button" >Pick date & time</Button> */}
                                                    <div style={{
                                                        padding: '1.2rem',
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'flex-start',
                                                        fontFamily: 'monospace',
                                                    }}><p style={{
                                                        fontFamily: 'monospace',
                                                        fontSize: '1.25rem',
                                                    }}>Remind me</p></div>
                                                    <MenuItem disableGutters sx={{
                                                        fontFamily: 'monospace',
                                                        paddingLeft: '1.2rem',
                                                        paddingRight: '1.2rem',
                                                    }}>In 6 hours</MenuItem>
                                                    <MenuItem disableGutters sx={{
                                                        fontFamily: 'monospace',
                                                        paddingLeft: '1.2rem',
                                                        paddingRight: '1.2rem',
                                                    }}>In 12 hours</MenuItem>
                                                    <MenuItem disableGutters sx={{
                                                        fontFamily: 'monospace',
                                                        paddingLeft: '1.2rem',
                                                        paddingRight: '1.2rem',
                                                    }}>In 24 hours</MenuItem>
                                                    <MenuItem disableGutters sx={{
                                                        fontFamily: 'monospace',
                                                        paddingLeft: '1.2rem',
                                                        paddingRight: '1.2rem',
                                                    }}> Pick date & time</MenuItem>
                                                </div>
                                            )}
                                        </div>
                                        <div className={styles.anchor}>

                                            {/* <StyledTooltip title={'Background options'}> */}
                                                <StyledIconButton ref={backgroundMenuRefButton} className={styles.menuButton}
                                                    onClick={() => setIsBackgroundMenu(prev => !prev)}>
                                                    <PaletteOutlined />
                                                </StyledIconButton>
                                            {/* </StyledTooltip> */}

                                            {isBackgroundMenuOpen && (
                                                <div className={styles.backgroundMenu}
                                                    ref={backgroundMenuRef}>
                                                    <BackgroundIconButton selected={backgroundColor === '#ffffff'} onClick={() => toggleBackgroundColor('#ffffff','#121212')}>
                                                        <BackgroundCircle selected={backgroundColor === '#ffffff'} />
                                                    </BackgroundIconButton>
                                                    <BackgroundIconButton selected={backgroundColor === '#fff59c'} onClick={() => toggleBackgroundColor('#fff59c', '#a68f00')}>
                                                        <BackgroundCircleYellow selected={backgroundColor === '#fff59c'} />
                                                    </BackgroundIconButton>
                                                    <BackgroundIconButton selected={backgroundColor === '#aaf0d1'} onClick={() => toggleBackgroundColor('#aaf0d1', '#4c8c7d')}>
                                                        <BackgroundCircleMintyGreen selected={backgroundColor === '#aaf0d1'} />
                                                    </BackgroundIconButton>
                                                    <BackgroundIconButton selected={backgroundColor === '#b2dfdb'} onClick={() => toggleBackgroundColor('#b2dfdb', '#005c5a')}>
                                                        <BackgroundCircleTeal selected={backgroundColor === '#b2dfdb'} />
                                                    </BackgroundIconButton> 
                                                    <BackgroundIconButton selected={backgroundColor === '#f5f5f5'} onClick={() => toggleBackgroundColor('#f5f5f5', '#004d40')}>
                                                        <BackgroundCircleChalk selected={backgroundColor === '#f5f5f5'} />
                                                    </BackgroundIconButton> 
                                                </div>
                                            )}
                                        </div>
                                        {initialOperation !== 'create' && (
                                            <StyledTooltip title={'Archive note'} >
                                                <StyledIconButton aria-label="Archive" onClick={() => toggleArchive()}>
                                                    {isArchived ? <Archive /> : <ArchiveOutlined />}
                                                </StyledIconButton>
                                            </StyledTooltip>
                                        )}
                                        {isEditMode && (
                                            <React.Fragment>
                                                <StyledTooltip title={'Undo'} >
                                                    <span>
                                                        <StyledIconButton aria-label="Undo" onClick={handleUndo} disabled={index.current === 0}>
                                                            <UndoOutlined />
                                                        </StyledIconButton>
                                                    </span>
                                                </StyledTooltip>
                                                <StyledTooltip title={'Redo'} >
                                                    <span>
                                                        <StyledIconButton aria-label="Redo" onClick={handleRedo} disabled={index.current === contentArray.length - 1}>
                                                            <RedoOutlined />
                                                        </StyledIconButton>
                                                    </span>
                                                </StyledTooltip>
                                            </React.Fragment>
                                        )}
                                        <div className={styles.anchor}>
                                            {/* <StyledTooltip title={'Options'} > */}
                                                <StyledIconButton ref={optionsMenuRefButton} className={styles.menuButton}
                                                    onClick={() => setIsOptionsMenu(prev => !prev)}>
                                                    <MoreVert />
                                                </StyledIconButton>
                                            {/* </StyledTooltip> */}
                                            {isOptionsMenuOpen && (
                                                <div className={styles.menu} ref={optionsMenuRef}>
                                                    <MenuItem onClick={toggleDelete}>Delete</MenuItem>
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
                                    <StyledTooltip title={type === 'note' ? 'Note' : 'Project'} >
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