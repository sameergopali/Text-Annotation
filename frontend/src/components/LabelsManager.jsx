import {useState} from 'react';
import { Edit, Trash2, Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const LabelManager= () => {
    const [labels, setLabels] = useState([
        { id: 1, filename: "Product Categories" }
       
    ]);
    const navigate = useNavigate(); 
    const handleDelete = (id) => {
        setLabels(labels.filter(label => label.id !== id));
    };
    const handleAdd = () => {
        setLabels([...labels, { id: labels.length + 1, filename: "New Label" }]);
    };
    const handleEdit = (filename) => {
        navigate(`/labels/${filename}`);
    };
    return(
        <div className="w-full   p-6">
            <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Label Manager</h1>
            <button onClick={handleAdd} className="flex text-white items-center px-4 py-2 gap-2 bg-blue-500 rounded-md hover:bg-blue-600 "><Plus size={16}/> Create New</button>
            </div>
            <div className="bg-white rounded-lg shadow">
            {labels.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                    No labels found. Create one to get started.
                </div>
            ) : (
                <ul className="divide-y">
                   
                {labels.map((label) => (
                     
                    <li  key={label.id} className="flex justify-between items-center p-4 hover:bg-gray-50">
                        <span className="text-lg text-black">{label.filename}</span>
                        <div className="flex gap-3">
                        <button onClick={() => {handleEdit(label.filename)}}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                            title="Edit"
                        > 
                        <Edit size={18} />
                        </button>
                        <button 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                            title="Delete"
                            onClick={() => handleDelete(label.id)}
                        >
                        <Trash2 size={18} />
                        </button>
                        </div>
                    </li>
                    ))} 
                </ul>)}
            </div>

        </div>
    );
}

export default LabelManager