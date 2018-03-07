import { Direction } from "./constants"

function reverse(direction: Direction) {
  switch (direction) {
    case Direction.Up:
      return Direction.Down
    case Direction.Down:
      return Direction.Up
    case Direction.East:
      return Direction.West
    case Direction.West:
      return Direction.East
    case Direction.North:
      return Direction.South
    case Direction.South:
      return Direction.North
  }
}

export default {
  description: "string",
  exits: {
    direction: "out",
    properties: {
      direction: "string",
    },
    relationship: "exit",
    type: "relationship",
  },
  mobs: {
    direction: "out",
    relationship: "mob",
    type: "relationship",
  },
  name: "string",
  room_id: {
    primary: true,
    type: "uuid",
  },
}

export function addReciprocalExit(n1, direction: Direction, n2): Promise<any> {
  return Promise.all([
    n1.relateTo(n2, "exits", { direction }),
    n2.relateTo(n1, "exits", { direction: reverse(direction)}),
  ])
}
