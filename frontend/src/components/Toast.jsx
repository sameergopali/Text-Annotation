import { useState, useEffect } from 'react';

const Toast = ({ 
  message = "Codebook Saved Successfully!", 
  duration = 3000,
  onHide,
  reset  // Add reset function prop
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onHide?.();
        reset?.();  // Call the reset function from the hook
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onHide, reset]);

  if (!isVisible) return null;

  return (
    <div className={`
      fixed bottom-4 right-4 
      bg-green-500 text-white 
      p-4 rounded shadow-lg
      transform transition-all duration-300 ease-in-out
      translate-y-0 opacity-100
    `}>
      {message}
    </div>
  );
};

export default Toast;

