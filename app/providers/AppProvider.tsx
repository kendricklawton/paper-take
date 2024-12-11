'use client'

import React, { createContext, useContext, useCallback, useState, useMemo, ReactNode, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, doc, FirestoreError, getDocs, orderBy, query as firestoreQuery, runTransaction, Timestamp } from "firebase/firestore";
import { Note, Project } from '../models';
import { useAuthContext } from './AuthProvider';

interface AppContextType {
    appError: string;
    filtered: (Note | Project)[];
    ideas: string[];
    info: string;
    isAppLoading: boolean;
    isModalOpen: boolean;
    notes: Note[];
    projects: Project[];
    searchTerm: string;
    clearAppError: () => void;
    createNote: (note: Note) => Promise<void>;
    createProject: (project: Project) => Promise<void>;
    deleteNote: (note: Note) => Promise<void>;
    deleteProject: (project: Project) => Promise<void>;
    updateNote: (note: Note) => Promise<void>;
    updateProject: (project: Project) => Promise<void>;
    fetchData: () => void;
    handleUpdateIdeas: (updatedIdeasIds: string[]) => Promise<void>;
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
    const [ideas, setIdeas] = useState<string[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [filtered, setFiltered] = useState<(Note | Project)[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [info, setInfo] = useState<string>('');
    const [isAppLoading, setIsAppLoading] = useState<boolean>(false);

    const clearAppError = useCallback(() => setAppError(''), []);

    const fetchIdeas = useCallback(async () => {
        if (user === null) {
            console.log("No user is logged in, fetching notes from local storage");
            return;
        }

        if (firestore === null) {
            console.error("Firestore is not initialized for fetching ideas");
            return;
        }
        try {
            const ref = collection(firestore, "users", user.uid, "ideas");
            const queryIdsList = (ref);
            const snapshot = await getDocs(queryIdsList);
            if (snapshot.empty) {
                console.log("No ideas found");
                return;
            }
            setIdeas(snapshot.docs[0].data().ideas);
        } catch (error) {
            if (error instanceof FirestoreError) {
                console.error('Firestore error while fetching notes: ', error.message);
            } else {
                console.error('Error fetching ideas: ', error);
            }
        }
    }, [user]);

    const fetchNotes = useCallback(async () => {
        if (user === null) {
            return;
        }

        if (firestore === null) {
            console.error("Firestore is not initialized for fetching notes");
            return;
        }
        
        try {
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
        if (user === null) {
            console.log("No user is logged in, fetching notes from local storage");
            return;
        }

        if (firestore === null) {
            console.error("Firestore is not initialized for fetching projects");
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

            const firestoreProjects: Project[] = snapshot.docs.map(doc => ({
                ...doc.data(),
            }) as Project);

            setProjects(firestoreProjects);

        } catch (error) {
            if (error instanceof FirestoreError) {
                console.error('Firestore error while fetching projects: ', error.message);
            } else {
                console.error('Error fetching projects: ', error);
            }
        }
    }, [user]);

    const fetchData = useCallback(async () => {
        if (!user) {
            console.log("No user is logged in, fetching data from local storage");
            return;
        }
        if (firestore === null) {
            console.error("Firestore is not initialized");
            return;
        }
        try {
            await fetchNotes();
            await fetchProjects();
            await fetchIdeas();
        } catch (error) {
            console.error('Unexpected error: ', error);
        } finally {
            setIsAppLoading(false);
        }
    }, [fetchIdeas, fetchNotes, fetchProjects, user]);

    const firestoreService = useCallback(async (collectionName: string, operation: string, idea: Note | Project, ideas?: string[]) => {
        if (firestore === null) {
            console.error("Firestore is not initialized");
            return;
        }
        try {
            if (!user) {
                return;
            }

            const ref = collection(firestore, "users", user.uid, collectionName);
            const docRef = doc(ref, idea.id);

            const ideasRef = collection(firestore, "users", user.uid, "ideas");
            const ideasDocRef = doc(ideasRef, 'ideas');

            await runTransaction(firestore, async (transaction) => {
                const snapshot = await transaction.get(docRef);
                let ideasSnapshot;
                if (ideas) {
                    ideasSnapshot = await transaction.get(ideasDocRef);
                }

                if ((operation === "update" || operation === "delete") && !snapshot.exists()) {
                    console.error(`${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)} not found`);
                    throw new Error(`${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)} not found`);
                }

                if (ideas) {
                    if (!ideasSnapshot?.exists()) {
                        transaction.set(ideasDocRef, { ideas });
                        console.log(`ideas created in Firestore`);
                    } else {
                        transaction.update(ideasDocRef, { ideas });
                        console.log(`ideas updated in Firestore`);
                    }
                }

                switch (operation) {
                    case "create":
                        transaction.set(docRef, JSON.parse(idea.toJSON()));
                        console.log(`${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)} created in Firestore`);
                        break;
                    case "update":
                        transaction.update(docRef, JSON.parse(idea.toJSON()));
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
            setIsAppLoading(false);
        }
    }, [user]);

    const firestoreServiceIds = useCallback(async (ideas: string[]) => {
        if (firestore === null) {
            console.error("Firestore is not initialized");
            return;
        }
        try {
            setIsAppLoading(true);
            if (!user) {
                console.log(`No user is logged in, updating ideas in local storage`);
                return;
            }

            const ref = collection(firestore, "users", user.uid, "ideas");
            const docRef = doc(ref, 'ideas');

            console.log(`Attempting to update ideas in Firestore`, ideas);

            await runTransaction(firestore, async (transaction) => {
                const snapshot = await transaction.get(docRef);

                if (!snapshot.exists()) {
                    transaction.set(docRef, { ideas });
                    console.log(`ideas created in Firestore`);
                } else {
                    transaction.update(docRef, { ideas });
                    console.log(`ideas updated in Firestore`);
                }
            
            });

        } catch (error) {
            console.error(`Error updating ideas: `, error);
        } finally {
            setIsAppLoading(false);
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

    const handleUpdateIdeas = useCallback(async (updatedIdeasIds: string[]) => {
        const prevIdeasIds = ideas;
        setIdeas(updatedIdeasIds);
        try {
            console.log('Attempting to update ideas in Firestore - ', updatedIdeasIds);
            await firestoreServiceIds(updatedIdeasIds);
        } catch (error) {
            console.error('Error updating ideas: ', error);
            setAppError('Error updating ideas');
            setIdeas(prevIdeasIds);
        }
    }, [firestoreServiceIds, ideas]);
    
    const createNote = useCallback(async (newNote: Note) => {
        const prevNotes = notes;
        const prevIdeasIds = ideas;
        newNote.createdAt = Timestamp.now();
        const updatedIdeasIds = [newNote.id, ...ideas];
        setNotes([newNote, ...notes]);
        setIdeas([newNote.id, ...ideas]);
        try {
            await firestoreService("notes", "create", newNote, updatedIdeasIds);
        } catch (error) {
            console.error('Error creating note: ', error);
            setAppError('Error creating note');
            setNotes(prevNotes);
            setIdeas(prevIdeasIds);
        }
    }, [notes, ideas, firestoreService]);

    const createProject = useCallback(async (newProject: Project) => {
        const prevProjects = projects;
        const prevIdeasIds = ideas;
        newProject.createdAt = Timestamp.now();
        const updatedIdeasIds = [newProject.id, ...ideas];
        setProjects([newProject, ...projects]);
        setIdeas([newProject.id, ...ideas]);
        try {
            await firestoreService("projects", "create", newProject, updatedIdeasIds);
        } catch (error) {
            console.error('Error creating project: ', error);
            setAppError('Error creating project');
            setProjects(prevProjects);
            setIdeas(prevIdeasIds);
        }
    }, [projects, ideas, firestoreService]);

    const updateNote = useCallback(async (updatedNote: Note) => {
        const prevNotes = notes;
        setNotes(prevNotes => prevNotes.map(note => note.id === updatedNote.id ? updatedNote : note));
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
        setProjects(prevIdeas => prevIdeas.map(idea => idea.id === updatedProject.id ? updatedProject : idea));
        try {
            await firestoreService("projects", "update", updatedProject);
        } catch (error) {
            console.error('Error updating project: ', error);
            setAppError('Error updating project');
            setProjects(prevProjects);
        }
    }, [projects, firestoreService]);

    const deleteNote = useCallback(async (deleteNote: Note) => {
        const prevNotes = notes;
        const prevIdeasIds = ideas;
        const updatedIdeasIds = ideas.filter(id => id !== deleteNote.id);
        setNotes(notes.filter(note => note.id !== deleteNote.id));
        setIdeas(ideas.filter(id => id !== deleteNote.id));
        try {
            await firestoreService("notes", "delete", deleteNote, updatedIdeasIds);
        } catch (error) {
            console.error('Error deleting note: ', error);
            setAppError('Error deleting note');
            setNotes(prevNotes);
            setIdeas(prevIdeasIds);
        }
    }, [notes, ideas, firestoreService]);

    const deleteProject = useCallback(async (deleteProject: Project) => {
        const prevProjects = projects;
        const prevIdeasIds = ideas;
        const updatedIdeasIds = ideas.filter(id => id !== deleteProject.id);
        setProjects(projects.filter(p => p.id !== deleteProject.id));
        setIdeas(ideas.filter(id => id !== deleteProject.id));
        try {
            await firestoreService("projects", "delete", deleteProject, updatedIdeasIds);
        } catch (error) {
            console.error('Error deleting project: ', error);
            setAppError('Error deleting project');
            setProjects(prevProjects);
            setIdeas(prevIdeasIds);
        }
    }, [projects, ideas, firestoreService]);

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
        appError, filtered, ideas, info, isAppLoading, notes, projects, searchTerm,isModalOpen,
        clearAppError, fetchData, handleUpdateIdeas, handleSearch, handleCloseSearch, setIsModalOpen, setInfo, setNotes, setProjects, updateNote, updateProject, createNote, createProject, deleteNote, deleteProject
    }), [
        appError, filtered, ideas, info, isAppLoading, notes, projects, searchTerm, isModalOpen,
        clearAppError, fetchData, handleUpdateIdeas, handleSearch, handleCloseSearch, updateNote, updateProject, createNote, createProject, deleteNote, deleteProject
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