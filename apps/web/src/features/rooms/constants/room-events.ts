export const ROOM_CREATED_EVENT = 'tunga:room-created';

export function notifyRoomCreated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(ROOM_CREATED_EVENT));
  }
}
