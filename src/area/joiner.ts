import { newReciprocalExit } from "../room/factory"
import { Room } from "../room/model/room"
import { persistExit } from "../room/service"
import { SectionType } from "./sectionType"

export default async function joinAreas(
  sectionType1: SectionType, rooms1: Room[], sectionType2: SectionType, rooms2: Room[]) {
  if (!rooms1 || !rooms2) {
    throw new Error("cannot join an empty area")
  }

  const sortedRooms1 = rooms1.sort(sortByNumberOfCandidateConnections)
  const sortedRooms2 = rooms2.sort(sortByNumberOfCandidateConnections)
  const candidate1 = sortedRooms1[0]
  const candidate2 = sortedRooms2[0]
  const exits = newReciprocalExit(candidate1, candidate2)
  await persistExit(exits)

  return exits
}

export function sortByNumberOfCandidateConnections(room1: Room, room2: Room) {
  return room1.exits.length > room2.exits.length ? 1 : -1
}
