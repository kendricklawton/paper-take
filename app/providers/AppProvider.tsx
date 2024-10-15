'use client'

import React, { createContext, useContext, useCallback, useEffect, useState, useMemo, ReactNode } from 'react';
import { firestore } from '../firebase';
import { collection, doc, getDocs, orderBy, query, runTransaction, Timestamp, Transaction } from "firebase/firestore";
import { Note, Project } from '../models';
import { useAuthContext } from './AuthProvider';

interface AppContextType {
    appError: string;
    filtered: (Note | Project)[];
    info: string;
    isLoadingApp: boolean;
    notes: Note[];
    projects: Project[];
    searchTerm: string;
    clearAppError: () => void;
    createIdea: (idea: Note | Project) => Promise<void>;
    deleteIdea: (idea: Note | Project) => Promise<void>;
    updateIdea: (idea: Note | Project) => Promise<void>;
    fetchData: () => void;
    handleCloseSearch: () => void;
    handleSearch: (term: string) => void;
    setIsLoadingApp: React.Dispatch<React.SetStateAction<boolean>>;
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
    const [filtered, setFiltered] = useState<(Note | Project)[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [info, setInfo] = useState<string>('');
    const [isLoadingApp, setIsLoadingApp] = useState<boolean>(false);

    const clearAppError = useCallback(() => setAppError(''), []);

    const fetchNotes = useCallback(async () => {
        if (!user) {
            console.log("No user is logged in, fetching notes from local storage");
            return;
        }

        try {
            const ref = collection(firestore, "users", user.uid, "notes");
            const queryNotes = query(ref, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(queryNotes);
            const array: Note[] = snapshot.docs.map(doc => (
                console.log(doc.data()),
                {
                    ...doc.data(),
                }) as Note);

            setNotes(array);
        } catch (error) {
            console.log('Error fetching notes: ', error);
            setNotes([]);
        }
    }, [user]);

    const fetchProjects = useCallback(async () => {
        if (!user) {
            console.log("No user is logged in, fetching projects from local storage");
            return;
        }

        try {
            const ref = collection(firestore, "users", user.uid, "projects");
            const queryProjects = query(ref, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(queryProjects);
            const array: Project[] = snapshot.docs.map(doc => ({
                ...doc.data(),
            }) as Project);

            setProjects(array);
        } catch (error) {
            console.log('Error fetching projects: ', error);
        }
    }, [user]);


    const fetchData = useCallback(async () => {
        if (!user) {
            console.log("No user is logged in, fetching notes from local storage");
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

    const apiService = useCallback(async (operation: "create" | "update" | "delete", idea: Note | Project) => {
        try {
            if (user) {
                console.log("id - " + idea.id);
                const location = idea instanceof Note ? "notes" : "projects";
                console.log("Location " + location);
                const ref = collection(firestore, "users", user.uid, location)

                // let docRef = null;
                let docRef;

                if (operation === "create") {
                    const docRefId = doc(ref);
                    docRef = doc(ref, docRefId.id);
                    idea.id = docRefId.id;
                    idea.createdAt = Timestamp.now();

                    if (idea instanceof Note) {
                        setNotes([idea, ...notes]);
                    } else if (idea instanceof Project) {
                        setProjects([idea, ...projects]);
                    }
                } else if (operation === "update") {
                    console.log(idea.id)
                    docRef = doc(ref, idea.id);

                    if (idea instanceof Note) {
                        setNotes(notes.map(note => note.id === idea.id ? idea : note));
                    } else if (idea instanceof Project) {
                        setProjects(projects.map(project => project.id === idea.id ? idea : project));
                    }
                } else if (operation === "delete") {
                    docRef = doc(ref, idea.id);

                    if (idea instanceof Note) {
                        setNotes(notes.filter(note => note.id !== idea.id));
                    } else if (idea instanceof Project) {
                        setProjects(projects.filter(project => project.id !== idea.id));
                    }
                } else {
                    throw new Error("Invalid operation");
                }

                await runTransaction(firestore, async (transaction: Transaction) => {
                    const snapshot = await transaction.get(docRef);
                    if (operation === "create") {
                        transaction.set(docRef, JSON.parse(idea.toJSON()));
                        console.log(idea as Note ? "Note created in Firestore" : "Project created in Firestore");
                    } else if (operation === "update") {
                        if (!snapshot.exists()) {
                            throw new Error(idea as Note ? "Note does not exist" : "Project does not exist");
                        }
                        transaction.update(docRef, JSON.parse(idea.toJSON()));
                        console.log(idea as Note ? "Note updated in Firestore" : "Project updated in Firestore");
                    } else if (operation === "delete") {
                        transaction.delete(docRef);
                        console.log(idea as Note ? "Note deleted in Firestore" : "Project deleted in Firestore");
                    }
                });
                await fetchData();
            } else {
                console.log('No user is logged in, updating note list in local storage');
            }
        } catch (error) {
            console.error(idea as Note ? 'Error updating note: ' : 'Error updating project: ', error);
        }
    }, [user, notes, projects, fetchData]);

    useEffect(() => {
        if (user) {
            fetchData();
        } else {
            setNotes([]);
            setProjects([]);
        }
    }, [user, fetchData]);

    const createIdea = useCallback(async (idea: Note | Project) => {
        if (idea instanceof Note) {
            setNotes(prevNotes => [idea, ...prevNotes]);
        } else if (idea instanceof Project) {
            setProjects(prevProjects => [idea, ...prevProjects]);
        } else {
            throw new Error("Invalid idea type");
        }

        await apiService("create", idea);
    }, [apiService]);

    const updateIdea = useCallback(async (idea: Note | Project) => {
        await apiService("update", idea);
    }, [apiService]);

    const deleteIdea = useCallback(async (idea: Note | Project) => {
        await apiService("delete", idea);
    }, [apiService]);

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
        appError, filtered, info, isLoadingApp, notes, projects, searchTerm,
        clearAppError, createIdea, fetchData, deleteIdea, handleSearch, handleCloseSearch, setIsLoadingApp, setInfo, setNotes, setProjects, updateIdea
    }), [
        appError, filtered, info, isLoadingApp, notes, projects, searchTerm,
        clearAppError, createIdea, deleteIdea, fetchData, handleSearch, handleCloseSearch, updateIdea
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