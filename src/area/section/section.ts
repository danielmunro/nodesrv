import SectionCollection from "../sectionCollection"
import SectionSpec from "../sectionSpec/sectionSpec"

export interface Section {
  build(spec: SectionSpec): Promise<SectionCollection>
}
