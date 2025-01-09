import AnnotatedText from "./AnnotatedText";
import SnapTextSelect from "./SnapTextSelect";

function DiffContent( {text, label1, label2, onTextSelect} ){ 

   
    return(
        <>
        <div className="flex space-x-4 gap-4">
            <div className="flex-1 text-lg text-stone-700 font-sans select-none p-8 bg-slate-200 shadow-md rounded-lg overflow-auto" style={{ width: '640px', height: '500px' }}>
                <AnnotatedText text={text} annotations={labels} color="blue" onClick={onDelete} />
            </div>
            <div className="flex-1 text-lg text-stone-800 font-sans bg-yellow-100 select-none p-8 shadow-md rounded-lg overflow-auto" style={{ width: '640px', height: '500px' }}>
                <SnapTextSelect text={text} onSelect={onTextSelect} />
            </div>
        </div>
        </>
    );
}

export default DiffContent;