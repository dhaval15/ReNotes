import { IconButton } from "@chakra-ui/react";
import Icon from '@oovui/react-feather-icons';

function TinyIconButton({onClick, type}){
	return (
		<IconButton
			onClick={onClick}
			size="sm"
			icon={<Icon type={type}/>}
		/>
	)
}

export default TinyIconButton;
