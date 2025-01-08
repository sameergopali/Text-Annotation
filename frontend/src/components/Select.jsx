import {useState} from 'react';

function Selection({options, value, onChange}){
   

    return (
        <select id="type-select" value={value} onChange={onChange}>
            <option value="select">--Select--</option>
            {options.length > 0 && options.map((key) => (
                <option key={key} value={key}>
                    {key}
                </option>
            ))}
        </select>
    );
}
export default Selection;   