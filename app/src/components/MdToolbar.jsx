import React from 'react';
import { Flex, Spacer, IconButton, Text } from '@chakra-ui/react';
import Icon from '@oovui/react-feather-icons';
import './MdToolbar.css'; // Create a CSS file for styling

const leftIcons = [
	{
		name: 'bold',
		action: 'toggleBold',
		icon: 'bold',
	},
	{
		name: 'italic',
		action: 'toggleItalic',
		icon: 'italic',
	},
	// {
	//   name: 'strikethrough',
	//   action: 'toggleStrikethrough',
	//   icon: 'strikethrough',
	// },
	{
		name: 'heading',
		action: 'toggleHeadingSmaller',
		icon: 'header',
		text: 'H',
	},
	{
		name: 'code',
		action: 'toggleCodeBlock',
		icon: 'code',
	},
	{
		name: 'quote',
		action: 'toggleBlockquote',
		icon: 'chevron-right',
		text: '"',
	},
	{
		name: 'unordered-list',
		action: 'toggleUnorderedList',
		icon: 'list',
	},
	{
		name: 'ordered-list',
		action: 'toggleOrderedList',
		icon: 'list-ol',
		text: '1.',
	},
	{
		name: 'link',
		action: 'drawLink',
		icon: 'link',
	},
	{
		name: 'image',
		action: 'drawImage',
		icon: 'image',
	},
	{
		name: 'table',
		action: 'drawTable',
		icon: 'table',
	},
	{
		name: 'horizontal-rule',
		action: 'drawHorizontalRule',
		icon: 'minus',
	},
	{
		name: 'guide',
		action: 'openGuide',
		icon: 'help-circle',
	},
];
const rightIcons = [
	{
		name: 'fullscreen',
		action: 'toggleFullScreen',
		icon: 'maximize',
	},
	{
		name: 'save',
		action: 'save',
		icon: 'save',
	},
];

const MdToolbar = ({ editor }) => {
  const handleButtonClick = (action) => {
		if(action == 'toggleFullScreen') {
		}
		else if (editor.current && editor.current.cm && editor.current.mde) {
      editor.current.cm.focus();
			editor.current.mde[action]();
    }
  };


  return (
    <Flex className="md-toolbar">
      {leftIcons.map((button) => (
        <IconButton
          key={button.name}
          aria-label={button.name}
					mr={1}
					size="sm"
          icon={ button.text != null ?
						<Text fontSize={20}> {button.text} </Text>
						: <Icon type={button.icon}/>
          }
          onClick={() => handleButtonClick(button.action)}
        />
      ))}
			<Spacer/>
      {rightIcons.map((button) => (
        <IconButton
          key={button.name}
          aria-label={button.name}
					mr={1}
					size="sm"
          icon={ button.text != null ?
						<Text fontSize={20}> {button.text} </Text>
						: <Icon type={button.icon}/>
          }
          onClick={() => handleButtonClick(button.action)}
        />
      ))}
    </Flex>
  );
};

export default MdToolbar;
