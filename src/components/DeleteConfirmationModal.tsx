import React from 'react';

type DeleteConfirmationModalProps = {
  noteTitle: string;
  onDeleteConfirm: () => void;
  onCancel: () => void;
};

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ noteTitle, onDeleteConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-20">
      <div className="bg-white p-5 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this note?</h2>
        <p className="break-words max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl">{noteTitle}</p>

        <div className="flex justify-end mt-4">
          <button onClick={onDeleteConfirm} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mr-2">
            Yes
          </button>
          <button onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded">
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
