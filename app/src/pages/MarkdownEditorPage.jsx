import React, { useRef } from 'react';
import { EditorComponent, useRemirror } from 'remirror/core';
import { AllExtensions } from 'remirror/extension/all';

const MarkdownEditor = () => {
  const { manager, state, onChange } = useRemirror({
    extensions: () => [new AllExtensions()],
    content: 'Start typing your Markdown here...',
  });

  const ref = useRef();

  return (
    <div>
      <EditorComponent
        manager={manager}
        state={state}
        onChange={onChange}
        autoRender
        placeholder='Start typing your Markdown here...'
        ref={ref}
      />
    </div>
  );
};

export default MarkdownEditor;
