import { newCritter } from "../../mob/factory/trail"
import { persistRoom } from "../../room/service"
import { newArena } from "../factory"
import SectionCollection from "../sectionCollection"
import MatrixSpec from "../sectionSpec/matrixSpec"
import SectionSpec from "../sectionSpec/sectionSpec"
import { SectionType } from "../sectionType"
import { Section } from "./section"

export default class implements Section {
  public async build(spec: SectionSpec): Promise<SectionCollection> {
    const matrixSpec = spec as MatrixSpec
    const room = await persistRoom(spec.getRoomTemplate().copy())
    room.sectionType = SectionType.Matrix
    const arena = await newArena(room, matrixSpec.width, matrixSpec.height, () => newCritter())
    const sectionCollection = new SectionCollection()
    sectionCollection.setConnectingRoom(room)
    sectionCollection.addRooms(arena.rooms)
    sectionCollection.addExitRoom(arena.getRandomEdge())

    return sectionCollection
  }
}
