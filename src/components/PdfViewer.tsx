"use client";

import { useEffect, useState } from 'react';

interface PdfViewerProps {
  url: string;
}

const PdfViewer = ({ url }: PdfViewerProps) => {
  const [isClient, setIsClient] = useState(false);
  
  // Determine if URL is absolute or relative
  const pdfUrl = url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_BASE_URL || ''}${url}`;
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <div className="h-screen w-screen bg-gray-100 animate-pulse flex items-center justify-center">Loading PDF...</div>;
  }
  
  return (
    <div className="h-full w-full border rounded-lg">
      <iframe
        src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
        className="w-full h-full rounded-lg border-0"
        title="PDF Viewer"
      />
    </div>
  );
};

export default PdfViewer;
