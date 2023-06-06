import { selectors, getHtmlElement } from "./utilities.js";
import { BOOKS_PER_PAGE } from "./data.js";

/**
 * Best abstraction: loadedTracker function
 * - Encapsulates the logic for tracking loaded books
 * - Provides a clear interface for interacting with the tracker
 *
 * @param {Array} prop - Array of books
 * @returns {Object} - Object with tracking methods
 */
export const loadedTracker = (prop) => {
  if (typeof prop !== "object" || prop === null) {
    throw new Error(`${prop} needed to be an array. Expected an array, received ${typeof prop}.`);
  }

  let tracker = 0;

  const increase = () => {
    tracker += BOOKS_PER_PAGE;
  };

  /**
   * Worst abstraction: checker method
   * - Mixes tracking logic with UI-related functionality
   * - Violates SRP by directly accessing DOM element and updating its text content
   * - Can be improved by separating UI-related functionality to a separate function/module responsible for handling UI updates
   *
   * @returns {HTMLElement} - Updated button element
   */
  const checker = () => {
    let booksLeft = prop.length - BOOKS_PER_PAGE - tracker;
    let btnText = booksLeft > 0 ? booksLeft : 0;
    const button = getHtmlElement(".list__remaining", selectors.loadMore);
    button.textContent = `(${btnText})`;
    return button;
  };

  /**
   * Worst abstraction: refValue method
   * - Unclear and non-descriptive name
   * - Suggests a generic reference value instead of its purpose
   * - Can be improved by using a more descriptive name to enhance code readability and maintainability
   *
   * @returns {Number} - Current value of the tracker
   */
  const refValue = () => {
    return tracker;
  };

  /**
   * Best abstraction: loaded method
   * - Abstracts the behavior of calculating the number of loaded books
   * - Provides a clear and descriptive name
   *
   * @returns {Number} - Number of loaded books
   */
  const loaded = () => {
    let booksLoaded = BOOKS_PER_PAGE + tracker;
    return booksLoaded;
  };

  return {
    increase,
    checker,
    refValue,
    loaded,
  };
};
