import { useCallback, useEffect } from "react"

export function AltKeyGrabber({ children, keymap }) {
	const onKeyHandler = useCallback((event) => {
		const key = keyFromEvent(event)
		if (keymap.has(key)) {
			const entry = keymap.get(key);
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

export function keyFromEvent(event) {
	let key = ''
	if (event.altKey)
		key = 'alt_'
	if (event.ctrlKey)
		key = `${key}ctrl_`
	if (event.shiftKey)
		key = `${key}shift_`

	key = `${key}${event.key}`
	return key
}
