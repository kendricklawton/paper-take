'use client'

import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
    useEffect,
    ReactNode,
} from 'react';

import {
    collection,
    doc,
    getDocs,
    query,
    runTransaction,
    Transaction
} from "firebase/firestore";
import { firestore } from '../firebase';
import { Note, Project } from '../models';
import { useAuthContext } from './AuthProvider';

interface AppContextType {
    filteredNotes: Note[];
    info: string[];
    isLoadingApp: boolean;
    isLoginModalOpen: boolean;
    notes: Note[];
    projects: Project[];
    searchTerm: string;
    currentList: 'notes' | 'projects';
    createNote: (newNote: Note) => Promise<void>;
    deleteNote: (noteId: string) => Promise<void>;
    fetchData: () => Promise<void>;
    handleCloseSearch: () => void;
    handleSearch: (term: string) => void;
    setInfo: React.Dispatch<React.SetStateAction<string[]>>;
    setIsLoadingApp: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentList: React.Dispatch<React.SetStateAction<'notes' | 'projects'>>;
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
    updateNote: (updatedNote: Note) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const { user } = useAuthContext();
    const [currentList, setCurrentList] = useState<'notes' | 'projects'>('projects');
    const [notes, setNotes] = useState<Note[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
    const [filteredItems, setFilteredItems] = useState<(Note | Project)[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [info, setInfo] = useState<string[]>([]);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    const [isLoadingApp, setIsLoadingApp] = useState<boolean>(false);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingApp(true);
            if (user) {
                const notesRef = collection(firestore, "users", user.uid, "notes");
                const qNotes = query(notesRef);
                const querySnapshot = await getDocs(qNotes);

                const notesArray: Note[] = querySnapshot.docs.map(doc => ({
                    id: doc.data().id,
                    ...doc.data(),
                })) as Note[];
                setNotes(notesArray);
                console.log("Notes fetched successfully");

                const projectsRef = collection(firestore, "users", user.uid, "projects");
                const qProjects = query(projectsRef);
                const projectsSnapshot = await getDocs(qProjects);

                const projectsArray: Project[] = projectsSnapshot.docs.map(doc => ({
                    id: doc.data().id,
                    ...doc.data(),
                }) as Project);
                setProjects(projectsArray);
                console.log("Projects fetched successfully");
            } else {
                console.log("No user is logged in, fetching notes from local storage");
            }
        } catch (error) {
            console.log('Error fetching notes:', error);
            setNotes([]);
        } finally {
            setIsLoadingApp(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchData();
        } else {
            setNotes([]);
        }
    }, [user, fetchData]);

    const createNote = useCallback(async (newNote: Note) => {
        console.log('New Note - ', newNote);
        setNotes(prevNotes => [...prevNotes, newNote]);
        try {
            if (user) {
                const notesRef = collection(firestore, "users", user.uid, "notes");
                const docRef = doc(notesRef, newNote.id);

                await runTransaction(firestore, async (transaction: Transaction) => {
                    const docSnapshot = await transaction.get(docRef);
                    if (docSnapshot.exists()) {
                        throw new Error("Note ID collision detected");
                    } else {
                        transaction.set(docRef, newNote);
                        console.log("Note created in Firestore");
                    }
                });
                await fetchData();
            }
        } catch (error) {
            console.error('Error creating note: ', error);
            setNotes(prevNotes => prevNotes.filter(note => note.id !== newNote.id));
        }
    }, [user, fetchData]);

    const createProject = useCallback(async (newProject: Project) => {
        console.log('New Project - ', newProject);
        setProjects(prevProjects => [...prevProjects, newProject]);
        try {
            if (user) {
                const notesRef = collection(firestore, "users", user.uid, "projects");
                const docRef = doc(notesRef, newProject.id);

                await runTransaction(firestore, async (transaction: Transaction) => {
                    const docSnapshot = await transaction.get(docRef);
                    if (docSnapshot.exists()) {
                        throw new Error("Project ID collision detected");
                    } else {
                        transaction.set(docRef, newProject);
                        console.log("Project created in Firestore");
                    }
                });
                await fetchData();
            }
        } catch (error) {
            console.error('Error creating project: ', error);
            setProjects(prevProjects => prevProjects.filter(project => project.id !== newProject.id));
        }
    }, [user, fetchData]);




    const updateNote = useCallback(async (updatedNote: Note) => {
        const { id, ...noteData } = updatedNote;

        const originalNote = notes.find(note => note.id === id);

        console.log('originalNote', originalNote);

        setNotes(prevNotes =>
            prevNotes.map(note =>
                note.id === id ? { ...originalNote, ...noteData } as Note : note
            )
        );

        try {
            if (user) {
                const notesRef = collection(firestore, "users", user.uid, "notes");
                const docRef = doc(notesRef, id);

                await runTransaction(firestore, async (transaction: Transaction) => {
                    const docSnapshot = await transaction.get(docRef);
                    if (!docSnapshot.exists()) {
                        throw new Error("Note does not exist");
                    } else {
                        transaction.update(docRef, noteData);
                        console.log("Note updated in Firestore");
                    }
                });
                await fetchData();
            } 
        } catch (error) {
            console.error('Error updating note: ', error);
            setInfo(['Error updating note']);
            setNotes(prevNotes =>
                prevNotes.map(note =>
                    note.id === id ? originalNote as Note : note
                )
            );
        }
    }, [user, fetchData, notes]);

    const deleteNote = useCallback(async (noteId: string) => {
        const noteToDelete = notes.find(note => note.id === noteId);
        setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
        console.log('noteToDelete - ', noteToDelete);
        try {
            if (user) {
                const notesRef = collection(firestore, "users", user.uid, "notes");
                const docRef = doc(notesRef, noteId);

                await runTransaction(firestore, async (transaction) => {
                    const docSnapshot = await transaction.get(docRef);
                    if (!docSnapshot.exists()) {
                        throw new Error("Note does not exist");
                    } else {
                        transaction.delete(docRef);
                        console.log("Note deleted in Firestore");
                    }
                });

                await fetchData();
            }
        } catch (error) {
            console.error('Error deleting note: ', error);
            setNotes(prevNotes => [...prevNotes, noteToDelete!]);
        }
    }, [notes, user, fetchData]);

    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
        if (term.trim() === '') {
            setFilteredItems([]);
        } else {
            const lowercasedTerm = term.toLowerCase();
            setFilteredItems(
                [...notes, ...projects].filter(item =>
                    item.title.toLowerCase().includes(lowercasedTerm)
                )
            );

        }
    }, [notes, projects]);

    const handleCloseSearch = useCallback(() => {
        setSearchTerm('');
        setFilteredNotes([]);
    }, []);

    const contextValue = useMemo(() => ({
        currentList,
        info,
        isLoadingApp,
        isLoginModalOpen,
        notes,
        projects,
        filteredItems,
        filteredNotes,
        searchTerm,
        createProject,
        createNote,
        fetchData,
        updateNote,
        deleteNote,
        handleSearch,
        handleCloseSearch,
        setCurrentList,
        setIsLoadingApp,
        setIsLoginModalOpen,
        setInfo,
        setNotes,
        setProjects,
    }), [
        currentList,
        info,
        isLoadingApp,
        isLoginModalOpen,
        notes,
        projects,
        filteredItems,
        filteredNotes,
        searchTerm,
        createProject,
        createNote,
        fetchData,
        updateNote,
        deleteNote,
        handleSearch,
        handleCloseSearch,
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
