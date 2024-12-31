import {useState} from 'react';

import AnnotationManager from '../components/AnnotationManager';
import {useAuth}    from '../context/AuthContext';

const Dashboard = () => {
    const [selectedContent, setSelectedContent] = useState('Annotation Manager');
    const {logout} = useAuth();

    const contentComponet ={
        'AnnotationManager': <AnnotationManager />,
        'Add File': <div>Add File</div>,
        'Logout': <div>Logout</div>
    }

    const content = contentComponet[selectedContent];
    return (
        <>
        <aside className='sidebar'>
            <button onClick={() => setSelectedContent('AnnotationManager')}>Annotation Manager</button>
            <button onClick={() => setSelectedContent('AddFile')}>Add File</button>
            <button onClick={() => setSelectedContent('Documentation')}>Documentation</button>
            <button onClick={() => logout()}>Logout</button>
        </aside>
        <main>
            {content}
        </main>
        </>
    );
};

export default Dashboard;