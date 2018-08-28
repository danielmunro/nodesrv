import { newRoom } from "../../../room/factory"
import { Room } from "../../../room/model/room"
import Service from "../../../room/service"
import AreaBuilder from "../areaBuilder"
import DefaultSpec from "../../sectionSpec/defaultSpec"
import { SectionType } from "../../sectionType"
import Line from "../line"
import { getFreeDirection } from "../../../room/direction"

function getGateRoom() {
  return newRoom(
    "City Gate",
    "A towering gate stands between a large forest and the city.")
}

function getRoom() {
  return newRoom(
    "A wide avenue",
    "Merchants, travellers, workers, conscripts, sailors, and more crowd the main avenue.")
}

export default async function newMainStreet(outsideConnection: Room): Promise<AreaBuilder> {
  const areaBuilder = new AreaBuilder(outsideConnection, await Service.new())
  areaBuilder.addRoomTemplate(SectionType.OutsideConnection, new DefaultSpec(getGateRoom()))
  areaBuilder.addRoomTemplate(SectionType.Root, new DefaultSpec(getRoom()))
  areaBuilder.addRoomTemplate(SectionType.Connection, new DefaultSpec(getRoom()))
  const line = new Line(getFreeDirection(outsideConnection), 6)
  await line.build(areaBuilder)

  return areaBuilder
}
