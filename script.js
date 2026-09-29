import {
    getDocument,
    GlobalWorkerOptions
} from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.min.mjs";


/* PDF.js worker */

GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.worker.min.mjs";


let pageFlip = null;

let currentPDF = null;


/* --------------------------------
   OPEN BOOK
-------------------------------- */

async function openBook(pdfPath) {

    const viewer =
        document.getElementById("viewer");

    const container =
        document.getElementById("book-container");

    const pageNumber =
        document.getElementById("page-number");


    viewer.classList.remove("hidden");

    container.innerHTML = "";

    pageNumber.textContent =
        "Loading book...";


    try {

        const loadingTask =
            getDocument(pdfPath);

        currentPDF =
            await loadingTask.promise;


        const pages = [];


        /* Render every PDF page */

        for (
            let i = 1;
            i <= currentPDF.numPages;
            i++
        ) {

            const page =
                await currentPDF.getPage(i);


            const viewport =
                page.getViewport({
                    scale: 1.5
                });


            const canvas =
                document.createElement("canvas");


            const context =
                canvas.getContext("2d");


            canvas.width =
                viewport.width;

            canvas.height =
                viewport.height;


            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;


            pages.push(
                canvas.toDataURL("image/jpeg", 0.95)
            );

        }


        /* Create flipbook */

        pageFlip =
            new St.PageFlip(
                container,
                {

                    width: 500,

                    height: 700,

                    size: "stretch",

                    minWidth: 280,

                    maxWidth: 600,

                    minHeight: 400,

                    maxHeight: 850,

                    showCover: true,

                    drawShadow: true,

                    flippingTime: 900,

                    useMouseEvents: true,

                    mobileScrollSupport: true

                }
            );


        pageFlip.loadFromImages(pages);


        pageFlip.on(
            "flip",
            function(event) {

                const page =
                    event.data + 1;

                pageNumber.textContent =
                    "Page " + page +
                    " of " +
                    currentPDF.numPages;

            }
        );


        pageNumber.textContent =
            "Page 1 of " +
            currentPDF.numPages;


    } catch (error) {

        console.error(error);

        pageNumber.textContent =
            "Unable to open this book.";

        alert(
            "Sorry, the book could not be opened."
        );

    }

}


/* --------------------------------
   CLOSE BOOK
-------------------------------- */

function closeBook() {

    const viewer =
        document.getElementById("viewer");


    if (pageFlip) {

        pageFlip.destroy();

        pageFlip = null;

    }


    viewer.classList.add("hidden");


    document.getElementById(
        "book-container"
    ).innerHTML = "";

}


/* --------------------------------
   NEXT PAGE
-------------------------------- */

function nextPage() {

    if (pageFlip) {

        pageFlip.flipNext(
            "bottom"
        );

    }

}


/* --------------------------------
   PREVIOUS PAGE
-------------------------------- */

function previousPage() {

    if (pageFlip) {

        pageFlip.flipPrev(
            "bottom"
        );

    }

}


/* --------------------------------
   MAKE FUNCTIONS AVAILABLE
   TO HTML BUTTONS
-------------------------------- */

window.openBook =
    openBook;

window.closeBook =
    closeBook;

window.nextPage =
    nextPage;

window.previousPage =
    previousPage;
