import {useState, useEffect} from 'react';
import {Folder } from 'lucide-react'
import { useNavigate } from "react-router-dom";

import text_annot from '../../assets/images/text_annot.png';


const Diffdash = () => {
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
        navigate(`/difftool/${folder}`);
    };
    return (
        <>
               <h2 className="text-2xl font-bold mb-4"><img src={text_annot} alt="Text Annotation logo" width="5%" className="inline-block mr-2" />Annotation Manager</h2>
               <p className="mb-4">Click on a folder to open the annotation tool.</p>
               <div className="bg-white rounded-lg shadow">
               <ul className="divide-y">
               {folders.map((folder) => (  
                   <li key={folder} className="flex justify-between items-center p-4 hover:bg-gray-300 cursor-pointer transition duration-200 ease-in-out transform hover:scale-105 rounded-lg" onClick={() => openAnnotationTool(folder)}>
                   <span className="flex items-center gap-2 text-lg text-black"><Folder />{folder}</span> 
                   </li>  
               ))}
               </ul>
               </div>
               </>
    );
};

export default Diffdash;