export interface FocusState extends Record<string, boolean> {
  twitter: boolean
  linkedin: boolean
  github: boolean
}

export interface KeyPressedState extends Record<string, boolean> {
  ShiftLeft: boolean
  ShiftRight: boolean
}
