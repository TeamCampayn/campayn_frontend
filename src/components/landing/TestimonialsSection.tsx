
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
    name: "Priya Sharma",
    profession: "Marketing Director, BeautyBloom",
    rating: 5,
    description:
      "Campayn transformed our creator marketing strategy. The AI matching connected us with perfect micro-influencers who drove 300% higher engagement than traditional campaigns.",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b9dc17aa?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
  {
    id: "testimonial-2",
    name: "Rahul Mehta",
    profession: "Founder, TechGadgets India",
    rating: 4.5,
    description:
      "The local reach feature helped us tap into Tier 2 cities we never could access before. Our sales increased by 150% in just 3 months using Campayn's creator network.",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
  {
    id: "testimonial-3",
    name: "Anita Desai",
    profession: "Brand Manager, FashionForward",
    rating: 5,
    description:
      "Finally, a platform that understands the Indian market! The ROI tracking and authentic creator partnerships have made our campaigns 5x more effective than agency work.",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
  {
    id: "testimonial-4",
    name: "Vikram Singh",
    profession: "CMO, HealthFirst Nutrition",
    rating: 4.5,
    description:
      "Campayn's trust system and verified creator network gave us confidence in every partnership. Our brand safety improved while reaching 10x more potential customers.",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
]

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 px-8 py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
          Loved by Brands Across India
        </h2>
        <p className="text-xl text-slate-600 leading-relaxed font-medium">
          See how brands are achieving unprecedented success with our creator marketing platform
        </p>
      </div>
      <ContainerScroll className="container h-[300vh]">
        <div className="sticky left-0 top-0 h-svh w-full py-12">
          <CardsContainer className="mx-auto size-full h-[450px] w-[350px]">
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
                <div className="flex flex-col items-center space-y-4 text-center">
                  <ReviewStars
                    className="text-yellow-500"
                    rating={testimonial.rating}
                  />
                  <div className="mx-auto w-4/5 text-lg text-gray-700">
                    <blockquote cite="#">"{testimonial.description}"</blockquote>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar className="!size-12 border-2 border-purple-200">
                    <AvatarImage
                      src={testimonial.avatarUrl}
                      alt={`Portrait of ${testimonial.name}`}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100 text-purple-700 font-semibold">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <span className="block text-lg font-semibold tracking-tight text-gray-900 md:text-xl">
                      {testimonial.name}
                    </span>
                    <span className="block text-sm text-gray-600">
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
