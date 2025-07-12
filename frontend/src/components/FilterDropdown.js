import React from 'react';
import '../styles/FilterBar.css';

const FilterDropdown = ({ options, selected = [], setSelected }) => {
    const safeSelected = Array.isArray(selected) ? selected : [];

    const handleToggle = (value) => {
        if (safeSelected.includes(value)) {
            setSelected(safeSelected.filter(v => v !== value));
        } else {
            setSelected([...safeSelected, value]);
        }
    }; 

    return (
    <div className="dropdown-pill-container">
        {options.map((option) => (
        <button
            key={option}
            className={`${safeSelected.includes(option) ? 'pill selected' : 'pill'}`}
            onClick={() => handleToggle(option)}
        >
            {option}
        </button>
        ))}
    </div>
    );
};

export default FilterDropdown;
