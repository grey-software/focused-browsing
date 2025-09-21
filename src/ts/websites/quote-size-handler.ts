import { SIZE_MAP, SizeKey } from '../constants/size-map';

/**
 * Shared utility for handling text size changes on quote elements
 */
export class QuoteSizeHandler {
  /**
   * Updates the font size of quote text and source elements
   * @param quoteElement - The quote container element
   * @param textSize - The size key (small, medium, large, xlarge)
   */
  static updateQuoteTextSize(quoteElement: HTMLDivElement, textSize: string): void {
    if (!quoteElement) return;

    const sizes = SIZE_MAP[textSize as SizeKey] || SIZE_MAP.medium;
    const quoteText = quoteElement.querySelector('p:first-child') as HTMLElement;
    const quoteSource = quoteElement.querySelector('p:last-child') as HTMLElement;
    
    if (quoteText) {
      quoteText.style.fontSize = sizes.quote;
    }
    if (quoteSource) {
      quoteSource.style.fontSize = sizes.source;
    }
  }
}