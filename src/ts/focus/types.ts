export enum FocusMode {
  Focused = 0,
  Unfocused = 1,
  CustomFocus = 2,
}

export enum Website {
  LinkedIn = 'LinkedIn',
  Youtube = 'Youtube',
  Unsupported = 'Unsupported',
}

export interface AppState extends Record<Website, FocusMode> {
  LinkedIn: FocusMode
  Youtube: FocusMode
}

export interface KeyPressedState {
  [key: string]: boolean
  ShiftLeft: boolean
  ShiftRight: boolean
}
