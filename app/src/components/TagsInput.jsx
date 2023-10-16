import React from 'react';
import CreatableSelect from 'react-select/creatable';

const TagsInput = ({ value, tags, onChange }) => {

	const availableTags = tags.map((tag) => ({
		value: tag,
		label: tag,
	}));

	const selectedTags = value.map((tag) => ({
		value: tag,
		label: tag,
	}));

	const handleInputChange = (selectedOptions) => {
		const newValue = selectedOptions.map((option) => option.value);
		onChange(newValue);
	};

	return (
		<CreatableSelect
			isMulti
			options={availableTags}
			value={selectedTags}
			onChange={handleInputChange}
		/>
	);
};

export default TagsInput;

