import {useState, useEffect} from 'react';
import {Folder } from 'lucide-react'
import { useNavigate } from "react-router-dom";

import text_annot from '../assets/images/text_annot.png';

const AnnotationManager = () => {
    const [finalized, setfinalized ]= useState(false);
    const [draft, setDraft] = useState(false);
    const  [folders, setfolders] = useState([]);

    useEffect(() => {   
        fetch('http://localhost:8000/folders/', {    
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(response => response.json())
            .then(data => { setfolders(data.folders);})
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);
    

    const navigate = useNavigate();
   
    const openAnnotationTool = (folder) => {
        navigate(`/annotViewer/${folder}`);
    };
    return (
        <>
        <h2><img src={text_annot} alt="Text Annotation logo" width="5%" />Annotation Manager</h2>
        <div className="bg-white rounded-lg shadow">
        <ul className="divide-y">
        {folders.map((folder) => (  
            <li  key={folder} className="flex justify-between items-center p-4 hover:bg-gray-50" onClick={()=>{openAnnotationTool(folder)}}>
            <span className="flex item-center gap-2 text-lg text-black" ><Folder/>{folder}</span> 
            </li>  )
        )
        }
        </ul>
        </div>
        </>
    );
};

export default AnnotationManager;