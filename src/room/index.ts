import Room from "./model"

export const DIRECTIONS = {
  down: "down",
  east: "east",
  north: "north",
  south: "south",
  up: "up",
  west: "west",
}

export function directionsForRoom(room: Room) {
  return Object.keys(DIRECTIONS).filter((d) => room[d])
}
