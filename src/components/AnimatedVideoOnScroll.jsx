import React, { createContext, useContext, useRef, forwardRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";

const SPRING_TRANSITION_CONFIG = {
  type: "spring",
  stiffness: 100,
  damping: 16,
  mass: 0.75,
  restDelta: 0.005,
};

const variants = {
  hidden: {
    filter: "blur(10px)",
    opacity: 0,
  },
  visible: {
    filter: "blur(0px)",
    opacity: 1,
  },
};

const ContainerScrollContext = createContext(undefined);

function useContainerScrollContext() {
  const context = useContext(ContainerScrollContext);
  if (!context) {
    throw new Error(
      "useContainerScrollContext must be used within a ContainerScroll Component"
    );
  }
  return context;
}

export const ContainerScroll = ({ children, className, ...props }) => {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start center", "end end"],
  });

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={`relative ${className || ""}`}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  );
};

export const ContainerAnimated = forwardRef(
  (
    {
      className,
      transition,
      style,
      inputRange = [0.2, 0.8],
      outputRange = [80, 0],
      ...props
    },
    ref
  ) => {
    const { scrollYProgress } = useContainerScrollContext();
    const y = useTransform(scrollYProgress, inputRange, outputRange);
    const opacity = useTransform(scrollYProgress, [0.85, 0.98], [1, 0]);
    return (
      <motion.div
        ref={ref}
        className={className || ""}
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ y, opacity, ...style }}
        transition={{ ...SPRING_TRANSITION_CONFIG, ...transition }}
        {...props}
      />
    );
  }
);
ContainerAnimated.displayName = "ContainerAnimated";

export const ContainerSticky = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`sticky left-0 top-0 min-h-svh w-full ${className || ""}`}
      {...props}
    />
  );
});
ContainerSticky.displayName = "ContainerSticky";

export const HeroVideo = forwardRef(({ style, className, transition, ...props }, ref) => {
  const { scrollYProgress } = useContainerScrollContext();
  const scale = useTransform(scrollYProgress, [0, 0.8], [0.7, 1]);

  return (
    <motion.video
      ref={ref}
      className={`relative z-10 size-auto max-h-full max-w-full ${className || ""}`}
      autoPlay
      muted
      loop
      playsInline
      style={{ scale, ...style }}
      {...props}
    />
  );
});
HeroVideo.displayName = "HeroVideo";

export const ContainerInset = forwardRef(
  (
    {
      className,
      style,
      insetYRange = [45, 0],
      insetXRange = [45, 0],
      roundednessRange = [1000, 16],
      transition,
      ...props
    },
    ref
  ) => {
    const { scrollYProgress } = useContainerScrollContext();

    const insetY = useTransform(scrollYProgress, [0, 0.8], insetYRange);
    const insetX = useTransform(scrollYProgress, [0, 0.8], insetXRange);
    const roundedness = useTransform(scrollYProgress, [0, 1], roundednessRange);
    const opacity = useTransform(scrollYProgress, [0.85, 0.98], [1, 0]);

    const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${roundedness}px)`;

    return (
      <motion.div
        ref={ref}
        className={`relative pointer-events-none overflow-hidden ${className || ""}`}
        style={{
          clipPath,
          opacity,
          ...style,
        }}
        {...props}
      />
    );
  }
);
ContainerInset.displayName = "ContainerInset";
