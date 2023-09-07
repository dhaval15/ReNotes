import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import NotesListPage from './pages/NotesListPage';
import EditNotePage from './pages/EditNotePage';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", Component: NotesListPage },
  { path: "/edit", Component: EditNotePage },
]);


function App() {
  return (
		<ChakraProvider>
			<RouterProvider router={router} />;
		</ChakraProvider>
  );
}

export default App;
