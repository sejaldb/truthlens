import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Monitor, MonitorOff, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResultDisplay, { type DetectionResult } from "./ResultDisplay";
import { simulateAnalysis } from "@/lib/detector";

const ScreenShareTab = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startScreenShare = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      s.getVideoTracks()[0].addEventListener("ended", () => {
        setStream(null);
        setIsLive(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      });
    } catch {
      console.error("Screen share denied");
    }
  }, []);

  const stopScreenShare = useCallback(() => {
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
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Share your screen to detect AI-generated content in live meetings, video calls, or any on-screen media.
        </p>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-border bg-card aspect-video flex items-center justify-center">
        {stream ? (
          <>
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-contain" />
            {isLive && (
              <motion.div
                className="absolute top-3 right-3 flex items-center gap-2 bg-accent/90 px-3 py-1 rounded-full"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Scan className="w-3 h-3 text-accent-foreground" />
                <span className="text-xs font-mono text-accent-foreground">SCANNING</span>
              </motion.div>
            )}
            {isAnalyzing && (
              <motion.div
                className="absolute inset-x-0 h-0.5 bg-accent/60"
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Monitor className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground">No screen shared</p>
            <p className="text-xs text-muted-foreground/60">
              Share a tab, window, or entire screen
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {!stream ? (
          <Button onClick={startScreenShare} className="flex-1 gap-2">
            <Monitor className="w-4 h-4" /> Share Screen
          </Button>
        ) : (
          <>
            <Button
              onClick={toggleLiveDetection}
              variant={isLive ? "destructive" : "default"}
              className="flex-1 gap-2"
            >
              {isLive ? <MonitorOff className="w-4 h-4" /> : <Scan className="w-4 h-4" />}
              {isLive ? "Stop Scanning" : "Start Scanning"}
            </Button>
            <Button variant="outline" onClick={stopScreenShare}>
              Stop Sharing
            </Button>
          </>
        )}
      </div>

      <ResultDisplay result={result} isAnalyzing={isAnalyzing} />
    </div>
  );
};

export default ScreenShareTab;
