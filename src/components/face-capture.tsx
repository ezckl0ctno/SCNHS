import { useEffect, useRef, useState } from "react";
import { descriptorFromVideo, loadFaceEngine } from "@/lib/school/face";
import { Button } from "@/components/ui/button";

export function FaceCapture({
  onCapture,
  variant = "dark",
}: {
  onCapture: (descriptor: number[]) => void;
  variant?: "dark" | "paper";
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hint, setHint] = useState("Starting camera…");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadFaceEngine();
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setReady(true);
        setHint("Face the camera, then capture.");
      } catch {
        setHint("Camera is not available here. Use PIN at the gate instead.");
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function capture() {
    if (!videoRef.current) return;
    setHint("Looking for a face…");
    const descriptor = await descriptorFromVideo(videoRef.current);
    if (!descriptor) {
      setHint("No face found. Come closer, even light, look straight.");
      return;
    }
    onCapture(descriptor);
    setHint("Face captured.");
  }

  return (
    <div className="grid gap-3">
      <div className="overflow-hidden rounded-2xl bg-ink">
        <video ref={videoRef} className="aspect-[4/3] w-full object-cover" muted playsInline />
      </div>
      <p className={variant === "dark" ? "text-sm text-leaf" : "text-sm text-muted"}>{hint}</p>
      <Button variant={variant === "dark" ? "gold" : "primary"} disabled={!ready} onClick={capture}>
        Capture face
      </Button>
    </div>
  );
}
