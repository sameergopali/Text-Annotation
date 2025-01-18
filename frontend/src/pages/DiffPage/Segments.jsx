import React, { useState } from 'react';


// Utility Functions
const exists = (array, obj) => {
  if (!array || !obj) return false;
  return array.some(item => item.start === obj.start && item.end === obj.end && item.user === obj.user);
};


const colorPalette = {
  single: {
    sameer: "rgb(147, 197, 253)", // blue-300
    srivani: "rgb(134, 239, 172)", // green-300
  },
  agreement: "rgb(167, 139, 250)", // purple-300
  disagreement: "rgb(252, 165, 165)", // red-300
  hover: {
    sameer: "rgb(59, 130, 246)", // blue-500
    srivani: "rgb(34, 197, 94)", // green-500
    agreement: "rgb(147, 51, 234)", // purple-500
    disagreement: "rgb(239, 68, 68)", // red-500
  }
};

// HoverableAnnotation Component
const HoverableAnnotation = ({ segment, hoveredLabel, onMouseEnter, onMouseLeave, onClick, filter }) => {
  const isHovered = hoveredLabel && segment.labels.some(label => exists(hoveredLabel, label));

  const getBackgroundColor = () => {
    if (segment.labels.length === 0) return "transparent";
    if (!filter.agreements && segment.agreement) return "transparent";
    if (!filter.disagreements &&  !segment.agreement) return "transparent";
    if (!filter.disagreements &&  segment.labels.length == 1) return "transparent";


    if (segment.labels.length > 1) {
      return isHovered 
        ? (segment.agreement ? colorPalette.hover.agreement : colorPalette.hover.disagreement)
        : (segment.agreement ? colorPalette.agreement : colorPalette.disagreement);
    }
    return isHovered ? colorPalette.hover[segment.labels[0].user] : colorPalette.hover[segment.labels[0].user];
  };

  return (
    <span
      className="relative group cursor-pointer"
      onMouseEnter={(e) => onMouseEnter(segment.labels, e)}
      onMouseLeave={onMouseLeave}
      onClick={() => onClick(segment.labels)}
    >
      <span className={`relative z-10 ${isHovered ? 'font-medium' : ''}`}>
        {segment.text}
      </span>
      {segment.labels.length > 0 && (
        <span
          className={`absolute inset-0 transition-all duration-200 ease-in-out
            ${isHovered ? 'opacity-50' : 'opacity-30'}`}
          style={{
            backgroundColor: getBackgroundColor(),
            transform: isHovered ? 'scaleY(1.2)' : 'scaleY(1)',
            transformOrigin: 'center'
          }}
        />
      )}
    </span>
  );
};

// Tooltip Component
const Tooltip = ({ hoveredLabel, position, text }) => {
  if (!hoveredLabel) return null;

return (
    <div
        className="fixed bg-white px-3 py-2 rounded-lg shadow-lg border text-sm z-50 pointer-events-none"
        style={{
            left: `${position.x + 10}px`,
            top: `${position.y - 40}px`,
        }}
    >
        <div className="font-medium mb-1">
            {hoveredLabel.length > 1 
                ? (hoveredLabel[0].start === hoveredLabel[1].start && 
                    hoveredLabel[0].end === hoveredLabel[1].end &&
                    hoveredLabel[0].codes.join() === hoveredLabel[1].codes.join()
                        ? "Perfect Agreement"
                        : "Disagreement")
                : `Annotator: ${hoveredLabel[0].user}`
            }
        </div>
        <div className="text-gray-600">
            {hoveredLabel.map((label, index) => (
                <div key={index}>
                    <strong>Annotator:</strong> {label.user}<br />
                    <strong>Text:</strong> {text.slice(label.start, label.end)}<br />
                    <strong>Label:</strong> {label.codes.join(" :: ")}
                </div>
            ))}
        </div>
    </div>
);
};

// Legend Component
const Legend = () => (
  <div className="flex flex-wrap gap-4 text-sm bg-gray-50 p-3 rounded-lg">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded" style={{ backgroundColor: colorPalette.single.sameer }}></div>
      <span>Annotator 1</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded" style={{ backgroundColor: colorPalette.single.srivani }}></div>
      <span>Annotator 2</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded" style={{ backgroundColor: colorPalette.agreement }}></div>
      <span>Agreement</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded" style={{ backgroundColor: colorPalette.disagreement }}></div>
      <span>Disagreement</span>
    </div>
  </div>
);

// MergedAnnotation Component
const TextSegment = ({ segments = [], text='', filter={}, onClick = () => {} }) => {
  const [hoveredLabel, setHoveredLabel] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setTooltipPosition({
      x: e.clientX + 100,
      y: e.clientY + 100,
    });
  };

  const renderAnnotatedText = (segments) => {
    return (
      segments.map((segment, index) => 
      <HoverableAnnotation
        key={index}
        segment={segment}
        hoveredLabel={hoveredLabel}
        onMouseEnter={(labels, e) => {
          setHoveredLabel(labels.length > 0 ? labels : null);
          handleMouseMove(e);
        }}
        onMouseLeave={() => setHoveredLabel(null)}
        onClick={onClick}
        filter= {filter}
      />
      
    )
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <p className="text-lg leading-relaxed">{renderAnnotatedText(segments, filter)}</p>
        <Tooltip hoveredLabel={hoveredLabel} position={tooltipPosition} text={text} />
      </div>
      <Legend />
    </div>
  );
};

export default TextSegment;
