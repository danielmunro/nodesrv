import SectionCollection from "../sectionCollection"
import SectionSpec from "../sectionSpec/sectionSpec"
import { Section } from "./section"

export default class implements Section {
  public async build(spec: SectionSpec): Promise<SectionCollection> {
    const sectionCollection = new SectionCollection()
    sectionCollection.setConnectingRoom(spec.getRoomTemplate().copy())
    return sectionCollection
  }
}
