'use client';

import { useState } from 'react';
import styles from '../../page.module.css';
import ProjectBody from '../ProjectBody';
import ProjectHeader from '../ProjectHeader';

export default function Page({ params }: { params: { slug: string } }) {

    console.log('params.slug:', params.slug);

    const title = 'Project Title';
    const description = 'Project Description';
    const [currentPage, setCurrentPage] = useState<'taskboard' | 'backlog' | 'capacity' | 'analytics' | 'goal'>('taskboard');

    const handlePageChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: 'taskboard' | 'backlog' | 'capacity' | 'analytics' | 'goal',
    ) => {
        setCurrentPage(newAlignment);
    };


    return (
        <div className={styles.page}>
            <h1>Under Construction</h1>
            <ProjectHeader
                currentPage={currentPage}
                description={description}
                handlePageChange={handlePageChange}
                title={title}
            />
            <div className={styles.spacer} />
            <ProjectBody currentPage={currentPage} />
        </div>
    );
}