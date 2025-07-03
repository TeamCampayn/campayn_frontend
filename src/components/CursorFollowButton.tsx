
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
        bg-gradient-to-br from-primary via-accent to-secondary
        hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90
        text-primary-foreground px-4 py-2 rounded-full font-medium text-sm
        shadow-2xl hover:shadow-primary/20
        transform hover:scale-105 active:scale-95
        backdrop-blur-md border border-primary/20
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        ${className}
      `}
      style={{
        left: mousePosition.x + 10, // Small offset to avoid cursor overlap
        top: mousePosition.y - 40,
        transition: 'opacity 0.2s ease-out, transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      {text}
    </button>
  );
};
