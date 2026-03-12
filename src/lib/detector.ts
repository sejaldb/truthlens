import type { DetectionResult } from "@/components/ResultDisplay";

// Simulated analysis — in production, this would call an AI vision backend
export const simulateAnalysis = (): Promise<DetectionResult> => {
  return new Promise((resolve) => {
    const delay = 2000 + Math.random() * 2000;
    setTimeout(() => {
      const roll = Math.random();
      if (roll < 0.4) {
        resolve({
          verdict: "real",
          confidence: Math.floor(80 + Math.random() * 18),
          details:
            "No signs of manipulation detected. Facial features, lighting consistency, and compression artifacts appear natural.",
        });
      } else if (roll < 0.75) {
        resolve({
          verdict: "deepfake",
          confidence: Math.floor(70 + Math.random() * 25),
          details:
            "Potential face-swap artifacts detected. Inconsistencies found in facial boundary blending, eye reflection patterns, and temporal coherence.",
        });
      } else {
        resolve({
          verdict: "suspicious",
          confidence: Math.floor(50 + Math.random() * 30),
          details:
            "Some anomalies detected but inconclusive. Minor inconsistencies in lighting and texture may indicate partial editing or heavy filtering.",
        });
      }
    }, delay);
  });
};
