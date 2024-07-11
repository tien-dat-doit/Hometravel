import { useState } from 'react';
import { Document, Page } from 'react-pdf';


function ViewPDF({file}: any) {
    const [numPages, setNumPages] = useState();
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }: any) {
        setNumPages(numPages);
    }

    return (
        <div className="pdf-div">
            <p>
                Page {pageNumber} of {numPages}
            </p>
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess} onLoadError={console.error}>
                {Array.apply(null, Array(numPages))
                    .map((x, i) => i + 1)
                    .map((page : any) => {
                        return (
                            <Page
                                pageNumber={page}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                // className="mx-auto mb-4 max-w-full"
                            />
                        );
                    })}
            </Document>
        </div>
    );
}
export default ViewPDF;
