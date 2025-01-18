import { useState, useRef, useEffect } from 'react';

const EditableElement = ({onChange, value}) => {
  const [isEditing, setIsEditing] = useState(false);
  console.log(value);
  const [text, setText] = useState(value);
  const inputRef = useRef(null);

  // Handle double click to enter edit mode
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  // Handle click outside to save
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isEditing && inputRef.current && !inputRef.current.contains(event.target)) {
        setIsEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Handle input change
  const handleChange = (e) => {
    setText(e.target.value);
  };

  // Handle enter key to save
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  return (
    <>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="flex-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <span 
          onDoubleClick={handleDoubleClick}
          className="flex-1 cursor-pointer hover:bg-gray-100 hover:cursor-text rounded"
        >
          {text}
        </span>
      )}
    </>
  );
};

export default EditableElement;