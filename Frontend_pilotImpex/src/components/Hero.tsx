import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';
// Import local images
import industrialStorage from "@/assets/image silder/Industrial Chemical Storage.png";
import chemicalSafety from "@/assets/image silder/Chemical Safety First.png";
import productRange from "@/assets/image silder/Chemical Product Range.png";
import vadodaraHub from "@/assets/image silder/Vadodara Industrial Hub.png";

// Professional chemical industry images
const heroImages = [
  {
    id: 1,
    src: industrialStorage,
    title: 'Industrial Chemical Storage',
    subtitle: 'Bulk Handling Expertise',
    description: 'State-of-the-art storage for caustic soda, hydrochloric acid, and specialty chemicals.'
  },
  {
    id: 2,
    src: chemicalSafety,
    title: 'Chemical Safety First',
    subtitle: 'Protective Handling',
    description: 'Strict safety protocols for handling hazardous chemicals.'
  },
  {
    id: 3,
    src: productRange,
    title: 'Chemical Product Range',
    subtitle: 'Comprehensive Inventory',
    description: 'Wide selection of industrial chemicals including caustic potash and aluminum chloride.'
  },
  {
    id: 4,
    src: vadodaraHub,
    title: 'Vadodara Industrial Hub',
    subtitle: 'Strategic Location',
    description: 'Strategically located in Vadodara, serving industries across India.'
  }
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000); // Increased from 5000ms to 8000ms for slower transitions
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30, duration: 0.5 },
        opacity: { duration: 0.4 }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30, duration: 0.5 },
        opacity: { duration: 0.2 }
      }
    })
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] // Custom cubic-bezier curve for smooth animation
      }
    }
  } as const;

  return (
    <section className="relative min-h-screen overflow-hidden bg-gray-900">
      {/* Background Slider */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0"
          >
            <img
              src={heroImages[currentIndex].src}
              alt={heroImages[currentIndex].title}
              className="h-full w-full object-cover brightness-100"
              style={{
                filter: 'brightness(0.9) saturate(1.1) contrast(1.05)'
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-3 text-white backdrop-blur-sm transition-all hover:bg-primary/80 md:left-8"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-3 text-white backdrop-blur-sm transition-all hover:bg-primary/80 md:right-8"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Content */}
      <div className="relative z-10 flex h-screen items-center justify-center px-4 text-center">
        <div className="container mx-auto max-w-6xl px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`slide-${currentIndex}`}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="space-y-6 text-white"
            >
              <motion.h1 
                className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
              >
                {heroImages[currentIndex].title}
                <motion.span 
                  className="mt-2 block text-2xl font-normal text-white/90 md:text-3xl lg:text-4xl"
                  variants={textVariants}
                >
                  {heroImages[currentIndex].subtitle}
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="mx-auto max-w-2xl text-lg text-white/90 md:text-xl"
                variants={textVariants}
              >
                {heroImages[currentIndex].description}
              </motion.p>
              
              <motion.div variants={textVariants} className="pt-4">
                <button
                  onClick={() => navigate('/products')}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-white/10 px-8 py-4 text-base font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/30"
                >
                  <span>View Products</span>
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
              
              <motion.div 
                className="mt-8 flex justify-center space-x-2"
                variants={textVariants}
              >
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 w-2 rounded-full transition-all ${currentIndex === index ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Since Badge */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transform">
        <div className="inline-flex items-center rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm">
          <div className="mr-2 h-1.5 w-1.5 rounded-full bg-white" />
          <span>Serving Since 1992</span>
        </div>
      </div>
    </section>
  );
}