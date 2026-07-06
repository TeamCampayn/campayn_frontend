import React, { useEffect, useRef, useState } from 'react';

interface VideoCard {
  id: string;
  videoUrl: string;
  posterUrl: string;
  category: string;
  brandLogoUrl: string;
}

const videoData: VideoCard[] = [
  {
    id: '1',
    videoUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/shortenedVideos/vibha_2s.mp4',
    posterUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/extractedFrames/vibha_frame.png',
    category: 'GRWM',
    brandLogoUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyAssets/conceptBrands+2/Kawaii-Kart-Logo.png'
  },
  {
    id: '2',
    videoUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/shortenedVideos/mayankIngle_2s.mp4',
    posterUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/extractedFrames/mayankIngle_frame.png',
    category: 'Product Review',
    brandLogoUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyAssets/conceptBrands+2/GrunX.png'
  },
  {
    id: '3',
    videoUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/shortenedVideos/ankerTalwar_2s.mp4',
    posterUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/extractedFrames/ankerTalwar_frame.png',
    category: 'Personalized Dining',
    brandLogoUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyAssets/conceptBrands+2/moozvodka.png'
  },
  {
    id: '4',
    videoUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/shortenedVideos/palakAdhikaari_2s.mp4',
    posterUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/extractedFrames/palakAdhikaari_frame.png',
    category: 'Product Review',
    brandLogoUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyAssets/conceptBrands+2/kusvaa.png'
  },
  {
    id: '5',
    videoUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/shortenedVideos/shefaliThapa_2s.mp4',
    posterUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/extractedFrames/shefaliThapa_frame.png',
    category: 'Styling',
    brandLogoUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyAssets/conceptBrands+2/ph.png'
  },
  {
    id: '6',
    videoUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/shortenedVideos/monikaMorwani_2s.mp4',
    posterUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/extractedFrames/monikaMorwani_frame.png',
    category: 'Best Home Hacks',
    brandLogoUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyAssets/conceptBrands+2/Purebreath.png'
  },
  {
    id: '7',
    videoUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/shortenedVideos/adnanKazi_2s.mp4',
    posterUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/extractedFrames/adnanKazi_frame.png',
    category: 'My Go To Product',
    brandLogoUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyAssets/conceptBrands+2/alomos.png'
  },
  {
    id: '8',
    videoUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/shortenedVideos/snigdhaRavi_2s.mp4',
    posterUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/extractedFrames/snigdhaRavi_frame.png',
    category: 'Product Review',
    brandLogoUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyAssets/conceptBrands+2/Alchemlifelogo.png'
  },
  {
    id: '9',
    videoUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/shortenedVideos/geetaBungla_2s.mp4',
    posterUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/extractedFrames/geetaBungla_frame.png',
    category: 'Aesthetics',
    brandLogoUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyAssets/conceptBrands+2/whitemoss.png'
  },
  {
    id: '10',
    videoUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/shortenedVideos/pritaDeka_2s.mp4',
    posterUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/extractedFrames/pritaDeka_frame.png',
    category: 'Cooking',
    brandLogoUrl: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyAssets/conceptBrands+2/themasalaboxx.png'
  }
];

interface VideoCardComponentProps {
  card: VideoCard;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const VideoCardComponent: React.FC<VideoCardComponentProps> = ({ card, isHovered, onHover, onLeave }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Handle autoplay restrictions gracefully
      });
    }
  }, []);

  return (
    <div
      className={`relative w-48 sm:w-60 h-72 sm:h-96 rounded-2xl shadow-md overflow-hidden bg-card transition-transform duration-300 flex-shrink-0 border border-foreground/10 ${
        isHovered ? 'scale-105 border-foreground/30 shadow-lg' : ''
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={card.posterUrl}
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
      >
        <source src={card.videoUrl} type="video/mp4" />
      </video>
      
      {/* Category Label */}
      <div className="absolute top-3 left-3 bg-ink/75 text-ink-foreground px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm font-space">
        {card.category}
      </div>
      
      {/* Brand Logo */}
      <div className="absolute bottom-3 left-3 w-20 h-20 p-1">
        <img
          src={card.brandLogoUrl}
          alt="Brand Logo"
          className="w-full h-full object-contain drop-shadow-lg"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
};

export const VideoCarousel: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  const duplicatedData = [...videoData, ...videoData];

  return (
    <section className="px-3 py-4 md:px-4">
      <div className="grain rounded-[2rem] bg-panel py-14 md:py-20 overflow-hidden">
        <div className="w-full">
          <div className="text-center mb-10 sm:mb-16 px-4">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground mb-4">
              Creator Content in Action
            </h2>
            <p className="text-base sm:text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              See how creators bring brands to life with authentic, engaging content across different categories
            </p>
          </div>
          
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className={`flex gap-6 ${isPaused ? 'animate-infinite-scroll-paused' : 'animate-infinite-scroll'}`}
                style={{
                  width: `${duplicatedData.length * 264}px`, // 264px = 240px width + 24px gap
                }}
              >
                {duplicatedData.map((card, index) => (
                  <VideoCardComponent
                    key={`${card.id}-${index}`}
                    card={card}
                    isHovered={hoveredCard === `${card.id}-${index}`}
                    onHover={() => {
                      setHoveredCard(`${card.id}-${index}`);
                      setIsPaused(true);
                    }}
                    onLeave={() => {
                      setHoveredCard(null);
                      setIsPaused(false);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
