import React, { useState, useMemo } from 'react';

// Utility Functions
const exists = (array, obj) => {
  if (!array || !obj) return false;
  return array.some(item => item.start === obj.start && item.end === obj.end && item.user === obj.user);
};

// Color generation functions
const generateColorPalette = (users) => {
  const baseColors = [
    "#93c5fd", "#86efac", "#fbbf24", "#a78bfa", "#fda4af", 
    "#6ee7b7", "#c4b5fd", "#fde047", "#7dd3fc", "#bef264"
  ];
  
  return {
    userColors: Object.fromEntries(
      users.map((user, i) => [user, baseColors[i % baseColors.length]])
    ),
    agreement: "#a78bfa",
    disagreement: "#fca5a5",
    hoverModifier: 0.7
  };
};

const getHoverColor = (color) => {
  // Simple hover darkening logic
  const hex = color.replace('#', '');
  const rgb = parseInt(hex, 16);
  const r = (rgb >> 16) * 0.7;
  const g = ((rgb >> 8) & 0xff) * 0.7;
  const b = (rgb & 0xff) * 0.7;
  return `rgb(${r},${g},${b})`;
};

// HoverableAnnotation Component
const HoverableAnnotation = ({ segment, hoveredLabel, onMouseEnter, onMouseLeave, onClick, filter, colors }) => {
  const isHovered = hoveredLabel && segment.labels.some(label => exists(hoveredLabel, label));

  const getBackgroundColor = () => {
    if (segment.labels.length === 0) return "transparent";
    if (!filter.agreements && segment.agreement) return "transparent";
    if (!filter.disagreements && !segment.agreement) return "transparent";
    if (!filter.disagreements && segment.labels.length === 1) return "transparent";

    if (segment.labels.length > 1) {
      return isHovered 
        ? (segment.agreement ? getHoverColor(colors.agreement) : getHoverColor(colors.disagreement))
        : (segment.agreement ? colors.agreement : colors.disagreement);
    }
    
    const userColor = colors.userColors[segment.labels[0].user];
    return isHovered ? getHoverColor(userColor) : userColor;
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
        top: `${position.y + 40}px`,
      }}
    >
      <div className="font-medium mb-1">
        {hoveredLabel.length > 1 
          ? (hoveredLabel.every(l => 
              l.start === hoveredLabel[0].start && 
              l.end === hoveredLabel[0].end &&
              l.codes.join() === hoveredLabel[0].codes.join()
            ) ? "Perfect Agreement" : "Disagreement")
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
const Legend = ({ users, colors }) => (
  <div className="flex flex-wrap gap-4 text-sm bg-gray-50 p-3 rounded-lg">
    {users.map(user => (
      <div key={user} className="flex items-center gap-2">
        <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.userColors[user] }}></div>
        <span>{user}</span>
      </div>
    ))}
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.agreement }}></div>
      <span>Agreement</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.disagreement }}></div>
      <span>Disagreement</span>
    </div>
  </div>
);

// Main Component
const TextSegment = ({ segments = [], text = '', filter = {}, onClick = () => {} }) => {
  const [hoveredLabel, setHoveredLabel] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Extract unique users from segments
  const users = useMemo(() => {
    const allUsers = new Set();
    segments.forEach(segment => {
      segment.labels.forEach(label => allUsers.add(label.user));
    });
    return Array.from(allUsers);
  }, [segments]);

  // Generate color palette based on users
  const colors = useMemo(() => generateColorPalette(users), [users]);

  const handleMouseMove = (e) => {
    setTooltipPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <p className="text-lg leading-relaxed">
          {segments.map((segment, index) => (
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
              filter={filter}
              colors={colors}
            />
          ))}
        </p>
        <Tooltip hoveredLabel={hoveredLabel} position={tooltipPosition} text={text} />
      </div>
      <Legend users={users} colors={colors} />
    </div>
  );
};

export default TextSegment;