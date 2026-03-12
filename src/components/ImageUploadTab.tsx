import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResultDisplay, { type DetectionResult } from "./ResultDisplay";
import { simulateAnalysis } from "@/lib/detector";

const ImageUploadTab = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setResult(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

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
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
          isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
        }`}
        whileHover={{ scale: 1.01 }}
        onClick={() => document.getElementById("img-upload")?.click()}
      >
        <input
          id="img-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-md" />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <ImageIcon className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground">Drop an image here or click to upload</p>
            <p className="text-xs text-muted-foreground/60">PNG, JPG, WEBP up to 20MB</p>
          </div>
        )}
      </motion.div>

      {preview && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
          <Button onClick={analyze} disabled={isAnalyzing} className="flex-1 gap-2">
            <Upload className="w-4 h-4" /> Analyze Image
          </Button>
          <Button
            variant="outline"
            onClick={() => { setPreview(null); setResult(null); }}
          >
            Clear
          </Button>
        </motion.div>
      )}

      <ResultDisplay result={result} isAnalyzing={isAnalyzing} />
    </div>
  );
};

export default ImageUploadTab;
