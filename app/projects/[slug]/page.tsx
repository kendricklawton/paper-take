'use client';

import { useState, useRef, useEffect } from 'react';
import styles from '../../page.module.css';
import ProjectBody from '../ProjectBody';
import ProjectHeader from '../ProjectHeader';

export default function Page({ params }: { params: { slug: string } }) {

    console.log('params.slug:', params.slug);

    const title = 'Project Title';
    const description = 'Project Description';

    const [isProjectSettingsOpen, setIsProjectSettingsOpen] = useState(false);

    const projectSettingsMenuRef = useRef<HTMLDivElement | null>(null);
    const projectSettingsMenuButtonRef = useRef<HTMLButtonElement | null>(null);

    const handleProjectSettingsMenu = () => {
        setIsProjectSettingsOpen(prev => !prev);
    };


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (projectSettingsMenuRef.current && !projectSettingsMenuRef.current.contains(event.target as Node)) {
            if (!projectSettingsMenuButtonRef.current?.contains(event.target as Node)) {
                setIsProjectSettingsOpen(false);
            }
        }
    }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [projectSettingsMenuRef, projectSettingsMenuButtonRef]);

    return (
        <div className={styles.page}>
            <ProjectHeader
                description={description}
                isProjectSettingsOpen={isProjectSettingsOpen}
                projectSettingsMenuRef={projectSettingsMenuRef}
                projectSettingsMenuButtonRef={projectSettingsMenuButtonRef}
                title={title}
                handleProjectSettingsMenu={handleProjectSettingsMenu}/>
            <h1>Under Construction</h1>
            <ProjectBody />
        </div>
    );
}