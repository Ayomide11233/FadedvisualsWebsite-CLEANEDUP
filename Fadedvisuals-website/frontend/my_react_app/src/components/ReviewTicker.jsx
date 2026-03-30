import React from 'react';
import { motion } from 'framer-motion';

const ReviewTicker = () => {
  const reviews = [
    {
      name: 'Bimpe',
      rating: 5,
      text: 'Hey Ayo! Its been a pleasure so far. you have been very helpful. I appreciate the time and thought you put into it'
    },
    {
      name: 'RG43',
      rating: 5,
      text: 'You were super easy to work with, supre professional turned the project around quickly'
    },
    {
      name: 'Kishi Sowunmi',
      rating: 5,
      text: 'There is so much intentionality with your work, and you executed such a lovely design. Will Highly recommend.'
    },
    {
      name: 'Muda',
      rating: 5,
      text: 'You brought my vision to life, the execution was perfect.'
    },
    {
      name: 'Nina Patel',
      rating: 5,
      text: 'Creative vision that perfectly captured our aesthetic. Amazing experience!'
    }
  ];

  // Duplicate for seamless loop
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

  return (
    <div className="relative py-12 overflow-hidden">
      {/* Title */}
      <h3 
        className="text-2xl font-bold mb-8 text-center"
        style={{ fontFamily: "'Unbounded', sans-serif" }}
      >
        <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          Client Reviews
        </span>
      </h3>

      {/* Gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#1a1a1a] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#1a1a1a] to-transparent z-10" />

      {/* Scrolling reviews */}
      <motion.div
        className="flex gap-6"
        animate={{
          x: [0, -2400] // Adjust based on content width
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear"
        }}
        whileHover={{
          animationPlayState: "paused"
        }}
      >
        {duplicatedReviews.map((review, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[400px] p-6 bg-[#252525] rounded-xl border border-purple-500/10 hover:border-purple-500/30 transition-colors duration-300"
          >
            {/* Rating stars */}
            <div className="flex gap-1 mb-3">
              {[...Array(review.rating)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-purple-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Review text */}
            <p 
              className="text-gray-300 mb-4 leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              "{review.text}"
            </p>

            {/* Reviewer name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold">
                {review.name.charAt(0)}
              </div>
              <span className="font-medium text-gray-200">{review.name}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default ReviewTicker;
