declare module 'react-quill' {
  import * as React from 'react';

  interface QuillOptions {
    theme?: string;
    value?: string;
    onChange?: (content: string) => void;
    onBlur?: () => void;
    modules?: {
      toolbar?: Array<
        | string[]
        | { header: (number | boolean)[] }
        | { list: 'ordered' | 'bullet' }
        | { color: string[] }
        | { background: string[] }
      >;
    };
    formats?: string[];
    className?: string;
    placeholder?: string;
  }

  const ReactQuill: React.ComponentType<QuillOptions>;
  export default ReactQuill;
}