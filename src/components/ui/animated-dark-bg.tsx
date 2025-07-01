
'use client';

import React, { useRef, useId, useEffect, CSSProperties } from 'react';
import { animate, useMotionValue, AnimationPlaybackControls } from 'framer-motion';

interface AnimatedDarkBgProps {
  className?: string;
  style?: CSSProperties;
}

function mapRange(
  value: number,
  fromLow: number,
  fromHigh: number,
  toLow: number,
  toHigh: number
): number {
  if (fromLow === fromHigh) {
    return toLow;
  }
  const percentage = (value - fromLow) / (fromHigh - fromLow);
  return toLow + percentage * (toHigh - toLow);
}

const useInstanceId = (): string => {
  const id = useId();
  const cleanId = id.replace(/:/g, "");
  const instanceId = `darkbg-${cleanId}`;
  return instanceId;
};

export function AnimatedDarkBg({
  className,
  style
}: AnimatedDarkBgProps) {
  const id = useInstanceId();
  const feColorMatrixRef = useRef<SVGFEColorMatrixElement>(null);
  const hueRotateMotionValue = useMotionValue(0);
  const hueRotateAnimation = useRef<AnimationPlaybackControls | null>(null);

  const displacementScale = 80;
  const animationDuration = 150;

  useEffect(() => {
    if (feColorMatrixRef.current) {
      if (hueRotateAnimation.current) {
        hueRotateAnimation.current.stop();
      }
      hueRotateMotionValue.set(0);
      hueRotateAnimation.current = animate(hueRotateMotionValue, 360, {
        duration: animationDuration / 25,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        ease: "linear",
        delay: 0,
        onUpdate: (value: number) => {
          if (feColorMatrixRef.current) {
            feColorMatrixRef.current.setAttribute("values", String(value));
          }
        }
      });

      return () => {
        if (hueRotateAnimation.current) {
          hueRotateAnimation.current.stop();
        }
      };
    }
  }, [animationDuration, hueRotateMotionValue]);

  return (
    <div
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        zIndex: -1,
        ...style
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -displacementScale,
          filter: `url(#${id}) blur(2px)`,
          background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)"
        }}
      >
        <svg style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <filter id={id}>
              <feTurbulence
                result="undulation"
                numOctaves="3"
                baseFrequency="0.0008,0.003"
                seed="2"
                type="turbulence"
              />
              <feColorMatrix
                ref={feColorMatrixRef}
                in="undulation"
                type="hueRotate"
                values="0"
              />
              <feColorMatrix
                in="dist"
                result="circulation"
                type="matrix"
                values="3 0 0 0 0.8  2 0 0 0 0.9  4 0 0 0 1.2  1 0 0 0 0"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="circulation"
                scale={displacementScale}
                result="dist"
              />
              <feDisplacementMap
                in="dist"
                in2="undulation"
                scale={displacementScale}
                result="output"
              />
            </filter>
          </defs>
        </svg>
        <div
          style={{
            background: "radial-gradient(circle at 20% 30%, rgba(88, 28, 135, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)",
            width: "100%",
            height: "100%",
            animation: "pulse 8s ease-in-out infinite alternate"
          }}
        />
      </div>

      {/* Animated noise overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
          opacity: 0.15,
          mixBlendMode: "multiply"
        }}
      />

      {/* Floating particles */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.1), transparent), radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.05), transparent), radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.08), transparent), radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.06), transparent), radial-gradient(2px 2px at 160px 30px, rgba(255,255,255,0.07), transparent)",
          backgroundSize: "200px 200px",
          animation: "float 20s ease-in-out infinite"
        }}
      />
    </div>
  );
}
