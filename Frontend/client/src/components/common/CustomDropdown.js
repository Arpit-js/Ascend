import React, { useState, useEffect, useRef } from 'react';
import styles from './CustomDropdown.module.css'; // Import CSS module

const CustomDropdown = ({ options, selectedValue, onChange, placeholder, displayKey = 'name', className = '' }) => {
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

  const selectedOption = options.find(o => o.id === selectedValue);
  const displayValue = selectedOption ? selectedOption[displayKey] : placeholder;

  return (
    <div className={`${styles.customDropdownContainer} ${className}`} ref={dropdownRef}>
      <button className={styles.dropdownButton} onClick={() => setIsOpen(!isOpen)}>
        <span>{displayValue}</span>
        <span className={`${styles.dropdownArrow} ${isOpen ? styles.open : ''}`}></span>
      </button>
      {isOpen && (
        <ul className={styles.dropdownList}>
          {options.map(option => (
            <li
              key={option.id}
              onClick={() => handleSelect(option)}
              className={option.id === selectedValue ? styles.selected : ''}
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