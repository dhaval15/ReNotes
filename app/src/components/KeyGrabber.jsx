import { useCallback, useEffect } from "react"

export function AltKeyGrabber({ children, keymap }) {
	const onKeyHandler = useCallback((event) => {
		if (event.altKey && keymap.has(event.key)) {
			const entry = keymap.get(event.key);
			entry.action();
			event.preventDefault();
		}
	}, [keymap]);

	useEffect(() => {
		window.addEventListener('keydown', onKeyHandler);
		return () => window.removeEventListener('keydown', onKeyHandler);
	}, [onKeyHandler]);
	return (<>
		{children}
	</>
	)
}
