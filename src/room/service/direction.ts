import Maybe from "../../support/functional/maybe/maybe"
import {Direction} from "../enum/direction"

const directionMap = [
  [ Direction.Up, Direction.Down ],
  [ Direction.Down, Direction.Up ],
  [ Direction.North, Direction.South ],
  [ Direction.South, Direction.North ],
  [ Direction.East, Direction.West ],
  [ Direction.West, Direction.East ],
]

function getFromDirectionMap(direction: Direction) {
  const map = directionMap.find(m => m[0] === direction)
  return map ? map[1] : undefined
}

export function reverse(direction: Direction): Direction {
  return new Maybe<Direction>(getFromDirectionMap(direction))
    .or(() => Direction.Noop)
    .get()
}
