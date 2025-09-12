import KeyPressManager from './keypress-manager';

describe('KeyPressManager', () => {
  let keyPressManager: KeyPressManager;

  beforeEach(() => {
    keyPressManager = new KeyPressManager();
  });

  test('constructor initializes keyPressedState correctly', () => {
    expect(keyPressManager.keyPressedState).toEqual({ ShiftRight: false, ShiftLeft: false });
  });

  test('setKeyPressedState updates key state correctly', () => {
    keyPressManager.setKeyPressedState('ShiftLeft', true);
    expect(keyPressManager.keyPressedState.ShiftLeft).toBe(true);
    keyPressManager.setKeyPressedState('ShiftRight', true);
    expect(keyPressManager.keyPressedState.ShiftRight).toBe(true);
    keyPressManager.setKeyPressedState('ShiftLeft', false);
    expect(keyPressManager.keyPressedState.ShiftLeft).toBe(false);
  });

  test('reset sets all key states to false', () => {
    keyPressManager.setKeyPressedState('ShiftLeft', true);
    keyPressManager.setKeyPressedState('ShiftRight', true);
    keyPressManager.reset();
    expect(keyPressManager.keyPressedState).toEqual({ ShiftRight: false, ShiftLeft: false });
  });

  test('keyIsShortcutKey returns true for ShiftLeft and ShiftRight', () => {
    const shiftLeftEvent = new KeyboardEvent('keydown', { code: 'ShiftLeft' });
    const shiftRightEvent = new KeyboardEvent('keydown', { code: 'ShiftRight' });
    const otherKeyEvent = new KeyboardEvent('keydown', { code: 'KeyA' });

    expect(keyPressManager.keyIsShortcutKey(shiftLeftEvent)).toBe(true);
    expect(keyPressManager.keyIsShortcutKey(shiftRightEvent)).toBe(true);
    expect(keyPressManager.keyIsShortcutKey(otherKeyEvent)).toBe(false);
  });

  test('isShortcutPressed returns true when both shortcut keys are pressed', () => {
    expect(keyPressManager.isShortcutPressed()).toBe(false);

    keyPressManager.setKeyPressedState('ShiftLeft', true);
    expect(keyPressManager.isShortcutPressed()).toBe(false);

    keyPressManager.setKeyPressedState('ShiftRight', true);
    expect(keyPressManager.isShortcutPressed()).toBe(true);

    keyPressManager.reset();
    expect(keyPressManager.isShortcutPressed()).toBe(false);
  });
});
