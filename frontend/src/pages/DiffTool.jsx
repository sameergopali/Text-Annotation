import {useState, useEffect} from 'react';
import { use } from 'react';
import { useParams } from "react-router-dom";

import AnnotatedText from '../components/AnnotatedText';
import DiffContent from "../components/DiffContent";
import Modal from "../components/Modal";
import TopPanel from "../components/TopPanel" ;
import UserComparisonSelector from '../components/UserSelector';

function DiffTool() {
    const [curr, setCurr] = useState(0);
    const [total, setTotal] = useState(0);
    const [text, setText] = useState('');
    const [users, setUsers] = useState([]);
    const [user1, setUser1] = useState('');
    const [user2, setUser2] = useState('');
    const [label1, setLabel1] = useState([]);   
    const [label2, setLabel2] = useState([]);
    const params = useParams();


    async function fetchlabels(user) {
        const folder = params.folder;
        const token = localStorage.getItem('token');
        const queryParams = new URLSearchParams({ user, folder,curr }).toString();
        try{
                const response = await fetch(`http://localhost:8000/labels/?${queryParams}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
        const data = await response.json();
        if(user === user1){
            setLabel1(data.labels);
        }else if(user === user2){
            console.log('label2',data.labels);
            setLabel2(data.labels);
        }
        }catch(err){
                console.log(err);
        }

    }
    async function fetchUsers(user) {   
        const token = localStorage.getItem('token');
        try{
            const response = await fetch(`http://localhost:8000/users/`, {
                headers: { 
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setUsers(data.users);
        }catch(err){    
            console.log(err);
        }   
    }           



    async function fetchData() {
            const folder = params.folder;
            const user = localStorage.getItem('user');
            const token = localStorage.getItem('token');
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
            }catch(err){
                console.log(err);
            }
        }
    
        useEffect(() => {
            fetchData();
            fetchlabels(user1);
            fetchlabels(user2);
        },[curr]);
        useEffect(() => {
            fetchUsers(user1);
        },[]);
    
    return (
        <>
       <TopPanel total={total} onChange={setCurr}/>
       <UserComparisonSelector users={users} setUser1={(u1)=>{fetchlabels(u1);setUser1(u1)}} setUser2={(u2)=>{console.log(u2);fetchlabels(u2);setUser2(u2)}}/>
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <div className="container" >
            <div className="box">
            {(user1 && <div id='labels1' ><AnnotatedText text={text} annotations={label1}  color="green" /></div>)}
            </div>
            <div className="box">
            {(user2 && <div id='label2' ><AnnotatedText text={text} annotations={label2} color="green" /></div>)}
            </div>
            </div>
          </div>
        
        </>
    )

}

export default DiffTool;