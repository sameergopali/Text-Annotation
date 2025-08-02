import {useState, useCallback} from 'react';
import { debounce, set } from "lodash";
import {X,Search} from 'lucide-react';

import { useFetch } from '../hooks/useFetch';

const SearchModal = ({ isOpen, onClose }) =>{
    
    
    if (!isOpen) return null;

    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);

    const searcher = useFetch({ 
        url: "http://localhost:8000/search",
        fetchOnMount: false,
        onSuccess: (data) => setResults(data.results)
    });

    const debouncedFetchResults = useCallback(debounce(searcher.refetch, 500), []);
    const handleChange = (e) => {
        let value = e.target.value; 
        setSearchTerm(value);
        debouncedFetchResults({ query: value });
    
    };

    return (
        <>
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          {/* Modal Container */}
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl p-6 relative">
            {/* Close Button */}
            <button 
              onClick={() => onClose()} 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
              <X size={24} />
            </button>

            {/* Search Input */}
            <div className="mb-4 relative mt-10">
              <input 
                type="text" 
                placeholder="Search resources..." 
                value={searchTerm}
                onChange={(e) => handleChange(e)} 
                className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            {
                searcher.loading && (
                    <div className="text-center text-gray-500 py-8">
                        Loading...
                    </div>
                )
            }
        
            {/* Search Results */}
            <div className="overflow-y-auto max-h-96">
                <ul className="space-y-4">
                    {results.map((result, id) => (
                        <li 
                            key={id} 
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <h3 className="font-bold text-lg mb-2">{result.annotation.text}</h3>
                            <p>
                            <span className="text-sm text-gray-500">{result.context.slice(0,result.annotation.start)}</span>
                            <span className="text-sm text-red-500 font-bold">
                                {result.context.slice(result.annotation.start, result.annotation.end)}
                            </span>
                            <span className="text-sm text-gray-500">
                                {result.context.slice(result.annotation.end)}
                            </span>
                            </p>
                            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {result.annotation.codes.join('::')}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* No Results State */}
            {results.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No results found
              </div>
            )}
      
       
            </div>
        </div>
        </>
    )
}

export default SearchModal;
