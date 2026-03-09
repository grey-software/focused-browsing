/**
 * The two visual states a website can be in:
 *   Focused   – distracting regions hidden, quote injected into feed
 *   Unfocused – feed visible, with low-value side distractions still hidden
 *               where the site controller treats that as the sensible default
 */
export enum FocusMode {
  Focused = 0,
  Unfocused = 1,
}

export enum Website {
  LinkedIn = 'LinkedIn',
  Youtube = 'Youtube',
  X = 'X',
  Unsupported = 'Unsupported',
}

export interface AppState extends Record<Website, FocusMode> {
  LinkedIn: FocusMode
  Youtube: FocusMode
  X: FocusMode
}

export interface KeyPressedState {
  [key: string]: boolean
  ShiftLeft: boolean
  ShiftRight: boolean
}
