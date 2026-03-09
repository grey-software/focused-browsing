import quoteUtils from '.';
import { quotes } from './quotes-data';

// Mock webextension-polyfill-ts
jest.mock('webextension-polyfill-ts', () => ({
  browser: {
    storage: {
      local: {
        get: jest.fn().mockResolvedValue({ textSize: 'medium' })
      }
    }
  }
}));

describe('Quote Utils', () => {
  describe('getRandomQuote', () => {
    it('should return a valid quote object', () => {
      const quote = quoteUtils.getRandomQuote();
      expect(quote).toBeDefined();
      expect(quote).toHaveProperty('id');
      expect(quote).toHaveProperty('text');
      expect(quote).toHaveProperty('source');
      expect(quotes).toContain(quote);
    });
  });

  describe('createQuoteElement', () => {
    let quoteElement: HTMLDivElement;

    beforeEach(async () => {
      quoteElement = await quoteUtils.createQuoteElement();
    });

    it('should create a div with correct class', () => {
      expect(quoteElement.tagName).toBe('DIV');
      expect(quoteElement.className).toBe('focus-quote');
    });

    it('should apply the shared quote container styles', () => {
      expect(quoteElement.style.padding).toBe('20px');
      expect(quoteElement.style.margin).toBe('20px 0px');
      expect(quoteElement.style.textAlign).toBe('left');
    });

    it('should create quote text and source elements with custom styles', () => {
      const children = quoteElement.children;
      expect(children).toHaveLength(2);

      const [textElement, sourceElement] = Array.from(children) as HTMLParagraphElement[];

      // Check quote text element has custom styles applied
      expect(textElement.tagName).toBe('P');
      expect(textElement.textContent).toMatch(/^".*"$/);
      expect(textElement.style.marginBottom).toBe('1rem');
      expect(textElement.style.lineHeight).toBe('1.5');
      expect(textElement.style.fontStyle).toBe('italic');

      // Check source element has custom styles applied
      expect(sourceElement.tagName).toBe('P');
      expect(sourceElement.textContent).toMatch(/^— /);
      expect(sourceElement.style.fontStyle).toBe('italic');
      expect(sourceElement.style.opacity).toBe('0.8');
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

    it('should apply correct font sizes based on textSize setting', () => {
      const [textElement, sourceElement] = Array.from(quoteElement.children) as HTMLParagraphElement[];
      
      // Medium size should be applied (default)
      expect(textElement.style.fontSize).toBe('2rem');
      expect(sourceElement.style.fontSize).toBe('1.5rem');
    });
  });

  describe('updateQuoteTextSize', () => {
    let quoteElement: HTMLDivElement;

    beforeEach(() => {
      // Create a basic quote element structure
      quoteElement = document.createElement('div');
      const textElement = document.createElement('p');
      const sourceElement = document.createElement('p');
      textElement.textContent = '"Test quote"';
      sourceElement.textContent = '— Test Author';
      quoteElement.appendChild(textElement);
      quoteElement.appendChild(sourceElement);
    });

    it('should update font sizes for small text size', () => {
      quoteUtils.updateQuoteTextSize(quoteElement, 'small');

      const textElement = quoteElement.querySelector('p:first-child') as HTMLElement;
      const sourceElement = quoteElement.querySelector('p:last-child') as HTMLElement;

      expect(textElement.style.fontSize).toBe('1.5rem');
      expect(sourceElement.style.fontSize).toBe('1.25rem');
    });

    it('should update font sizes for large text size', () => {
      quoteUtils.updateQuoteTextSize(quoteElement, 'large');

      const textElement = quoteElement.querySelector('p:first-child') as HTMLElement;
      const sourceElement = quoteElement.querySelector('p:last-child') as HTMLElement;

      expect(textElement.style.fontSize).toBe('2.5rem');
      expect(sourceElement.style.fontSize).toBe('2rem');
    });

    it('should default to medium size for invalid textSize', () => {
      quoteUtils.updateQuoteTextSize(quoteElement, 'invalid');

      const textElement = quoteElement.querySelector('p:first-child') as HTMLElement;
      const sourceElement = quoteElement.querySelector('p:last-child') as HTMLElement;

      expect(textElement.style.fontSize).toBe('2rem');
      expect(sourceElement.style.fontSize).toBe('1.5rem');
    });

    it('should handle null quoteElement gracefully', () => {
      expect(() => {
        quoteUtils.updateQuoteTextSize(null as any, 'medium');
      }).not.toThrow();
    });
  });
});
