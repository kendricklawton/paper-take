import React, { useState } from 'react';

const initialItems = [
    { id: '1', content: 'Item 1' },
    { id: '2', content: 'Item 2' },
    { id: '3', content: 'Item 3' },
];

const columnHeaders = ['Work Item', 'New', 'Active', 'Impeded', 'Closed'];

const ProjectBody: React.FC = () => {
    const [columns, setColumns] = useState<{ [key: number]: { id: string; content: string }[] }>({
        0: initialItems,
        1: [],
        2: [],
        3: [],
        4: [],
    });

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, itemId: string) => {
        event.dataTransfer.setData('text/plain', itemId);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, columnIndex: number) => {
        event.preventDefault();
        const itemId = event.dataTransfer.getData('text/plain');

        // Find the item and remove it from the current column
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

    return (
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
            {Object.keys(columns).map((columnIndexStr) => {
                const columnIndex = Number(columnIndexStr);
                return (
                    <div
                        key={columnIndex}
                        onDragOver={handleDragOver}
                        onDrop={(event) => handleDrop(event, columnIndex)}
                        style={{
                            width: '20%',
                            minHeight: '200px',
                            border: '1px solid black',
                            padding: '10px',
                            backgroundColor: '#f0f0f0',
                        }}
                    >
                        <h3 style={{ textAlign: 'center' }}>{columnHeaders[columnIndex]}</h3>
                        {columns[columnIndex].map((item) => (
                            <div
                                key={item.id}
                                draggable
                                onDragStart={(event) => handleDragStart(event, item.id)}
                                style={{
                                    padding: '10px',
                                    margin: '5px',
                                    backgroundColor: '#fff',
                                    border: '1px solid #ccc',
                                    cursor: 'grab',
                                }}
                            >
                                {item.content}
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default ProjectBody;