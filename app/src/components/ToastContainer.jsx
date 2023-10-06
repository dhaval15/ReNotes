import React, { useEffect }from 'react';
import { useToast } from '@chakra-ui/react'

export function ToastContainer ({onAlert, onClearMessage}) {
	const toast = useToast();
	const alert = onAlert();
	const id = 'alert-id';
	useEffect(() => {
		if (alert != null && !toast.isActive(id))
			toast({
				id,
				title: alert,
				position: 'top-right',
				status: 'warning',
				variant: 'subtle',
				duration: 3000,
				isClosable: true,
				onCloseComplete: onClearMessage,
			});
	}, [toast, alert]);

	return (
		<>
		</>
	)
};
