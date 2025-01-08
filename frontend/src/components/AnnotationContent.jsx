import AnnotatedText from "./AnnotatedText";

function AnnotationContent( {text, labels, onTextSelect, onDelete} ){ 
    console.log('creating annotations text');

    return(
        <div className="container" >
            <div className="box">
                <div id='text' ><AnnotatedText text={text} annotations={labels} color="blue" onClick={onDelete} /></div>
            </div>
            <div className="box bg-yellow-100"  onMouseUp={(e)=>onTextSelect(e)} >
                {text}
            </div>
        </div>
    );
}

export default AnnotationContent;