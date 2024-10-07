'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { IconButton } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import {
    AccountBoxOutlined, ArchiveOutlined, CircleOutlined, Close, DeleteOutlined, LoginOutlined,
    LogoutOutlined, MenuOpen, Refresh, Search,
    // SettingsOutlined, 
    Archive, Delete,
    HelpCenter,
    HelpCenterOutlined,
    Circle,
    // Settings,
    Lightbulb,
    LightbulbOutlined
} from '@mui/icons-material';

import { useAppContext } from '../providers/AppProvider';
import { useAuthContext } from '../providers/AuthProvider';
import styles from "./Header.module.css";

export default function Header() {
    // Contexts
    const { isLoadingAuth, logOut, user } = useAuthContext();
    const {
        searchTerm, handleSearch, handleCloseSearch, isLoadingApp,
        isLoginModalOpen, setIsLoginModalOpen, fetchData, setNotes
    } = useAppContext();

    // State Variables
    const [title, setTitle] = useState('');
    const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    // const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const pathname = usePathname();
    const router = useRouter();

    const accountMenuRef = useRef<HTMLDivElement>(null);
    const accountButtonRef = useRef<HTMLButtonElement>(null);
    const navMenuRef = useRef<HTMLDivElement>(null);
    const navButtonRef = useRef<HTMLButtonElement>(null);
    const settingsMenuRef = useRef<HTMLDivElement>(null);
    const settingsButtonRef = useRef<HTMLButtonElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Handlers
    const handleOnFocusSearch = () => router.push('/search');
    const handleSearchButton = () => {
        router.push('/search');
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };
    const handleLogin = () => {
        setIsLoginModalOpen(true);
        setIsAccountMenuOpen(false);
    };
    const handleLogOut = async () => {
        try {
            await logOut();
            setNotes([]);
            setIsAccountMenuOpen(false);
        } catch (error) {
            console.log(error);
        }
    };
    const handleCloseButton = () => {
        router.back();
        handleCloseSearch();
        window.scrollTo({ top: 0 });
    };

    // Effects
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navMenuRef.current && !navMenuRef.current.contains(event.target as Node)) {
                if (!navButtonRef.current?.contains(event.target as Node)) {
                    setIsNavMenuOpen(false);
                }
            }
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
                if (!accountButtonRef.current?.contains(event.target as Node)) {
                    setIsAccountMenuOpen(false);
                }
            }
            if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
                if (!settingsButtonRef.current?.contains(event.target as Node)) {
                    // setIsSettingsMenuOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [accountButtonRef, accountMenuRef, navButtonRef, navMenuRef, settingsButtonRef, settingsMenuRef]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        handleCloseSearch();
        switch (pathname) {
            case '/':
                setTitle('Paper Take');
                break;
            case '/account':
                setTitle('Account');
                break;
            case '/archive':
                setTitle('Archive');
                break;
            case '/help':
                setTitle('Help');
                break;
            case '/notes':
                setTitle('Notes');
                break;
            case '/projects':
                setTitle('Projects');
                break;
            case '/search':
                setTitle('Search');
                break;
            case '/trash':
                setTitle('Trash');
                break;
            default:
                setTitle('Paper Take');
        }
    }, [handleCloseSearch, pathname]);

    if (isLoginModalOpen) {
        return null;
    }

    return (
        <header className={isScrolled ? styles.headerScrolled : styles.header}>
            {/* Nav Leading */}
            <div className={styles.headerLeading}>
                <div className={styles.navAnchor}>
                    <IconButton ref={navButtonRef} onClick={() => setIsNavMenuOpen(prev => !prev)}>
                        {isNavMenuOpen ? <Close /> : <MenuOpen />}
                    </IconButton>
                    {isNavMenuOpen && (
                        <nav className={styles.menu} ref={navMenuRef}>
                            <Link className={pathname === '/' ? styles.navLinkActive : styles.navLink} href='/'>
                                {pathname === '/' ? <Lightbulb /> : <LightbulbOutlined/>} Ideas
                            </Link>
                            {/* <Link className={pathname === '/notes' ? styles.navLinkActive : styles.navLink} href='/notes'>
                                {pathname === '/notes' ? <Note /> : <NoteOutlined />} Notes
                            </Link>
                            <Link className={pathname === '/projects' ? styles.navLinkActive : styles.navLink} href='/projects'>
                                {pathname === '/projects' ? <AccountTree /> : <AccountTreeOutlined/>} Projects
                            </Link> */}
                            <Link className={pathname === '/archive' ? styles.navLinkActive : styles.navLink} href='/archive'>
                                {pathname === '/archive' ? <Archive /> : <ArchiveOutlined />} Archive
                            </Link>
                            <Link className={pathname === '/trash' ? styles.navLinkActive : styles.navLink} href='/trash'>
                                {pathname === '/trash' ? <Delete /> : <DeleteOutlined />} Trash
                            </Link>
                            <Link className={pathname === '/help' ? styles.navLinkActive : styles.navLink} href='/help'>
                                {pathname === '/help' ? <HelpCenter /> : <HelpCenterOutlined />} Help
                            </Link>
                        </nav>
                    )}
                </div>
                <div className={styles.headerTitle}>
                    <p>{title}</p>
                </div>
                {/* Nav Input */}
                <div className={styles.searchInputContainer}>
                    <IconButton onClick={handleSearchButton}>
                        <Search />
                    </IconButton>
                    <input
                        autoComplete="off"
                        className={styles.searchInput}
                        id='headerInput'
                        type="text"
                        placeholder='Search...'
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={handleOnFocusSearch}
                        ref={inputRef}
                    />
                    {pathname === '/search' && (
                        <IconButton onClick={handleCloseButton}>
                            <Close />
                        </IconButton>
                    )}
                </div>
            </div>
            {/* Nav Trailing */}
            <div className={styles.headerTrailing}>
                {(isLoadingApp || isLoadingAuth) ? (
                    <IconButton>
                        <CircularProgress size={20} />
                    </IconButton>
                ) : (
                    <IconButton onClick={fetchData}>
                        <Refresh />
                    </IconButton>
                )}
                {/* <div className={styles.settingsAnchor}>
                    <IconButton
                        ref={settingsButtonRef}
                        onClick={() => setIsSettingsMenuOpen(prev => !prev)}>
                        {isSettingsMenuOpen ? <Settings /> : <SettingsOutlined />}
                    </IconButton>
                    {isSettingsMenuOpen && (
                        <nav className={styles.menu} ref={settingsMenuRef}>
                            <div className={styles.navLink}>
                                Todo - Theme
                            </div>
                            <div className={styles.navLink}>
                                Todo - Enable Sharing
                            </div>
                            <div className={styles.navLink}>
                                Todo - Reminder Defaults
                            </div>
                        </nav>
                    )}
                </div> */}
                <div className={styles.accountAnchor}>
                    <IconButton
                        ref={accountButtonRef}
                        onClick={() => setIsAccountMenuOpen(prev => !prev)}>
                        {isAccountMenuOpen ? <Circle /> : <CircleOutlined />}
                    </IconButton>
                    {isAccountMenuOpen && (
                        <nav className={styles.menu} ref={accountMenuRef}>
                            {user && (
                                <Link className={styles.navLink}
                                    // ref={archiveLinkRef} 
                                    onClick={() => setIsAccountMenuOpen(false)} href='/account'>
                                    <AccountBoxOutlined /> Account
                                </Link>
                            )}
                            {user ? (
                                <div className={styles.navLink}
                                    // ref={logOutRef} 
                                    onClick={handleLogOut}>
                                    <LogoutOutlined /> Log Out
                                </div>
                            ) : (
                                <div className={styles.navLink}
                                    // ref={loginRef} 
                                    onClick={handleLogin}>
                                    <LoginOutlined /> Login
                                </div>
                            )}
                        </nav>
                    )}
                </div>
            </div>
        </header>
    );
}