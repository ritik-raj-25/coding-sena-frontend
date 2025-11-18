import React from 'react';
import { FaTimes } from 'react-icons/fa';
import Button from './fields/Button';

function TestModel({ isOpen, onClose, onConfirm, title, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <Button 
            onClick={onClose} 
            className="hover:text-gray-600"
            bgColor='bg-white'
            textColor='text-gray-400'
          >
            <FaTimes className="cursor-pointer"/>
          </Button>
        </div>

        <div className="mb-6 text-gray-700">
          {children}
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            onClick={onClose}
            bgColor='bg-gray-200'
            textColor='text-gray-800'
            className="rounded-md hover:bg-gray-300 font-medium cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            bgColor='bg-indigo-600'
            textColor='text-white'
            className="rounded-md hover:bg-indigo-700 font-medium cursor-pointer"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TestModel;