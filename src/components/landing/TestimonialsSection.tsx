
"use client"

import * as React from "react"
import {
  CardTransformed,
  CardsContainer,
  ContainerScroll,
  ReviewStars,
} from "../ui/animated-cards-stack"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

const TESTIMONIALS = [
  {
    id: "testimonial-1",
    name: "Manasi Sawant",
    profession: "CMO, Wow Skin Science",
    rating: 5,
    description:
      "Campayn transformed our creator marketing strategy. The AI matching connected us with perfect micro-influencers who drove 300% higher engagement than traditional campaigns.",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b9dc17aa?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
    companyLogo: "/company-logos/wow-skin-science.png",
  },
  {
    id: "testimonial-2",
    name: "Harsh Jha",
    profession: "Co-Founder, Flabs",
    rating: 4.5,
    description:
      "The local reach feature helped us tap into Tier 2 cities we never could access before. Our sales increased by 150% in just 3 months using Campayn's creator network.",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
    companyLogo: "/company-logos/flabs.png",
  },
  {
    id: "testimonial-3",
    name: "Shivendra Sharma",
    profession: "Founder, JASTRO",
    rating: 5,
    description:
      "Finally, a platform that understands the Indian market! The ROI tracking and authentic creator partnerships have made our campaigns 5x more effective than agency work.",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
    companyLogo: "/company-logos/jastro.png",
  },
  {
    id: "testimonial-4",
    name: "Vinaya T",
    profession: "Founder, Glodemi",
    rating: 4.5,
    description:
      "Campayn's trust system and verified creator network gave us confidence in every partnership. Our brand safety improved while reaching 10x more potential customers.",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
    companyLogo: "/company-logos/glodemi.png",
  },
]

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 px-4 sm:px-8 py-8 sm:py-12">
      <ContainerScroll className="container h-[200vh]">
        <div className="sticky left-0 top-0 h-screen w-full flex flex-col items-center justify-center py-4 sm:py-8">
          {/* Heading inside sticky container */}
          <div className="max-w-4xl mx-auto text-center mb-4 sm:mb-6 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-4">
              Loved by Brands Across India
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-medium">
              See how brands are achieving unprecedented success with our creator marketing platform
            </p>
          </div>
          
          {/* Cards */}
          <CardsContainer className="mx-auto h-[350px] sm:h-[400px] md:h-[420px] w-[280px] sm:w-[320px] md:w-[350px]">
            {TESTIMONIALS.map((testimonial, index) => (
              <CardTransformed
                arrayLength={TESTIMONIALS.length}
                key={testimonial.id}
                variant="light"
                index={index + 2}
                role="article"
                aria-labelledby={`card-${testimonial.id}-title`}
                aria-describedby={`card-${testimonial.id}-content`}
              >
                <div className="flex flex-col items-center space-y-3 sm:space-y-4 text-center">
                  <ReviewStars
                    className="text-yellow-500"
                    rating={testimonial.rating}
                  />
                  <div className="mx-auto w-[90%] sm:w-4/5 text-sm sm:text-base md:text-lg text-gray-700">
                    <blockquote cite="#">"{testimonial.description}"</blockquote>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center bg-white rounded-lg border border-gray-200 p-1">
                    <img
                      src={testimonial.companyLogo}
                      alt={`${testimonial.profession.split(', ')[1]} logo`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm sm:text-base md:text-lg font-semibold tracking-tight text-gray-900">
                      {testimonial.name}
                    </span>
                    <span className="block text-xs sm:text-sm text-gray-600">
                      {testimonial.profession}
                    </span>
                  </div>
                </div>
              </CardTransformed>
            ))}
          </CardsContainer>
        </div>
      </ContainerScroll>
    </section>
  )
}
