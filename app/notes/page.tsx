"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '../../components/Navbar';

interface Note {
  id: number;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  );

  const fetchNotes = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session?.user) {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', sessionData.session.user.id);

      if (error) {
        console.error('Error fetching notes:', error);
      } else {
        setNotes(data || []);
      }
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSaveNote = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
      console.error('Error retrieving session:', sessionError);
      return;
    }

    const user = sessionData.session.user;
    if (!user) {
      console.error('No user logged in');
      return;
    }

    const { error } = await supabase
      .from('notes')
      .insert([
        {
          user_id: user.id,
          title: noteTitle || "Untitled Note",
          content: noteContent,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Error saving note:', error);
      return;
    }
    setNoteTitle('');
    setNoteContent('');
    fetchNotes();
  };

  const handleDeleteNote = async (noteId: number) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .match({ id: noteId });

    if (error) {
      console.error('Error deleting note:', error);
      return;
    }
    fetchNotes(); // Refresh the notes list
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 border rounded-lg shadow-lg w-full max-w-md">
          <input
            type="text"
            placeholder="Note Title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
          />
          <textarea
            className="w-full p-4 border rounded-md"
            placeholder="Write your note here..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
          ></textarea>
          <button
            onClick={handleSaveNote}
            className="w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 mt-4"
          >
            Save Note
          </button>
        </div>
        <div className="w-full max-w-md mt-4">
          {notes.map(note => (
            <div key={note.id} className="bg-white p-4 border-b relative">
              <h3 className="font-bold">{note.title}</h3>
              <p>{note.content}</p>
              <p className="text-sm text-gray-500">Created at: {new Date(note.created_at).toLocaleString()}</p>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Notes;

