/* =========================================
   PDF.JS
========================================= */

import {
    getDocument,
    GlobalWorkerOptions
} from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.min.mjs";


GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.worker.min.mjs";



/* =========================================
   GLOBAL VARIABLES
========================================= */

let pageFlip = null;

let currentPDF = null;



/* =========================================
   OPEN BOOK
========================================= */

async function openBook(pdfPath) {

    const viewer =
        document.getElementById("viewer");

    const container =
        document.getElementById("book-container");

    const pageNumber =
        document.getElementById("page-number");


    /* -------------------------------------
       SHOW VIEWER
    ------------------------------------- */

    viewer.classList.remove("hidden");

    container.innerHTML = "";

    pageNumber.textContent =
        "Loading book...";


    try {


        /* =================================
           LOAD PDF
        ================================= */

        const loadingTask =
            getDocument(pdfPath);

        currentPDF =
            await loadingTask.promise;



        /* =================================
           GET FIRST PAGE DIMENSIONS
        ================================= */

        const firstPage =
            await currentPDF.getPage(1);


        const firstViewport =
            firstPage.getViewport({
                scale: 1
            });


        const originalWidth =
            firstViewport.width;


        const originalHeight =
            firstViewport.height;


        const aspectRatio =
            originalWidth /
            originalHeight;



        /* =================================
           DETERMINE BOOK ORIENTATION
        ================================= */

        let bookWidth;

        let bookHeight;


        /*
         * The PageFlip library needs the
         * dimensions of ONE PAGE.
         *
         * We choose a suitable display
         * size while preserving the PDF's
         * original proportions.
         */


        const maxPageWidth =
            520;


        const maxPageHeight =
            720;


        if (aspectRatio >= 0.95 &&
            aspectRatio <= 1.05) {

            /*
             * SQUARE BOOK
             */

            bookWidth = 520;

            bookHeight = 520;

        }

        else if (aspectRatio > 1) {

            /*
             * LANDSCAPE BOOK
             */

            bookWidth =
                Math.min(
                    maxPageWidth,
                    originalWidth
                );

            bookHeight =
                bookWidth /
                aspectRatio;


            if (bookHeight > maxPageHeight) {

                bookHeight =
                    maxPageHeight;

                bookWidth =
                    bookHeight *
                    aspectRatio;

            }

        }

        else {

            /*
             * PORTRAIT BOOK
             */

            bookHeight =
                Math.min(
                    maxPageHeight,
                    originalHeight
                );

            bookWidth =
                bookHeight *
                aspectRatio;


            if (bookWidth > maxPageWidth) {

                bookWidth =
                    maxPageWidth;

                bookHeight =
                    bookWidth /
                    aspectRatio;

            }

        }



        /* =================================
           ROUND DIMENSIONS
        ================================= */

        bookWidth =
            Math.round(bookWidth);


        bookHeight =
            Math.round(bookHeight);



        /* =================================
           RENDER ALL PDF PAGES
        ================================= */

        const pages = [];


        for (
            let i = 1;
            i <= currentPDF.numPages;
            i++
        ) {


            const page =
                await currentPDF.getPage(i);


            /*
             * Render at a higher resolution
             * for better image quality.
             */

            const renderScale = 1.5;


            const viewport =
                page.getViewport({
                    scale: renderScale
                });


            const canvas =
                document.createElement(
                    "canvas"
                );


            const context =
                canvas.getContext("2d");


            canvas.width =
                viewport.width;


            canvas.height =
                viewport.height;



            await page.render({

                canvasContext:
                    context,

                viewport:
                    viewport

            }).promise;



            /*
             * Convert the page into an image.
             */

            pages.push(
                canvas.toDataURL(
                    "image/jpeg",
                    0.95
                )
            );

        }



        /* =================================
           CREATE PAGE FLIP
        ================================= */

        pageFlip =
            new St.PageFlip(
                container,
                {

                    /*
                     * These dimensions are
                     * automatically selected
                     * according to the PDF.
                     */

                    width:
                        bookWidth,

                    height:
                        bookHeight,


                    size:
                        "stretch",


                    minWidth:
                        220,

                    maxWidth:
                        650,


                    minHeight:
                        220,

                    maxHeight:
                        800,


                    showCover:
                        true,


                    drawShadow:
                        true,


                    flippingTime:
                        900,


                    useMouseEvents:
                        true,


                    mobileScrollSupport:
                        true,


                    maxShadowOpacity:
                        0.5

                }
            );



        /* =================================
           LOAD PAGES
        ================================= */

        pageFlip.loadFromImages(
            pages
        );



        /* =================================
           PAGE NUMBER
        ================================= */

        pageFlip.on(
            "flip",
            function(event) {

                const page =
                    event.data + 1;


                pageNumber.textContent =
                    "Page " +
                    page +
                    " of " +
                    currentPDF.numPages;

            }
        );



        pageNumber.textContent =
            "Page 1 of " +
            currentPDF.numPages;


    }

    catch (error) {

        console.error(
            "Error opening PDF:",
            error
        );


        pageNumber.textContent =
            "Unable to open this book.";


        alert(
            "Sorry, the book could not be opened."
        );

    }

}



/* =========================================
   CLOSE BOOK
========================================= */

function closeBook() {

    const viewer =
        document.getElementById(
            "viewer"
        );


    if (pageFlip) {

        pageFlip.destroy();

        pageFlip = null;

    }


    viewer.classList.add(
        "hidden"
    );


    document.getElementById(
        "book-container"
    ).innerHTML = "";

}



/* =========================================
   NEXT PAGE
========================================= */

function nextPage() {

    if (pageFlip) {

        pageFlip.flipNext(
            "bottom"
        );

    }

}



/* =========================================
   PREVIOUS PAGE
========================================= */

function previousPage() {

    if (pageFlip) {

        pageFlip.flipPrev(
            "bottom"
        );

    }

}



/* =========================================
   SEARCH
========================================= */

function setupSearch() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const bookCards =
        document.querySelectorAll(
            ".book-card"
        );


    const noResults =
        document.getElementById(
            "no-results"
        );



    searchInput.addEventListener(
        "input",
        function() {


            const searchTerm =
                searchInput.value
                    .toLowerCase()
                    .trim();


            let visibleBooks = 0;



            bookCards.forEach(
                function(card) {


                    const title =
                        (
                            card.dataset.title ||
                            ""
                        ).toLowerCase();


                    const category =
                        (
                            card.dataset.category ||
                            ""
                        ).toLowerCase();


                    const description =
                        (
                            card.dataset.description ||
                            ""
                        ).toLowerCase();



                    /*
                     * Search through:
                     *
                     * Book title
                     * Category
                     * Description
                     */

                    const matches =
                        title.includes(
                            searchTerm
                        ) ||

                        category.includes(
                            searchTerm
                        ) ||

                        description.includes(
                            searchTerm
                        );



                    if (matches) {

                        card.style.display =
                            "";

                        visibleBooks++;

                    }

                    else {

                        card.style.display =
                            "none";

                    }

                }
            );



            /* =================================
               NO RESULTS MESSAGE
            ================================= */

            if (
                searchTerm !== "" &&
                visibleBooks === 0
            ) {

                noResults.classList.remove(
                    "hidden"
                );

            }

            else {

                noResults.classList.add(
                    "hidden"
                );

            }

        }
    );

}



/* =========================================
   KEYBOARD CONTROLS
========================================= */

document.addEventListener(
    "keydown",
    function(event) {


        /*
         * Do nothing if the search box
         * is being used.
         */

        if (
            document.activeElement &&
            document.activeElement.id ===
                "searchInput"
        ) {

            return;

        }



        if (
            event.key === "ArrowRight"
        ) {

            nextPage();

        }



        if (
            event.key === "ArrowLeft"
        ) {

            previousPage();

        }



        if (
            event.key === "Escape"
        ) {

            closeBook();

        }

    }
);



/* =========================================
   START SEARCH
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    setupSearch
);



/* =========================================
   MAKE FUNCTIONS AVAILABLE TO HTML
========================================= */

window.openBook =
    openBook;


window.closeBook =
    closeBook;


window.nextPage =
    nextPage;


window.previousPage =
    previousPage;
