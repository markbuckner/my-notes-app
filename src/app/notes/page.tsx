"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '../../components/Navbar';
import { useAuth } from '@/src/components/AuthContext';
import EditNoteModal from '../../components/EditNoteModal';
import Spinner from '@/src/components/Spinner';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { useNotes } from '@/src/components/NotesContext';

interface Note {
  id: number;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const Notes: React.FC = () => {
  const {
    notes,
    setNotes,
    fetchNotes,
    isLoading,
  } = useNotes();
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [showNewNote, setShowNewNote] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [highlight, setHighlight] = useState(false);
  const router = useRouter();
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteContent(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  );

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const scrollToTopAndHighlight = () => {
    scrollToTop();
    setHighlight(true);
    setTimeout(() => setHighlight(false), 500);
  };

  const handleNewNoteClick = () => {
    setShowNewNote(true);
    setNoteTitle('');
    setNoteContent('');
    scrollToTopAndHighlight();
  };

  const handleSaveNote = async () => {
    setShowNewNote(false);
    if (notes.length >= 50) {
      alert("You have reached the limit of 50 notes. This is a demo app with limited resources.");
      return;
    }

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

    const newNote: Omit<Note, 'id'> = {
      user_id: user.id,
      title: noteTitle || "Untitled Note",
      content: noteContent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Optimistically update the UI
    const tempId = Date.now();
    setNotes(prevNotes => [{ ...newNote, id: tempId }, ...prevNotes]);

    // Sync with backend
    const { data, error } = await supabase
      .from('notes')
      .insert([newNote])
      .select(); // Ensure data is returned

    if (error) {
      console.error('Error saving note:', error);
      // Rollback optimistic update if there's an error
      setNotes(prevNotes => prevNotes.filter(note => note.id !== tempId));
      return;
    }

    if (data && data.length > 0) {
      const savedNote = data[0];
      // Update the temp note with the real id from the database
      setNotes(prevNotes =>
        prevNotes.map(note => (note.id === tempId ? { ...savedNote } : note))
      );
    }

    setNoteTitle('');
    setNoteContent('');

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
    }

    if (window.innerWidth <= 768) {
      scrollToTop();
    }
  };

  const handleEditNote = async (id: number, title: string, content: string) => {
    const updatedNote = {
      title,
      content,
      updated_at: new Date().toISOString()
    };

    // Optimistically update the UI
    setNotes(prevNotes =>
      prevNotes.map(note => (note.id === id ? { ...note, ...updatedNote } : note))
    );

    setIsEditing(false); // Close the modal immediately

    const { error } = await supabase
      .from('notes')
      .update(updatedNote)
      .match({ id });

    if (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteClick = (note: Note) => {
    setNoteToDelete(note);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    if (noteToDelete) {
      // Optimistically update the UI
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteToDelete.id));

      setShowDeleteConfirmation(false); // Close the modal immediately

      const { error } = await supabase
        .from('notes')
        .delete()
        .match({ id: noteToDelete.id });

      if (error) {
        console.error('Error deleting note:', error);
      } else {
        setNoteToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setNoteToDelete(null);
  };

  if (!isLoggedIn && !isAuthLoading) {
    return (
      <>
        <Navbar onCreateNote={scrollToTopAndHighlight} />
        <div className="flex flex-col items-center justify-normal bg-gray-100" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div id="spacer" className="p-8"></div>
          <div className="bg-white p-8 border rounded-lg shadow-lg text-center max-w-lg w-[97%]">
            <h2 className="text-lg font-bold text-center text-gray-700 mb-3">Please sign up or login to manage your notes</h2>
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

  return (
    <>
      <Navbar onCreateNote={handleNewNoteClick} isNotesPage={true} />
      <div className="flex flex-col items-center justify-normal bg-gray-100" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="w-full max-w-4xl mx-auto px-2 relative">
          <div id="spacer" className="p-2"></div>
          {showNewNote && (
            <div id="create-note" className={`bg-white p-8 border rounded-lg shadow-lg mt-4 mb-8 ${highlight ? 'highlight-animation' : ''}`}>
              <input
                type="text"
                placeholder="Note Title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full p-2 border rounded-md mb-4"
                maxLength={100}
              />
              <textarea
                ref={textareaRef}
                className="w-full p-4 border rounded-md overflow-hidden resize-none"
                placeholder="Write your note here..."
                value={noteContent}
                onChange={handleTextareaChange}
                maxLength={4000}
              ></textarea>
              <button
                onClick={handleSaveNote}
                className="w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 mt-4"
              >
                Save Note
              </button>
            </div>
          )}

          <div className={`${isLoading ? 'opacity-50' : ''}`}>
            {notes.map(note => (
              <div key={note.id} className="note-item bg-white p-4 border rounded-lg shadow-lg mb-3 relative">
                <div className="flex justify-between mb-2">
                  <h3 className="font-bold break-words text-lg overflow-hidden max-w-[calc(100%-6rem)]">{note.title}</h3>
                  <div className="absolute top-2 right-2 flex">
                    <button
                      onClick={() => { setCurrentNote(note); setIsEditing(true); }}
                      className="bg-yellow-100 hover:bg-yellow-300 text-black font-bold py-1 px-3 rounded text-md mr-0.5"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteClick(note)}
                      className="bg-red-300 hover:bg-red-400 text-black font-bold py-1 px-3 rounded text-md"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p className="whitespace-pre-wrap break-words mb-1.5">{note.content}</p>
                <span className="text-xxs text-gray-400 border-t pt-1 border-dashed">
                  Created at: {new Date(note.created_at).toLocaleString()}
                </span>

                {note.updated_at !== note.created_at && (
                  <p className="text-xxs text-gray-400">Updated at: {new Date(note.updated_at).toLocaleString()}</p>
                )}
              </div>
            ))}
          </div>

          {!isLoading && notes.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No notes found. Create your first note!</p>
          )}

          {isLoading && (
            <div className="sticky bottom-0 w-full flex justify-center pb-5">
              <Spinner />
            </div>
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
      {showDeleteConfirmation && noteToDelete && (
        <DeleteConfirmationModal
          noteTitle={noteToDelete.title}
          onDeleteConfirm={handleDeleteConfirm}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default Notes;
