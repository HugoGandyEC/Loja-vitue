import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'lg' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    '2xl': 'max-w-7xl',
    'full': 'max-w-full m-4',
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Panel */}
        <div className={`relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 w-full ${sizeClasses[size]}`}>
          
          {/* Header */}
          <div className="bg-white px-4 py-4 sm:px-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
            <h3 className="text-lg font-bold leading-6 text-gray-900" id="modal-title">
              {title}
            </h3>
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Fechar</span>
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="bg-gray-50 px-4 py-6 sm:px-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Modal;