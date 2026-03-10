import quoteUtils from '.';
import { quotes } from './quotes-data';

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

    beforeEach(() => {
      quoteElement = quoteUtils.createQuoteElement();
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

    it('should apply the default font sizes', () => {
      const [textElement, sourceElement] = Array.from(quoteElement.children) as HTMLParagraphElement[];
      
      expect(textElement.style.fontSize).toBe('2rem');
      expect(sourceElement.style.fontSize).toBe('1.5rem');
    });
  });
});
