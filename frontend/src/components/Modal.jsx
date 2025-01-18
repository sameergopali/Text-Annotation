import React from 'react';
import {useState} from 'react';

import { useFetch } from '../hooks/useFetch';
import Selection from './Select';

const   Modal = ({selected, onChange,optionsData }) => {
    const [selectedCodes, setSelectedCode] = useState([]);
    const [showDefinition, setShowDefinition] = useState(false);
    

   
    
   


   

    const handleCodeChange = (e, level) => {
        let value = e.target.value; 
        setSelectedCode([...selectedCodes.slice(0, level), value]);
        onChange({codes: [...selectedCodes.slice(0, level), value]});
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
            <h3 className='text-2xl font-semibold mb-4 text-center'>Code Selection</h3>
                <div className='mb-4 max-h-32 bg-zinc-200 overflow-y-auto p-2 rounded'>
                    <p className='text-sm'>Selected Text: <span className='text-red-500 '>{selected.text}</span></p>
                </div>
                <form id="type-form" className='space-y-4'>
                    {renderDropdowns()}
            
                <div className='flex items-center mt-4'>
                    <input type="checkbox" id="showDefinition" checked={showDefinition} onChange={checkboxChange} className='form-checkbox h-5 w-5 text-blue-600' />
                    <label htmlFor="showDefinition" className='ml-2 text-lg'>Show Definition</label>
                </div>
            </form>
     </>
    );
};

export default Modal;