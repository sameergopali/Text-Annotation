function AnnotatedText({ text, annotations, color, onClick }) {
    // Function to process text into annotated parts
    console.log('annotations text', annotations);
    const renderAnnotatedText = () => {
        if (!annotations || annotations.length === 0) {
            return <span>{text}</span>;
        }

        const annotatedParts = [];
        let lastIndex = 0;

        annotations.forEach(({ start, end, id, codes }) => {
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
                    key={id}
                    className={`highlight ${color}`}
                    id={id}
                    onClick={() => onClick(id)}
                >
                    {text.slice(start, end)}
                </span>
            );

            // Add the annotation label
            annotatedParts.push(
                <span
                    key={`label-${id}`}
                    className="span-label"
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

        return annotatedParts;
    };

    return <>{renderAnnotatedText()}</>;
}

export default AnnotatedText;