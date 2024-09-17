'use client'
// AppProvider.tsx
import React, { createContext, useCallback, useState, useMemo, ReactNode, useContext } from 'react';
import { Note } from '../models/note';
import { Project } from '../models/project';

// interface AppProviderProps {
//     children: ReactNode;
// }
// export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {

// Define your context type
export interface AppContextType {
    notes: Note[];
    filteredNotes: Note[];
    projects: Project[];
    filteredProjects: Project[];
    infoQueue: string[];
    addInfoToQueue: (info: string) => void;
    clearInfoQueue: () => void;
    createNote: (note: Note) => void;
    deleteNote: (id: string) => void;
    addProject: (project: Project) => void;
    deleteProject: (id: string) => void;
    error: string | null;
}

const initialNotes: Note[] = [];
const initialFilteredNotes: Note[] = [];
const initialProjects: Project[] = [];
const initialFilteredProjects: Project[] = [];
const initialInfoQueue: string[] = [];
const initialError: string | null = null;

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const [filteredNotes, setFilteredNotes] = useState<Note[]>(initialFilteredNotes);
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>(initialProjects);
    const [infoQueue, setInfoQueue] = useState<string[]>(initialInfoQueue);
    const [error, setError] = useState<string | null>(initialError);

    const createNote = useCallback((note: Note) => {
        try {

            note.id = Date.now().toString(); 
            
            if (notes.some(existingNote => existingNote.id === note.id)) {
                throw new Error('Note with this ID already exists.');
            }

            setNotes(prevNotes => [...prevNotes, note]);
    
        } catch (error) {
            console.error('Error creating note:', error);
        }
    }, []);

    const deleteNote = useCallback((id: string) => {
        try {
            if (!notes.some(note => note.id === id)) {
                throw new Error('Note with this ID does not exist.');
            }
            setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
    }, [notes]);

    const addProject = useCallback((project: Project) => {
        try {
            if (projects.some(existingProject => existingProject.id === project.id)) {
                throw new Error('Project with this ID already exists.');
            }
            setProjects(prevProjects => [...prevProjects, project]);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
    }, [projects]);

    const deleteProject = useCallback((id: string) => {
        try {
            if (!projects.some(project => project.id === id)) {
                throw new Error('Project with this ID does not exist.');
            }
            setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
    }, [projects]);

    const addInfoToQueue = useCallback((info: string) => {
        setInfoQueue(prevInfoQueue => [...prevInfoQueue, info]);
        setError(null);
    }, []);

    const clearInfoQueue = useCallback(() => {
        setInfoQueue([]);
        setError(null);
    }, []);

    const contextValue = useMemo(() => ({
        notes,
        filteredNotes,
        projects,
        filteredProjects,
        infoQueue,
        addInfoToQueue,
        clearInfoQueue,
        createNote,
        deleteNote,
        addProject,
        deleteProject,
        error
    }), [
        notes, filteredNotes, projects, filteredProjects, infoQueue,
        addInfoToQueue, clearInfoQueue, createNote, deleteNote, addProject, deleteProject, 
        error]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within AppProvider.tsx');
    }
    return context;
};
