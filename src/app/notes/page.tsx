"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '../../components/Navbar';
import { useAuth } from '@/src/components/AuthContext';
import EditNoteModal from '../../components/EditNoteModal';
import Spinner from '@/src/components/Spinner';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

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
  const [isLoading, setIsLoading] = useState(true);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [highlight, setHighlight] = useState(false);
  const router = useRouter();
  const { isLoggedIn } = useAuth(); // Use the useAuth hook

  // Ref for the textarea with type specified
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Function to handle textarea change and auto-resize
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

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const scrollToTopAndHighlight = () => {
    scrollToTop();
    setHighlight(true);
    setTimeout(() => setHighlight(false), 500); // Reset highlight after the animation duration
  };

  const handleNewNoteClick = () => {
    setNoteTitle('');
    setNoteContent('');
    scrollToTopAndHighlight();
  };

  const fetchNotes = async () => {
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
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSaveNote = async () => {

    if (notes.length >= 25) {
      alert("You have reached the limit of 25 notes. This is a demo app with limited resources.");
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
    // Reset textarea size
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // This line resets the height
    }
    fetchNotes();
    // Check if the window width is less than or equal to 768 pixels (a common mobile breakpoint)
    if (window.innerWidth <= 768) {
      scrollToTop();
    }
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
      //scrollToTop();
    }
  };

  const handleDeleteClick = (note: Note) => {
    setNoteToDelete(note);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    if (noteToDelete) {
      const { error } = await supabase
        .from('notes')
        .delete()
        .match({ id: noteToDelete.id });

      if (error) {
        console.error('Error deleting note:', error);
      } else {
        fetchNotes();
        setShowDeleteConfirmation(false);
        setNoteToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setNoteToDelete(null);
  };

  // Check if the user is logged in
  if (!isLoggedIn) {
    return (
      <>
        <Navbar onCreateNote={scrollToTopAndHighlight} />
        <div className="flex flex-col items-center justify-normal min-h-screen bg-gray-100">
          <div id="spacer" className="p-8"></div>
          <div className="bg-white p-8 border rounded-lg shadow-lg text-center">
            <p>Sign Up or Login to manage your notes 📝</p>
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
      <div className="flex flex-col items-center justify-normal min-h-screen bg-gray-100">
        <div className="w-full max-w-4xl mx-auto px-2 relative">
          <div id="spacer" className="p-2"></div>
          <div id="create-note" className={`bg-white p-8 border rounded-lg shadow-lg mt-4 mb-8 ${highlight ? 'highlight-animation' : ''}`}>
            <input
              type="text"
              placeholder="Note Title"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
              maxLength={120}
            />
            <textarea
              ref={textareaRef}
              className="w-full p-4 border rounded-md overflow-hidden resize-none"
              placeholder="Write your note here..."
              value={noteContent}
              onChange={handleTextareaChange}
              maxLength={5000}
            ></textarea>
            <button
              onClick={handleSaveNote}
              className="w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 mt-4"
            >
              Save Note
            </button>
          </div>

          {/* Notes List */}
          <div className={`${isLoading ? 'opacity-50' : ''}`}>
            {notes.map(note => (
              <div key={note.id} className="note-item bg-white p-4 border rounded-lg shadow-lg mb-3 relative">
                <div className="flex justify-between mb-2">
                  <h3 className="font-bold break-words overflow-hidden max-w-[calc(100%-6rem)]">{note.title}</h3>
                  <div className="absolute top-2 right-2 flex">
                    <button
                      onClick={() => { setCurrentNote(note); setIsEditing(true); }}
                      className="bg-yellow-100 hover:bg-yellow-300 text-black font-bold py-1 px-3 rounded text-xs mr-0.5"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteClick(note)}
                      className="bg-red-300 hover:bg-red-400 text-black font-bold py-1 px-3 rounded text-xs"
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

          {/* Spinner Overlay */}
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