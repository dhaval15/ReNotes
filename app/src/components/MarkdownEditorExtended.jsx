import '@remirror/styles/all.css';

import React, { FC, PropsWithChildren, useCallback } from 'react';
import { ExtensionPriority } from 'remirror';
import {
  BlockquoteExtension,
  BoldExtension,
  BulletListExtension,
  CodeBlockExtension,
  CodeExtension,
  HardBreakExtension,
  HeadingExtension,
  ItalicExtension,
  LinkExtension,
  ListItemExtension,
  MarkdownExtension,
  OrderedListExtension,
  PlaceholderExtension,
  StrikeExtension,
  TableExtension,
  TrailingNodeExtension,
} from 'remirror/extensions';
import {
  EditorComponent,
  MarkdownToolbar,
  Remirror,
  ThemeProvider,
  useRemirror,
} from '@remirror/react';
import { AllStyledComponent } from '@remirror/styles/emotion';

export const useManager = (placeholder, content) => {
  const extensions = useCallback(
    () => [
      new LinkExtension({ autoLink: true }),
      new PlaceholderExtension({ placeholder }),
      new BoldExtension(),
      new StrikeExtension(),
      new ItalicExtension(),
      new HeadingExtension(),
      new BlockquoteExtension(),
      new BulletListExtension({ enableSpine: true }),
      new OrderedListExtension(),
      new ListItemExtension({
        priority: ExtensionPriority.High,
        enableCollapsible: true,
      }),
      new CodeExtension(),
      new CodeBlockExtension({ supportedLanguages: [] }),
      new TrailingNodeExtension(),
      new TableExtension(),
      new MarkdownExtension({ copyAsMarkdown: false }),
      new HardBreakExtension(),
    ],
    [placeholder],
  );

  const { manager, state } = useRemirror({
    extensions,
    stringHandler: 'markdown',
    content: content,
  });
	return {
		manager,
		initial: state,
	};
}

const MarkdownEditorExtended = ({
  content,
  theme,
	placeholder,
  ...rest
}) => {
	const {manager, initial} = useManager(placeholder, content);
  return (
    <AllStyledComponent>
      <ThemeProvider theme={theme}>
        <Remirror 
					manager={manager} autoFocus initialContent={initial}
					style={{
						display: 'flex',
						flexDirection: 'column',
					}}>
          <MarkdownToolbar />
          <EditorComponent style={{
						flex: 1,
					}}
					class="scroll"/>
        </Remirror>
      </ThemeProvider>
    </AllStyledComponent>
  );
};
export default MarkdownEditorExtended;
