"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from './AuthContext';

export interface Note {
    id: number;
    user_id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
}

interface NotesContextType {
    notes: Note[];
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
    fetchNotes: () => void;
    isLoading: boolean;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isLoggedIn } = useAuth();

    const fetchNotes = useCallback(async () => {
        setIsLoading(true);
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
            const { data, error } = await supabase
                .from('notes')
                .select('*')
                .eq('user_id', sessionData.session.user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching notes:', error);
            } else {
                setNotes(data || []);
            }
        }
        setIsLoading(false);
    }, [supabase]);

    // Fetch or clear notes on authentication state change
    useEffect(() => {
        if (isLoggedIn) {
            fetchNotes();
        } else {
            setNotes([]); // Clear notes when logged out
        }
    }, [isLoggedIn, fetchNotes]);

    return (
        <NotesContext.Provider value={{ notes, setNotes, fetchNotes, isLoading }}>
            {children}
        </NotesContext.Provider>
    );
};

export const useNotes = () => {
    const context = useContext(NotesContext);
    if (!context) {
        throw new Error('useNotes must be used within a NotesProvider');
    }
    return context;
};
