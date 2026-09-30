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
           GET FIRST PAGE SIZE
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
           CALCULATE BOOK SIZE
        ================================= */

        let bookWidth;

        let bookHeight;


        const maxPageWidth =
            520;

        const maxPageHeight =
            720;



        /* SQUARE */

        if (
            aspectRatio >= 0.95 &&
            aspectRatio <= 1.05
        ) {

            bookWidth = 520;

            bookHeight = 520;

        }


        /* LANDSCAPE */

        else if (aspectRatio > 1) {

            bookWidth =
                maxPageWidth;

            bookHeight =
                bookWidth /
                aspectRatio;


            if (
                bookHeight >
                maxPageHeight
            ) {

                bookHeight =
                    maxPageHeight;

                bookWidth =
                    bookHeight *
                    aspectRatio;
            }

        }


        /* PORTRAIT */

        else {

            bookHeight =
                maxPageHeight;

            bookWidth =
                bookHeight *
                aspectRatio;


            if (
                bookWidth >
                maxPageWidth
            ) {

                bookWidth =
                    maxPageWidth;

                bookHeight =
                    bookWidth /
                    aspectRatio;
            }

        }



        /* =================================
           ROUND NUMBERS
        ================================= */

        bookWidth =
            Math.round(bookWidth);

        bookHeight =
            Math.round(bookHeight);



        /* =================================
           RENDER PDF PAGES
        ================================= */

        const pages = [];


        for (
            let i = 1;
            i <= currentPDF.numPages;
            i++
        ) {


            const page =
                await currentPDF.getPage(i);


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



            pages.push(
                canvas.toDataURL(
                    "image/jpeg",
                    0.95
                )
            );

        }



        /* =================================
           CREATE FLIPBOOK
        ================================= */

        pageFlip =
            new St.PageFlip(
                container,
                {

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
                        0.5,

                    /*
                     * Allow buttons and other
                     * HTML elements outside the
                     * book to receive clicks.
                     */

                    clickEventForward:
                        true

                }
            );



        /* =================================
           LOAD PAGES
        ================================= */

        pageFlip.loadFromImages(
            pages
        );



        /* =================================
           PAGE FLIP EVENT
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
   NEXT PAGE
========================================= */

function nextPage() {

    if (
        pageFlip &&
        currentPDF
    ) {

        console.log(
            "Next button clicked"
        );


        pageFlip.flipNext();

    }

}



/* =========================================
   PREVIOUS PAGE
========================================= */

function previousPage() {

    if (
        pageFlip &&
        currentPDF
    ) {

        console.log(
            "Previous button clicked"
        );


        pageFlip.flipPrev();

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


    currentPDF = null;


    viewer.classList.add(
        "hidden"
    );


    document.getElementById(
        "book-container"
    ).innerHTML = "";

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
         * Don't turn pages while typing
         * in the search box.
         */

        if (
            document.activeElement &&
            document.activeElement.id ===
                "searchInput"
        ) {

            return;

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            nextPage();

        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            previousPage();

        }


        if (
            event.key ===
            "Escape"
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
