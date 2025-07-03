
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
      if (isHovered) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isHovered]);

  return (
    <div
      className={`relative w-60 h-96 rounded-xl shadow-lg overflow-hidden bg-white transition-transform duration-300 flex-shrink-0 ${
        isHovered ? 'scale-105' : ''
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
        playsInline
        preload="metadata"
      >
        <source src={card.videoUrl} type="video/mp4" />
      </video>
      
      {/* Category Label */}
      <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium">
        {card.category}
      </div>
      
      {/* Brand Logo */}
      <div className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full p-1 shadow-md">
        <img
          src={card.brandLogoUrl}
          alt="Brand Logo"
          className="w-full h-full object-contain"
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
  
  // Duplicate the data for seamless loop
  const duplicatedData = [...videoData, ...videoData];

  return (
    <div className="py-16 bg-gradient-to-b from-purple-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Creator Content in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how creators bring brands to life with authentic, engaging content across different categories
          </p>
        </div>
        
        <div className="relative">
          {/* Gradient masks for smooth fade effect */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
          
          <div className="overflow-hidden">
            <div
              className={`flex gap-4 ${isPaused ? '' : 'animate-infinite-scroll'}`}
              style={{
                width: `${duplicatedData.length * 256}px`, // 256px = 240px width + 16px gap
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
  );
};
