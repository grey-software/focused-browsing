import { quotes } from './quotes-data';
import { browser } from 'webextension-polyfill-ts';
import { SIZE_MAP, SizeKey } from '../constants/size-map';

// Custom styles for quotes
const customStyles = {
  quoteContainer: {
    padding: '20px',
    margin: '20px 0',
    textAlign: 'left',
  },
  quoteText: {
    marginBottom: '1rem',
    lineHeight: '1.5',
    fontStyle: 'italic',
  },
  quoteSource: {
    fontStyle: 'italic',
    opacity: '0.8',
  },
};

// Quote size handler utility
const updateQuoteTextSize = (quoteElement: HTMLDivElement, textSize: string): void => {
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

const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

const createQuoteElement = (): HTMLDivElement => {
  const quote = getRandomQuote();
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

const createSimpleQuoteElement = async (): Promise<HTMLDivElement> => {
  const quote = getRandomQuote();
  const quoteDiv = document.createElement('div');
  quoteDiv.className = 'focus-quote-simple';
  Object.assign(quoteDiv.style, customStyles.quoteContainer);

  const quoteText = document.createElement('p');
  Object.assign(quoteText.style, customStyles.quoteText);

  const quoteSource = document.createElement('p');
  Object.assign(quoteSource.style, customStyles.quoteSource);

  // Get size settings and apply to both text and source
  const settings = await browser.storage.local.get(['textSize']);
  const textSize = settings.textSize || 'medium';
  const sizes = SIZE_MAP[textSize as SizeKey];
  
  quoteText.style.fontSize = sizes.quote;
  quoteSource.style.fontSize = sizes.source;

  quoteText.textContent = `"${quote.text}"`;
  quoteSource.textContent = `— ${quote.source}`;

  quoteDiv.appendChild(quoteText);
  quoteDiv.appendChild(quoteSource);

  return quoteDiv;
}

export default {
  getRandomQuote,
  createQuoteElement,
  createSimpleQuoteElement,
  updateQuoteTextSize,
}