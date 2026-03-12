import { useState } from "react";
import { motion } from "framer-motion";
import { Link, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ResultDisplay, { type DetectionResult } from "./ResultDisplay";
import { simulateAnalysis } from "@/lib/detector";

const UrlDetectTab = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyze = async () => {
    if (!url.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    const res = await simulateAnalysis();
    setResult(res);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 p-4 rounded-lg border border-border bg-card">
          <Link className="w-5 h-5 text-muted-foreground shrink-0" />
          <Input
            placeholder="Paste image or video URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            onKeyDown={(e) => e.key === "Enter" && analyze()}
          />
        </div>
        <Button onClick={analyze} disabled={isAnalyzing || !url.trim()} className="w-full gap-2">
          <Search className="w-4 h-4" /> Analyze URL
        </Button>
      </motion.div>

      <ResultDisplay result={result} isAnalyzing={isAnalyzing} />
    </div>
  );
};

export default UrlDetectTab;
