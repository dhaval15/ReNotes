import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import DashboardPage from './pages/DashboardPage';
import NodePage from './pages/NodePage';
import EditNotePage from './pages/EditNotePage';
import { Provider } from 'react-redux';
import store from './store';

import {
	createMemoryRouter,
	createHashRouter,
	RouterProvider,
} from "react-router-dom";
import LoginPage from './pages/LoginPage';
import AuthProvider from './components/AuthProvider';
import ExternalPage from './pages/ExternalPage';

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
		element: <AuthProvider><NodePage /></AuthProvider>,
	},
	{
		path: '/:collection/:id/edit',
		element: <AuthProvider> <EditNotePage /> </AuthProvider>,
	},
	{
		path: '/external',
		element: <AuthProvider> <ExternalPage /> </AuthProvider>,
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
