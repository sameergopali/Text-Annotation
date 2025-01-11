import {useState, useEffect} from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";

import AnnotatedText from '../../components/AnnotatedText';
import Modal from "../../components/Modal";
import SnapTextSelect from '../../components/SnapTextSelect';
import TopPanel from "../../components/TopPanel" ;
import UserComparisonSelector from '../../components/UserSelector';
import { useFetch, usePost } from '../../hooks/useFetch';
import MergedAnnotation from './MergedAnnotatedText';

function DiffTool() {
    const [curr, setCurr] = useState(0);
    const [total, setTotal] = useState(0);
    const [text, setText] = useState('');
    const [users, setUsers] = useState([]);
    const [user1, setUser1] = useState('');
    const [user2, setUser2] = useState('');
    const [labels, setLabels] = useState({}); // Store all labels in a single object
    const params = useParams();

    ////////////////////////////////
    const [modalOpen, setmodalOpen] = useState(false);
    const onClose = () => {setmodalOpen(false);};
    const OpenModal = () => {setmodalOpen(true)};

    const [selectedlabels, setSelectedLabels] = useState([]);
    const [selecedtext, setSelectedText] = useState();

     const onSave = async (codes) => {
        const user = localStorage.getItem('user');
        const newLabels = [...labels[user],{ text: selecedtext.text, start: selecedtext.start, end: selecedtext.end, codes:codes}];
        setLabels(prevLabels => ({
            ...prevLabels,
            [user]: newLabels
        }));
        postSave(newLabels);
        setmodalOpen(false);
        await fetchLabels(localStorage.getItem('user'));

    }

    const onTextSelect = (selection) => { 
        setSelectedText( {
                start: selection.startOffset,
                end: selection.endOffset,
                text: selection.selectedText});
        OpenModal();
    };
    ///////////////////////////////////////////////////

    // Fetch labels for a user and store them in the labels object
    async function fetchLabels(user) {
        if (!user) return;
        
        const folder = params.folder;
        const token = localStorage.getItem('token');
        const queryParams = new URLSearchParams({ user, folder, curr }).toString();
        
        try {
            const response = await fetch(`http://localhost:8000/labels/?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            // Update labels object with new data
            setLabels(prevLabels => ({
                ...prevLabels,
                [user]: data.labels
            }));
        } catch (err) {
            console.log(err);
            // Clear labels for this user on error
            setLabels(prevLabels => ({
                ...prevLabels,
                [user]: []
            }));
        }
    }

    const postSave = async (labels, user) => {
        const folder = params.folder;
        user   = user || localStorage.getItem('user');
        const token = localStorage.getItem('token');
        let response = await axios.post('http://localhost:8000/labels', { user, folder, curr, labels }, {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });
        console.log(response);

        
    }

    // Fetch users list
    useFetch({url:'http://localhost:8000/users/', 
        dependencies: [],
        queryparams: { folder: params.folder },
        onSuccess: (data) => setUsers(data.users)})
        ;
      

    const onDelete = async (user, index) => {
        const newLabels = [...labels[user].slice(0, index), ...labels[user].slice(index + 1)];
        setLabels(prevLabels => ({
            ...prevLabels,
            [user]: newLabels
        }));
        await postSave(newLabels, user);
        // Implement delete functionality here
        // After deletion, refetch labels for the affected user
        await fetchLabels(user);
    }

    // Fetch text data
    useFetch({ url:'http://localhost:8000/text/',
        dependencies: [curr],
        queryparams: { folder: params.folder, curr, user: user1 },
        onSuccess: (data) => {
            setText(data.text);
            setTotal(data.total);
        }
    });



    // Fetch labels when users or curr changes
    useFetch({ url:'http://localhost:8000/labels/',
        dependencies: [user1, user2, curr],
        queryparams: { folder: params.folder, curr, user: user1 },
        onSuccess: (data) => setLabels(prevLabels => ({
            ...prevLabels,
            [user1]: data.labels
        }))
    }); 
   

    // Handlers for user selection
    const handleUser1Change = (u1) => {
        setUser1(u1);
    };

    const handleUser2Change = (u2) => {
        setUser2(u2);
    };
    
    return (
        <>
            <TopPanel total={total} onChange={setCurr}>
                <span className="mx-4">|</span>
                <UserComparisonSelector 
                    users={users} 
                    setUser1={handleUser1Change}
                    setUser2={handleUser2Change}
                />
            </TopPanel>
            <div className="flex flex-col items-center justify-center pt-4">
                <div className="flex space-x-4 gap-4">
                    <div 
                        className="flex-1 text-lg text-stone-800 font-sans bg-gray-100 select-none p-8 shadow-md rounded-lg overflow-auto" 
                        style={{ height: '240px', width: '640px' }}
                    >
                        <h1 className='text-xl'><center>Compare Annotations</center></h1>
                    </div>
                    <div className="flex-1 text-lg text-stone-600 font-sans bg-yellow-100 select-none p-8 shadow-md rounded-lg overflow-auto" 
                    style={{ width: '640px', height: '240px' }}>
                        <SnapTextSelect text={text} onSelect={onTextSelect} />
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center pt-4">
                    <div className="flex space-x-4 gap-4">
                        <div 
                            className="flex-1 text-lg text-stone-700 font-sans select-none p-8 bg-gray-100 shadow-md rounded-lg overflow-auto" 
                            style={{ width: '640px', height: '400px', maxWidth: '100%' }}
                        >
                            <AnnotatedText 
                                text={text} 
                                annotations={labels[user1] || []} 
                                color="blue" 
                                onClick={(index) => onDelete(user1, index)} 
                            />
                        </div>
                        <div 
                            className="flex-1 text-lg text-stone-800 font-sans bg-gray-100 select-none p-8 shadow-md rounded-lg overflow-auto" 
                            style={{ width: '640px', height: '400px', maxWidth: '100%' }}
                        >
                            <AnnotatedText 
                                text={text} 
                                annotations={labels[user2] || []} 
                                color="blue" 
                                onClick={(index) => onDelete(user2, index)} 
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            {modalOpen && <Modal selected={selecedtext} onClose={onClose} onSave={onSave}/>}
        </>
    );
}

export default DiffTool;