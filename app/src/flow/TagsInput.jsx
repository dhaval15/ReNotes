import { useEffect, useState } from "react";
import FlowInput from './FlowInput';

export default function TagsInput({
	placeholder,
	initial,
	onNext,
}) {
	const [tags, setTags] = useState(initial ?? []);
	const [query, setQuery] = useState('');

	const onKeyDown = (e) => {
		if (e.key == 'Enter') {
			onNext(tags);
			e.preventDefault();
		}
	};

	useEffect(() => {
		const q = query.trim()
		if (q === '') 
			return
		setTags(q.split(/(\s+)/).filter( e => e.length > 1))
	}, [query, setTags]);

	return (
		<FlowInput
			onKeyDown={onKeyDown}
			placeholder={placeholder ?? 'Search'}
			value={query ?? ''}
			onChange={(e) => setQuery(e.target.value)}
		/>
	)
}
