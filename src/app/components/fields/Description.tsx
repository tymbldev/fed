import React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import History from '@tiptap/extension-history';
import ListItem from '@tiptap/extension-list-item';
import Placeholder from "@tiptap/extension-placeholder";
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
// import LoadingSpinner from '../ui/LoadingSpinner';

interface DescriptionProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | string) => void;
  onBlur: (field: string) => void;
  required?: boolean;
  label?: string;
}

export default function Description({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required = false,
  label = "Description"
}: DescriptionProps) {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      History,
      ListItem,
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc ml-4'
        }
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal ml-4'
        }
      }),
      Bold,
      Italic,
      Underline,
      Placeholder.configure({
        placeholder: 'Share your roles, responsibilities etc...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: formData.description || '',
    onUpdate: ({ editor }) => {
      onInputChange(editor.getHTML());
    },
    onBlur: () => {
      onBlur('description');
    },
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[168px]'
      }
    }
  });

  if (!editor) {
    return null;
  }

  return (
    <div>
      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={`mt-1 border rounded-md ${
        errors.description && touched.description
          ? 'border-red-300'
          : 'border-gray-300'
      }`}>
        <div className="border-b border-gray-200 p-2 flex gap-4">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1 ${editor.isActive('bold') ? 'text-blue-600' : 'text-gray-600'}`}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1 ${editor.isActive('italic') ? 'text-blue-600' : 'text-gray-600'}`}
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1 ${editor.isActive('underline') ? 'text-blue-600' : 'text-gray-600'}`}
            title="Underline"
          >
            <span className="underline">U</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1 ${editor.isActive('bulletList') ? 'text-blue-600' : 'text-gray-600'}`}
            title="Bullet List"
          >
            <span className="text-xl">•</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1 ${editor.isActive('orderedList') ? 'text-blue-600' : 'text-gray-600'}`}
            title="Numbered List"
          >
            <span className="text-lg">1.</span>
          </button>
        </div>
        <div className="p-4 [&_.is-editor-empty]:before:content-[attr(data-placeholder)] [&_.is-editor-empty]:before:text-gray-400 [&_.is-editor-empty]:before:float-left [&_.is-editor-empty]:before:h-0 [&_.is-editor-empty]:before:pointer-events-none [&_*:focus]:outline-none">
          <EditorContent editor={editor} id="description" />
        </div>
      </div>
      {errors.description && touched.description && (
        <p className="mt-2 text-sm text-red-600">{errors.description}</p>
      )}
    </div>
  );
}