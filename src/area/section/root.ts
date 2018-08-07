import Service from "../../room/service"
import SectionCollection from "../sectionCollection"
import SectionSpec from "../sectionSpec/sectionSpec"
import { SectionType } from "../sectionType"
import { Section } from "./section"

export default class implements Section {
  public async build(spec: SectionSpec): Promise<SectionCollection> {
    const service = await Service.new()
    const room = await service.saveRoom(spec.getRoomTemplate().copy())
    room.sectionType = SectionType.Root
    const sectionCollection = new SectionCollection()
    sectionCollection.setConnectingRoom(room)

    return sectionCollection
  }
}
