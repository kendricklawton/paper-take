'use client'

import React, { createContext, useContext, useCallback, useState, useMemo, ReactNode, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, doc, FirestoreError, getDocs, orderBy, query as firestoreQuery, runTransaction, Timestamp } from "firebase/firestore";
import { Note, Project } from '../models';
import { useAuthContext } from './AuthProvider';

interface AppContextType {
    appError: string;
    filtered: (Note | Project)[];
    info: string;
    isLoadingApp: boolean;
    isModalOpen: boolean;
    notes: Note[];
    projects: Project[];
    searchTerm: string;
    searchIsFocused: boolean;
    clearAppError: () => void;
    createNote: (note: Note) => Promise<void>;
    createProject: (project: Project) => Promise<void>;
    deleteNote: (note: Note) => Promise<void>;
    deleteProject: (project: Project) => Promise<void>;
    updateNote: (note: Note) => Promise<void>;
    updateProject: (project: Project) => Promise<void>;
    fetchData: () => void;
    handleCloseSearch: () => void;
    handleSearch: (term: string) => void;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setInfo: React.Dispatch<React.SetStateAction<string>>;
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const { user } = useAuthContext();
    const [appError, setAppError] = useState<string>('');
    const [notes, setNotes] = useState<Note[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [filtered, setFiltered] = useState<(Note | Project)[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchIsFocused, setSearchIsFocused] = useState<boolean>(false);
    const [info, setInfo] = useState<string>('');
    const [isLoadingApp, setIsLoadingApp] = useState<boolean>(false);

    const clearAppError = useCallback(() => setAppError(''), []);

    const fetchNotes = useCallback(async () => {
        if (!user) {
            console.log("No user is logged in, fetching notes from local storage");
            return;
        }

        try {
            console.log('Fetching notes from Firestore');
            const ref = collection(firestore, "users", user.uid, "notes");
            const queryNotes = (ref);
            const snapshot = await getDocs(queryNotes);

            if (snapshot.empty) {
                console.log("No notes found");
                return;
            }

            const firestoreNotes: Note[] = snapshot.docs.map(doc => ({
                ...doc.data(),
            }) as Note);


            setNotes(firestoreNotes);


        } catch (error) {
            if (error instanceof FirestoreError) {
                console.error('Firestore error while fetching notes: ', error.message);
            } else {
                console.error('Error fetching notes: ', error);
            }
        }
    }, [user]);

    const fetchProjects = useCallback(async () => {
        if (!user) {
            console.log("No user is logged in, fetching projects from local storage");
            return;
        }

        try {
            console.log('Fetching projects from Firestore');
            const ref = collection(firestore, "users", user.uid, "projects");
            const queryProjects = firestoreQuery(ref, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(queryProjects);

            if (snapshot.empty) {
                console.log("No projects found");
                return;
            }

            const projects: Project[] = snapshot.docs.map(doc => ({
                ...doc.data(),
            }) as Project);

            setProjects(projects);
        } catch (error) {
            if (error instanceof FirestoreError) {
                console.error('Firestore error while fetching projects: ', error.message);
            } else {
                console.error('Error fetching projects: ', error);
            }
        }
    }, [user, setProjects]);

    const fetchData = useCallback(async () => {
        if (!user) {
            console.log("No user is logged in, fetching data from local storage");
            return;
        }
        try {
            setIsLoadingApp(true);

            await fetchNotes();
            await fetchProjects();

        } catch (error) {
            console.error('Unexpected error: ', error);
        } finally {
            setIsLoadingApp(false);
        }
    }, [fetchNotes, fetchProjects, user]);
    
    const firestoreService = useCallback(async (collectionName: string, operation: string, item: Note | Project) => {
        try {
            setIsLoadingApp(true);
            if (!user) {
                console.log(`No user is logged in, updating ${collectionName} list in local storage`);
                return;
            }

            const ref = collection(firestore, "users", user.uid, collectionName);
            const docRef = doc(ref, item.id);

            console.log(`Attempting to ${operation} ${collectionName} in Firestore`);
            console.log(item);

            await runTransaction(firestore, async (transaction) => {
                const snapshot = await transaction.get(docRef);

                if ((operation === "update" || operation === "delete") && !snapshot.exists()) {
                    console.error(`${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)} not found`);
                    throw new Error(`${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)} not found`);
                }

                switch (operation) {
                    case "create":
                        transaction.set(docRef, JSON.parse(item.toJSON()));
                        console.log(`${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)} created in Firestore`);
                        break;
                    case "update":
                        transaction.update(docRef, JSON.parse(item.toJSON()));
                        console.log(`${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)} updated in Firestore`);
                        break;
                    case "delete":
                        transaction.delete(docRef);
                        console.log(`${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)} deleted in Firestore`);
                        break;
                    default:
                        console.error("Invalid operation");
                        throw new Error("Invalid operation");
                }
            });

        } catch (error) {
            console.error(`Error updating ${collectionName}: `, error);
        } finally {
            setIsLoadingApp(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchData();
        } else {
            setNotes([]);
            setProjects([]);
        }
    }, [user, fetchData]);

    const createNote = useCallback(async (newNote: Note) => {
        const prevNotes = notes;
        newNote.createdAt = Timestamp.now();
        setNotes([newNote, ...notes]);
        try {
            await firestoreService("notes", "create", newNote);
        } catch (error) {
            console.error('Error creating note: ', error);
            setAppError('Error creating note');
            setNotes(prevNotes);
        }
    }, [notes, firestoreService]);

    const createProject = useCallback(async (newProject: Project) => {
        const prevProjects = projects;
        setProjects([newProject, ...projects]);
        try {
            await firestoreService("projects", "create", newProject);
        } catch (error) {
            console.error('Error creating project: ', error);
            setAppError('Error creating project');
            setProjects(prevProjects);
        }
    }, [projects, firestoreService]);

    const updateNote = useCallback(async (updatedNote: Note) => {
        const prevNotes = notes;
        setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
        try {
            await firestoreService("notes", "update", updatedNote);
        } catch (error) {
            console.error('Error updating note: ', error);
            setAppError('Error updating note');
            setNotes(prevNotes);
        }
    }, [notes, firestoreService]);

    const updateProject = useCallback(async (updatedProject: Project) => {
        const prevProjects = projects;
        setProjects(projects.map(project => project.id === updatedProject.id ? updatedProject : project));
        try {
            await firestoreService("projects", "update", updatedProject);
        } catch (error) {
            console.error('Error updating project: ', error);
            setAppError('Error updating project');
            setProjects(prevProjects); // Revert to previous state
        }
    }, [projects, firestoreService]);

    const deleteNote = useCallback(async (deleteNote: Note) => {
        const prevNotes = notes;
        setNotes(notes.filter(n => n.id !== deleteNote.id));
        try {
            await firestoreService("notes","delete", deleteNote);
        } catch (error) {
            console.error('Error deleting note: ', error);
            setAppError('Error deleting note');
            setNotes(prevNotes); // Revert to previous state
        }
    }, [notes, firestoreService]);

    const deleteProject = useCallback(async (deleteProject: Project) => {
        const prevProjects = projects;
        setProjects(projects.filter(p => p.id !== deleteProject.id));
        try {
            await firestoreService("projects","delete", deleteProject);
        } catch (error) {
            console.error('Error deleting project: ', error);
            setAppError('Error deleting project');
            setProjects(prevProjects); // Revert to previous state
        }
    }, [projects, firestoreService]);


    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
        if (term.trim() === '') {
            setFiltered([]);
        } else {
            const lowercasedTerm = term.toLowerCase();
            const filteredNotes = notes.filter(note =>
                note.title.toLowerCase().includes(lowercasedTerm) ||
                note.content.toLowerCase().includes(lowercasedTerm)
            );
            const filteredProjects = projects.filter(project => project.title.toLowerCase().includes(lowercasedTerm));
            setFiltered([...filteredNotes, ...filteredProjects]);
        }
    }, [notes, projects]);

    const handleCloseSearch = useCallback(() => {
        setSearchTerm('');
        setFiltered([]);
    }, []);


    const contextValue = useMemo(() => ({
        appError, filtered, info, isLoadingApp, notes, projects, searchTerm, searchIsFocused, isModalOpen,
        clearAppError, fetchData, handleSearch, handleCloseSearch, setIsModalOpen, setInfo, setNotes, setProjects, setSearchIsFocused, updateNote, updateProject, createNote, createProject, deleteNote, deleteProject
    }), [
        appError, filtered, info, isLoadingApp, notes, projects, searchTerm, searchIsFocused, isModalOpen,
        clearAppError, fetchData, handleSearch, handleCloseSearch, updateNote, updateProject, createNote, createProject, deleteNote, deleteProject
    ]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    return context;
};