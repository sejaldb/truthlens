import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, CameraOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResultDisplay, { type DetectionResult } from "./ResultDisplay";
import { simulateAnalysis } from "@/lib/detector";

const WebcamTab = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch {
      console.error("Camera access denied");
    }
  }, []);

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setIsLive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [stream]);

  const toggleLiveDetection = () => {
    if (isLive) {
      setIsLive(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setIsLive(true);
      const run = async () => {
        setIsAnalyzing(true);
        const res = await simulateAnalysis();
        setResult(res);
        setIsAnalyzing(false);
      };
      run();
      intervalRef.current = setInterval(run, 5000);
    }
  };

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [stream]);

  return (
    <div className="space-y-6">
      <div className="relative rounded-lg overflow-hidden border border-border bg-card aspect-video flex items-center justify-center">
        {stream ? (
          <>
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            {isLive && (
              <motion.div
                className="absolute top-3 right-3 flex items-center gap-2 bg-danger/90 px-3 py-1 rounded-full"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="w-2 h-2 rounded-full bg-danger-foreground" />
                <span className="text-xs font-mono text-danger-foreground">LIVE</span>
              </motion.div>
            )}
            {/* Scan overlay */}
            {isAnalyzing && (
              <motion.div
                className="absolute inset-x-0 h-0.5 bg-primary/60"
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Camera className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground">Camera not active</p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {!stream ? (
          <Button onClick={startCamera} className="flex-1 gap-2">
            <Camera className="w-4 h-4" /> Start Camera
          </Button>
        ) : (
          <>
            <Button onClick={toggleLiveDetection} variant={isLive ? "destructive" : "default"} className="flex-1 gap-2">
              {isLive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
              {isLive ? "Stop Detection" : "Start Live Detection"}
            </Button>
            <Button variant="outline" onClick={stopCamera}>
              Stop Camera
            </Button>
          </>
        )}
      </div>

      <ResultDisplay result={result} isAnalyzing={isAnalyzing} />
    </div>
  );
};

export default WebcamTab;
