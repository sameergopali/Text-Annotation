import React from "react";

function Card({ 
  title, 
  children, 
  footer, 
  className = "", 
  headerClassName = "", 
  bodyClassName = "", 
  footerClassName = "" 
}) {
  return (
    <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>
      {/* Header Section */}
      {title && (
        <div className={`p-2 border-b bg-gray-100 font-semibold text-md ${headerClassName}`}>
          {title}
        </div>
      )}

      {/* Body Section */}
      <div className={`p-4 ${bodyClassName}`}>
        {children}
      </div>

      {/* Footer Section */}
      {footer && (
        <div className={`p-4 border-t bg-gray-100 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
