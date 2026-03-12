import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldAlert, AlertTriangle } from "lucide-react";

export type DetectionResult = {
  verdict: "real" | "deepfake" | "suspicious";
  confidence: number;
  details: string;
};

interface ResultDisplayProps {
  result: DetectionResult | null;
  isAnalyzing: boolean;
}

const verdictConfig = {
  real: {
    icon: Shield,
    label: "Authentic",
    colorClass: "text-safe",
    glowClass: "glow-primary",
    bgClass: "bg-safe/10 border-safe/30",
  },
  deepfake: {
    icon: ShieldAlert,
    label: "Deepfake Detected",
    colorClass: "text-danger",
    glowClass: "glow-danger",
    bgClass: "bg-danger/10 border-danger/30",
  },
  suspicious: {
    icon: AlertTriangle,
    label: "Suspicious",
    colorClass: "text-warning",
    glowClass: "",
    bgClass: "bg-warning/10 border-warning/30",
  },
};

const ResultDisplay = ({ result, isAnalyzing }: ResultDisplayProps) => {
  if (isAnalyzing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 p-8"
      >
        <div className="relative w-20 h-20">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border-2 border-accent/50"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <p className="text-muted-foreground font-mono text-sm">Analyzing media...</p>
      </motion.div>
    );
  }

  if (!result) return null;

  const config = verdictConfig[result.verdict];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className={`rounded-lg border p-6 ${config.bgClass} ${config.glowClass}`}
      >
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Icon className={`w-10 h-10 ${config.colorClass}`} />
          </motion.div>
          <div>
            <h3 className={`text-xl font-bold ${config.colorClass}`}>{config.label}</h3>
            <p className="text-muted-foreground text-sm font-mono">
              Confidence: {result.confidence}%
            </p>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-4">
          <motion.div
            className={`h-full rounded-full ${
              result.verdict === "real"
                ? "bg-safe"
                : result.verdict === "deepfake"
                ? "bg-danger"
                : "bg-warning"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${result.confidence}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>

        <p className="text-sm text-secondary-foreground">{result.details}</p>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultDisplay;
