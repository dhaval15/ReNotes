import { Kbd, Center, Text, VStack } from "@chakra-ui/react";
import DialogFlow from "../flow/DialogFlow";
import { useCallback, useRef, useState } from "react";
import { useConfig } from "../components/ExternalEdit";
import { AltKeyGrabber } from "../components/KeyGrabber";
import { useSelected, useCollections } from "../reducers/hooks";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCollectionAsync } from "../reducers/collectionsReducer";
import EditNotePage from "./EditNotePage";
import NodePage from "./NodePage";

function simpleFilter(item, query) {
	return item.toLowerCase().includes(query.toLowerCase())
};

function renderTitle(id, title, isSelected) {
	return (<Text padding={2}
		key={id}
		width="100%"
		textAlign="left"
		bg={isSelected ? "gray.100" : "transparent"}
	>
		{title}
	</Text>)
};

function createTagsSelector(tags) {
	return (value) => {
		return {
			type: 'tags',
			placeholder: 'Tags',
			initial: value,
			tags: tags,
			next: (result, res) => {
				return {
					action: 'done',
					result: {
						...result,
						tags: res,
					},
				}
			},
		}
	}
}

function createNodeSelector(nodes, tagsSelector, editorSelector) {
	return {
		type: 'select',
		initial: '',
		filter: (node, query) => {
			return simpleFilter(node.title, query)
		},
		items: nodes,
		renderItem: (node, _, selected) => {
			return renderTitle(node.id, node.title, selected)
		},
		allowedKeys: ['shift_Enter', 'ctrl_Enter'],
		next: (_, res) => {
			if (res.key == null) {
				if (res.selection == null) {
					return {
						action: 'next',
						result: {
							title: res.query,
						},
						selector: tagsSelector([]),
					}
				}
				else {
					return {
						action: 'done',
						result: {
							node: res.selection,
						},
					}
				}
			}
			if (res.key == 'shift_Enter') {
				return {
					action: 'next',
					result: {
						title: res.query,
					},
					selector: tagsSelector([]),
				}
			}
			if (res.key == 'ctrl_Enter' && res.selection) {
				return {
					action: 'next',
					result: {
						node: res.selection,
					},
					selector: editorSelector,
				}
			}
		},
		placeholder: 'Search Nodes',
		required: true,
	}
}

function createCollectionSelector(collections) {
	return {
		type: 'select',
		initial: '',
		filter: (collection, query) => {
			return simpleFilter(collection, query)
		},
		items: collections,
		renderItem: (collection, _, selected) => {
			return renderTitle(collection, collection, selected)
		},
		next: (_, res) => {
			if (res.key == null) {
				if (res.selection == null) {
				}
				else {
					return {
						action: 'done',
						result: res.selection,
					}
				}
			}

			if (res.key == 'shift_Enter' && res.selection) {

			}
		},
		placeholder: 'Search Collections',
		required: true,
	}
}

function createEditorSelector(editors) {
	return {
		type: 'select',
		initial: '',
		filter: (editor, query) => {
			return simpleFilter(editor.label, query)
		},
		items: editors,
		renderItem: (editor, _, selected) => {
			return renderTitle(editor.id, editor.label, selected)
		},
		next: (result, res) => {
			if (res.selection && res.key == null) {
				return {
					action: 'done',
					result: {
						...result,
						editor: res.selection,
					},
				}
			}
		},
		placeholder: 'Search Editor',
		required: true,
	}
}

function useNodeSelector() {
	const selected = useSelected()
	const editorSelector = useEditorSelector()
	if (!selected)
		return null
	const tagsSelector = createTagsSelector(selected.tags)
	return createNodeSelector(selected.nodes, tagsSelector, editorSelector)
}

function useEditorSelector() {
	const config = useConfig();
	return createEditorSelector(config?.editors ?? [])
}

function useCollectionSelector() {
	const dispatch = useDispatch()
	const collections = useCollections()
	const change = useCallback((collection) => {
		dispatch(fetchCollectionAsync(collection))
	}, [dispatch])
	return [
		createCollectionSelector(collections),
		change,
	]
}

function useExternalNavigate() {
	const config = useConfig();
	const token = useSelector((state) => state.auth.token);
	const node = useSelector((state) => state.node.node);
	const navigate = useNavigate();

	const callback = useCallback((node, editor) => {
		const urlParams = new URLSearchParams(Object.entries({
			collection: node.collection,
			nodeId: node.id,
			token: token,
			host: config.host,
		}));
		const url = `${editor.url}?${urlParams}`;
		navigate('/external', {
			state: {
				url,
				title: editor.title ? node.title : null,
			}
		});
	});

	if (config == null)
		return null;

	return callback;
}

export default function CanvasPage() {
	const dialogRef = useRef(null)
	const nodeSelector = useNodeSelector()
	const [
		collectionSelector,
		changeCollection,
	] = useCollectionSelector()
	const [placeholderData, setPlaceholderData] = useState({});

	const keymap = new Map(Object.entries({
		'alt_f': {
			help: 'open a node',
			action: async () => {
				const result = await dialogRef.current.openAsync({
					selector: nodeSelector,
				})
				if (result) {
					if (result.node)
						setPlaceholderData({
							type: 'node-view',
							collection: result.node.collection,
							id: result.node.id,
						});
				}
			},
		},
		'alt_c': {
			help: 'open a collection',
			action: async () => {
				const result = await dialogRef.current.openAsync({
					selector: collectionSelector,
				})
				if (result) {
					changeCollection(result)
				}
			},
		},
	}))

	return (<>
		<Placeholder
			help={<Help keymap={keymap} />}
			{...placeholderData}
		/>
		<AltKeyGrabber keymap={keymap}>
			<DialogFlow dialogRef={dialogRef} />
		</AltKeyGrabber>
	</>
	)
}

function Placeholder(props) {
	const {
		type,
		help,
		...extras
	} = props;
	if (type == 'node-view')
		return <NodePage {...extras} />
	if (type == 'edit-view')
		return <EditNotePage {...extras} />
	return help
}

function Help({ keymap }) {
	const entries = Array.from(keymap, ([key, value]) => ({ key, ...value }));
	return (
		<Center height="100vh">
			<VStack alignItems="start">
				{(entries.map((entry) => {
					const [mod, key] = entry.key.split('_')
					return (
						<div key={entry.key}>
							<span style={{ marginRight: 8 }}>
								<Kbd>{mod}</Kbd> + <Kbd>{key}</Kbd>
							</span>
							{entry.help}
						</div>
					)
				}))}
			</VStack>
		</Center>
	)
}
