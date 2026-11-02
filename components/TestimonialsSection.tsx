'use client';

import Slider from 'react-slick';
import Image from 'next/image';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    quote: "Bite Me is absolutely intoxicating. The scent is seductive yet elegant - perfect for evening occasions. It lasts all night and makes me feel incredibly confident.",
    image: '/users/parul.avif',
    rating: 5,
    perfume: 'Bite Me',
    location: 'Mumbai'
  },
  {
    name: 'Arjun Khanna',
    quote: "Dark Knight has become my signature scent. It's bold, masculine, and mysterious. My colleagues always ask what fragrance I'm wearing.",
    image: '/users/anil-tyagi.jpeg',
    rating: 5,
    perfume: 'Dark Knight',
    location: 'Delhi'
  },
  {
    name: 'Kavya Patel',
    quote: "Midnight Desire is pure elegance in a bottle. The fragrance is sophisticated and alluring. I feel more confident and captivating when I wear it.",
    image: '/users/savita.webp',
    rating: 5,
    perfume: 'Midnight Desire',
    location: 'Bangalore'
  },
  {
    name: 'Rohit Singh',
    quote: "Lusty Nights is incredible. The blend of spicy and woody notes is perfect. Great longevity and projection.",
    image: '/users/ankit.jpeg',
    rating: 5,
    perfume: 'Lusty Nights',
    location: 'Pune'
  }
];

const TestimonialsCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    cssEase: 'ease-in-out',
    dotsClass: 'slick-dots custom-dots',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex justify-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < rating ? 'text-gray-900 fill-gray-900' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4 tracking-wide">
            Customer Reviews
          </h2>
          <div className="w-16 h-px bg-gray-300 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm font-light max-w-2xl mx-auto">
            Discover why customers choose our fragrances
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="testimonials-slider">
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="px-3">
                <div className="bg-white border border-gray-200 p-8 min-h-[380px] flex flex-col hover:shadow-md transition-shadow duration-300">
                  
                  {/* Profile Section */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gray-200 mb-4 overflow-hidden">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    
                    <h3 className="text-gray-900 font-light text-base mb-1">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-500 text-xs mb-2 font-light">
                      {testimonial.location}
                    </p>
                    <div className="text-gray-600 text-xs font-light tracking-wide">
                      {testimonial.perfume}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="mb-6">
                    <StarRating rating={testimonial.rating} />
                  </div>

                  {/* Quote */}
                  <blockquote className="text-gray-700 text-sm leading-relaxed flex-1 font-light text-center">
                    {testimonial.quote}
                  </blockquote>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 border border-gray-200 px-8 py-4">
            <div className="flex -space-x-2">
              {testimonials.slice(0, 3).map((testimonial, index) => (
                <Image
                  key={index}
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <div className="text-left">
              <p className="text-gray-900 font-light text-sm">
                Join 5,000+ satisfied customers
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .testimonials-slider .custom-dots {
          bottom: -60px;
          display: flex !important;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }
        .testimonials-slider .custom-dots li {
          margin: 0;
          width: auto;
          height: auto;
        }
        .testimonials-slider .custom-dots li button {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #d1d5db;
          border: none;
          transition: all 0.3s ease;
          padding: 0;
        }
        .testimonials-slider .custom-dots li button:before {
          display: none;
        }
        .testimonials-slider .custom-dots li.slick-active button {
          background: #111827;
          width: 24px;
          border-radius: 5px;
        }
        .testimonials-slider .custom-dots li button:hover {
          background: #6b7280;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsCarousel;
