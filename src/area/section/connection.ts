import { persistRoom } from "../../room/service"
import SectionCollection from "../sectionCollection"
import SectionSpec from "../sectionSpec/sectionSpec"
import { SectionType } from "../sectionType"
import { Section } from "./section"

export default class implements Section {
  public async build(spec: SectionSpec): Promise<SectionCollection> {
    const room = await persistRoom(spec.getRoomTemplate().copy())
    room.sectionType = SectionType.Connection
    const sectionCollection = new SectionCollection()
    sectionCollection.setConnectingRoom(room)

    return sectionCollection
  }
}
