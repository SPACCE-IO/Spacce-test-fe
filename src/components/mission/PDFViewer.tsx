"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Scan, ZoomIn, ZoomOut } from "lucide-react";

// Extend Window interface for PDF.js
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

interface PdfViewerProps {
  url: string;
  toggleDrawer: () => void;
}

const PdfViewer = ({ url, toggleDrawer }: PdfViewerProps) => {
  const [isClient, setIsClient] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<any>(null); // Store current render task
  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determine if URL is absolute or relative
  const pdfUrl = url.startsWith("http")
    ? url
    : `${
        process.env.NEXT_PUBLIC_BASE_URL ||
        "https://spacce-gateway-service-726569672166.europe-west1.run.app"
      }${url}`;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleToogle =()=>{
    toggleDrawer()
  }

  // Load PDF.js
  useEffect(() => {
    if (!isClient) return;

    const loadPdfJs = async () => {
      try {
        // Load PDF.js using script tags for better compatibility
        if (typeof window !== "undefined" && !window.pdfjsLib) {
          // Load PDF.js script
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });

          // Set worker
          if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          }
        }

        if (window.pdfjsLib) {
          // Load the PDF document
          const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
          const pdf = await loadingTask.promise;

          setPdfDoc(pdf);
          setTotalPages(pdf.numPages);
          setIsLoading(false);
        } else {
          throw new Error("PDF.js failed to load");
        }
      } catch (err) {
        console.error("Error loading PDF:", err);
        setError("Failed to load PDF document");
        setIsLoading(false);
      }
    };

    loadPdfJs();
  }, [isClient, pdfUrl]);

  // Centralized render function with debouncing
  const renderPage = async () => {
    if (!pdfDoc || !canvasRef.current || !containerRef.current || isRendering)
      return;

    // Clear any pending render timeout
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
      renderTimeoutRef.current = null;
    }

    setIsRendering(true);

    try {
      // Cancel any ongoing render task
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }

      const page = await pdfDoc.getPage(currentPage);
      const canvas = canvasRef.current!;
      const context = canvas.getContext("2d")!;
      const container = containerRef.current!;

      // Calculate scale to fit container width
      const containerWidth = container.clientWidth - 32; // Account for padding
      const viewport = page.getViewport({ scale: 1 });
      const scaleToFit = containerWidth / viewport.width;

      const scaledViewport = page.getViewport({ scale: scaleToFit * scale });

      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;

      // Clear the canvas before rendering
      context.clearRect(0, 0, canvas.width, canvas.height);

      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport,
      };

      // Store the render task so we can cancel it if needed
      renderTaskRef.current = page.render(renderContext);

      await renderTaskRef.current.promise;

      // Clear the reference after successful render
      renderTaskRef.current = null;
    } catch (err) {
      // Don't log cancelled render operations as errors
      if (err?.name !== "RenderingCancelledException") {
        console.error("Error rendering page:", err);
      }
    } finally {
      setIsRendering(false);
    }
  };

  // Debounced render function for resize events
  const debouncedRenderPage = () => {
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }
    renderTimeoutRef.current = setTimeout(() => {
      renderPage();
    }, 100);
  };

  // Render current page
  useEffect(() => {
    renderPage();

    // Cleanup function to cancel render on unmount or dependency change
    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
    };
  }, [pdfDoc, currentPage, scale]);

  // Handle container resize
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      // Use debounced render for resize events to prevent rapid-fire renders
      debouncedRenderPage();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      // Clear any pending timeouts
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
        renderTimeoutRef.current = null;
      }
      // Cancel any ongoing render task when component unmounts
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
    };
  }, [pdfDoc, currentPage, scale]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pageNum = parseInt(e.target.value);
    goToPage(pageNum);
  };

  if (!isClient) {
    return (
      <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center rounded-lg">
        <div className="text-gray-600">Loading PDF...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full bg-red-50 flex items-center justify-center rounded-lg border-2 border-red-200">
        <div className="text-red-600 text-center">
          <div className="text-lg font-semibold mb-2">Error Loading PDF</div>
          <div className="text-sm">{error}</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading PDF...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-white border relative">
      {/* PDF Canvas Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col items-center">
          <div className="bg-white shadow-lg rounded-sm mb-4">
            <canvas
              ref={canvasRef}
              className="block"
              style={{
                width: "100%",
                height: "auto",
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating Previous Button */}
      <button
        onClick={goToPrevPage}
        disabled={currentPage <= 1}
        onMouseEnter={() => setIsHovered(true)}
        className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-70 text-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:bg-opacity-90 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{ pointerEvents: isHovered ? "auto" : "none" }}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Floating Next Button */}
      <button
        onClick={goToNextPage}
        disabled={currentPage >= totalPages}
        onMouseEnter={() => setIsHovered(true)}
        className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-70 text-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:bg-opacity-90 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{ pointerEvents: isHovered ? "auto" : "none" }}
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Bottom Navigation Overlay */}
      <div
        className={`absolute bottom-0 w-full left-1/2 transform -translate-x-1/2 transition-all duration-300 z-10 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{ pointerEvents: isHovered ? "auto" : "none" }}
        onMouseEnter={() => setIsHovered(true)}
      >
        <div className="flex items-center space-x-4 bg-black bg-opacity-70 text-white px-6 py-3 backdrop-blur-sm">
          {/* Page Info */}
          <span className="text-sm font-medium whitespace-nowrap">
            {currentPage} / {totalPages}
          </span>

          {/* Page Slider */}
          <div className="w-full">
            <div className="relative">
              <input
                type="range"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={handleSliderChange}
                className="w-full h-2 bg-white bg-opacity-30 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                    ((currentPage - 1) / (totalPages - 1)) * 100
                  }%, rgba(255,255,255,0.3) ${
                    ((currentPage - 1) / (totalPages - 1)) * 100
                  }%, rgba(255,255,255,0.3) 100%)`,
                }}
              />
            </div>
          </div>

          <div className="w-px h-6 bg-white bg-opacity-30"></div>

          {/* Toggle Drawer Button */}
          <button
            onClick={handleToogle}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            title="Open Scanner"
          >
            <Scan className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default PdfViewer;
