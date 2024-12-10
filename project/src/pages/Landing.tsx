import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Rocket, 
  Globe, 
  ArrowRight, 
  Play, 
  Zap,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const features = [
    {
      icon: <Rocket className="w-12 h-12 text-blue-600" />,
      title: "AI-Powered Matching",
      description: "Our intelligent algorithms understand human potential beyond traditional metrics.",
      benefit: "Discover hidden talents"
    },
    {
      icon: <Globe className="w-12 h-12 text-green-600" />,
      title: "Global Talent Network",
      description: "Connect with diverse professionals who bring unique perspectives and skills.",
      benefit: "Expand your team's horizons"
    },
    {
      icon: <Heart className="w-12 h-12 text-purple-600" />,
      title: "Human-Centric Approach",
      description: "We believe in the story behind every resume, not just the data points.",
      benefit: "Understand human potential"
    }
  ];

  const testimonials = [
    {
      name: "Elena Rodriguez",
      role: "Chief People Officer",
      quote: "RecruitPro doesn't just find candidates, it discovers human potential.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Michael Chen",
      role: "Startup Founder",
      quote: "Our team feels like a family, thanks to RecruitPro's unique matching approach.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    }
  ];

  return (
    <div ref={scrollRef} className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.header 
        style={{ 
          y: backgroundY,
          opacity: textOpacity
        }}
        className="container mx-auto px-6 py-20"
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl font-bold text-gray-900 mb-6"
          >
            Unleashing Human Potential Through AI
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl text-gray-700 mb-10"
          >
            We don't just match skills. We connect human stories, aspirations, and dreams.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center space-x-4"
          >
            <Link 
              to="/signup" 
              className="bg-blue-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition flex items-center"
            >
              Start Your Journey <ArrowRight className="ml-2" />
            </Link>
            <Link 
              to="/demo" 
              className="border-2 border-blue-600 text-blue-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition flex items-center"
            >
              <Play className="mr-2" /> Watch Demo
            </Link>
          </motion.div>
        </div>
      </motion.header>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Beyond Traditional Recruitment
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We see more than just skills. We see potential, passion, and human stories.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-all"
            >
              <div className="flex justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {feature.description}
              </p>
              <div className="text-blue-600 font-medium flex items-center justify-center">
                {feature.benefit}
                <ArrowRight className="ml-2 w-5 h-5" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Human Stories of Transformation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real experiences from leaders who believe in the power of human potential.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gray-50 rounded-xl p-8 shadow-md"
              >
                <p className="text-xl italic text-gray-700 mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-6"
          >
            Your Potential Awaits
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl mb-10 max-w-2xl mx-auto"
          >
            Every great team starts with understanding the unique human behind the resume.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link 
              to="/signup" 
              className="bg-white text-blue-600 px-12 py-5 rounded-full text-lg font-bold hover:bg-blue-50 transition inline-flex items-center"
            >
              Discover Your Team <Zap className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
