import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Shield, Award, Zap, RefreshCw, Headphones, Cable, Star, CheckCircle
} from 'lucide-react';

type Feature = {
  icon: React.ReactNode;
  title: string;
  desc: string;
};

type FeatureCardProps = {
  item: Feature;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
};

const FeatureCard = ({ item, isHovered, onHover, onLeave }: FeatureCardProps) => (
  <div 
    className={`group bg-white rounded-sm p-8 transition-all duration-300 cursor-pointer border ${
      isHovered ? 'border-black shadow-lg' : 'border-gray-100 hover:border-gray-300'
    }`}
    onMouseEnter={onHover}
    onMouseLeave={onLeave}
  >
    <div className="mb-6 flex justify-center">
      <div className={`p-3 border transition-all duration-300 ${
        isHovered ? 'border-black bg-black' : 'border-gray-200 bg-white'
      }`}>
        <div className={`transition-colors duration-300 ${isHovered ? '[&_svg]:text-white' : ''}`}>
          {item.icon}
        </div>
      </div>
    </div>
    <h3 className="text-base font-medium text-gray-900 mb-3 text-center tracking-wide uppercase text-xs">
      {item.title}
    </h3>
    <p className="text-xs text-gray-600 text-center leading-relaxed font-light">
      {item.desc}
    </p>
  </div>
);

export default function AboutUsSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const features: Feature[] = [
    {
      icon: <Shield className="text-gray-700 w-6 h-6" />,
      title: 'Stylish Mobile Covers',
      desc: 'Protect your device in style with cases that match your mood—sleek, rugged, quirky, or classic.',
    },
    {
      icon: <Zap className="text-gray-700 w-6 h-6" />,
      title: 'Fast Chargers & Cables',
      desc: 'Whether you\'re always on the move or need a speedy charge at home, we\'ve got you covered.',
    },
    {
      icon: <Cable className="text-gray-700 w-6 h-6" />,
      title: 'Innovative Charger Covers',
      desc: 'Spruce up your space and keep your chargers safe with our fun, functional charger covers.',
    },
    {
      icon: <Headphones className="text-gray-700 w-6 h-6" />,
      title: 'Crisp Sound Headphones',
      desc: 'Music, calls, gaming—we bring immersive audio right to your ears.',
    }
  ];

  const values: Feature[] = [
    {
      icon: <Star className="text-gray-700 w-6 h-6" />,
      title: 'Latest Arrivals',
      desc: 'We track tech trends so you always get the freshest styles and best innovations.',
    },
    {
      icon: <Award className="text-gray-700 w-6 h-6" />,
      title: 'Customer First',
      desc: 'Got a question or a special request? Our friendly team is always listening.',
    },
    {
      icon: <Zap className="text-gray-700 w-6 h-6" />,
      title: 'Fast & Secure Delivery',
      desc: 'Wherever you are, your accessories reach you quickly—safe, sealed, and ready to use.',
    },
    {
      icon: <CheckCircle className="text-gray-700 w-6 h-6" />,
      title: 'Easy Shopping Experience',
      desc: 'Browse, compare, pick. Shopping with us is as smooth as your new screen protector!',
    },
    {
      icon: <Shield className="text-gray-700 w-6 h-6" />,
      title: 'Premium Quality Only',
      desc: 'Every product meets rigorous standards for quality and reliability—accessories that protect, enhance, and last.',
    },
    {
      icon: <RefreshCw className="text-gray-700 w-6 h-6" />,
      title: 'Honest, Transparent Service',
      desc: 'What you see is what you get, with accurate product descriptions, real customer reviews, and no hidden surprises.',
    }
  ];

  return (
    <section className="bg-white py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Heading */}
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-4 font-medium">
            Your One-Stop Mobile Destination
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-6 tracking-tight">
            Everything Mobile, Simplified
          </h2>
          
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mb-8"></div>
          
          <p className="text-sm lg:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Welcome to Caishen United, your one-stop destination for everything mobile! We are passionate tech 
            enthusiasts, curators of style, and everyday problem-solvers who make it easy for you to accessorize 
            your digital life. Your gadget deserves the best.
          </p>
        </div>

        {/* Products Section */}
        <div className="mb-20 lg:mb-28">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3 font-medium">
              What We Offer
            </p>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-4 tracking-tight">
              Carefully Curated Selection
            </h3>
            <div className="w-16 h-px bg-gray-300 mx-auto mb-6"></div>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
              We stock a carefully chosen selection of accessories that combine durability, 
              practicality, and great design—because every smartphone owner is unique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((item, index) => (
              <FeatureCard 
                key={index}
                item={item}
                isHovered={hoveredCard === `feature-${index}`}
                onHover={() => setHoveredCard(`feature-${index}`)}
                onLeave={() => setHoveredCard(null)}
              />
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3 font-medium">
              Why Choose Us
            </p>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-4 tracking-tight">
              Your Satisfaction Is Our Promise
            </h3>
            <div className="w-16 h-px bg-gray-300 mx-auto mb-6"></div>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
              We believe quality should not break the bank. Every product here is tried and tested 
              for performance, with options to suit every taste and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {values.map((item, index) => (
              <FeatureCard 
                key={index}
                item={item}
                isHovered={hoveredCard === `value-${index}`}
                onHover={() => setHoveredCard(`value-${index}`)}
                onLeave={() => setHoveredCard(null)}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 mb-20 py-16 border-t border-b border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-light text-gray-900 mb-2">10+</div>
              <div className="text-xs uppercase tracking-wider text-gray-500">Device Models</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-light text-gray-900 mb-2">50K+</div>
              <div className="text-xs uppercase tracking-wider text-gray-500">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-light text-gray-900 mb-2">4.9★</div>
              <div className="text-xs uppercase tracking-wider text-gray-500">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-light text-gray-900 mb-2">100%</div>
              <div className="text-xs uppercase tracking-wider text-gray-500">Quality Tested</div>
            </div>
          </div>
        </div>

        {/* Community Section */}
        <div className="text-center mb-16 py-12 bg-gray-50 rounded-sm">
          <div className="max-w-3xl mx-auto px-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-4 font-medium">
              Join Our Community
            </p>
            <h4 className="text-2xl lg:text-3xl font-light text-gray-900 mb-4 tracking-tight">
              Let us Stay Connected
            </h4>
            <div className="w-16 h-px bg-gray-300 mx-auto mb-6"></div>
            <p className="text-sm text-gray-600 mb-6 font-light leading-relaxed">
              We are more than a website; we are a community. Follow us on social media for exclusive deals, 
              quick hacks, and gadget inspiration. Have a suggestion? Want to see a new product? We thrive 
              on your feedback!
            </p>
            <p className="text-base text-gray-900 font-light italic">
              At Caishen United, we do not just accessorize phones—we accessorize your life.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="max-w-2xl mx-auto">
            <h4 className="text-2xl lg:text-3xl font-light text-gray-900 mb-6 tracking-tight">
              Discover the Difference Today
            </h4>
            <p className="text-sm text-gray-600 mb-8 font-light leading-relaxed">
              Experience the perfect blend of style, innovation, and compatibility. Shop confidently 
              with secure payments, easy returns, and transparent warranty coverage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/products"
                className="inline-flex items-center gap-2 px-10 py-4 text-xs uppercase tracking-widest text-white bg-black hover:bg-gray-900 transition-all duration-300 font-medium"
              >
                Shop Collection
              </Link>
              <Link 
                href="/about"
                className="inline-flex items-center gap-2 px-10 py-4 text-xs uppercase tracking-widest text-gray-900 border border-gray-300 hover:border-black transition-all duration-300 font-medium"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
