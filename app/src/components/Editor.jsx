import React, { useState, useEffect, useRef } from 'react';
import { Flex } from '@chakra-ui/react';
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import MdToolbar from './MdToolbar';
import "./Editor.css";

const MemoMde = React.memo(SimpleMdeReact);

const Editor = ({initialContent}) => {
	const editor = useRef(null);
	const onChange = (text) => {

	};

	return (
		<Flex height="100vh" direction="column">
				<MdToolbar height="8em" editor={editor} />
				<Flex 
					flex={1}
					style={{
						justifyContent:"center",
						width:"100%",
						alignItems: "center",
						flex: 1,
						height:"100%",
						overflowY: 'auto',
					}}
					px="0em"
					pb={8}>
					<MemoMde
						style={{
							height: '100%',
							boxSizing: 'border-box',
							width: '100%',
						}}
						pt='8em'
						ref={editor}
						getCodemirrorInstance={(cm) => {
							if (editor.current)
								editor.current.cm = cm
						}}
						getMdeInstance={(e) => {
							if (editor.current)
								editor.current.mde = e
						}}
						options={{
							//lineNumbers: true,
							scrollbarStyle: null,
							status: false,
							toolbar: [],
						}}
						value={initialContent} 
						onChange={onChange} />
			</Flex>
		</Flex>
	)
}

export default Editor;
