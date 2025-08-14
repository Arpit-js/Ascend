import React, { useState, useEffect, useRef } from 'react';
import './CustomDropdown.css';

const CustomDropdown = ({ options, selectedValue, onChange, placeholder, displayKey = 'name' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const displayValue = options.find(o => o.id === selectedValue)?.[displayKey] || placeholder;

  return (
    <div className="custom-dropdown-container" ref={dropdownRef}>
      <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
        <span>{displayValue}</span>
        {/* The icon component is replaced with a simple span */}
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}></span>
      </button>
      {isOpen && (
        <ul className="dropdown-list">
          {options.map(option => (
            <li 
              key={option.id} 
              onClick={() => handleSelect(option)}
              className={option.id === selectedValue ? 'selected' : ''}
            >
              {option[displayKey]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;