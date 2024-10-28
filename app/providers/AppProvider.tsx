'use client'

import React, { createContext, useContext, useCallback, useState, useMemo, ReactNode, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, doc, FirestoreError, getDocs, orderBy, query as firestoreQuery, runTransaction, Timestamp } from "firebase/firestore";
import { Note, Project } from '../models';
import { useAuthContext } from './AuthProvider';

interface AppContextType {
    appError: string;
    filtered: (Note | Project)[];
    ideasIds: string[];
    info: string;
    isLoadingApp: boolean;
    isModalOpen: boolean;
    notes: Note[];
    projects: Project[];
    searchTerm: string;
    searchIsFocused: boolean;
    addOfflineIdeasToFirebase: (
        offlineIdeas: (Note | Project)[],
        offlineIdeasId: string[]
    ) => Promise<void>;
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
    setIdeas: React.Dispatch<React.SetStateAction<(Note | Project)[]>>;
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

    const [ideasIds, setIdeasIds] = useState<string[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [ideas, setIdeas] = useState<(Note | Project)[]>([
        ...notes,
        ...projects
    ]);
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

    const firestoreService = useCallback(async (collectionName: string, operation: string, idea: Note | Project, ideas: string[] | undefined) => {
        try {
            setIsLoadingApp(true);
            if (!user) {
                console.log(`No user is logged in, updating ${collectionName} list in local storage`);
                return;
            }

            if (ideas) {
                const ref = collection(firestore, "users", user.uid, "ideas");
                const docRef = doc(ref, "ideas");

                await runTransaction(firestore, async (transaction) => {
                    const snapshot = await transaction.get(docRef);

                    if (!snapshot.exists()) {
                        console.error(`Ideas not found`);
                        throw new Error(`Ideas not found`);
                    }

                    switch (operation) {
                        case "create":
                            transaction.update(docRef, { ideas: ideas });
                            console.log(`Ideas updated in Firestore`);
                            break;
                        case "delete":
                            transaction.update(docRef, { ideas: ideas });
                            console.log(`Ideas updated in Firestore`);
                            break;
                        default:
                            console.error("Invalid operation");
                            throw new Error("Invalid operation");
                    }
                });
            }

            const ref = collection(firestore, "users", user.uid, collectionName);
            const docRef = doc(ref, idea.id);

            console.log(`Attempting to ${operation} ${collectionName} in Firestore`);
            console.log(idea);

            await runTransaction(firestore, async (transaction) => {
                const snapshot = await transaction.get(docRef);

                if ((operation === "update" || operation === "delete") && !snapshot.exists()) {
                    console.error(`${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)} not found`);
                    throw new Error(`${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)} not found`);
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
            setIsLoadingApp(false);
        }
    }, [user]);

    const addOfflineIdeasToFirebase = useCallback(async (offlineIdeas: (Note | Project)[], offlineIdeasIds: string[]) => {
        if (!user) {
            console.log("No user is logged in, adding offline notes to Firestore");
            return;
        }
        console.log("Adding offline notes to Firestore");
        console.log(offlineIdeas);
        console.log(offlineIdeasIds);


        console.log("Adding offline notes to Firestore");
        // offlineNotes.forEach(async (idea) => {
        //     try {
        //         if(idea.type === "note") {
        //             await firestoreService("notes", "create", idea, offlineIdeas);
        //         } else if(idea.type === "project") {
        //             await firestoreService("projects", "create", idea, offlineIdeas);
        //         } else {
        //             console.error("Invalid idea type");
        //         }

        //     } catch(error) {
        //         console.error('Error creating note: ', error);
        //     }

        // });
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
        // setIdeas(prevIdeas => [newNote, ...prevIdeas]);
        // setIdeasIds(prevIdeasIds => [newNote.id, ...prevIdeasIds]);

        try {
            await firestoreService("notes", "create", newNote, undefined);
        } catch (error) {
            console.error('Error creating note: ', error);
            setAppError('Error creating note');
            setNotes(prevNotes);
            // setIdeas(prevIdeas);
            // setIdeasIds(prevIdeasIds);
        }
    }, [notes, firestoreService]);

    const createProject = useCallback(async (newProject: Project) => {
        const prevProjects = projects;
        setProjects([newProject, ...projects]);
        try {
            await firestoreService("projects", "create", newProject, undefined);
        } catch (error) {
            console.error('Error creating project: ', error);
            setAppError('Error creating project');
            setProjects(prevProjects);

        }
    }, [projects, firestoreService]);

    const updateNote = useCallback(async (updatedNote: Note) => {
        const prevNotes = notes;
        setNotes(prevNotes => prevNotes.map(note => note.id === updatedNote.id ? updatedNote : note));
        try {
            await firestoreService("notes", "update", updatedNote, undefined);
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
            await firestoreService("projects", "update", updatedProject, undefined);
        } catch (error) {
            console.error('Error updating project: ', error);
            setAppError('Error updating project');
            setProjects(prevProjects);
        }
    }, [projects, firestoreService]);

    const deleteNote = useCallback(async (deleteNote: Note) => {
        const prevNotes = notes;
        setNotes(notes.filter(note => note.id !== deleteNote.id));
        console.log("Deleted Note ", deleteNote);
        try {
            await firestoreService("notes", "delete", deleteNote, undefined);
        } catch (error) {
            console.error('Error deleting note: ', error);
            setAppError('Error deleting note');
            setNotes(prevNotes);

        }
    }, [notes, firestoreService]);

    const deleteProject = useCallback(async (deleteProject: Project) => {
        const prevProjects = projects;
        setProjects(projects.filter(p => p.id !== deleteProject.id));


        try {
            await firestoreService("projects", "delete", deleteProject, undefined);
        } catch (error) {
            console.error('Error deleting project: ', error);
            setAppError('Error deleting project');
            setProjects(prevProjects);
        }
    }, [projects, firestoreService]);

    const handleUpdateIdeas = useCallback(async (updatedIdeasIds: string[]) => {
        setIdeasIds(updatedIdeasIds);
    }, []);

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
        appError, filtered, ideas, ideasIds, info, isLoadingApp, notes, projects, searchTerm, searchIsFocused, isModalOpen,
        addOfflineIdeasToFirebase, clearAppError, fetchData, handleUpdateIdeas, handleSearch, handleCloseSearch, setIsModalOpen, setIdeas, setInfo, setNotes, setProjects, setSearchIsFocused, updateNote, updateProject, createNote, createProject, deleteNote, deleteProject
    }), [
        appError, filtered, ideas, ideasIds, info, isLoadingApp, notes, projects, searchTerm, searchIsFocused, isModalOpen,
        addOfflineIdeasToFirebase, clearAppError, fetchData, handleUpdateIdeas, handleSearch, handleCloseSearch, updateNote, updateProject, createNote, createProject, deleteNote, deleteProject
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