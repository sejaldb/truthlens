import { motion } from "framer-motion";
import { Shield, Image, Film, Link, Camera, Monitor } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedBackground from "@/components/AnimatedBackground";
import ImageUploadTab from "@/components/ImageUploadTab";
import VideoUploadTab from "@/components/VideoUploadTab";
import UrlDetectTab from "@/components/UrlDetectTab";
import WebcamTab from "@/components/WebcamTab";
import ScreenShareTab from "@/components/ScreenShareTab";

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />

      <div className="relative z-10 container max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6 glow-primary"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Shield className="w-8 h-8 text-primary" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="text-gradient-primary">DeepGuard</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            AI-powered deepfake detection for images, videos, live camera & screen sharing
          </p>
        </motion.div>

        {/* Main Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="image" className="space-y-6">
            <TabsList className="grid grid-cols-5 bg-card border border-border h-auto p-1.5 rounded-xl">
              {[
                { value: "image", icon: Image, label: "Image" },
                { value: "video", icon: Film, label: "Video" },
                { value: "url", icon: Link, label: "URL" },
                { value: "camera", icon: Camera, label: "Camera" },
                { value: "screen", icon: Monitor, label: "Screen" },
              ].map(({ value, icon: Icon, label }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex flex-col gap-1 py-2.5 px-1 text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
              <TabsContent value="image" className="mt-0">
                <ImageUploadTab />
              </TabsContent>
              <TabsContent value="video" className="mt-0">
                <VideoUploadTab />
              </TabsContent>
              <TabsContent value="url" className="mt-0">
                <UrlDetectTab />
              </TabsContent>
              <TabsContent value="camera" className="mt-0">
                <WebcamTab />
              </TabsContent>
              <TabsContent value="screen" className="mt-0">
                <ScreenShareTab />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-muted-foreground/50 mt-12 font-mono"
        >
          DeepGuard v1.0 — Prototype with simulated detection
        </motion.p>
      </div>
    </div>
  );
};

export default Index;
