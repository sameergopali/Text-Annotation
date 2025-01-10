import { useState } from 'react';

import AnnotatedText from "./AnnotatedText";
import SnapTextSelect from "./SnapTextSelect";

function AnnotationContent( {text, labels, onTextSelect, onDelete} ){ 

    const [deleteOpen, setdeleteOpen] = useState(false);
    const [index, setIndex] = useState(null);

    const OpenDelete = () => {
        return (
            <>
            <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'></div>
            <div id='dialog' className='bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full relative'>
                <h3 className='text-2xl font-semibold mb-4 text-center'>Delete Annotation</h3>
                <div className='flex justify-end space-x-4'>
                <button onClick={() => {setIndex(null); setdeleteOpen(false)}} className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'>Close</button>
                <button onClick={() => { onDelete(index); setIndex(null); setdeleteOpen(false) }} className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'>OK</button>
                </div>
            </div>
            </>
        )
    };
    console.log('creating annotations text');

    return(
        <>
        <div className="flex space-x-4 gap-4">
            <div className="flex-1 text-lg text-stone-800 font-sans select-none p-8 bg-slate-200 shadow-md rounded-lg overflow-auto" style={{ width: '640px', height: '500px' }}>
                <AnnotatedText text={text} annotations={labels} color="blue" onClick={(index)=>{setIndex(index);setdeleteOpen(true)}} />
            </div>
            <div className="flex-1 text-lg text-stone-600 font-sans bg-yellow-100 select-none p-8 shadow-md rounded-lg overflow-auto" style={{ width: '640px', height: '500px' }}>
                <SnapTextSelect text={text} onSelect={onTextSelect} />
            </div>
        </div>

        {deleteOpen && <OpenDelete />}
        </>
    );
}

export default AnnotationContent;