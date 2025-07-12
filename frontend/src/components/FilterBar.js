import React, { useState } from 'react';
import FilterDropdown from './FilterDropdown';
import '../styles/FilterBar.css';

const swapTypes = ['borrow me', 'buy me', 'take me'];
const categories = ['clothing', 'shoes', 'accessories', 'home goods'];
const subcategories = ['dress', 'top', 'bottom', 'outerwear'];
const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '0', '2', '4', '6', '8', '10'];

const FilterBar = ({ filters, setFilters, categoryCounts }) => {
  const [openFilters, setOpenFilters] = useState([]);

  const toggleOpen = (filterName) => {
    setOpenFilters(prev =>
      prev.includes(filterName)
        ? prev.filter(name => name !== filterName)
        : [...prev, filterName]
    );
  };

  const dropdown = (label, filterName, options) => (
    <div className="filter-dropdown-group">
      <button
        className="dropdown-header"
        onClick={() => toggleOpen(filterName)}
      >
        {label}
        <span className="dropdown-icon">{openFilters.includes(filterName) ? '–' : '+'}</span>
      </button>
      {/* {openFilter === filterName && ( */}
      <div className={`dropdown-accordion${openFilters.includes(filterName) ? ' open' : ''}`}>
        <FilterDropdown
          options={options}
          selected={filters[filterName] || []}
          setSelected={(valueArray) => 
            setFilters(prev => ({ 
                ...prev, 
                [filterName]: Array.isArray(valueArray) ? valueArray : [] }))}
        />
      </div>
    </div> 
  );

  // const categoriesWithCounts = cateogires.map(cat => {
  //   const count = categoryCounts?.[cat] || 0;
  //   return `${cat} (${count})`;
  // });

  return (
    <div className="filter-bar">
      {dropdown('Swap Type', 'swapType', swapTypes)}
      {dropdown('Category', 'category', categories)}
      {filters.category.includes('clothing') && dropdown('Clothing Type', 'subcategory', subcategories)}
      {dropdown('Size', 'size', sizes)}
    </div>
  );
};

export default FilterBar;
