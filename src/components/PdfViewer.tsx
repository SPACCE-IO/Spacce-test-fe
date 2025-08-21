"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

// Extend Window interface for PDF.js
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

interface PdfViewerProps {
  url: string;
}

const PdfViewer = ({ url }: PdfViewerProps) => {
  const [isClient, setIsClient] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine if URL is absolute or relative
  const pdfUrl = url.startsWith("http")
    ? url
    : `${process.env.NEXT_PUBLIC_BASE_URL || ""}${url}`;

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  // Render current page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d")!;

        const viewport = page.getViewport({ scale });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (err) {
        console.error("Error rendering page:", err);
      }
    };

    renderPage();
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
    <div className="h-full w-full flex flex-col bg-white border">
      {/* PDF Canvas Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden bg-gray-100 flex items-center justify-center p-4 relative"
      >
        <div className="relative bg-white shadow-lg rounded-sm overflow-hidden">
          <canvas
            ref={canvasRef}
            className="block max-w-full max-h-full"
            style={{
              maxWidth: "100%",
              maxHeight: "calc(100vh - 220px)",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Floating Previous Button */}
        <button
          onClick={goToPrevPage}
          disabled={currentPage <= 1}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 hover:bg-white border border-gray-300 rounded-full shadow-lg backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* Floating Next Button */}
        <button
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 hover:bg-white border border-gray-300 rounded-full shadow-lg backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-center p-4 border-t bg-gray-500">
        {/* Page Info and Slider */}
        <div className="flex items-center space-x-6 max-w-md w-full">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            {currentPage} / {totalPages}
          </span>

          {/* Page Slider */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="range"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                    ((currentPage - 1) / (totalPages - 1)) * 100
                  }%, #E5E7EB ${
                    ((currentPage - 1) / (totalPages - 1)) * 100
                  }%, #E5E7EB 100%)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
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
