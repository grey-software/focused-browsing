export interface FocusState extends Record<string, boolean> {
  twitter: boolean
  linkedin: boolean
}

export interface KeyPressedState extends Record<string, boolean> {
  ShiftLeft: boolean
  ShiftRight: boolean
}
