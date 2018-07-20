import { newRoom } from "../../../room/factory"
import { newItemFixture } from "../../../item/factory"

export default function() {
  return newRoom(
    "A clearing in the woods",
    "A small patch of land has been cleared of trees. On it sits a modest inn, tending to weary travellers.",
    [],
    [
      newItemFixture("a cozy fire pit", "A small fire blazes."),
    ])
}
