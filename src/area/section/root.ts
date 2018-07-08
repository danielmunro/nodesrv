import SectionCollection from "../sectionCollection"
import SectionSpec from "../sectionSpec/sectionSpec"
import { SectionType } from "../sectionType"
import { Section } from "./section"
import { persistRoom } from "../../room/service"

export default class implements Section {
  public async build(spec: SectionSpec): Promise<SectionCollection> {
    const room = await persistRoom(spec.getRoomTemplate().copy())
    room.sectionType = SectionType.Root
    const sectionCollection = new SectionCollection()
    sectionCollection.setConnectingRoom(room)
    return sectionCollection
  }
}
