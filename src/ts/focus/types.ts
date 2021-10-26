export enum FocusState {
  Focused = 0,
  Unfocused = 1,
  Premium = 2,
}

export enum Website {
  Twitter = 'Twitter',
  LinkedIn = 'LinkedIn',
  Youtube = 'Youtube',
  Unsupported = 'Unsupported',
}

export interface AppState extends Record<Website, FocusState> {
  Twitter: FocusState
  LinkedIn: FocusState
  Youtube: FocusState
}

export interface KeyPressedState extends Record<string, boolean> {
  ShiftLeft: boolean
  ShiftRight: boolean
}
