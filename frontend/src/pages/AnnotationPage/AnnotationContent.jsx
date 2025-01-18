import AnnotatedText from "../../components/AnnotatedText";
import SnapTextSelect from "../../components/SnapTextSelect";

function AnnotationContent( {text, labels, onTextSelect, onDelete} ){ 

    return(
        <>
        <div className="flex space-x-4 gap-4">
            <div className="flex-1 text-lg text-stone-800 font-sans select-none p-8 bg-slate-200 shadow-md rounded-lg overflow-auto" style={{ width: '640px', height: '500px' }}>
                <AnnotatedText text={text} annotations={labels} color="blue" onClick={(index)=>{onDelete({index})} }/>
            </div>
            <div className="flex-1 text-lg text-stone-600 font-sans bg-yellow-100 select-none p-8 shadow-md rounded-lg overflow-auto" style={{ width: '640px', height: '500px' }}>
                <SnapTextSelect text={text} onSelect={onTextSelect} />
            </div>
        </div>
       

        </>
    );
}

export default AnnotationContent;