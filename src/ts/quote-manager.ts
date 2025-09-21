import { quotes } from './quotes';

export default class QuoteManager {
  static getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }

  static createQuoteElement(): HTMLDivElement {
    const quote = this.getRandomQuote();
    const quoteDiv = document.createElement('div');
    quoteDiv.className = 'focus-quote';
    quoteDiv.style.cssText = `
      padding: 2rem;
      text-align: center;
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 800px;
      margin: 2rem auto;
      background: var(--focus-quote-bg, #f8f9fa);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    const quoteText = document.createElement('p');
    quoteText.style.cssText = `
      font-size: 1.5rem;
      line-height: 1.6;
      color: var(--focus-quote-text, #2c3e50);
      margin-bottom: 1rem;
      font-style: italic;
    `;
    quoteText.textContent = `"${quote.text}"`;

    const quoteSource = document.createElement('p');
    quoteSource.style.cssText = `
      font-size: 1rem;
      color: var(--focus-quote-source, #7f8c8d);
      margin: 0;
    `;
    quoteSource.textContent = `— ${quote.source}`;

    quoteDiv.appendChild(quoteText);
    quoteDiv.appendChild(quoteSource);

    return quoteDiv;
  }

  static createSimpleQuoteElement(): HTMLDivElement {
    const quote = this.getRandomQuote();
    const quoteDiv = document.createElement('div');
    quoteDiv.className = 'focus-quote-simple';
    quoteDiv.style.cssText = `
      padding: 20px;
      margin: 20px 0;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      text-align: left;
    `;

    const quoteText = document.createElement('p');
    quoteText.style.marginBottom = '0.5rem';
    quoteText.textContent = `"${quote.text}"`;

    const quoteSource = document.createElement('p');
    quoteSource.style.fontStyle = 'italic';
    quoteSource.textContent = `— ${quote.source}`;

    quoteDiv.appendChild(quoteText);
    quoteDiv.appendChild(quoteSource);

    return quoteDiv;
  }
}
