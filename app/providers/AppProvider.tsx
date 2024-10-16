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
            if (!user) {
                console.log('No user is logged in, updating note list in local storage');
                return;
            }

            const location = idea instanceof Note ? "notes" : "projects";
            const ref = collection(firestore, "users", user.uid, location);
            let docRef;

            if (operation === "create") {
                const docRefId = doc(ref);
                docRef = doc(ref, docRefId.id);
                idea.id = docRefId.id;
                idea.createdAt = Timestamp.now();
            } else {
                docRef = doc(ref, idea.id);
            }

            await runTransaction(firestore, async (transaction: Transaction) => {
                const snapshot = await transaction.get(docRef);

                if ((operation === "update" || operation === "delete") && !snapshot.exists()) {
                    console.error(idea instanceof Note ? 'Note not found' : 'Project not found');
                    throw new Error(idea instanceof Note ? 'Note not found' : 'Project not found');
                }

                switch (operation) {
                    case "create":
                        transaction.set(docRef, JSON.parse(idea.toJSON()));
                        console.log(idea instanceof Note ? "Note created in Firestore" : "Project created in Firestore");
                        break;
                    case "update":
                        transaction.update(docRef, JSON.parse(idea.toJSON()));
                        console.log(idea instanceof Note ? "Note updated in Firestore" : "Project updated in Firestore");
                        break;
                    case "delete":
                        transaction.delete(docRef);
                        console.log(idea instanceof Note ? "Note deleted in Firestore" : "Project deleted in Firestore");
                        break;
                    default:
                        console.error("Invalid operation");
                        throw new Error("Invalid operation");
                }
            });

            await fetchData();
        } catch (error) {
            console.error(idea instanceof Note ? 'Error updating note: ' : 'Error updating project: ', error);
        }
    }, [user, fetchData]);


    useEffect(() => {
        if (user) {
            fetchData();
        } else {
            setNotes([]);
            setProjects([]);
        }
    }, [user, fetchData]);

    const createIdea = useCallback(async (idea: Note | Project) => {
        if (idea.type === "note") {
            setNotes(prevNotes => [idea, ...prevNotes]);
        } else if (idea.type === "project") {
            setProjects(prevProjects => [idea, ...prevProjects]);
        } else {
            throw new Error("Invalid idea type");
        }

        await apiService("create", idea);
    }, [apiService]);

    const updateIdea = useCallback(async (idea: Note | Project) => {
        if (idea.type === "note") {
            setNotes(prevNotes => prevNotes.map(note => note.id === idea.id ? idea : note));
        } else if (idea.type === "project") {
            setProjects(prevProjects => prevProjects.map(project => project.id === idea.id ? idea : project));
        } else {
            throw new Error("Invalid idea type");
        }
        await apiService("update", idea);
    }, [apiService]);

    const deleteIdea = useCallback(async (idea: Note | Project) => {
        if (idea.type === "note") {
            setNotes(prevNotes => prevNotes.filter(note => note.id !== idea.id));
        } else if (idea.type === "project") {
            setProjects(prevProjects => prevProjects.filter(project => project.id !== idea.id));
        } else {
            throw new Error("Invalid idea type");
        }
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