import React from 'react';
import {
	HStack,
	VStack,
	Spacer,
	Heading,
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import FadedButton from '../components/FadedButton';
import Icon from '@oovui/react-feather-icons';

export default function ExternalPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const url = location.state.url;
	const title = location.state.title;
	return (
		<VStack width="100%" height="100%" alignItems="stretch">
			<HStack>
				{(title &&
					<Heading size="sm" ml="1em">
						{title}
					</Heading>)}
				<Spacer />
				<FadedButton
					label="Close"
					onClick={() => { navigate(-1); }}
					icon={<Icon type="x" />} />
			</HStack>
			<iframe
				src={url}
				title="Embedded Page"
				style={{
					height: "100%",
					width: "100%",
				}} />
		</VStack>
	)
}
