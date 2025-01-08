import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import data_extraction from '../assets/images/data_extraction.png';
import de_iden from '../assets/images/de_iden.png';
import logout_img from '../assets/images/logout.png';
import overview from '../assets/images/overview.png';
import text_annot from '../assets/images/text_annot.png';
import yale from '../assets/images/Yale.png';
import AnnotationManager from '../components/AnnotationManager';
import Diffdash from '../components/Diffdash';
import LabelManager from '../components/LabelsManager';
import {useAuth}    from '../context/AuthContext';
import Placeholder from '../pages/Placeholder';

const Dashboard = () => {
    // state to keep track of the selected content
    const [selectedContent, setSelectedContent] = useState('Annotation Manager');
    // get the logout function from the AuthContext
    const {logout} = useAuth();
    const nav = useNavigate();
    // content component mapping
    const contentComponet ={
        'AnnotationManager': <AnnotationManager />,
        'Add File': <div>Add File</div>,
        'Logout': <div>Logout</div>,
        'Placeholder': <Placeholder />,
        'Schema': <LabelManager />,
        'Diff' : <Diffdash />

    }

    const content = contentComponet[selectedContent];
    return (
        <>
        <div className='sidebar'>
            <h1><img src={yale}  alt="Yale logo" width="8%"/> Annotation Platform</h1> 
            <div onClick={()=>setSelectedContent('Placeholder')}> <img src={overview} alt="Top Panel Image" width="10%"/> Overview</div>
            <div onClick={()=>setSelectedContent('Placeholder')}> <img src={data_extraction} alt="Top Panel Image" width="10%"/> Data Extraction</div>
            <div onClick={()=>setSelectedContent('Placeholder')}> <img src={de_iden} alt="Top Panel Image" width="12%"/> De-identification</div>
            <div onClick={()=>setSelectedContent('AnnotationManager')}> <img src={text_annot} alt="Top Panel Image" width="12%"/>Annotation Manager</div>  
            <div onClick={()=>setSelectedContent('Schema')}> <img src={text_annot} alt="Top Panel Image" width="12%"/>Schema</div>  
            <div onClick={()=>setSelectedContent('Diff')}> <img src={text_annot} alt="Top Panel Image" width="12%"/>Annotation Diff</div>  
            <div onClick={()=>logout()}> <img src={logout_img} alt="Top Panel Image" width="10%"/> Logout</div>
        </div>
        <main className='main-content'>
            {content}
        </main>
        </>
    );
};

export default Dashboard;