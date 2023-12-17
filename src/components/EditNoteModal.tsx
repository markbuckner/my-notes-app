"use client";

import React, { useState } from 'react';

interface Props {
  note: { id: number; title: string; content: string };
  onSave: (id: number, title: string, content: string) => void;
  onCancel: () => void;
}

const EditNoteModal: React.FC<Props> = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const handleSave = () => {
    onSave(note.id, title, content);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-10">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg text-center font-semibold">Edit Note</h3>
        <input
          type="text"
          className="w-full p-2 my-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-2 my-2 border rounded h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <div className="flex justify-around">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditNoteModal;
