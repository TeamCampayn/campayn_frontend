
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
        bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
        hover:from-blue-700 hover:via-purple-700 hover:to-pink-700
        text-white px-6 py-3 rounded-full font-semibold text-sm
        shadow-lg hover:shadow-xl hover:shadow-purple-500/25
        transform hover:scale-105 active:scale-95
        border border-white/20 backdrop-blur-sm
        transition-all duration-200 ease-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        ${className}
      `}
      style={{
        left: mousePosition.x - 10, // Close to cursor for easy clicking
        top: mousePosition.y - 50,
        transition: 'opacity 0.2s ease-out',
      }}
    >
      {text}
    </button>
  );
};
