import optionsHtml from './options.html';

import './options';

describe('options.ts', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    const options = document.createElement('div');
    options.innerHTML = optionsHtml;
    document.body.appendChild(options);
  });

  it('renders the separate settings scaffold', () => {
    const title = document.querySelector('.hero-title') as HTMLElement;
    expect(title.textContent).toBe('Settings');
  });

  it('does not render a placeholder settings container', () => {
    expect(document.querySelector('.surface')).toBeNull();
  });
});
