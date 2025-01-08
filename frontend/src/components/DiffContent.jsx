import AnnotatedText from "./AnnotatedText";

function DiffContent( {text, label1, label2, onTextSelect} ){ 

    return(
        <>
        <div className="container" >
            <div className="box"  onMouseUp={(e)=>onTextSelect(e)} >
                {text}
            </div>
            <div className="box">
                <div id='text' ><AnnotatedText text={text} annotations={label1} color="blue" /></div>
            </div>
        </div>
        <div className="container" >
        <div className="box">
            <div id='labels1' ><AnnotatedText text={text} annotations={label1}  color="green" /></div>
        </div>
        <div className="box">
            <div id='label2' ><AnnotatedText text={text} annotations={label2} color="red" /></div>
        </div>
        </div>
        </>
    );
}

export default DiffContent;