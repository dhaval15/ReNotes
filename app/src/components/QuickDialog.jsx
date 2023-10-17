import { Input, VStack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import DialogContainer from './DialogContainer';

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

function useQuickKeys(length, current, onSelected) {
	const [selected, setSelected] = useState(current ?? -1);

	const onKeyDown = (e) => {
		if (e.key == 'ArrowUp' || (e.key == 'Tab' && e.shiftKey)) {
			setSelected((prev) => prev == 0 ? 0 : prev - 1);
			e.preventDefault();
		}
		else if (e.key == 'ArrowDown' || e.key == 'Tab') {
			setSelected((prev) => prev == length - 1 ? prev : prev + 1);
			e.preventDefault();
		}
		else if (e.key == 'Enter') {
			if (selected > -1) {
				onSelected(selected);
			}
			e.preventDefault();
		}
	};

	return {
		onKeyDown,
		selected,
		setSelected,
	};
}

export default function QuickDialog({
	isOpen,
	onClose,
	initialQuery,
	dialogRef,
	current,
	items,
	filter,
	renderItem,
	onSelected,
	placeholder,
}) {
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
		current,
		(index) => {
			onSelected(filtered[index]);
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
		setQuery(initialQuery ?? '');
	}, [initialQuery]);

	return (
		<div
			onKeyDown={onKeyDown}
			ref={dialogRef}>
			<DialogContainer
				isOpen={isOpen}
				onClose={() => {
					onClose(null);
				}}
				title={
					<Input
						placeholder={placeholder ?? 'Search'}
						value={query ?? ''}
						onChange={(e) => setQuery(e.target.value)}
					/>
				}
				body={
					<VStack gap={0} alignItems="stretch">
						{(filtered.map((item, index) => {
							const isSelected = index === selected;
							return (
								<InViewItem key={index} inView={isSelected}>
									{renderItem(item, index, isSelected)}
								</InViewItem>
							)
						}))}
					</VStack>
				} />
		</div>
	)
}
