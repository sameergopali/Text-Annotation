import { useState } from "react";

const useFilter= ()=>{
    const [filter, setFilter] = useState({
        agreements: true,
        disagreements: true,
    });

    const handleFilterChange = (e) => {
        const { name, checked } = e.target;
        setFilter((prevFilter) => ({
            ...prevFilter,
            [name]: checked,
        }));
    };

    return { filter, handleFilterChange };
}


const FilterOptions = ({filter,handleFilterChange}) => {    
    return (
        <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    name="agreements"
                    checked={filter.agreements}
                    onChange={handleFilterChange}
                />
                <span>Agreements</span>
            </label>
            <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    name="disagreements"
                    checked={filter.disagreements}
                    onChange={handleFilterChange}
                />
                <span>Disagreements</span>
            </label>
        </div>
    );
}

export { useFilter, FilterOptions };