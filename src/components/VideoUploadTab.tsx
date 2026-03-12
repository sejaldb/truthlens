import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResultDisplay, { type DetectionResult } from "./ResultDisplay";
import { simulateAnalysis } from "@/lib/detector";

const VideoUploadTab = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("video/")) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setResult(null);
  }, []);

  const analyze = async () => {
    setIsAnalyzing(true);
    setResult(null);
    const res = await simulateAnalysis();
    setResult(res);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <motion.div
        className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-muted-foreground transition-colors cursor-pointer"
        whileHover={{ scale: 1.01 }}
        onClick={() => document.getElementById("vid-upload")?.click()}
      >
        <input
          id="vid-upload"
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {preview ? (
          <video src={preview} controls className="max-h-64 mx-auto rounded-md" />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Film className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground">Drop a video here or click to upload</p>
            <p className="text-xs text-muted-foreground/60">MP4, MOV, WEBM up to 100MB</p>
          </div>
        )}
      </motion.div>

      {preview && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
          <Button onClick={analyze} disabled={isAnalyzing} className="flex-1 gap-2">
            <Upload className="w-4 h-4" /> Analyze Video
          </Button>
          <Button variant="outline" onClick={() => { setPreview(null); setResult(null); }}>
            Clear
          </Button>
        </motion.div>
      )}

      <ResultDisplay result={result} isAnalyzing={isAnalyzing} />
    </div>
  );
};

export default VideoUploadTab;
