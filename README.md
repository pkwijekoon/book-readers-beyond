# 📚 Book Readers & Beyond

**A digital library for stories, books, imagination, and learning.**

Book Readers & Beyond is a web-based digital book library designed to present illustrated books and other publications in an accessible, reader-friendly format.

The project uses **GitHub Pages**, HTML, CSS, and JavaScript to create a simple online reading experience, including an interactive PDF flipbook viewer.

---

## 🌷 About the Project

The goal of **Book Readers & Beyond** is to provide a welcoming online space where readers can explore and enjoy digital books.

The website is designed to support:

* 📖 Children's storybooks
* 🌈 Illustrated books
* 📚 Other digital publications
* 🔄 Interactive PDF flipbook viewing
* 📱 Mobile-friendly reading
* 💻 Desktop and tablet viewing

The collection may grow over time as new books and publications are added.

---

## ✨ Features

* 📚 Digital book library
* 🖼️ Book cover previews
* 📖 Interactive page-turning experience
* ◀ Previous / Next page navigation
* 📱 Responsive design
* 💻 Desktop and mobile support
* 📄 PDF-based books
* 🌐 Hosted using GitHub Pages

---

## 🗂️ Project Structure

```text
book-readers-beyond/
│
├── index.html
├── style.css
├── script.js
├── LICENSE
├── README.md
│
├── books/
│   ├── be-kind-to-every-creature.pdf
│   └── ...
│
└── covers/
    ├── be-kind-to-every-creature.jpg
    └── ...
```

### Main files

**`index.html`**
Contains the structure and content of the digital library and book viewer.

**`style.css`**
Controls the visual appearance, layout, typography, buttons, book cards, and responsive design.

**`script.js`**
Controls PDF loading and the interactive page-turning book viewer.

**`books/`**
Contains the PDF books made available through the website.

**`covers/`**
Contains the cover images displayed in the digital library.

**`LICENSE`**
Contains the MIT License that applies to the website source code as described below.

---

## 📖 How to Add a New Book

To add another book to the library:

### 1. Add the PDF

Place the PDF inside:

```text
books/
```

For example:

```text
books/my-new-book.pdf
```

### 2. Add the cover

Place the cover image inside:

```text
covers/
```

For example:

```text
covers/my-new-book.jpg
```

### 3. Add the book card

Add a new book card to `index.html` using the appropriate PDF and cover filenames.

Example:

```html
<article class="book-card">

    <img
        src="covers/my-new-book.jpg"
        alt="My New Book cover"
    >

    <h3>
        My New Book
    </h3>

    <p>
        A short description of the book.
    </p>

    <button
        onclick="openBook('books/my-new-book.pdf')">

        📖 Read Book

    </button>

</article>
```

After committing the changes, GitHub Pages will publish the updated website.

---

## 🌐 Website

The website is published using **GitHub Pages**.

The project site will normally be available at:

```text
https://YOUR-GITHUB-USERNAME.github.io/book-readers-beyond/
```

Replace `YOUR-GITHUB-USERNAME` with the GitHub username associated with this repository.

---

## 🛠️ Technologies

This project uses:

* HTML5
* CSS3
* JavaScript
* PDF.js
* StPageFlip
* GitHub
* GitHub Pages

PDF.js is used to render PDF documents in the browser.

StPageFlip is used to create the interactive page-turning experience.

---

## 📜 Licensing

### Website source code

The original website source code in this repository, including the HTML, CSS, and JavaScript created for this project, is licensed under the:

**MIT License**

See the [`LICENSE`](LICENSE) file for the complete license text.

The MIT License permits reuse, modification, distribution, and other uses of the licensed software subject to its terms.

### Books and creative content

**The books, stories, poems, illustrations, artwork, cover images, characters, and other original creative content contained in this project are NOT licensed under the MIT License.**

Unless a particular work states otherwise, these materials are:

**Copyright © 2026 Pushpakanthie Wijekoon. All rights reserved.**

The MIT License for the website source code does **not** grant permission to copy, reproduce, modify, publish, distribute, sell, or create derivative works from the books or other original creative content.

If a particular book or asset has a different copyright holder or license, the terms specifically associated with that work apply.

---

## © Copyright

Copyright © 2026 Pushpakanthie Wijekoon

All rights reserved for original books, stories, illustrations, artwork, cover images, and other creative works unless otherwise stated.

---

## 🤝 Contributions

Suggestions and improvements to the website code are welcome.

If you would like to contribute to the software portion of this project, please ensure that your contribution is compatible with the project's MIT License.

Contributions do not automatically grant permission to use or redistribute copyrighted books or other creative works contained in the repository.

---

## ⚠️ Third-Party Libraries

This project may use third-party libraries and resources.

Third-party software remains subject to its own respective licenses and copyright notices.

Users should review the applicable license terms of third-party components before redistributing them independently.

---

## 🌱 Project Vision

Book Readers & Beyond is intended to grow into a simple and welcoming digital space where readers can discover stories, explore books, and enjoy the experience of reading online.

**Stories inspire imagination.
Books open new worlds.
Kindness makes every story better.** 🌷

---

## 👩‍💻 Maintainer

**Pushpakanthie Wijekoon**

Book Readers & Beyond
