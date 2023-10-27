import {
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	Text,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import usePromiseDisclosure from '../hooks/usePromiseDisclosure';
import Flow from './Flow';
import { logger } from '../logger';

function useFlowParams(params, onClose) {
	const [selector, setSelector] = useState(null)
	const [result, setResult] = useState({})
	const [error, setError] = useState(null)

	useEffect(() => {
		setSelector(params?.selector)
	}, [params])

	const onNext = useCallback((res) => {
		logger.debug('Next:',{
			type: selector.type,
			response: res,
		})
		if (selector.required && res == null) {
			setError('Required')
		}
		const response = selector.next(result, res)
		logger.debug('Result:', response)
		if (response.action == 'done') {
			onClose(response.result)
		}
		else if (response.action == 'next') {
			setSelector(response.selector)
			setResult(response.result)
		}
	}, [selector, setSelector, result, setResult])

	if (selector == null) {
		return {
			selector: {
				type: 'loading',
			}
		}
	}

	return {
		selector,
		onNext,
		error,
	}
}

export default function DialogFlow({
	dialogRef,
	fixedHeight,
}) {

	const {
		isOpen,
		onClose,
		params,
	} = usePromiseDisclosure(dialogRef)

	const {
		selector,
		onNext,
		error,
	} = useFlowParams(params, onClose)

	let style = {}
	if (selector.type === 'select')
		style = {
			height: fixedHeight ?? '400px'
		}

	return (
		<div ref={dialogRef}>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				scrollBehavior="inside"
				blockScrollOnMount={true}
				size="lg">
				<ModalOverlay />
				<ModalContent>
					<ModalBody
						style={style}>
						<Flow type={selector.type} {...selector} onNext={onNext} />
						{(error && <Text>
							{error}
						</Text>)}
					</ModalBody>
				</ModalContent>
			</Modal>
		</div>
	)
}
