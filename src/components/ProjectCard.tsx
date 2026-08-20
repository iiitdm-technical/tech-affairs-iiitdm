"use client";

import React from 'react';
import Image from 'next/image';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  name?: string;
  title?: string;
  image?: string;
  description?: string;
  themeColor?: string;
  isDarkMode?: boolean;
  icons?: React.ReactElement[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  name,
  title,
  image,
  description,
  themeColor = '#4A90E2',
  isDarkMode = false,
  icons = [],
}) => {
  const displayTitle = title ?? name ?? 'Project';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="rounded-xl"
    >
      <Tilt
        className="parallax-effect-glare-scale"
        perspective={500}
        glareEnable={true}
        glareMaxOpacity={0.45}
        scale={1.03}
      >
        <motion.div 
          className="h-80 w-full rounded-xl relative shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-white/20 to-transparent backdrop-blur-lg border border-white/20 group"
          style={{ '--theme-color': themeColor } as React.CSSProperties}
          whileHover="hover"
        >
          {image ? (
            <Image src={image} alt={displayTitle} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover rounded-xl" />
          ) : (
            <div
              className="w-full h-full rounded-xl"
              style={{
                background: `radial-gradient(120% 120% at 10% 20%, ${themeColor}33 0%, transparent 55%), radial-gradient(120% 120% at 90% 80%, ${themeColor}55 0%, transparent 60%)`
              }}
            />
          )}
          
          {/* Always visible title */}
          <div className={
            `absolute inset-0 flex items-center justify-center rounded-xl p-4 ` +
            (isDarkMode ? 'bg-black/40' : 'bg-white/40')
          }>
            <div className="flex flex-col items-center justify-center">
              <h2 className={isDarkMode ? "text-white text-2xl font-bold text-center" : "text-black text-2xl font-bold text-center"}>{displayTitle}</h2>
              {icons.length > 0 && (
                <div className="mt-3 flex items-center justify-center gap-3 text-lg" style={{ color: themeColor }}>
                  {icons.map((icon, index) => (
                    <span key={index} className="flex items-center justify-center">
                      {icon}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Hover-to-reveal description */}
          <motion.div
            className={
              `absolute inset-0 flex flex-col items-center justify-center rounded-xl p-4 ` +
              (isDarkMode ? 'bg-black/70' : 'bg-white/70')
            }
            initial={{ opacity: 0 }}
            variants={{ hover: { opacity: 1 } }}
            transition={{ duration: 0.3 }}
          >
            <h2 className={isDarkMode ? "text-white text-2xl font-bold text-center" : "text-black text-2xl font-bold text-center"}>{displayTitle}</h2>
            {description && (
              <p className={isDarkMode ? "text-white text-center mt-2 text-xs line-clamp-3" : "text-black text-center mt-2 text-xs line-clamp-3"}>{description}</p>
            )}
          </motion.div>

          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-xl border-2 border-transparent transition-all duration-300 group-hover:border-[var(--theme-color)] group-hover:shadow-[0_0_20px_var(--theme-color)]" />
        </motion.div>
      </Tilt>
    </motion.div>
  );
};

export default ProjectCard;
