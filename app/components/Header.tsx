'use client'

import { AccountCircleOutlined, AccountTreeOutlined, ArchiveOutlined, Close, DeleteOutlined, MenuOpen, NotesOutlined, Search, SettingsOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from "./header.module.css";
import { useAppContext } from '../providers/AppProvider';

export default function Header() {
    const { } = useAppContext();
    const pathname = usePathname();
    const router = useRouter();

    const [linkTitle, setLinkTitle] = useState('');

    const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const archiveRef = useRef<HTMLAnchorElement>(null);
    const homeRef = useRef<HTMLAnchorElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const mediaRef = useRef<HTMLAnchorElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const projectRef = useRef<HTMLAnchorElement>(null);
    const trashRef = useRef<HTMLAnchorElement>(null);

    const handleOnFocusSearch = () => {
        router.push('/search');
    }
    const handleSearchButton = () => {
        router.push('/search');
        inputRef.current?.focus();
    };

    const handleCloseButton = () => {
        router.back();
        // handleCloseSearch();
        window.scrollTo({ top: 0 });
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsLinkMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // useEffect(() => {
    //     handleCloseSearch();
    //     if (pathname.includes('projects')) {
    //         setLinkTitle('Projects');
    //     } else {
    //         switch (pathname) {
    //             case ('/'):
    //                 setLinkTitle('Notes');
    //                 break;
    //             case ('/search'):
    //                 setLinkTitle('Search');
    //                 break;
    //             case '/reminders':
    //                 setLinkTitle('Reminders');
    //                 break;
    //             case '/archive':
    //                 setLinkTitle('Archive');
    //                 break;
    //             case '/settings':
    //                 setLinkTitle('Settings');
    //                 break;
    //             case '/trash':
    //                 setLinkTitle('Trash');
    //                 break;
    //             case '/help':
    //                 setLinkTitle('Help');
    //                 break;
    //             default:
    //                 setLinkTitle('');
    //         }
    //     }
    // }, [handleCloseSearch, pathname, setIsSearch]);

    const toggleLinkMenu = () => {
        setIsLinkMenuOpen(!isLinkMenuOpen);
    }

    const toggleAccountMenu = () => {
        setIsAccountMenuOpen(prevState => !prevState);
    };

    return (
        <>
            <header className={isScrolled ? styles.headerScrolled : styles.header}>
                <div className={styles.headerLeading}>
                    {isLinkMenuOpen ? (
                        <IconButton onClick={() => setIsLinkMenuOpen(false)}>
                            <Close />
                        </IconButton>
                    ) : (
                        <IconButton onClick={() => setIsLinkMenuOpen(true)}>
                            <MenuOpen />
                        </IconButton>
                    )}
                    <div className={styles.headerTitle}>
                        <h3>{linkTitle}</h3>
                    </div>
                    <div className={styles.searchInputContainer}>
                        <IconButton onClick={handleSearchButton}>
                            <Search />
                        </IconButton>
                        {/* <input
                            // autoComplete="off"
                            // className={styles.searchInput}
                            // id='headerInput'
                            // type="text"
                            // placeholder='Search'
                            // value={searchTerm}
                            // onChange={(e) => handleSearch(e.target.value)}
                            // onFocus={handleOnFocusSearch}
                            // ref={inputRef}
                        /> */}
                        {/* {pathname === '/search' && (
                            <IconButton onClick={handleCloseButton}>
                                <Close />
                            </IconButton>
                        )} */}
                    </div>
                </div>
                <div className={styles.headerTrailing}>
                    <IconButton>
                        <SettingsOutlined />
                    </IconButton>
                    <IconButton>
                        <AccountCircleOutlined />
                    </IconButton>
                </div>
            </header>
            {isLinkMenuOpen && (
                <div className={styles.navContainer} ref={menuRef}>
                    {/* <Link className={pathname === '/' ? styles.navLinkActive : styles.navLink} ref={homeRef} href='/'><NotesOutlined />Notes</Link>
                    <Link className={pathname === '/projects' ? styles.navLinkActive : styles.navLink} ref={projectRef} href='/projects'><AccountTreeOutlined />Projects</Link>
                    <Link className={pathname === '/archive' ? styles.navLinkActive : styles.navLink} ref={archiveRef} href='/archive'><ArchiveOutlined />Archive</Link>
                    <Link className={pathname === '/trash' ? styles.navLinkActive : styles.navLink} ref={trashRef} href='/trash'><DeleteOutlined />Trash</Link> */}
                </div>
            )}
        </>
    );
}