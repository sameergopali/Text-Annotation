import {useState, useEffect} from 'react';
import { useLocation } from "react-router-dom";

import Modal from "../components/Modal";


const AnnotationTool = (state) => {

    const [modalOpen, setmodalOpen] = useState(false);
    const [selected, setSelected] = useState();
    const [labels, setLabels] = useState([]);
    const [text, setText] = useState();
    const [total, setTotal] = useState(0);
    const  [curr, setCurr] = useState(0);
    const onClose = () => {setmodalOpen(false);};
    const onOpen = () => {setmodalOpen(true)};
    const location = useLocation();
    const {finalized, draft} = location.state||{};


  
    const postSave = async (labels) => {
        fetch('http://localhost:8000/labels', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({"curr": curr, "labels": labels})
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    
    

    const onSave = (code, subcode) => {
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
        let newlabels  =[...labels, {text: selected.text, start: selected.start, end: selected.end, code: code, subcode: subcode}]
        setLabels(newlabels);
        postSave(newlabels);
    }

    const handleTextSelect = (e) => { 
        e.preventDefault();
        const selectedText = window.getSelection().toString();
        
        let start = window.getSelection().anchorOffset;
        let end = window.getSelection().focusOffset;
        if (start > end) {
            [start, end] = [end, start];
        }
        
        setSelected(
            {
                text: selectedText,
                start: start,
                end: end,
            }
        );
        onOpen();
    };

    const removeLabel = (index) => {    
        const newLabels = [...labels];
        newLabels.splice(index, 1);
        setLabels(newLabels);
        postSave(newLabels);
    };

    const _setCurr= ( val) => {
        val = Math.max(0, Math.min(total - 1, parseInt(val)));
        setCurr(val);
    }

    useEffect(() => {
        async function fetchData() {
            const token = localStorage.getItem('token');
            try{
                const response = await fetch(`http://localhost:8000/text/${curr}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setText(data.text);
                setTotal(data.total);
                setLabels(data.labels);
                console.log(data);
            }catch(err){
                console.log(err);
            }
        }
        fetchData();
        
    },[curr]);

    const renderAnnotations = () => {   
        if  (labels.length === 0) {
            return <div>{text}</div>;
        }
        const parts = [];
        let before = 0 ;
        labels.sort((a, b) => a.start - b.start);
        labels.forEach(label => {
            parts.push(<span>{text.substring(before, label.start)}</span>);
            parts.push(
                <span key={label.start}>
                <span className="highlight" style={{ backgroundColor: 'cadetblue' }} >{label.text}</span>
                <label className='label-annotation' onClick={() => removeLabel(labels.indexOf(label))}> {label.code}: {label.subcode}</label>
                </span>
            );
            before = label.end;
        });
        parts.push(<span>{text.substring(before)}</span>);
    
        return <div>{parts}</div>;
       
    };

    return (
        <>
        {modalOpen && <Modal selected={selected} onClose={onClose} onSave={onSave}/>}
        <nav className="navbar">
            <a href="/dashboard">Dashboard</a>    
            <button className='modal-save-btn' onClick={()=> _setCurr(curr-1)}> Prev</button>
            <select onChange={(e) => _setCurr(e.target.value)} value={curr}> 
            {Array.from({ length: total }, (_, i) => (
                <option key={i} value={i}>
                    Message: {i + 1}/{total}
                </option>
            ))}
            </select>
            <button className='modal-save-btn' onClick={()=> _setCurr(curr+1)}> Next</button>
        </nav>
        <div className="container" >
            <div className="text-container" onMouseUp={handleTextSelect} >
                {text}
            </div>
            <div className="annotation-container">
                {renderAnnotations()}
            </div>
        </div>
        </>
    )
};

export default AnnotationTool;


