import React, { useState, useEffect } from 'react';
import { Link } from '@chakra-ui/react';

const NoteTile = ({ note }) => {
	return (
		<Link 
			href={`/note/${note.id}`}
			style={{
				color: '#483248',
				fontSize: 24,
				fontWeight: 500,
			}}>
			{note.title}
		</Link>
	)
};

export default NoteTile;
