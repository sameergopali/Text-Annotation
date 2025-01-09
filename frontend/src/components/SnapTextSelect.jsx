import React, { useState, useEffect, useCallback } from 'react';

const SnapTextSelect = ({ text , onSelect}) => { 
    const [selectionStart, setSelectionStart] = useState(null);
    const [selectionEnd, setSelectionEnd] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const specials = ['.', ',', '!', '?', '(', ')', ':', ';', "'", '"','-'];
    const words = text ? text.split(new RegExp(`(?<=\\s)|(?=\\s)|${specials.map(s => `(?<=\\${s})|(?=\\${s})`).join('|')}`)) : [];

    const wordOffsets = words.reduce((acc, word, index) => {
      const prevOffset = index > 0 ? acc[index - 1].end : 0;
      const start = text.indexOf(word, prevOffset);
      const end = start + word.length;
      acc[index] = { start, end };
      return acc;
    }, []);
  
    const getSelectedOffsets = useCallback((start, end) => {
      if (start === null || end === null) return null;
      const startIdx = Math.min(start, end);
      const endIdx = Math.max(start, end);
      return {
        start: wordOffsets[startIdx].start,
        end: wordOffsets[endIdx].end,
        text: text.substring(wordOffsets[startIdx].start, wordOffsets[endIdx].end)
      };
    }, [wordOffsets, text]);

 
  

    const handleMouseDown = (index) => {
      setIsDragging(true);
      setSelectionStart(index);
      setSelectionEnd(index);
    };

  
    const handleMouseMove = useCallback((e) => {
      if (!isDragging) return;
      // Find the word element under the cursor
      const element = document.elementFromPoint(e.clientX, e.clientY);
      const wordSpan = element?.closest('.word-span');
      if (wordSpan?.dataset?.index) {
        console.log('draggin')
        const currentIndex = parseInt(wordSpan.dataset.index);
        setSelectionEnd(currentIndex);
      }
    }, [isDragging]);
  

    const handleMouseUp = (e) => {
      console.log(selectionStart, selectionEnd);
      if (isDragging) {
        setIsDragging(false);
        const selection = getSelectedOffsets(selectionStart, selectionEnd);
        if (selection && onSelect) {
          onSelect({
            startOffset: selection.start,
            endOffset: selection.end,
            selectedText: selection.text
          });
      }
      }
    };  
  
    const handleClickOutside = useCallback((e) => {
      if (!e.target.closest('.word-span')) {
        setSelectionStart(null);
        setSelectionEnd(null);
        setIsDragging(false);
      }
    }, []);
  
    useEffect(() => {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [handleMouseMove, handleMouseUp, handleClickOutside]);
  
    const isWordSelected = (index) => {
      if (selectionStart === null || selectionEnd === null) return false;
      const startIdx = Math.min(selectionStart, selectionEnd);
      const endIdx = Math.max(selectionStart, selectionEnd);
      return index >= startIdx && index <= endIdx;
    }

    
    return (
       <p>
       
       {words.map((word, index) => (
            <span
              key={index}
              data-index={index}
              className={`word-span ${
                word.trim() ? 'cursor-text' : ''
              } ${
                isWordSelected(index) ? 'bg-blue-200' : ''
              }`}
              onMouseDown={() => word.trim() && handleMouseDown(index)}
            >
              {word}
            </span>
          ))}
       </p>
    );
}

export default SnapTextSelect;