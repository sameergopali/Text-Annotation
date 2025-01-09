import {useState, useEffect} from 'react';
import { useParams } from "react-router-dom";

import AnnotatedText from '../components/AnnotatedText';
import SnapTextSelect from '../components/SnapTextSelect';
import TopPanel from "../components/TopPanel" ;
import UserComparisonSelector from '../components/UserSelector';

function DiffTool() {
    const [curr, setCurr] = useState(0);
    const [total, setTotal] = useState(0);
    const [text, setText] = useState('');
    const [users, setUsers] = useState([]);
    const [user1, setUser1] = useState('');
    const [user2, setUser2] = useState('');
    const [labels, setLabels] = useState({}); // Store all labels in a single object
    const params = useParams();

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

    // Fetch users list
    async function fetchUsers() {   
        const folder = params.folder;
        const queryParams = new URLSearchParams({ folder }).toString();
        
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8000/users/?${queryParams}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data.users);
            setUsers(data.users);
        } catch (err) {    
            console.log(err);
        }   
    }           

    const onDelete = async (user, index) => {
        const folder = params.folder;
        // Implement delete functionality here
        // After deletion, refetch labels for the affected user
        await fetchLabels(user);
    }

    async function fetchData() {
        const folder = params.folder;
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        const queryParams = new URLSearchParams({ user, folder, curr }).toString();
        
        try {
            const response = await fetch(`http://localhost:8000/text/?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setText(data.text);
            setTotal(data.total);
        } catch (err) {
            console.log(err);
        }
    }

    // Initial data and users fetch
    useEffect(() => {
        fetchData();
        fetchUsers();
    }, []);

    // Fetch text when curr changes
    useEffect(() => {
        fetchData();
    }, [curr]);

    // Fetch labels when users or curr changes
    useEffect(() => {
        if (user1) fetchLabels(user1);
        if (user2) fetchLabels(user2);
    }, [user1, user2, curr]);

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
                <div className="flex items-center justify-center">
                    <div 
                        className="text-lg text-stone-800 font-sans bg-yellow-100 select-none p-8 shadow-md rounded-lg overflow-auto" 
                        style={{ height: '200px', width: '1325px' }}
                    >
                        <SnapTextSelect text={text} />
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center pt-4">
                    <div className="flex space-x-4 gap-4">
                        <div 
                            className="flex-1 text-lg text-stone-700 font-sans select-none p-8 bg-gray-100 shadow-md rounded-lg overflow-auto" 
                            style={{ width: '640px', height: '250px', maxWidth: '100%' }}
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
                            style={{ width: '640px', height: '250px', maxWidth: '100%' }}
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
        </>
    );
}

export default DiffTool;