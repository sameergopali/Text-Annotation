import {useState, useEffect} from 'react';
import { useParams } from "react-router-dom";

import AnnotationContent from '../components/AnnotationContent';
import Modal from "../components/Modal";
import TopPanel from "../components/TopPanel" 



const AnnotationTool = () => {

    const params = useParams();
    const [modalOpen, setmodalOpen] = useState(false);
    const [selected, setSelected] = useState();
    const [labels, setLabels] = useState([]);
    const [text, setText] = useState();
    const [total, setTotal] = useState(0);
    const [curr, setCurr] = useState(0);
    const onClose = () => {setmodalOpen(false);};
    const OpenModal = () => {setmodalOpen(true)};


  
    const postSave = async (labels) => {
        const folder = params.folder;
        const user = localStorage.getItem('user');
        console.log(folder);
        fetch('http://localhost:8000/labels/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({"user": user, "folder": folder ,"curr": curr, "labels": labels})
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    
    

    const onSave = (codes) => {
        // Check for overlapping annotations
        const isOverlapping = labels.some(label => 
            (selected.start >= label.start && selected.start <= label.end) ||
            (selected.end >= label.start && selected.end <= label.end) ||
            (selected.start <= label.start && selected.end >= label.end)
        );

        if (isOverlapping) {
            alert("Overlap not allowed");
            return;
        }
        let newlabels  =[...labels, { text: selected.text, start: selected.start, end: selected.end, codes:codes}]
        newlabels = newlabels.sort((a, b) => a.start - b.start);
        postSave(newlabels);
        setLabels(newlabels);
        setmodalOpen(false);
    }

    const onTextSelect = (e) => { 
        e.preventDefault();
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
            const range = selection.getRangeAt(0);
            console.log(range.startOffset, range.endOffset);
            setSelected( {
                start: range.startOffset,
                end: range.endOffset,
                text: selection.toString(),
            });
        }
        OpenModal();
    };

    const removeLabel = (index) => {   
        const newLabels = [...labels.slice(0, index), ...labels.slice(index + 1)];
        setLabels(newLabels);
        postSave(newLabels);
    };

    async function fetchData() {
        const folder = params.folder;
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        const queryParams = new URLSearchParams({ user, folder,curr }).toString();

        try{
            const response = await fetch(`http://localhost:8000/text/?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setText(data.text);
            setTotal(data.total);
            setLabels(data.labels);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        
        fetchData();
    },[curr]);


    return (
        <>
        <TopPanel total={total} onChange={setCurr}/>
        <AnnotationContent text={text}  labels={labels}  onDelete={removeLabel} onTextSelect={onTextSelect}/>
        {modalOpen && <Modal selected={selected} onClose={onClose} onSave={onSave}/>}
        </>
    )
};

export default AnnotationTool;


