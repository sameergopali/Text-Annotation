import {useState} from 'react';

function Selection({options, value, onChange}){
   

    return (
        <select
            id="type-select"
            value={value}
            onChange={onChange}
            className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
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