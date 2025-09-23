/**
 * Universal utilities for DOM element manipulation.
 * This approach works consistently across all websites and maintains element structure.
 */

/**
 * Hides an element by removing all its children and returning them for later restoration.
 * @param element The element whose children should be removed
 * @returns Array of removed children nodes, or empty array if element is null/undefined
 */
export function hideElementChildren(element: Element | null): Node[] {
  if (!element) return [];
  
  const children = Array.from(element.children);
  children.forEach(child => element.removeChild(child));
  return children;
}

/**
 * Restores previously hidden element by re-appending the stored children.
 * @param element The element to restore children to
 * @param children Array of children nodes to restore
 */
export function restoreElementChildren(element: Element | null, children: Node[]): void {
  if (!element || !children.length) return;
  
  children.forEach(child => element.appendChild(child));
}

/**
 * Convenience function that hides multiple elements and returns a restore function.
 * This provides a functional interface while keeping concerns separated.
 * @param elements Array of elements to hide
 * @returns Function that restores all hidden elements
 */
export function hideElements(elements: (Element | null)[]): () => void {
  const hiddenChildren: { element: Element; children: Node[] }[] = [];
  
  elements.forEach(element => {
    if (element) {
      const children = hideElementChildren(element);
      if (children.length > 0) {
        hiddenChildren.push({ element, children });
      }
    }
  });
  
  // Return restore function
  return () => {
    hiddenChildren.forEach(({ element, children }) => {
      restoreElementChildren(element, children);
    });
  };
}

/**
 * Clears an array by setting its length to 0.
 * Useful for cleaning up element storage arrays.
 * @param elements Array to clear
 */
export function clearElements(elements: any[]): void {
  elements.length = 0;
}