import { motion } from "framer-motion";

const orbs = [
  { x: "10%", y: "20%", size: 300, color: "var(--primary)", delay: 0 },
  { x: "80%", y: "60%", size: 250, color: "var(--accent)", delay: 1.5 },
  { x: "50%", y: "80%", size: 200, color: "var(--primary)", delay: 3 },
  { x: "30%", y: "50%", size: 180, color: "var(--accent)", delay: 0.8 },
];

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute inset-0 bg-grid opacity-20" />
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[120px] opacity-[0.07]"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: `hsl(${orb.color})`,
          }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            delay: orb.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          animate={{ y: ["0vh", "100vh"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default AnimatedBackground;
