import { useDisclosure } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

export function useGetter(getter, from) {
	const [value, setValue] = useState(null);
	useEffect(() => {
		setValue(getter(from))
	}, [from]);
	return [value, setValue];
}

export default function usePromiseDisclosure(ref) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [resolver, setResolver] = useState(null);
	const [params, setParams] = useState(null);

	const openAsync = useCallback(async (params) => {
		setParams(params);
		onOpen();
		let resolveFn;
		const promise = new Promise((resolve, _) => {
			resolveFn = resolve;
		});
		setResolver(() => resolveFn);
		return promise;
	},[onOpen, setResolver, setParams]);

	const onCloseDialog = (result) => {
		onClose();
		resolver(result);
	}


	useEffect(() => {
		if(ref.current){
			ref.current.openAsync = openAsync;
		}
	}, [openAsync, ref]);

	return {
		openAsync,
		isOpen,
		onOpen,
		onClose: onCloseDialog,
		resolver,
		params,
	};
}
