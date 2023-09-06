import './App.css';
import React, { useRef } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'
import NotesListPage from './pages/NotesListPage';
import EditNotePage from './pages/EditNotePage';

function App() {
  return (
		<ChakraProvider>
			<Router>
				<Switch>
					<Route path="/" exact component={NotesListPage} />
					<Route path="/edit" component={EditNotePage} />
				</Switch>
			</Router>
		</ChakraProvider>
  );
}

export default App;
