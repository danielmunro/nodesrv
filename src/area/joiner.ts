import { newReciprocalExit } from "../room/factory"
import { Room } from "../room/model/room"
import { persistExit } from "../room/service"
import { SectionType } from "./sectionType"

export default async function joinAreas(
  sectionType1: SectionType, rooms1: Room[], sectionType2: SectionType, rooms2: Room[]) {
  if (!rooms1 || !rooms2) {
    throw new Error("cannot join an empty area")
  }

  const sortedRooms1 = sortByNumberOfCandidateConnections(rooms1)
  const sortedRooms2 = sortByNumberOfCandidateConnections(rooms2)
  const candidate1 = sortedRooms1[0]
  const candidate2 = sortedRooms2[0]
  const exits = newReciprocalExit(candidate1, candidate2)
  await persistExit(exits)

  return exits
}

export function sortByNumberOfCandidateConnections(rooms: Room[]) {
  return rooms.sort((a, b) => a.exits.length > b.exits.length ? 1 : -1)
}
