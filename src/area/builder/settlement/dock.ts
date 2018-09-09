import { newRoom } from "../../../room/factory"
import { Room } from "../../../room/model/room"
import Service from "../../../room/service"
import DefaultSpec from "../../sectionSpec/defaultSpec"
import { SectionType } from "../../sectionType"
import AreaBuilder from "../areaBuilder"

function getDockRoom(): Room {
  return newRoom(
    "A dock",
    "")
}

export default async function newDock(outsideConnection: Room): Promise<AreaBuilder> {
  const areaBuilder = new AreaBuilder(outsideConnection, await Service.new())
  areaBuilder.addRoomTemplate(SectionType.Root, new DefaultSpec(getDockRoom()))
  areaBuilder.addRoomTemplate(SectionType.Connection, new DefaultSpec(getDockRoom()))

  await areaBuilder.buildSection(SectionType.Root)
  await areaBuilder.buildSection(SectionType.Connection)
  await areaBuilder.buildSection(SectionType.Connection)
  await areaBuilder.buildSection(SectionType.Connection)
  await areaBuilder.buildSection(SectionType.Connection)
  await areaBuilder.buildSection(SectionType.Connection)
  await areaBuilder.buildSection(SectionType.Connection)

  return areaBuilder
}
