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
            <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'></div>
            <div id='dialog' className='bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full'>
                <h3 className='text-2xl font-semibold mb-4 text-center'>Code Selection</h3>
                <div className='mb-4 max-h-32 bg-zinc-200 overflow-y-auto p-2 rounded'>
                    <p className='text-sm'>Selected Text: <span className='text-red-500 '>{selected.text}</span></p>
                </div>
                <form id="type-form" className='space-y-4'>
                    {renderDropdowns()}
                    <div className='flex space-x-4 justify-end'>
                        <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={()=>onSave(selectedCodes)}>Submit</button>
                        <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={onClose} >Cancel</button>
                    </div>
                    <div className='flex items-center mt-4'>
                        <input type="checkbox" id="showDefinition" checked={showDefinition} onChange={checkboxChange} className='form-checkbox h-5 w-5 text-blue-600' />
                        <label htmlFor="showDefinition" className='ml-2 text-lg'>Show Definition</label>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Modal;