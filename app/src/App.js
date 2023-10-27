import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import DashboardPage from './pages/DashboardPage';
import { NodePageRoute } from './pages/NodePage';
import { EditNotePageRoute } from './pages/EditNotePage';
import { Provider } from 'react-redux';
import store from './store';

import {
	createHashRouter,
	RouterProvider,
} from "react-router-dom";
import LoginPage from './pages/LoginPage';
import AuthProvider from './components/AuthProvider';
import ExternalPage from './pages/ExternalPage';
import CanvasPage from './pages/CanvasPage';
import TestPage from './pages/TestItPage';

const router = createHashRouter([
	{
		path: '/login',
		element: <LoginPage />,
	},
	{
		index: '/',
		element: <AuthProvider><DashboardPage /></AuthProvider>,
	},
	{
		path: '/:collection/:id',
		element: <AuthProvider><NodePageRoute /></AuthProvider>,
	},
	{
		path: '/:collection/:id/edit',
		element: <AuthProvider> <EditNotePageRoute /> </AuthProvider>,
	},
	{
		path: '/external',
		element: <AuthProvider> <ExternalPage /> </AuthProvider>,
	},
	{
		path: '/canvas',
		element: <AuthProvider> <CanvasPage /> </AuthProvider>,
	},
]);


function App() {

	return (
		<ChakraProvider>
			<Provider store={store}>
				<RouterProvider router={router} />
			</Provider>
		</ChakraProvider>
	);
}

export default App;
