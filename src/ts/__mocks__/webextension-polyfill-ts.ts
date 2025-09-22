export const browser = {
  storage: {
    local: {
      get: jest.fn(() => Promise.resolve({})),
      set: jest.fn(() => Promise.resolve()),
    },
    onChanged: {
      addListener: jest.fn(),
    },
  },
  tabs: {
    get: jest.fn((tabId) => Promise.resolve({ id: tabId, url: 'https://example.com' })),
    onUpdated: {
      addListener: jest.fn(),
    },
    onActivated: {
      addListener: jest.fn(),
    },
    sendMessage: jest.fn(() => Promise.resolve({})),
  },
  scripting: {
    executeScript: jest.fn(() => Promise.resolve([{ result: false }])),
  },
  runtime: {
    onMessage: {
      addListener: jest.fn(),
    },
  },
};