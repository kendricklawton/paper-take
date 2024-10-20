'use client'

import React, { useEffect, useState } from 'react';
import styles from './Project.module.css';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface ProjectBodyProps {
    currentPage: "taskboard" | "backlog" | "capacity" | "analytics" | "goal";
}

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

const ProjectBody: React.FC<ProjectBodyProps> = ({
    currentPage,
}) => {
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

    const Taskboard = () => {
        return (
            <React.Fragment>
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
            </React.Fragment>
        );
    };

    const Backlog = () => {
        return (
            <h1>Backlog</h1>
        );
    }

    const Capacity = () => {
        return (
            <h1>Capacity</h1>
        );
    }

    const Analytics = () => {
        return (
            <h1>Analytics</h1>
        );
    }

    const Goal = () => {
        return (
            <h1>Goal</h1>
        );
    }

    const Desktop = () => {
        const renderPage = () => {
            switch (currentPage) {
                case 'taskboard':
                    return <Taskboard />;
                case 'backlog':
                    return <Backlog />;
                case 'capacity':
                    return <Capacity />;
                case 'analytics':
                    return <Analytics />;
                case 'goal':
                    return <Goal />;
                default:
                    return <h1>Page not found</h1>;
            }
        };

        return (
            <div className={styles.body}>
                {renderPage()}
            </div>
        );
    }

    const Mobile = () => {
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
                <div className={styles.spacer} />
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
        <React.Fragment>
            {
                isMobile ? Mobile() : Desktop()
            }
        </React.Fragment>
    );
};

export default ProjectBody;