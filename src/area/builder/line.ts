import { SectionType } from "../sectionType"
import AreaBuilder from "./areaBuilder"
import Shape from "./shape"

export default class Line implements Shape {
  constructor(private readonly direction, private readonly length: number) {}

  public async build(areaBuilder: AreaBuilder): Promise<void> {
    await areaBuilder.buildSection(SectionType.Root, this.direction)
    for (let i = 0; i < this.length; i++) {
      await areaBuilder.buildSection(SectionType.Connection, this.direction)
    }
    const allRooms = areaBuilder.getAllRooms()
    areaBuilder.setExitRoom(allRooms[allRooms.length - 1])
  }
}
