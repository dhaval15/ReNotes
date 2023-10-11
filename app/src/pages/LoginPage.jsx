import React, { useEffect, useState } from 'react';
import {
	VStack,
	Box,
	Spacer,
	Heading,
	Input,
	Button,
	FormControl,
	FormLabel,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync } from '../reducers/authReducer';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
	const dispatch = useDispatch();
	const [formData, setFormData] = useState({ username: '', password: '' });
	const token = useSelector((state) => state.auth.token);
	const navigate = useNavigate();

	useEffect(() => {
		if (token != null) {
			navigate('/');
		}
	}, [token, navigate]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleLogin = async () => {
		dispatch(loginAsync(formData));
	};

	return (
		<VStack height="100vh">
			<VStack height="100%">
				<Spacer />
				<VStack p={8} bg="gray.50" borderRadius={4}>
					<Heading as="h2" size="lg" mb={4}>
						ReNotes
					</Heading>
					<FormControl id="username" isRequired mb={4}>
						<FormLabel>Username</FormLabel>
						<Input type="text" name="username" variant="filled" value={formData.username} onChange={handleInputChange} />
					</FormControl>
					<FormControl id="password" isRequired mb={4}>
						<FormLabel>Password</FormLabel>
						<Input type="password" name="password" variant="filled" value={formData.password} onChange={handleInputChange} />
					</FormControl>
					<Button colorScheme="blue" onClick={handleLogin}>
						Login
					</Button>
				</VStack>
				<Spacer />
			</VStack>
		</VStack>
	);
}

export default LoginPage;

