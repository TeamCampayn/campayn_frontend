
import { useEffect, useRef, useState } from 'react';
import { LiquidButton } from './ui/liquid-glass-button';

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
    // Scroll to waitlist section
    const waitlistSection = document.getElementById('waitlist-section');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <LiquidButton
      ref={buttonRef}
      onClick={handleClick}
      className={`
        fixed z-50 pointer-events-auto
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
    </LiquidButton>
  );
};
