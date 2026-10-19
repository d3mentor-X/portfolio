// Player input state, shared between the keyboard handlers, the on-screen
// joystick and the 3D player.
export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  /** normalized touch/joystick direction */
  joyX: number;
  joyY: number;
}

export const createInput = (): InputState => ({
  up: false,
  down: false,
  left: false,
  right: false,
  joyX: 0,
  joyY: 0,
});
