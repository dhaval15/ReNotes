import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import NotesListPage from './pages/NotesListPage';
import EditNotePage from './pages/EditNotePage';

function App() {
  return (
		<ChakraProvider>
			<EditNotePage/>
		</ChakraProvider>
  );
}

export default App;
