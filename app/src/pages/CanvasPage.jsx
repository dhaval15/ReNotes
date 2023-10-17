import { VStack, Kbd, Center } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AltKeyGrabber } from "../components/KeyGrabber";
import SelectItemDialog from '../components/SelectItemDialog';
import { useCollections, useSelected } from "../reducers/hooks";
import EditNotePage from "./EditNotePage";
import NodePage from "./NodePage";

function useNodeSelector() {
	const selected = useSelected(null);
	return {
		id: (item) => item.id,
		title: (item) => item.title,
		items: selected?.nodes ?? [],
		query: '',
	};
}

function useCollectionSelector() {
	const collections = useCollections();
	return {
		id: (item) => item,
		title: (item) => item,
		items: collections ?? [],
		query: '',
	};
}

export default function CanvasPage() {
	const navigate = useNavigate();
	const [collection, setCollection] = useState(null);
	const nodeSelector = useNodeSelector();
	const collectionSelector = useCollectionSelector();
	useSelected(collection);
	const dialogRef = useRef(null);
	const [placeholderData, setPlaceholderData] = useState({});

	const keymap = new Map(Object.entries({
		'f': {
			help: 'open a node',
			action: async () => {
				const node = await dialogRef.current.openAsync(nodeSelector);
				if (node)
					setPlaceholderData({
						type: 'node-view',
						collection: node.collection,
						id: node.id,
					});
			},
		},
		'e': {
			help: 'edit a node',
			action: async () => {
				const node = await dialogRef.current.openAsync(nodeSelector);
				if (node)
					setPlaceholderData({
						type: 'edit-view',
						collection: node.collection,
						id: node.id,
					});
			},
		},
		'c': {
			help: 'change collection',
			action: async () => {
				const collection = await dialogRef.current.openAsync(collectionSelector);
				if (collection)
					setCollection(collection);
			},
		},
		'w': {
			help: 'close window',
			action: () => {
				setPlaceholderData({})
			},
		},
		'q': {
			help: 'quit dev mode',
			action: () => {
				navigate(-1);
			},
		},
	}));
	return (<>
		<PlaceHolder
			help={<Help keymap={keymap} />}
			{...placeholderData}
		/>
		<AltKeyGrabber keymap={keymap}>
			<SelectItemDialog dialogRef={dialogRef} />
		</AltKeyGrabber>
	</>
	)
}

function PlaceHolder(props) {
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
					return (
						<div key={entry.key}>
							<span style={{ marginRight: 8 }}>
								<Kbd>alt</Kbd> + <Kbd>{entry.key}</Kbd>
							</span>
							{entry.help}
						</div>
					)
				}))}
			</VStack>
		</Center>
	)
}
