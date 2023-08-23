import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import NotesListPage from './pages/NotesListPage';

function App() {
  return (
		<ChakraProvider>
			<NotesListPage/>
		</ChakraProvider>
  );
}

export default App;
