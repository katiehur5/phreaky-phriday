import React, { useState } from 'react';
import FilterDropdown from './FilterDropdown';
import '../styles/FilterBar.css';

const swapTypes = ['borrow me', 'buy me', 'take me'];
const categories = ['clothing', 'shoes', 'accessories', 'home goods'];
const subcategories = ['dress', 'top', 'bottom', 'outerwear'];
const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '0', '2', '4', '6', '8', '10'];

const FilterBar = ({ filters, setFilters, categoryCounts }) => {
  const [openFilter, setOpenFilter] = useState(null);

  const toggleOpen = (filterName) => {
    setOpenFilter(prev => (prev === filterName ? null : filterName));
  };

  const dropdown = (label, filterName, options) => (
    <div className="filter-dropdown-group">
      <button
        className="dropdown-header"
        onClick={() => toggleOpen(filterName)}
      >
        {label}
        <span className="dropdown-icon">{openFilter === filterName ? '–' : '+'}</span>
      </button>
      {openFilter === filterName && (
        <FilterDropdown
          options={options}
          selected={filters[filterName] || []}
          setSelected={(valueArray) => 
            setFilters(prev => ({ 
                ...prev, 
                [filterName]: Array.isArray(valueArray) ? valueArray : [] }))}
        />
      )}
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
