'use client'

import React, { useEffect, useState } from 'react';
import styles from './Project.module.css';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const toggleButtonStyles = {
    fontSize: 'large',
    fontWeight: 'lighter',
    fontFamily: 'monospace',
    color: 'inherit',
    border: 'none',
    borderRadius: '0px',
    textTransform: 'none'
};

const initialTasks = [
    { id: '1', content: 'Item 1' },
    { id: '2', content: 'Item 2' },
    { id: '3', content: 'Item 3' },
    { id: '4', content: 'Item 4' },
];

const columnHeaders = [
    // 'Work Item',
    'New',
    'Active',
    'Closed'
];

const ProjectBody: React.FC = () => {
    const [currentColumn, setCurrentColumn] = useState('notes');
    const [columns, setColumns] = useState<{ [key: number]: { id: string; content: string }[] }>({
        0: initialTasks,
        1: [],
        2: [],
        // 3: [],
    });
    const [isMobile, setIsMobile] = useState(false);

    const handleColumnChange = (event: React.MouseEvent<HTMLElement>, newColumn: string) => {
        setCurrentColumn(newColumn);
    }

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, itemId: string) => {
        event.dataTransfer.setData('text/plain', itemId);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, columnIndex: number) => {
        event.preventDefault();
        const itemId = event.dataTransfer.getData('text/plain');

        const newColumns = { ...columns };
        for (const col in newColumns) {
            const index = newColumns[col].findIndex(item => item.id === itemId);
            if (index !== -1) {
                const item = newColumns[col].splice(index, 1)[0];
                newColumns[columnIndex].push(item);
                break;
            }
        }

        setColumns(newColumns);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize
            )
        };
    }, [isMobile]);

    const desktopView = () => {
        return (
            <div className={styles.body}>
                {Object.keys(columns).map((columnIndexStr) => {
                    const columnIndex = Number(columnIndexStr);
                    return (
                        <div
                            key={columnIndex}
                            onDragOver={handleDragOver}
                            onDrop={(event) => handleDrop(event, columnIndex)}
                            className={styles.column}
                        >
                            <h3>{columnHeaders[columnIndex]}</h3>
                            {columns[columnIndex].map(task => (
                                <div
                                    key={task.id}
                                    draggable
                                    onDragStart={(event) => handleDragStart(event, task.id)}
                                    className={styles.item}
                                >
                                    {task.content}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        );
    }

    const mobileView = () => {
        return (
            <div className={styles.body}>
                <ToggleButtonGroup
                    value={currentColumn}
                    exclusive
                    onChange={handleColumnChange}
                    aria-label="column"
                    sx={{
                        width: '100%',
                        border: 'none',
                        borderRadius: '0px',
                        justifyContent: 'center',
                    }}
                >
                    {columnHeaders.map((header, index) => (
                        <ToggleButton
                            key={index}
                            value={header.toLowerCase()}
                            sx={toggleButtonStyles}
                        >
                            {header}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
                <div
                    onDragOver={handleDragOver}
                    onDrop={(event) => handleDrop(event, 0)}
                    className={styles.column}
                >
                    <h3>{columnHeaders[0]}</h3>
                    {columns[0].map((task) => (
                        <div
                            key={task.id}
                            draggable
                            onDragStart={(event) => handleDragStart(event, task.id)}
                            className={styles.item}
                        >
                            {task.content}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            {
                isMobile ? mobileView() : desktopView()
            }
        </>
    );
};

export default ProjectBody;