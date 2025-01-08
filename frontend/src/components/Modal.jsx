import React from 'react';
import {useState, useEffect} from 'react';

import optionsData from '../assets/options.json';
import Selection from './Select';

const   Modal = ({selected, onClose, onSave }) => {
    
    const [selectedCodes, setSelectedCode] = useState([]);
    const [showDefinition, setShowDefinition] = useState(false);
   


    useEffect(() => {
        
    }, []);

    const handleCodeChange = (e, level) => {
        let value = e.target.value; 
        setSelectedCode([...selectedCodes.slice(0, level), value]);
        console.log(selectedCodes);
    };
  
    const checkboxChange = ()=>{
       setShowDefinition(() => !showDefinition);
    }


    const renderDropdowns = () => {
        let currData = optionsData;
        const dropdowns = [];
        let options = currData['options'].map(option =>  option.name);
        console.log('options', options);
        for (let i = 0; i <= selectedCodes.length; i++) {
            if (options.length === 0) break;
            const level = i;
            dropdowns.push(
                <Selection
                    key={level}
                    options={options}
                    value={selectedCodes[level] || ''}
                    onChange={(e) => handleCodeChange(e, level)}
                />
            );
            const selectedValue = selectedCodes[level];
            currData = currData['options'].find(option => option.name === selectedValue);
            options = currData ? currData['options'].map(option => option.name) : [];
        }
        return dropdowns;
    };

    return (
        <>
            <div className='overlay' ></div>
            <div id='dialog' >
                <h3>Annotation Selection</h3>
                <p>Selected Text: {selected.text}</p>
                <form id="type-form">
                    {renderDropdowns()}
                    <br/>
                    <button type="button" className="submit" onClick={()=>onSave(selectedCodes)}>Submit</button>
                    <button type="button" className="cancel" onClick={onClose} >Cancel</button>
                </form>
            </div>
        </>
    );
};

export default Modal;