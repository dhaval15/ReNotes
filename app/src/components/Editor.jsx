import React, { useState, useEffect, useRef, useContext } from 'react';
import { Flex, useDisclosure } from '@chakra-ui/react';
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import MdToolbar from './MdToolbar';
import "./Editor.css";
import SelectNodeDialog from './SelectNodeDialog';
import debounce from 'lodash/debounce';

const MemoMde = React.memo(SimpleMdeReact);

const Editor = ({ initialContent, onChangeDebounced, onSave }) => {
	const dialogRef = useRef(null);
	useEffect(() => {
		console.log(dialogRef.current);
	},[dialogRef.current]);
	return (
		<>
			<SelectNodeDialog dialogRef={dialogRef}/>
			<EditorArea 
				dialogRef={dialogRef} 
				onSave={onSave}
				onChangeDebounced={onChangeDebounced} 
				initialContent={initialContent}/>
		</>
	)
}

function EditorArea({ dialogRef, initialContent, onChangeDebounced, onSave}) {
	const editor = useRef(null);
	const TYPING_INTERVAL = 2000;

	const debouncedSave = React.useRef(
		debounce((text) => {
			onChangeDebounced(text);
		}, TYPING_INTERVAL)
	).current;

	const onChange = (text) => {
		debouncedSave(text);
	}

	React.useEffect(() => {
		return () => {
			debouncedSave.cancel();
		};
	}, [debouncedSave]);

	const extraKeys = React.useMemo(() => {
		return {
			'Ctrl-F': async (cm) => {
				console.log(dialogRef);
				const node = await dialogRef.current.openAsync();
				const selection = cm.getSelection().trim();
				const inline = selection != '' ? selection : node.title;
				const url = `[${inline}](id:${node.id})`;
				cm.replaceSelection(url);
			},
		};
	}, []);


	return (
		<>
			<Flex height="100vh" direction="column">
				<MdToolbar height="8em" editor={editor} onSave={onSave}/>
				<Flex
					id="editor"
					flex={1}
					style={{
						justifyContent: "center",
						width: "100%",
						alignItems: "center",
						flex: 1,
						height: "100%",
						overflowY: 'auto',
					}}
					px="0em">
					<MemoMde
						style={{
							height: '100%',
							boxSizing: 'border-box',
							width: '100%',
						}}
						pt='8em'
						ref={editor}
						getCodemirrorInstance={(cm) => {
							if (editor.current) {
								editor.current.cm = cm
							}
						}}
						getMdeInstance={(e) => {
							if (editor.current)
								editor.current.mde = e
						}}
						options={{
							scrollbarStyle: null,
							status: false,
							toolbar: [],
							autofocus: true,
							spellChecker: false,
						}}
						extraKeys={extraKeys}
						onChange={onChange}
						value={initialContent}/>
				</Flex>
			</Flex>
		</>
	)
}

export default Editor;
