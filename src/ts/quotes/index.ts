import { quotes } from './quotes-data';
import { browser } from 'webextension-polyfill-ts';
import { SIZE_MAP, SizeKey } from './text-size';

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

const createQuoteElement = async (): Promise<HTMLDivElement> => {
  const quote = getRandomQuote();
  const quoteDiv = document.createElement('div');
  quoteDiv.className = 'focus-quote';
  Object.assign(quoteDiv.style, customStyles.quoteContainer);

  const quoteText = document.createElement('p');
  Object.assign(quoteText.style, customStyles.quoteText);

  const quoteSource = document.createElement('p');
  Object.assign(quoteSource.style, customStyles.quoteSource);

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
  updateQuoteTextSize,
}