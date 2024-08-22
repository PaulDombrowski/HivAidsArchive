import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './PDFViewer.css';

// Set the workerSrc for pdfjs to use the local worker file
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function PDFViewer({ file }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function goToNextPage() {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));
  }

  function goToPrevPage() {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  }

  return (
    <div className="pdf-viewer-container">
      <TransformWrapper
        defaultScale={1}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: true }}
        pinch={{ step: 5 }}
        panning={{ velocityDisabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="controls">
              <button onClick={zoomOut}>-</button>
              <button onClick={zoomIn}>+</button>
              <button onClick={resetTransform}>Reset</button>
            </div>
            <TransformComponent>
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                className="pdf-document"
              >
                <Page pageNumber={pageNumber} renderMode="svg" />
              </Document>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
      <div className="navigation">
        <button
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          className="nav-button"
        >
          &#10094; Previous
        </button>
        <div className="page-info">
          Page {pageNumber} of {numPages}
        </div>
        <button
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
          className="nav-button"
        >
          Next &#10095;
        </button>
      </div>
    </div>
  );
}

export default PDFViewer;
