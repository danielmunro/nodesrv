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
    const sectionCollection = new SectionCollection()
    const room = spec.getRoomTemplate().copy()
    room.sectionType = SectionType.Matrix
    await persistRoom(room)
    const arena = await newArena(room, matrixSpec.width, matrixSpec.height)
    sectionCollection.addRooms(arena.rooms)
    sectionCollection.setConnectingRoom(arena.connectingRoom)

    return sectionCollection
  }
}
