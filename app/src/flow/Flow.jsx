import { Text } from "@chakra-ui/react";
import FlowInput from "./FlowInput"
import SelectMenu from "./SelectMenu";
import TagsInput from "./TagsInput";

export default function Flow(props) {
	const { type, ...extras } = props;
	if (type === 'loading')
		return <Text> Loading </Text>
	if (type === 'select')
		return (
			<SelectMenu
				{...extras}
			/>
		)
	if (type === 'input')
		return (
			<FlowInput
				placeholder={props.placeholder}
			/>
		)
	if (type === 'tags')
		return (
			<TagsInput
				{...extras}
			/>
		)
	return null
}

