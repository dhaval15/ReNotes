import { VStack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { keyFromEvent } from "../components/KeyGrabber";
import FlowInput from './FlowInput';

function useInView(ref) {
	const [intersecting, setIntersecting] = useState(false)
	const observer = new IntersectionObserver(([entry]) =>
		setIntersecting(entry.isIntersecting)
	)

	useEffect(() => {
		observer.observe(ref.current)
		return () => observer.disconnect()
	}, [ref])

	return intersecting;
}

function InViewItem({ inView, children }) {
	const topRef = useRef(null);
	const bottomRef = useRef(null);

	const inViewTop = useInView(topRef);
	const inViewBottom = useInView(bottomRef);

	useEffect(() => {
		if (inView) {
			if (!inViewTop) {
				topRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				})
			}
			else if (!inViewBottom) {
				bottomRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'end',
				})
			}
		}
	}, [inViewTop, inViewBottom, inView]);

	return (
		<div>
			<div aria-hidden='true' ref={topRef} />
			{children}
			<div aria-hidden='true' ref={bottomRef} />
		</div>
	)
}

function useFilter({
	items,
	filter,
}) {
	const [filtered, setFiltered] = useState(items);
	const [query, setQuery] = useState('');

	useEffect(() => {
		var q = query.trim();
		var filtered = items;
		if (filter && q != '') {
			filtered = filtered.filter((item) => filter(item, q));
		}
		setFiltered(filtered);
	}, [filter, query, items]);

	return {
		filtered,
		query,
		setQuery,
	};
}

function useQuickKeys(length, current, allowedKeys = [], onSelected) {
	const [selected, setSelected] = useState(current ?? -1);

	const onKeyDown = (e) => {
		const key = keyFromEvent(e);
		if (allowedKeys.indexOf(key) !== -1) {
			onSelected(selected, key);
			e.preventDefault();
		}
		else if (key == 'ArrowUp' || key == 'shift_Tab') {
			setSelected((prev) => prev == 0 ? 0 : prev - 1);
			e.preventDefault();
		}
		else if (key == 'ArrowDown' || key == 'Tab') {
			setSelected((prev) => prev == length - 1 ? prev : prev + 1);
			e.preventDefault();
		}
		else if (e.key == 'Enter') {
			onSelected(selected, null);
			e.preventDefault();
		}
	};

	return {
		onKeyDown,
		selected,
		setSelected,
	};
}

export default function SelectMenu(props) {
	const {
		initial,
		items,
		filter,
		renderItem,
		onNext,
		placeholder,
		allowedKeys,
		...extras
	} = props;
	const {
		filtered,
		query,
		setQuery,
	} = useFilter({ items, filter });

	const {
		onKeyDown,
		selected,
		setSelected,
	} = useQuickKeys(
		filtered.length,
		-1,
		allowedKeys,
		(index, key) => {
			onNext({
				key: key,
				selection: index > -1 ? filtered[index] : null,
				query: query.trim(),
			});
		},);

	useEffect(() => {
		if (filtered.length > 0) {
			setSelected(0);
		}
		else {
			setSelected(-1);
		}
	}, [filtered]);

	useEffect(() => {
		setQuery(initial ?? '');
	}, [initial]);

	return (
		<VStack
			p={2}
			style={{
				height: 'inherit'
			}}
			alignItems="stretch"
			onKeyDown={onKeyDown}
			{...extras}>
			<FlowInput
				placeholder={placeholder ?? 'Search'}
				value={query ?? ''}
				onChange={(e) => setQuery(e.target.value)}
			/>
			<VStack
				style={{
					overflowY: 'auto',
					flex: 1,
				}}
				gap={0}
				alignItems="stretch">
				{(filtered.map((item, index) => {
					const isSelected = index === selected;
					return (
						<InViewItem key={index} inView={isSelected}>
							{renderItem(item, index, isSelected)}
						</InViewItem>
					)
				}))}
			</VStack>
		</VStack >
	)
}
