
import { useEffect, useRef, useState } from 'react';

interface CursorFollowButtonProps {
  text?: string;
  className?: string;
}

export const CursorFollowButton = ({ 
  text = "Join the Waitlist", 
  className = "" 
}: CursorFollowButtonProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Add event listeners to the document
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleClick = () => {
    // For now, just log - later this can be connected to waitlist functionality
    console.log('Join the waitlist clicked!');
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`
        fixed z-50 pointer-events-auto
        bg-gradient-to-r from-blue-600 to-purple-600 
        hover:from-blue-700 hover:to-purple-700
        text-white px-6 py-3 rounded-full font-medium
        shadow-lg hover:shadow-xl
        transition-all duration-200 ease-out
        transform hover:scale-105
        backdrop-blur-sm
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        ${className}
      `}
      style={{
        left: mousePosition.x - 80, // Offset to center the button on cursor
        top: mousePosition.y - 25,
        transition: 'left 0.1s ease-out, top 0.1s ease-out, opacity 0.3s ease-out',
      }}
    >
      {text}
    </button>
  );
};
