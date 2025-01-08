import { useState } from 'react';

import TopPanelNav from './TopPanelNav';

const  TopPanel = function({total, onChange}){
    let [val, setVal] = useState(0);
    let [prevDeactivated, setprevDeactivated] = useState(true);
    let [nextDeactivated, setnextDeactivated] = useState(false);

   
    function validVal(value){
        value = Math.min(total-1, Math.max(parseInt(value),0));
        setVal(value);
        setprevDeactivated(false);
        setnextDeactivated(false);
        if (value <= 0) {
            setprevDeactivated(true); 
        }
        if (value >= total-1) {
           setnextDeactivated(true);
        }
        return value;
    }
    function handleSelectChange(e){
        let value  =validVal(parseInt(e.target.value));
        console.log("setting value in nav", value);
        onChange(value);
    }

   
    return (
        <>
        <TopPanelNav>
        <div className="button-container">
            <button  id='prev' className={prevDeactivated?"fancy-button-deactivated":"fancy-button" }  onClick={()=>onChange(validVal(val-1))}> 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg>
                Prev
            </button>
        
            <button  id='next' className={nextDeactivated?"fancy-button-deactivated":"fancy-button" }  onClick={()=>onChange(validVal(val+1))}>
                Next
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
            </button>
        </div>
        &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
        <select onChange={(e) => handleSelectChange(e)}  value={val}> 
            {Array.from({ length: total }, (_, i) => (
                <option key={i} value={i}>
                    Message: {i + 1}/{total}
                </option>
            ))}
        </select>
        </TopPanelNav>
        </>
    );
}

export default TopPanel;