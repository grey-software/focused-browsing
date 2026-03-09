import { quotes } from './quotes-data';

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

const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

const createQuoteElement = (): HTMLDivElement => {
  const quote = getRandomQuote();
  const quoteDiv = document.createElement('div');
  quoteDiv.className = 'focus-quote';
  Object.assign(quoteDiv.style, customStyles.quoteContainer);

  const quoteText = document.createElement('p');
  Object.assign(quoteText.style, customStyles.quoteText);
  quoteText.style.fontSize = '2rem';

  const quoteSource = document.createElement('p');
  Object.assign(quoteSource.style, customStyles.quoteSource);
  quoteSource.style.fontSize = '1.5rem';

  quoteText.textContent = `"${quote.text}"`;
  quoteSource.textContent = `— ${quote.source}`;

  quoteDiv.appendChild(quoteText);
  quoteDiv.appendChild(quoteSource);

  return quoteDiv;
}

export default {
  getRandomQuote,
  createQuoteElement,
}
