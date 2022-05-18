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
  Instagram = 'Instagram',
  Google = 'Google',
  Unsupported = 'Unsupported',
}

export enum ColorMode {
  Light,
  Dim,
  Dark,
}

export interface AppState extends Record<Website, FocusMode> {
  Twitter: FocusMode
  LinkedIn: FocusMode
  Youtube: FocusMode
  Github: FocusMode
  Facebook: FocusMode
  Instagram: FocusMode
  Google: FocusMode
}

export interface KeyPressedState extends Record<string, boolean> {
  ShiftLeft: boolean
  ShiftRight: boolean
}
