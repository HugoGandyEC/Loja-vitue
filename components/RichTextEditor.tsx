import React, { useEffect, useRef } from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Heading1, Heading2, Undo, Redo 
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize content once
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, []); // Run once on mount

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const ToolbarButton = ({ icon: Icon, cmd, arg, title }: any) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        execCmd(cmd, arg);
      }}
      className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
      title={title}
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 flex-wrap">
        <div className="flex items-center gap-0.5 border-r border-gray-300 pr-2 mr-1">
            <ToolbarButton icon={Undo} cmd="undo" title="Desfazer" />
            <ToolbarButton icon={Redo} cmd="redo" title="Refazer" />
        </div>
        
        <div className="flex items-center gap-0.5 border-r border-gray-300 pr-2 mr-1">
            <ToolbarButton icon={Heading1} cmd="formatBlock" arg="H1" title="Título 1" />
            <ToolbarButton icon={Heading2} cmd="formatBlock" arg="H2" title="Título 2" />
        </div>

        <div className="flex items-center gap-0.5 border-r border-gray-300 pr-2 mr-1">
            <ToolbarButton icon={Bold} cmd="bold" title="Negrito" />
            <ToolbarButton icon={Italic} cmd="italic" title="Itálico" />
            <ToolbarButton icon={Underline} cmd="underline" title="Sublinhado" />
        </div>

        <div className="flex items-center gap-0.5 border-r border-gray-300 pr-2 mr-1">
            <ToolbarButton icon={AlignLeft} cmd="justifyLeft" title="Alinhar Esquerda" />
            <ToolbarButton icon={AlignCenter} cmd="justifyCenter" title="Centralizar" />
            <ToolbarButton icon={AlignRight} cmd="justifyRight" title="Alinhar Direita" />
        </div>

        <div className="flex items-center gap-0.5">
            <ToolbarButton icon={List} cmd="insertUnorderedList" title="Lista" />
            <ToolbarButton icon={ListOrdered} cmd="insertOrderedList" title="Lista Numerada" />
        </div>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="flex-1 p-8 overflow-y-auto outline-none prose max-w-none text-gray-800"
        style={{ minHeight: '400px' }}
      >
      </div>
    </div>
  );
};

export default RichTextEditor;