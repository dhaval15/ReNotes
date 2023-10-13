import React, { useState } from 'react';
import {
	IconButton,
} from '@chakra-ui/react';

const FadedButton = ({icon, onClick, label, style}) => {
	const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
	return(
		<IconButton
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			aria-label={label}
			icon={icon}
			variant="ghost"
			style={{
				color: 'grey',
  			opacity: isHovered ? 1 : 0.2,
  			transition: 'opacity 1s',
				... style,
			}}
			onClick={onClick}
		/>
	)
}

export default FadedButton;
