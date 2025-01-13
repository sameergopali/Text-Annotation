import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import data_extraction from '../../assets/images/data_extraction.png';
import de_iden from '../../assets/images/de_iden.png';
import logout_img from '../../assets/images/logout.png';
import overview from '../../assets/images/overview.png';
import text_annot from '../../assets/images/text_annot.png';
import yale from '../../assets/images/Yale.png';
import {useAuth}    from '../../context/AuthContext';
import Import from '../ImportPage/Import';  
import Placeholder from '../Placeholder';
import AnnotationManager from './AnnotationManager';
import Diffdash from './Diffdash';
import LabelManager from './LabelsManager'; 

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
        'Diff' : <Diffdash />,
        'TextAnnotator': <Placeholder/>,
        'Import': <Import />

    }

    const content = contentComponet[selectedContent];
    return (
        <>
        <div className='flex'>
            <div className='w-1/4 h-screen bg-green-700 text-white p-4'>
                <h1 className='text-xl font-bold mb-6 flex items-center'>
                    <img src={yale} alt="Yale logo" className='w-8 h-8 mr-2' /> Annotation Platform
                </h1>
                <div className='space-y-4'>
                    <div className={`flex items-center cursor-pointer hover:bg-green-600 p-2 rounded ${selectedContent === 'Placeholder' ? 'bg-green-600' : ''}`} onClick={() => setSelectedContent('Placeholder')}>
                        <img src={overview} alt="Overview" className='w-6 h-6 mr-2' /> Overview
                    </div>
                    <div className={`flex items-center cursor-pointer hover:bg-green-600 p-2 rounded ${selectedContent === 'TextAnnotator' ? 'bg-green-600' : ''}`} onClick={() => setSelectedContent('TextAnnotator')}>
                        <img src={data_extraction} alt="Data Extraction" className='w-6 h-6 mr-2' /> Data Extraction
                    </div>
                    <div className={`flex items-center cursor-pointer hover:bg-green-600 p-2 rounded ${selectedContent === 'Placeholder' ? 'bg-green-600' : ''}`} onClick={() => setSelectedContent('Placeholder')}>
                        <img src={de_iden} alt="De-identification" className='w-6 h-6 mr-2' /> De-identification
                    </div>
                    <div className={`flex items-center cursor-pointer hover:bg-green-600 p-2 rounded ${selectedContent === 'AnnotationManager' ? 'bg-green-600' : ''}`} onClick={() => setSelectedContent('AnnotationManager')}>
                        <img src={text_annot} alt="Annotation Manager" className='w-6 h-6 mr-2' /> Annotation Manager
                    </div>
                    <div className={`flex items-center cursor-pointer hover:bg-green-600 p-2 rounded ${selectedContent === 'Schema' ? 'bg-green-600' : ''}`} onClick={() => setSelectedContent('Schema')}>
                        <img src={text_annot} alt="Schema" className='w-6 h-6 mr-2' /> Schema
                    </div>
                    <div className={`flex items-center cursor-pointer hover:bg-green-600 p-2 rounded ${selectedContent === 'Diff' ? 'bg-green-600' : ''}`} onClick={() => setSelectedContent('Diff')}>
                        <img src={text_annot} alt="Annotation Diff" className='w-6 h-6 mr-2' /> Annotation Diff
                    </div>
                    <div className={`flex items-center cursor-pointer hover:bg-green-600 p-2 rounded ${selectedContent === 'Diff' ? 'bg-green-600' : ''}`} onClick={() => setSelectedContent('Import')}>
                        <img src={text_annot} alt="Annotation Diff" className='w-6 h-6 mr-2' /> Import File
                    </div>
                    <div className='flex items-center cursor-pointer hover:bg-green-600 p-2 rounded' onClick={() => logout()}>
                        <img src={logout_img} alt="Logout" className='w-6 h-6 mr-2' /> Logout
                    </div>
                </div>
            </div>
            <main className='w-3/4 p-4'>
                {content}
            </main>
        </div>
        </>
    );
};

export default Dashboard;