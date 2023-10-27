import React, { useState, useEffect } from 'react';
import { logger } from '../logger';
import { Text, Link, Stack } from '@chakra-ui/react';
import {  useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function useConfig() {
	const [config, setConfig] = useState(null);

	useEffect(() => {
		fetch('/config/editors.json')
			.then((response) => response.json())
			.then((data) => {
				setConfig(data);
			})
			.catch((error) => {
				logger.debug(error);
			});
	}, []);

	return config;
}

export default function ExternalEdit() {
	const config = useConfig();
	const navigate = useNavigate();
	const token = useSelector((state) => state.auth.token);
	const node = useSelector((state) => state.node.node);
	if (config == null)
		return null;

	const handleNavigate = (editor) => {
		const urlParams = new URLSearchParams(Object.entries({
			collection: node.collection,
			nodeId: node.id,
			token: token,
			host: config.host,
		}));
		const url = `${editor.url}?${urlParams}`;
		navigate('/external', {
			state: {
				url,
				title: editor.title ? node.title : null,
			}
		});
	};

	return (
		<Stack spacing={2}>
			<Text fontSize={20}> Open in </Text>
			{config.editors.map((editor, index) => (
				<Link
					pl={1}
					key={index}
					colorScheme="blue"
					onClick={() => handleNavigate(editor)}
				>
					{editor.label}
				</Link>
			))}
		</Stack>
	);
}
