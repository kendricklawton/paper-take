'use client';

// import { useState } from 'react';
import styles from '../Project.module.css';
import ProjectBody from '../ProjectBody';
import ProjectHeader from '../ProjectHeader';

export default function Page({ params }: { params: { slug: string } }) {

    console.log('params.slug:', params.slug);

    // const projectId = params.slug;
    // const [title, setTitle] = useState('Project Title');
    // const [description, setDescription] = useState('Project Description');

    const title = 'Project Title';
    const description = 'Project Description';
    return (
        <div className={styles.page}>

            <ProjectHeader description={description} title={title} />
            <h1>Under Construction</h1>
            <ProjectBody />
        </div>
    )

}