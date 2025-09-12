import QuoteManager from './quote-manager';
import { quotes } from './quotes';

describe('QuoteManager', () => {
  describe('getRandomQuote', () => {
    it('should return a valid quote object', () => {
      const quote = QuoteManager.getRandomQuote();
      expect(quote).toBeDefined();
      expect(quote).toHaveProperty('id');
      expect(quote).toHaveProperty('text');
      expect(quote).toHaveProperty('source');
      expect(quotes).toContain(quote);
    });
  });

  describe('createQuoteElement', () => {
    let quoteElement: HTMLDivElement;

    beforeEach(() => {
      quoteElement = QuoteManager.createQuoteElement();
    });

    it('should create a div with correct class and styling', () => {
      expect(quoteElement.tagName).toBe('DIV');
      expect(quoteElement.className).toBe('focus-quote');
      expect(quoteElement.style.padding).toBe('2rem');
      expect(quoteElement.style.textAlign).toBe('center');
    });

    it('should create quote text and source elements', () => {
      const children = quoteElement.children;
      expect(children).toHaveLength(2);

      const [textElement, sourceElement] = Array.from(children) as HTMLParagraphElement[];

      // Check quote text element
      expect(textElement.tagName).toBe('P');
      expect(textElement.textContent).toMatch(/^".*"$/); // Should be wrapped in quotes
      expect(textElement.style.fontSize).toBe('1.5rem');
      expect(textElement.style.fontStyle).toBe('italic');

      // Check source element
      expect(sourceElement.tagName).toBe('P');
      expect(sourceElement.textContent).toMatch(/^— /); // Should start with em dash
      expect(sourceElement.style.fontSize).toBe('1rem');
    });

    it('should use a quote from the quotes array', () => {
      const textElement = quoteElement.firstElementChild as HTMLParagraphElement;
      const sourceElement = quoteElement.lastElementChild as HTMLParagraphElement;

      // Remove quotes and em dash for comparison
      const text = textElement.textContent?.slice(1, -1); // Remove surrounding quotes
      const source = sourceElement.textContent?.slice(2); // Remove em dash and space

      // Find matching quote
      const matchingQuote = quotes.find(q => q.text === text && q.source === source);
      expect(matchingQuote).toBeDefined();
    });
  });
});
