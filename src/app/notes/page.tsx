"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '../../components/Navbar';
import withAuth from '@/src/components/WithAuth';
import EditNoteModal from '../../components/EditNoteModal';
import Spinner from '@/src/components/Spinner';

interface Note {
  id: number;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const Notes: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [highlight, setHighlight] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  );

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const scrollToTopAndHighlight = () => {
    window.scrollTo(0, 0);
    setHighlight(true);
    setTimeout(() => setHighlight(false), 500); // Reset highlight after the animation duration
  };

  // Check if the user is logged in
  if (!isLoggedIn) {
    return (
      <>
        <Navbar isLoggedIn={isLoggedIn} onCreateNote={scrollToTopAndHighlight} />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 border rounded-lg shadow-lg text-center">
            <p>Sign up or Login to manage your notes 📝</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => router.push('/signup')}
                className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 mr-2"
              >
                Sign Up
              </button>
              <button
                onClick={() => router.push('/login')}
                className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600 ml-2"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const fetchNotes = async () => {
    setIsLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session?.user) {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', sessionData.session.user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching notes:', error);
      } else {
        setNotes(data || []);
      }
    }
    setIsLoading(false);
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
    scrollToTop();
  };

  const handleEditNote = async (id: number, title: string, content: string) => {
    const { error } = await supabase
      .from('notes')
      .update({ title, content, updated_at: new Date().toISOString() })
      .match({ id });

    if (error) {
      console.error('Error updating note:', error);
    } else {
      fetchNotes();
      setIsEditing(false);
      scrollToTop();
    }
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
    fetchNotes();
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} onCreateNote={scrollToTopAndHighlight} isNotesPage={true} />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        {/* New Note Creation Box */}
        <div id="create-note" className={`bg-white p-8 border rounded-lg shadow-lg w-full max-w-md ${highlight ? 'highlight-animation' : ''}`}>
          <input
            type="text"
            placeholder="Note Title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
            maxLength={100}
          />
          <textarea
            className="w-full p-4 border rounded-md"
            placeholder="Write your note here..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            maxLength={5000}
          ></textarea>
          <button
            onClick={handleSaveNote}
            className="w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 mt-4"
          >
            Save Note
          </button>
        </div>

        {/* Notes Container with Minimum Height */}
        <div className="w-full max-w-md mt-4 min-h-[300px]">
          {isLoading ? (
            <Spinner />
          ) : notes.length === 0 ? (
            <p className="text-center text-gray-500">No notes found. Create your first note!</p>
          ) : (
            notes.map(note => (
              <div key={note.id} className="bg-white p-4 border-b relative">
                <h3 className="font-bold">{note.title}</h3>
                <p className="whitespace-pre-wrap break-words">{note.content}</p>
                <p className="text-xxs text-gray-400">Created at: {new Date(note.created_at).toLocaleString()}</p>
                {note.updated_at !== note.created_at && (
                  <p className="text-xxs text-gray-400">Updated at: {new Date(note.updated_at).toLocaleString()}</p>
                )}
                <button
                  onClick={() => { setCurrentNote(note); setIsEditing(true); }}
                  className="absolute top-3 right-14 bg-yellow-100 hover:bg-yellow-300 text-white font-bold py-1 px-3 rounded text-xs"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="absolute top-3 right-3.5 bg-red-300 hover:bg-red-400 text-white font-bold py-1 px-3 rounded text-xs"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {isEditing && currentNote && (
        <EditNoteModal
          note={currentNote}
          onSave={handleEditNote}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </>
  );
};

export default withAuth(Notes);
