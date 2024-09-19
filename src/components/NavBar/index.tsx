import { useState, useEffect, useRef } from "react";
import styles from './styles.module.css';

interface NavBarProps {
  filters: { siteSources: string[] };
  selectedSourceType: string[];
  onFilterChange: (sourceType: string) => void;
}

export function NavBar({ filters, selectedSourceType, onFilterChange }: NavBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref to the dropdown container

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navItem} ref={dropdownRef}>
        <button onClick={toggleDropdown} className={styles.navLink}>
          Sources <span className={styles.arrow}>{dropdownOpen ? "▲" : "▼"}</span>
        </button>
        {dropdownOpen && (
          <div className={styles.dropdownMenu}>
            {filters.siteSources.map((source) => (
              <div key={source} className={styles.dropdownItem}>
                <input 
                  type="checkbox" 
                  id={source} 
                  checked={selectedSourceType.includes(source)}
                  onChange={() => onFilterChange(source)} 
                />
                <label htmlFor={source}>{source}</label>
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
