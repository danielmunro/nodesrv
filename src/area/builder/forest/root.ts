import { newRoom } from "../../../room/factory"

export default async function() {
  return newRoom(
    "A clearing in the woods",
    "A small patch of land has been cleared of trees. On it sits a modest inn, tending to weary travellers.")
}
