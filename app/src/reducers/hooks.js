import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { fetchCollectionAsync, fetchCollectionsAsync } from "./collectionsReducer";

export function useInitStore() {
	const dispatch = useDispatch();
	const loaded = useSelector((state) => state.collections.loaded);
	useEffect(() => {
		if (!loaded)
			dispatch(fetchCollectionsAsync());
	}, [loaded]);
}

export function useCollections() {
	useInitStore();
	const collections = useSelector((state) => state.collections.data);
	return collections;
}

export function useSelected(name) {
	useInitStore();
	const dispatch = useDispatch();
	const selected = useSelector((state) => state.collections.selected);
	useEffect(() => {
		if(name)
			dispatch(fetchCollectionAsync(name));
	}, [name]);
	return selected;
}
