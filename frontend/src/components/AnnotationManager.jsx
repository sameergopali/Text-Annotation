import {useState} from 'react';
import { useNavigate } from "react-router-dom";

const AnnotationManager = () => {
    const [finalized, setfinalized ]= useState(false);
    const [draft, setDraft] = useState(false);
    const navigate = useNavigate();
   
    const openAnnotationTool = () => {
        navigate('/annotViewer', {state: {finalized: finalized, draft: draft}});
    };
    return (
        <div className='main-content'>
            <form>
                <label>
                    <input type="checkbox" onChange={(e) => setfinalized(e.target.checked)} />
                    Include Finalized Annotations
                </label>
                <label>
                    <input type="checkbox" onChange={(e) => setDraft(e.target.checked)} />
                    Include Draft Annotations
                </label>
                <button type="button" onClick={openAnnotationTool}>Open Annotation tool</button>
            </form>
        </div>
    );
};

export default AnnotationManager;