import { useState } from 'react';
import { Plus,Save } from 'lucide-react';
import { useParams } from 'react-router-dom';

import TopPanelNav from '../../components/TopPanelNav';
import EditableElement from './EditableElement';
import LabelItem from './LabelItem';    

const Labels = () => { 
    const params = useParams();
    const Name = params.name;
    const [labels, setLabels] = useState([{
        "name": "root",
        "options" :[{"name":"option1", "options":[]}, {"name":"option2", "options":[]}]
    }]);   
    const [filename, setFilename] = useState(params.name);
    
    const handleSave = () => { 
        let data = {
            "filename": filename,
            "labels": labels
        }
        console.log(data);

     }

    
    const addNewLabel = () => {
        setLabels([...labels, {"name":"New Label", "options":[]}]);
    } ;
    return  (
        <>
        <TopPanelNav/>
        <div className="w-full   border rounded-lg shadow-sm">
        <div className="border-b px-12 p-4 gap-2 flex justify-between items-center">
            <EditableElement  value={filename} onChange={(name) => setFilename(name)} />
            <button  className="flex items-center gap-2 px-3 p-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={addNewLabel}>
                <Plus size={16} /> Add Label
            </button>
            <button  onClick={handleSave} className="flex  items-center  gap-2 bg-blue-500 text-white px-3 p-1 rounded hover:bg-blue-600">
                <Save size={16}/>Save
            </button>

        </div>   
        </div>
        <div className="p-4">
            {labels.map((label, index) => (
                <LabelItem item={label} key={index} onUpdate={(updated) =>{
                    const newOptions = [...labels];
                    newOptions[index] = updated;
                    setLabels(newOptions);
                }}
                onDelete={(deleted)=>{
                    setLabels(labels.filter((opt)=> opt !== deleted));
                }}
                level={0}
                />
            ))}
        </div>
        </>
        )
}


export default Labels;