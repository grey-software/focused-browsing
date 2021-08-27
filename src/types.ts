export interface FocusState extends Record<string, boolean> {
  twitter: boolean
  linkedin: boolean
}

export interface KeyPressedStates extends Record<string, boolean> {
  ShiftLeft: boolean
  ShiftRight: boolean
}
