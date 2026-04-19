"use client";

import { useMemo, useState } from "react";

import {
  appendPdfParams,
  clampPage,
  clampZoom,
  nextPage,
  prevPage,
} from "@/lib/pdf-utils";

type PDFViewerProps = {
  fileUrl: string;
  fileName?: string;
  totalPages?: number;
  initialPage?: number;
  initialZoom?: number;
  showControls?: boolean;
  onDownload?: () => void;
};

export default function PDFViewer({
  fileUrl,
  fileName = "document.pdf",
  totalPages,
  initialPage = 1,
  initialZoom = 100,
  showControls = true,
  onDownload,
}: PDFViewerProps) {
  const [page, setPage] = useState(clampPage(initialPage, totalPages));
  const [zoom, setZoom] = useState(clampZoom(initialZoom));

  const viewerSrc = useMemo(() => appendPdfParams(fileUrl, page, zoom), [fileUrl, page, zoom]);

  const handleZoomIn = () => setZoom((current) => clampZoom(current + 10));
  const handleZoomOut = () => setZoom((current) => clampZoom(current - 10));
  const handlePageBack = () => setPage((current) => prevPage(current));
  const handlePageForward = () => setPage((current) => nextPage(current, totalPages));

  const triggerDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = fileUrl;
    anchor.download = fileName;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.click();
  };

  const triggerPrint = () => {
    window.open(viewerSrc, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {showControls ? (
        <header className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 p-3">
          <button
            type="button"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white"
            onClick={handleZoomOut}
            aria-label="Zoom out"
          >
            -
          </button>
          <span className="min-w-12 text-center text-xs font-semibold text-slate-700">{zoom}%</span>
          <button
            type="button"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white"
            onClick={handleZoomIn}
            aria-label="Zoom in"
          >
            +
          </button>

          <div className="mx-1 h-4 w-px bg-slate-300" />

          <button
            type="button"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white"
            onClick={handlePageBack}
            aria-label="Previous page"
            disabled={page <= 1}
          >
            Prev
          </button>
          <span className="text-xs font-semibold text-slate-700">
            Page {page}
            {totalPages ? ` / ${totalPages}` : ""}
          </span>
          <button
            type="button"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white"
            onClick={handlePageForward}
            aria-label="Next page"
            disabled={Boolean(totalPages) && page >= (totalPages || 1)}
          >
            Next
          </button>

          <div className="ml-auto flex gap-2">
            <button
              type="button"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white"
              onClick={triggerPrint}
            >
              Print
            </button>
            <button
              type="button"
              className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
              onClick={triggerDownload}
            >
              Download
            </button>
          </div>
        </header>
      ) : null}

      <div className="h-[65vh] min-h-[420px] w-full bg-slate-100 md:h-[72vh]">
        <iframe
          title="PDF Viewer"
          src={viewerSrc}
          className="h-full w-full"
          loading="lazy"
        />
      </div>
    </section>
  );
}
