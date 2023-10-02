import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import DashboardPage from './pages/DashboardPage';
import NodePage from './pages/NodePage';
import EditNotePage from './pages/EditNotePage';
import { Provider } from 'react-redux';
import store from './store';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", Component: DashboardPage },
  { path: "/:collection/:id", Component: NodePage },
  { path: "/:collection/:id/edit", Component: EditNotePage },
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
