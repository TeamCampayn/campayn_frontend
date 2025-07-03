
import { useEffect, useRef, useState } from 'react';

interface CursorFollowButtonProps {
  text?: string;
  className?: string;
  containerRef?: React.RefObject<HTMLElement>;
}

export const CursorFollowButton = ({ 
  text = "Join the Waitlist", 
  className = "",
  containerRef
}: CursorFollowButtonProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const container = containerRef?.current || document;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Only track if mouse is within the container and below navbar (assuming navbar is ~80px)
        if (e.clientX >= rect.left && e.clientX <= rect.right && 
            e.clientY >= Math.max(rect.top, 80) && e.clientY <= rect.bottom) {
          setMousePosition({ x: e.clientX, y: e.clientY });
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else {
        setMousePosition({ x: e.clientX, y: e.clientY });
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Add event listeners
    container.addEventListener('mousemove', handleMouseMove);
    if (containerRef?.current) {
      containerRef.current.addEventListener('mouseleave', handleMouseLeave);
    } else {
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      if (containerRef?.current) {
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
      } else {
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [containerRef]);

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
        left: mousePosition.x - 75, // Center cursor on button (button width ~150px)
        top: mousePosition.y - 25, // Center cursor vertically (button height ~50px)
        transition: 'opacity 0.2s ease-out',
      }}
    >
      {text}
    </button>
  );
};
