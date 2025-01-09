import AnnotatedText from "./AnnotatedText";
import SnapTextSelect from "./SnapTextSelect";

function AnnotationContent( {text, labels, onTextSelect, onDelete} ){ 
    console.log('creating annotations text');

    return(
        <div className="container" >
            <div className="box select-none">
                <div id='text' ><AnnotatedText text={text} annotations={labels} color="blue" onClick={onDelete} /></div>
            </div>
            <div className="box bg-yellow-100 select-none" >
                <SnapTextSelect text={text} onSelect={onTextSelect} />
            </div>
        </div>
    );
}

export default AnnotationContent;