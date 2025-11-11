"use client";

import { useEffect, useRef } from "react";

// Extend the JSX namespace to include model-viewer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerJSX &
        React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

interface ModelViewerJSX {
  src?: string;
  poster?: string;
  alt?: string;
  "auto-rotate"?: boolean;
  "camera-controls"?: boolean;
  "shadow-intensity"?: string;
  ar?: boolean;
  "ar-modes"?: string;
  "ios-src"?: string;
  loading?: "auto" | "lazy" | "eager";
  reveal?: "auto" | "interaction" | "manual";
  style?: React.CSSProperties;
}

interface ModelViewerProps {
  src: string;
  iosSrc?: string;
  poster?: string;
  alt?: string;
  autoRotate?: boolean;
  cameraControls?: boolean;
  shadowIntensity?: number;
  enableAR?: boolean;
  className?: string;
}

export function ModelViewer({
  src,
  iosSrc,
  poster,
  alt = "3D Model",
  autoRotate = true,
  cameraControls = true,
  shadowIntensity = 1,
  enableAR = true,
  className = "",
}: ModelViewerProps) {
  const viewerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Dynamically load model-viewer script
    if (typeof window !== "undefined" && !customElements.get("model-viewer")) {
      const script = document.createElement("script");
      script.type = "module";
      script.src =
        "https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js";
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  return (
    <model-viewer
      ref={viewerRef}
      src={src}
      ios-src={iosSrc}
      poster={poster}
      alt={alt}
      auto-rotate={autoRotate}
      camera-controls={cameraControls}
      shadow-intensity={shadowIntensity.toString()}
      ar={enableAR}
      ar-modes="webxr scene-viewer quick-look"
      loading="eager"
      reveal="auto"
      className={className}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "400px",
      }}
    />
  );
}
