//@ts-check

import {
    genresObject,
    authors,
    books,
    BOOKS_PER_PAGE
  } from "./data.js";

  /**
   * Encapsulates the logic for getting an HTML element from the DOM by its label.
   * Provides a clear interface for retrieving elements and handles error cases when the element is not found.
   *
   * @param {string} label - The identifying element from the DOM
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
   * Encapsulates the logic for creating and populating option elements for a given object.
   * Abstracts away repetitive code and provides a clean and reusable way to generate options for dropdown menus.
   *
   * @param {string} text - The text for the first option element
   * @param {object} object - The object containing key-value pairs for the options
   * @returns {DocumentFragment} - The document fragment containing the option elements
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
   * Encapsulates the logic for creating the inner HTML for a book element.
   * Takes in the book object and index and generates the appropriate HTML structure.
   *
   * @param {Object} prop - The book object.
   * @param {string} prop.id - The unique identifier of the book.
   * @param {string} prop.image - The URL of the book's image.
   * @param {string} prop.title - The title of the book.
   * @param {string} prop.author - The author of the book represented by a UUID.
   * @param {number} index - The index associated with the book.
   * @returns {HTMLElement} - The created booksElement.
   */
  export const innerHTML = (prop, index) => {
    if (typeof prop !== "object" || prop === null) {
      throw new Error(`The book object must be an object with properties: id, image, title, author. Received ${typeof prop}.`);
    }
    const { id, image, title, author } = prop;

    const booksElement = document.createElement("div");
    booksElement.dataset.index = `${index}`;
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
    // I have applied encapsulation by separating UI-related functionality from data-related functionality. The getHtmlElement function encapsulates the logic for retrieving elements from the DOM, and the optionsCreate function encapsulates the logic for generating option elements for dropdown menus. These functions provide a clear interface and improve code modularity.

    // I have also improved error handling by providing more informative and specific error messages when errors occur in the innerHTML function.

    // Additionally, I have improved the naming and clarity of variables and functions throughout the code to enhance readability and maintainability.





//     When converting the book preview to a component, you may face challenges related to the component's structure, data binding and rendering, and event handling. These include deciding how the component should be structured, handling dynamic data efficiently, and managing interactive elements within the component.

// Other elements that are suitable for conversion into web components are dropdown menus, modal windows, and tabs/accordions. These elements have reusable functionality and can be easily customized and integrated into different parts of an application.

// Keeping HTML, CSS, and JavaScript in a single file can be advantageous for smaller projects or simple components. It simplifies distribution, improves portability, and reduces the number of HTTP requests needed to load the component. However, as the project grows larger or more complex, separating the code into separate files or using modularization techniques becomes more beneficial for code organization, reusability, and scalability.