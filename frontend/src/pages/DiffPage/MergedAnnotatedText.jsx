import React, { useState } from "react";

function MergedAnnotation({text, labels, onClick}) {
  const [hoveredLabel, setHoveredLabel] = useState(null);
  const exists =(array,obj) => array.some(item => JSON.stringify(item) === JSON.stringify(obj));

  const userColors = new Map();
  const colorPalette = [
    "green",  // Green
    "blue",  // Blue
];
  const parsedLabels = Object.entries(labels).flatMap(([user, userLabels]) => {
    // Assign a color to the user if not already assigned
    if (!userColors.has(user)) {
      const color = colorPalette[userColors.size % colorPalette.length];
      userColors.set(user, color);
    }
    const userColor = userColors.get(user);
  
    // Map labels with user and color
    return userLabels.map((label) => ({ ...label, user, color: userColor }));
  });


  function renderAnnotatedText(text, labels) {
    // 1. Create events for label starts and ends
    const events = [];
    labels.forEach((label) => {
      events.push({ pos: label.start, type: "start", label });
      events.push({ pos: label.end, type: "end", label });
    });

    // 2. Sort events
    events.sort((a, b) => {
      if (a.pos !== b.pos) return a.pos - b.pos;
      return a.type === "end" ? -1 : 1;
    });

    // 3. Create segments
    const segments = [];
    let activeLabels = [];
    let lastPos = 0;

    events.forEach((event) => {
      if (event.pos > lastPos) {
        segments.push({
          text: text.slice(lastPos, event.pos),
          labels: [...activeLabels],
        });
      }

      if (event.type === "start") {
        activeLabels.push(event.label);
      } else {
        activeLabels = activeLabels.filter((l) => l !== event.label);
      }
      lastPos = event.pos;
    });

    if (lastPos < text.length) {
      segments.push({
        text: text.slice(lastPos),
        labels: [...activeLabels],
      });
    }
    
    console.log(segments);
    // 4. Render segments with hover effects
    return segments.map((segment, index) => (
      <span
        key={index}
        className="relative"
        onMouseEnter={() =>
            {console.log('hovered label', segment.labels);
          setHoveredLabel(segment.labels.length > 0 ? segment.labels : null)}
        }
        onMouseLeave={() => setHoveredLabel(null)}
        onClick={() =>  onClick(segment.labels)}
      >
        {/* Base text */}
        <span
          className= "relative z-10 "
        >
          {segment.text}
        </span>

        {/* Stacked highlights with blend modes */}
        {segment.labels.map((label, labelIndex) => 
        {
            return (
            <span
            key={labelIndex}
            className="absolute inset-0 opacity-30 transition-all duration-300 ease-in-out"
            style={{
              zIndex: labelIndex + 1,
              backgroundColor:
              hoveredLabel && exists(hoveredLabel, label) ? "red" : label.color,
              height: hoveredLabel && exists(hoveredLabel, label) ? "120%" : "100%",
            }}
            >
            </span>
            )}
        )}
      </span>
    ));
  }

  return <p>{renderAnnotatedText(text, parsedLabels)}</p>;
}

export default MergedAnnotation;
