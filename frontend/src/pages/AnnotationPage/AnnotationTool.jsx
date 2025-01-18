import {useState, useEffect} from 'react';
import { use } from 'react';
import { useParams } from "react-router-dom";

import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import Modal from "../../components/Modal";
import TopPanel from "../../components/TopPanel" 
import { useDialog } from '../../hooks/useDialog.jsx';
import {useFetch,usePost} from '../../hooks/useFetch.jsx';
import AnnotationContent from './AnnotationContent.jsx';






const AnnotationTool = () => {
  

    const params = useParams();
    const user = localStorage.getItem('user');
    const [labels, setLabels] = useState([]);
    const [text, setText] = useState();
    const [total, setTotal] = useState(0);
    const [curr, setCurr] = useState(0);
    const [codebook, setCodebook] = useState([]);
    

    const codeSelect =  useDialog();  
    const deleteConfirm = useDialog();
    const {postData}= usePost({url:"http://localhost:8000/labels"});


    useFetch({ 
            url:"http://localhost:8000/text/",
            queryparams:{folder:params.folder, curr: curr, user:user} ,
            dependencies: [curr] , 
            onSuccess: (data) => {
                setText(data.text);
            }
            })
    useFetch({
        url:"http://localhost:8000/total/",
        queryparams:{folder:params.folder},
        dependencies: [curr],
        onSuccess: (data) => setTotal(data.total)
    });

    useFetch({
        url:"http://localhost:8000/labels/",
        queryparams:{folder:params.folder, user:user, curr:curr},
        dependencies: [curr],
        onSuccess: (data) => {
            console.log('labels', data.labels);
            setLabels(data.labels)
        }
    });

    useFetch({  
        url:"http://localhost:8000/codebook/",
        queryparams:{filename:'EPPCMiner'},
        onSuccess: (data) => {
            console.log('data', data);
            setCodebook({options:data.codebook||[]});
        }
    });




    const onSave = (data) => {
        const isOverlapping = labels.some(label => 
            (data.start >= label.start && data.start < label.end) ||
            (data.end > label.start && data.end < label.end) || 
            (data.start <= label.start && data.end > label.end)
        );  

        if (isOverlapping) {
            alert("Overlap not allowed");
            return;
        }
        let newlabels  =[...labels, data]
        newlabels = newlabels.sort((a, b) => a.start - b.start);
        setLabels(newlabels);
        postData({body:{folder:params.folder, user:user, curr:curr, labels: newlabels}});
    }


    const removeLabel = () => {   
        console.log('removing label', deleteConfirm.dialogData);
        const index = deleteConfirm.dialogData.index;
        const newLabels = [...labels.slice(0, index), ...labels.slice(index + 1)];
        setLabels(newLabels);
        postData({body:{folder:params.folder, user:user, curr:curr, labels: newLabels}});
    };


    return (
        <>
        <TopPanel total={total} onChange={setCurr}/>
        <div className="flex items-center justify-center pt-4 ">
            <AnnotationContent text={text} labels={labels} 
            onDelete={deleteConfirm.openDialog} 
            onTextSelect={(selection) => 
                codeSelect.openDialog({
                    start: selection.startOffset,
                    end: selection.endOffset,
                    text: selection.selectedText,
                    codes: []
                    })}/>
        </div>
        <ConfirmDialog isOpen={codeSelect.isOpen} onClose={codeSelect.closeDialog} onSubmit={onSave} data={codeSelect.dialogData}>
            <Modal selected={codeSelect.dialogData} onChange={codeSelect.setDialogData}  optionsData={codebook} />
        </ConfirmDialog>
        <ConfirmDialog isOpen={deleteConfirm.isOpen} onClose={deleteConfirm.closeDialog} onSubmit={removeLabel} data={deleteConfirm.dialogData}>
            Remove Annotation?
        </ConfirmDialog>
        </>
    )
};

export default AnnotationTool;


