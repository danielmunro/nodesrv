import { Terrain } from "./terrain"

export default function getMovementCost(terrain: Terrain) {
  if (terrain === Terrain.Mountains || terrain === Terrain.Water) {
    return 2
  }

  if (terrain === Terrain.Forest) {
    return 1.5
  }

  if (terrain === Terrain.Settlement) {
    return 0.5
  }

  return 1
}
