import { useEffect, useRef, useState } from 'react';
import style from '@components/DropDown/DropDown.module.css';
//import style from "./DropDown.module.css";
import { FaAngleDown, FaCheck } from 'react-icons/fa';

type SelectOption = {
  value: string;
  label: string;
};

type DropDownProps = {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const DropDown = ({ options, value, onChange, placeholder }: DropDownProps) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const selected = options.find((opt) => opt.value === value);

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className={style.selectWrapper}>
      <button
        type="button"
        className={`${style.inputForm} ${style.customSelect}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected?.label || placeholder}

        <FaAngleDown className={style.selectIcon} />
      </button>

      {isOpen && (
        <ul className={style.dropdown}>
          {options.map((option) => {
            const isSelected = value === option.value;

            return (
              <li
                key={option.value}
                className={`${style.option} ${
                  isSelected ? style.optionSelected : ''
                }`}
                onClick={() => handleSelect(option.value)}
              >
                <span>{option.label}</span>

                {isSelected && <FaCheck className={style.optionIcon} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default DropDown;
