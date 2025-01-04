import axios from 'axios';
import { colord, getFormat } from 'colord';
import { handleAuthError } from './auth';

/**
 * Adds scroll to a child element.
 *
 * @param {HTMLElement} childElement the element to add scroll to
 * @return {boolean | number} `height` if the child element is scrollable
 */
export const addScroll = childElement => {
  const parent = childElement.parentElement;
  const exceeds = childElement.scrollWidth > parent.clientWidth;
  const leftButton = parent.querySelector('.left');
  const rightButton = parent.querySelector('.right');
  let bindEvent;

  const isScrollable = childElement.scrollWidth > childElement.clientWidth;

  if (exceeds && isScrollable) {
    let isMouseDown = false;
    let startX;
    let scrollLeft;

    const handleDrag = e => {
      if (!isMouseDown) return;
      const x = e.pageX - startX;
      childElement.scrollLeft = scrollLeft - x;
      updateButtonVisibility();
    };

    const handleMouseUp = () => {
      if (!isMouseDown) return;
      isMouseDown = false;
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleMouseUp);
      childElement.style.removeProperty('cursor');
      childElement.style.removeProperty('user-select');
    };
    bindEvent = e => {
      isMouseDown = true;
      startX = e.pageX;
      scrollLeft = childElement.scrollLeft;

      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleMouseUp);
      childElement.style.cursor = 'grabbing';
      childElement.style.userSelect = 'none';
    };

    childElement.addEventListener('mousedown', bindEvent);

    leftButton.addEventListener('click', () => {
      childElement.scrollBy({
        left: -60,
        behavior: 'smooth',
      });
      updateButtonVisibility();
    });

    rightButton.addEventListener('click', () => {
      childElement.scrollBy({
        left: 60,
        behavior: 'smooth',
      });
      updateButtonVisibility();
    });

    const updateButtonVisibility = () => {
      const maxScroll = childElement.scrollWidth - childElement.clientWidth;

      leftButton.style.opacity = childElement.scrollLeft > 0 ? 1 : 0;
      rightButton.style.opacity = childElement.scrollLeft < maxScroll ? 1 : 0;

      leftButton.style.pointerEvents = childElement.scrollLeft > 0 ? 'auto' : 'none';
      rightButton.style.pointerEvents = childElement.scrollLeft < maxScroll ? 'auto' : 'none';
    };

    updateButtonVisibility();
  }

  if (!isScrollable) {
    childElement.removeEventListener('mousedown', bindEvent);
    leftButton.style.opacity = 0;
    leftButton.style.pointerEvents = 'none';
    rightButton.style.opacity = 0;
    rightButton.style.pointerEvents = 'none';
  } else {
    rightButton.parentElement && (rightButton.parentElement.parentElement.height = childElement.clientHeight);
    rightButton.style.opacity = 1;
    rightButton.style.pointerEvents = 'auto';
  }

  window.addEventListener('resize', () => addScroll(childElement), { once: true });

  return isScrollable ? childElement.clientHeight : false;
};

/**
 * Check if a string ends with a specific value.
 *
 * @param {string} string - The input string to check
 * @param {string|string[]} value - The value or values to check against
 * @return {boolean} Returns true if the string ends with the specified value, otherwise false
 */
export const stringEndWith = (string, value) => {
  if (typeof value === 'string') return string.endsWith(value);
  if (Array.isArray(value)) return value.some(v => string.endsWith(v));
  return false;
};

/**
 * Copies the given text to the clipboard using the navigator.clipboard API.
 *
 * @param {string} text - The text to be copied to the clipboard.
 * @return {Promise<boolean>} A Promise that resolves to true if the text was successfully copied, false otherwise.
 */
export const copyToClipboard = text => {
  return new Promise(async resolve => {
    try {
      await navigator.clipboard.writeText(text);
      resolve(true);
    } catch {
      resolve(false);
    }
  });
};

/**
 * Check if the given link corresponds to the current page pathname.
 *
 * @param {object} link - The link object to check.
 * @param {string} pathname - The current page's pathname.
 * @return {boolean} Returns true if the link corresponds to the current page pathname, false otherwise.
 */
export const isCurrentPage = (link, pathname) =>
  (link.alias && pathname.includes(link.alias)) || (pathname === '/' && link.href === '/') || (pathname !== '/' && link.href !== '/' && pathname.includes(link.href));

/**
 * Function that calculates the luminance of a color and returns true if it is light and false if it is dark.
 *
 * @param {string} color - the color to calculate the luminance for
 * @return {boolean} true if the color is light, false if it is dark
 */
export const getShade = color => {
  if (!getFormat(color)) return console.warn('Invalid color format');
  let hex = color;
  if (getFormat(color) !== 'hex') hex = colord(color).toHex();
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? true : false;
};

/**
 * Converts a color name to its RGBA equivalent.
 *
 * @param {string} color - The name of the color to convert.
 * @return {string|null} The RGBA representation of the color, or null if conversion failed.
 */
export function toRGB(color) {
  // Create a temporary element to compute styles
  const tempElement = document.createElement('div');
  tempElement.style.color = color;

  document.body.appendChild(tempElement);

  const computedColor = getComputedStyle(tempElement).color;

  document.body.removeChild(tempElement);

  const rgbaMatch = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);

  if (rgbaMatch) {
    const [, r, g, b, a = '1'] = rgbaMatch;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  return null;
}

/**
 * ApplyPrototypes function to extend String prototype with advanceTrim method.
 *
 */
export const ApplyPrototypes = () => {
  /**
   * A function that trims white spaces from the beginning and end of a string.
   *
   * @return {string} The trimmed string.
   */
  String.prototype.advanceTrim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
};

// Create axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle specific authentication errors
    if (error.response?.data?.remark === 'authentication_error') {
      handleAuthError(error);
    }
    return Promise.reject(error);
  }
);
