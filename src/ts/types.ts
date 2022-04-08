export enum FocusMode {
  Focused = 0,
  Custom = 1,
  Unfocused = 2,
}

export enum Website {
  Twitter = 'Twitter',
  LinkedIn = 'LinkedIn',
  Youtube = 'Youtube',
  Github = 'Github',
  Facebook = 'Facebook',
  Unsupported = 'Unsupported',
}

export interface AppState extends Record<Website, FocusMode> {
  Twitter: FocusMode
  LinkedIn: FocusMode
  Youtube: FocusMode
  Github: FocusMode
  Facebook: FocusMode
}

export interface KeyPressedState extends Record<string, boolean> {
  ShiftLeft: boolean
  ShiftRight: boolean
}
