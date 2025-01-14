import { useState } from 'react';
import { use } from 'react';
import { Plus,Save } from 'lucide-react';
import { useParams } from 'react-router-dom';

import Toast from '../../components/Toast';
import TopPanelNav from '../../components/TopPanelNav';
import {useFetch,usePost} from '../../hooks/useFetch';
import EditableElement from './EditableElement';
import LabelItem from './LabelItem';    

const Labels = () => { 

    const params = useParams();
  
    const [filename, setFilename] = useState(params.name);
    const [codebook, setCodebook] = useState([]);   

    useFetch({  
        url:"http://localhost:8000/codebook/",
        queryparams:{filename:params.name},
        onSuccess: (data) => {
            setCodebook(data.codebook||[]);
        }
    });

    const { postData,success, reset } = usePost({ url: "http://localhost:8000/codebook" });

    
    const handleSave = () => { 
        let body = { filename: filename, codebook: codebook };    
        postData({ body: body, options: { headers: { 'Content-Type': 'application/json' } } });
     }

    
    const addNewLabel = () => {
        setCodebook([...codebook, {"name":"New Category", "options":[]}]);
    } ;

    return  (
        <>
        <TopPanelNav/>
        <div className="w-full border rounded-lg shadow-sm">
        <div className="border-b px-12 p-4 gap-2 flex justify-between items-center">
            <EditableElement value={filename} onChange={(name) => setFilename(name)} />
            <button className="flex items-center gap-2 px-3 p-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={addNewLabel}>
                <Plus size={16} /> Add Category
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 bg-blue-500 text-white px-3 p-1 rounded hover:bg-blue-600">
                <Save size={16}/>Save
            </button>
        </div>   
        </div>
        <div className="p-4"></div>
        <div className="p-4">
            {codebook && codebook.map((label, index) => (
                <LabelItem item={label} key={index} onUpdate={(updated) =>{
                    const newOptions = [...codebook];
                    newOptions[index] = updated;
                    setCodebook(newOptions);
                }}
                onDelete={(deleted)=>{
                    setCodebook(codebook.filter((opt)=> opt !== deleted));
                }}
                level={0}
                />
            ))}
        </div>

        { success && <Toast  duration={1000} reset={reset}/> }
        </>
    )
}


export default Labels;