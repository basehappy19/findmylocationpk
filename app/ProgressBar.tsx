import React from 'react';
import { motion } from 'framer-motion';
import { Flag } from 'lucide-react';

const ProgressBar = ({ value, total, current }: { value: number, total: number, current: number }) => {
    const progress = (value / 100) * 100;

    return (
        <div className="w-full space-y-2">
            <div className="relative h-6 bg-pink-100 rounded-full overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-20">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute h-6 w-2 bg-pink-300 transform -skew-x-12"
                            style={{ left: `${i * 10}%` }}
                        />
                    ))}
                </div>

                {/* Progress fill */}
                <motion.div
                    className="h-full bg-gradient-to-r from-pink-400 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{
                        duration: 0.5,
                        ease: "easeOut"
                    }}
                />

                {/* Bouncing bubble */}
                <motion.div
                    className="absolute top-1 h-6 w-6 rounded-full bg-white shadow-lg border-2 border-pink-400"
                    style={{ left: `${progress - 1.5}%` }}
                    animate={{
                        y: [0, -8, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Finish line */}
                <div className="absolute right-0 top-0 h-full flex items-center pr-2">
                    <Flag className="h-5 w-5 text-black" />
                </div>
            </div>

            {/* Progress text */}
            <motion.div
                className="flex justify-between text-sm text-pink-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <span className="font-medium">คำถามที่ {current} จาก {total}</span>
                <span className="font-medium">{Math.round(progress)}%</span>
            </motion.div>
        </div>
    );
};

export default ProgressBar;