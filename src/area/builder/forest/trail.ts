import { newCritter } from "../../../mob/factory/trail"
import { Direction } from "../../../room/constants"
import { newRoom } from "../../../room/factory"
import { Room } from "../../../room/model/room"
import AreaBuilder from "../../areaBuilder"
import { SectionType } from "../../sectionType"

function getRoom(): Room {
  return newRoom(
    "A trail in the woods",
    "Old growth trees line a narrow and meandering trail. " +
    "Thick green moss hangs from massive branches, obscuring any potential view. A lazy fog hangs " +
    "frozen in the canopy, leaving an eerie silence.")
}

export async function newTrail(
  outsideConnection: Room, direction: Direction, length: number, critterChanceToPopPercent: number = 0.5) {
  const areaBuilder = new AreaBuilder(outsideConnection)
  areaBuilder.addRoomTemplate(SectionType.Root, getRoom())
  areaBuilder.addRoomTemplate(SectionType.Connection, getRoom())
  areaBuilder.addMobTemplate(SectionType.Connection, newCritter(), critterChanceToPopPercent)
  await areaBuilder.buildSection(SectionType.Root, direction)
  for (let i = 0; i < length; i++) {
    await areaBuilder.buildSection(SectionType.Connection, direction)
  }

  return areaBuilder.getAllRooms()
}
