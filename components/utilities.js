//@ts-check

import {
    genresObject,
    authors,
    books,
    BOOKS_PER_PAGE
} from "./data.js";



// WORST
// Lack of separation of concerns:
// The code mixes UI-related functionality (DOM manipulation) with data-related functionality (loading books, updating button text, etc.).
// This violates the Single Responsibility Principle (SRP) and makes the code less maintainable.

// Naming and clarity:
// The variable names in the code are not consistently clear and descriptive.
// Improving the naming conventions would enhance code readability and understandability.
// To improve the three worst abstractions using SOLID principles:

// Single Responsibility Principle (SRP): Separate the UI-related functionality from the data-related functionality. Move the DOM manipulation code to a separate module or function responsible for handling UI updates. This way, each component or module will have a single responsibility.

// Open/Closed Principle (OCP): Enhance error handling in the innerHTML function by throwing custom error classes or specific error messages that provide meaningful information about the cause of the error. This allows for better extensibility and easier maintenance.

// Naming and clarity: Refactor the variable names to be more descriptive and consistent. Use clear and meaningful names that accurately represent the purpose of the variables and functions. This will improve code readability and maintainability.

/**
 * getHtmlElement function:
 * It abstracts the process of getting an element from the DOM by its label.
 * It provides a clear interface for retrieving elements and handles error cases when the element is not found.
 * This improves code readability and reusability.
 * Function that gets the needed element from the DOM
 *
 * @param {string} label - Represent the identifying element from the DOM
 * @param {HTMLElement} [target]
 * @returns {HTMLElement}
 */
export const getHtmlElement = (label, target) => {
    const scope = target || document;
    const node = scope.querySelector(`${label}`);
    if (!(node instanceof HTMLElement)) {
        throw new Error(`${label} element not found in HTML`);
    }
    return node;
};

/**
 * Object containing all query selectors
 */
export const selectors = {
    list: getHtmlElement("[data-list-items]"),
    message: getHtmlElement("[data-list-message]"),
    loadMore: getHtmlElement("[data-list-button]"),
    previewOverlay: {
        overlay: getHtmlElement("[data-list-active]"),
        overlayBtn: getHtmlElement("[data-list-close]"),
        overlayBlur: getHtmlElement("[data-list-blur]"),
        overlayImage: getHtmlElement("[data-list-image]"),
        titleOverlay: getHtmlElement("[data-list-title]"),
        dataOverlay: getHtmlElement("[data-list-subtitle]"),
        infoOverlay: getHtmlElement("[data-list-description]"),
    },
    theme: {
        themeBtn: getHtmlElement("[data-header-settings]"),
        themeOverlay: getHtmlElement("[data-settings-overlay]"),
        themeCancelBtn: getHtmlElement("[data-settings-cancel]"),
        themeForm: getHtmlElement("[data-settings-form]"),
        themeSelect: getHtmlElement("[data-settings-theme]"),
    },
    search: {
        searchBtn: getHtmlElement("[data-header-search]"),
        searchOverlay: getHtmlElement("[data-search-overlay]"),
        searchCancelBtn: getHtmlElement("[data-search-cancel]"),
        searchForm: getHtmlElement("[data-search-form]"),
    },
    genresSelect: getHtmlElement("[data-search-genres]"),
    authorSelect: getHtmlElement("[data-search-authors]"),
    title: getHtmlElement("[data-search-title]"),
    outline: getHtmlElement(".overlay__button"),
};

export const css = {
    day: {
        dark: "10, 10, 20",
        light: "255, 255, 255",
    },
    night: {
        dark: "255, 255, 255",
        light: "10, 10, 20",
    },
};

selectors.outline.style.outline = "0"; // Fixing the outline bug with the overlay close button

/**
 *optionsCreate function:
 It encapsulates the logic for creating and populating option elements for a given object.
 It abstracts away the repetitive code and provides a clean and reusable way to generate options for dropdown menus.
 This promotes code modularity and maintainability.
 * @param {string} text
 * @param {object} object
 * @returns {DocumentFragment}
 */
const optionsCreate = (text, object) => {
    const fragment = document.createDocumentFragment();
    const allOption = document.createElement("option");
    allOption.value = "All";
    allOption.innerText = text;
    fragment.appendChild(allOption);

    for (const [keyValue, property] of Object.entries(object)) {
        const option = document.createElement("option");
        option.value = keyValue;
        option.innerText = property;
        fragment.appendChild(option);
    }

    return fragment;
};

selectors.genresSelect.appendChild(optionsCreate("All genres", genresObject));
selectors.authorSelect.appendChild(optionsCreate("All authors", authors));

// Set the colors of the preview overlay text to correspond with the theme change
selectors.previewOverlay.titleOverlay.style.color = `rgba(var(--color-dark))`;
selectors.previewOverlay.dataOverlay.style.color = `rgba(var(--color-dark))`;
selectors.previewOverlay.infoOverlay.style.color = `rgba(var(--color-dark))`;

/**
 * innerHTML function:
 * It abstracts the process of creating the inner HTML for a book element.
 * It takes in the book object and index and generates the appropriate HTML structure.
 * This abstraction improves code readability and separates the creation of the book element from the rest of the code logic.
 *
 *
 * Worst
 * Error handling:
 * The code throws a generic error when the prop parameter is not of the expected type in the innerHTML function.
 * It would be better to provide a more informative and specific error message to aid in debugging.
 * @param {Object} prop - The book (in the form of an object).
 * @param {string} prop.id - The unique identifier of the book.
 * @param {string} prop.image - The URL of the book's image.
 * @param {string} prop.title - The title of the book.
 * @param {string} prop.author - The author of the book represented by a UUID, which correlates with the key values in the authors Object.
 * @param {number} index - The index associated with the book.
 * @returns {HTMLElement} - The created booksElement.
 */
export const innerHTML = (prop, index) => {
    if (typeof prop !== "object" || prop === null) {
        throw new Error(`${prop} needed to be an object with the following properties: id, title, author. Expected an object, received ${typeof prop}.`);
    }
    const {
        id,
        image,
        title,
        author
    } = prop;

    const booksElement = document.createElement("div");
    booksElement.dataset.index = `${index}`; // Retrieving the index to make it easier to fetch data for future use
    booksElement.className = "preview";
    booksElement.id = id;
    booksElement.innerHTML = `<img src=${image} class='preview__image' alt="${title} book image"></img>
  <div class="preview__info">
    <h3 class="preview__title">${title}</h3>
    <div class="preview__author">${authors[author]}</div>
  </div>`;
    return booksElement;
};

// Initial loading of the first 36 books
for (let i = 0; i < BOOKS_PER_PAGE; i++) {
    selectors.list.appendChild(innerHTML(books[i], i));
}

// Changing the text content of the "Show more" button
selectors.loadMore.innerHTML = `<span>Show more</span>
<span class="list__remaining">(${books.length - BOOKS_PER_PAGE})</span>`;