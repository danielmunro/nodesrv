import { newMerchant, newSailor, newTraveller } from "../../../mob/factory/settlement"
import { getFreeDirection } from "../../../room/direction"
import { newRoom } from "../../../room/factory"
import { Room } from "../../../room/model/room"
import Service from "../../../room/service"
import DefaultSpec from "../../sectionSpec/defaultSpec"
import { SectionType } from "../../sectionType"
import AreaBuilder from "../areaBuilder"
import Line from "../line"

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
  areaBuilder.addRoomTemplate(SectionType.Root, new DefaultSpec(getGateRoom()))
  areaBuilder.addRoomTemplate(SectionType.Connection, new DefaultSpec(getRoom()))
  areaBuilder.addMobTemplate(SectionType.Connection, newSailor(), 0.25)
  areaBuilder.addMobTemplate(SectionType.Connection, newTraveller(), 0.10)
  areaBuilder.addMobTemplate(SectionType.Connection, newMerchant(), 0.25)
  const line = new Line(getFreeDirection(outsideConnection), 6)
  await line.build(areaBuilder)

  return areaBuilder
}
