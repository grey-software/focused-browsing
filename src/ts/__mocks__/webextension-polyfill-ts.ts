export const browser = {
  storage: {
    local: {
      get: jest.fn(() => Promise.resolve({})),
      set: jest.fn(() => Promise.resolve()),
    },
  },
  tabs: {
    onUpdated: {
      addListener: jest.fn(),
    },
    onActivated: {
      addListener: jest.fn(),
    },
    sendMessage: jest.fn(() => Promise.resolve({})),
  },
  scripting: {
    executeScript: jest.fn(() => Promise.resolve([])),
  },
  runtime: {
    onMessage: {
      addListener: jest.fn(),
    },
  },
};