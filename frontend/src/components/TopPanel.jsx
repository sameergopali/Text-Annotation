import { useState } from 'react';
import { ChevronLeft,ChevronRight } from 'lucide-react';

import TopPanelNav from './TopPanelNav';

const  TopPanel = function({total, onChange, children}){
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
        <div className="flex items-center">
            <button id='prev' className={` transition ease-in-out  flex items-center gap-2 px-4 py-1 ${prevDeactivated ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700 text-white"} rounded`} onClick={() => onChange(validVal(val - 1))}>
                {!prevDeactivated && <ChevronLeft size={16} />}
                Prev
            </button>

            <button id='next' className={`transition ease-in-out flex items-center  gap-2 ml-2 px-4 py-1 ${nextDeactivated ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700 text-white"} rounded`} onClick={() => onChange(validVal(val + 1))}>
                Next
                {!nextDeactivated && <ChevronRight size={16} />}
            </button>
        </div>
        <span className="mx-4">|</span>
        <select className="border border-cyan-500 rounded px-2 py-1" onChange={(e) => handleSelectChange(e)} value={val}>
            {Array.from({ length: total }, (_, i) => (
                <option key={i} value={i}>
                    Message: {i + 1}/{total}
                </option>
            ))}
        </select>
        {children}
        </TopPanelNav>
        </>
    );
}

export default TopPanel;