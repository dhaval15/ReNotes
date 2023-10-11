import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, setAuth } from '../reducers/authReducer';

function AuthProvider({ children }) {
	const token = useSelector((state) => state.auth.token);
	const [isLoaded, setLoaded] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem('token');
		const expiry = localStorage.getItem('expiry');
		const now = new Date() / 1000;
		setLoaded(true);
		if (expiry && token) {
			if (now > expiry) {
				dispatch(logout());
			} else {
				dispatch(setAuth({ token, expiry }));
			}
		}
	}, [dispatch]);

	useEffect(() => {
		if (isLoaded && token == null) {
			navigate('/login');
		}
	}, [token, isLoaded, navigate]);

	return token ? children : null;
}


export default AuthProvider;
