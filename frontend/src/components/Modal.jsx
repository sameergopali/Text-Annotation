import React from 'react';
import {useState, useEffect} from 'react';

import data from '../assets/options.json';

const Modal = ({selected, onClose, onSave }) => {
    const [selectedCode, setSelectedCode] = useState();
    const [selectedSubcode, setSelectedSubcode] = useState();
    const [showDefinition, setShowDefinition] = useState(false);


    useEffect(() => {
        if (Object.keys(data).length > 0) {
            setSelectedCode(Object.keys(data)[0]);
            setSelectedSubcode(data[Object.keys(data)[0]][0]);
        }
    }, []);

    const handleCodeChange = (event) => {
        setSelectedCode(event.target.value);
        setSelectedSubcode(data[event.target.value][0]);
        
    };
  
    const checkboxChange = ()=>{
       setShowDefinition(() => !showDefinition);
    }


    const text = "This is a sample text for annotation tool. Write a paragraph here and select the text to annotate it. You can also add annotations to the text. ";
    return (
        <>
        <div className='modal-overlay' ></div>
        <div className='modal-container' >
            <label> <center><b>Select Annotation</b></center> <i> <center>Text: {selected.text}</center></i></label>
            <label> <input type="checkbox" onChange={checkboxChange} /> Show Defintion</label>

            <div  className="grid-container">
            <div>
                <label>Code:</label>
                <select name="code" className='options' onChange={(event) => handleCodeChange(event)}>
                    {Object.keys(data).map((key) => (
                        <option key={key} value={key} >
                            {key}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Subcode:</label>
                <select name="subcode" value={selectedSubcode} className='options' onChange={(event) => setSelectedSubcode(event.target.value)}>
                    {data[selectedCode]?.map((subcode) => (
                        <option key={subcode} value={subcode} >
                            {subcode}
                        </option>
                    ))}
                </select>
            </div>
            {showDefinition && <div id="definition" >
                <b>Code Definition:</b><br/>
                {text}
            </div>}
            {showDefinition && <div id="definiton" >
                <b>SubCode Definition:</b><br/>
                {text}
            </div>}
            <div>
                <button  className='modal-close-btn' onClick={onClose}>
                    Close
                </button>
            </div>
            <div>
                <button className='modal-save-btn' onClick={() => {onSave(selectedCode, selectedSubcode); onClose();}}>
                    Save
                </button>
            </div>
            </div>
        </div>
        </>
    );
};

export default Modal;