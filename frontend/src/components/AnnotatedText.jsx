function AnnotatedText({ text, annotations, color = 'blue', onClick }) {

    

    // Function to process text into annotated parts
    console.log('annotations text', annotations);
    const renderAnnotatedText = () => {
        if (!annotations || annotations.length === 0 || !text) {
            return <span>{text}</span>;
        }

        const annotatedParts = [];
        let lastIndex = 0;

        annotations.forEach(({ start, end, codes }, index) => {
            // Add unannotated text before the current annotation
            if (lastIndex < start) {
            annotatedParts.push(
                <span key={`text-${lastIndex}-${start}`}>
                {text.slice(lastIndex, start)}
                </span>
            );
            }

            // Add the annotated part
            annotatedParts.push(
            <span
                key={`annotation-${index}`}
                className={`bg-${color}-200 text-${color}-800 px-1 rounded cursor-pointer border border-${color}-400 hover:font-bold transition duration-300 ease-in-out`}
                id={`annotation-${index}`}
                onClick={() => onClick(index)}
            >
                {text.slice(start, end)}
            </span>
            );

            // Add the annotation label
            annotatedParts.push(
            <span
                key={`label-${index}`}
                className="ml-2 text-xs font-semibold text-white bg-teal-500 px-2 py-1 rounded-full border border-teal-500 shadow-md"
            >
                {codes.join(" :: ")}
            </span>
            );

            lastIndex = end;
        });

        // Add any remaining unannotated text
        if (lastIndex < text.length) {
            annotatedParts.push(
            <span key={`text-${lastIndex}-end`}>
                {text.slice(lastIndex)}
            </span>
            );
        }
        console.log(annotatedParts);
        return annotatedParts;
    };

    return <>{renderAnnotatedText()}</>;
}

export default AnnotatedText;