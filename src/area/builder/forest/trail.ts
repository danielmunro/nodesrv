import { newForestItem } from "../../../item/factory/trail"
import { newCritter } from "../../../mob/factory/trail"
import { Direction } from "../../../room/constants"
import { newRoom } from "../../../room/factory"
import { Room } from "../../../room/model/room"
import Service from "../../../room/service"
import AreaBuilder from "../../areaBuilder"
import DefaultSpec from "../../sectionSpec/defaultSpec"
import { SectionType } from "../../sectionType"

const CRITTER_CHANCE_TO_POP = 0.5
const FOREST_ITEM_CHANCE_TO_POP = 0.5

function getRoom(): Room {
  return newRoom(
    "A trail in the woods",
    "Old growth trees line a narrow and meandering trail. " +
    "Thick green moss hangs from massive branches, obscuring any potential view. A lazy fog hangs " +
    "frozen in the canopy, leaving an eerie silence.")
}

export async function newTrail(
  outsideConnection: Room, direction: Direction, length: number) {
  const areaBuilder = new AreaBuilder(outsideConnection, await Service.new())
  areaBuilder.addRoomTemplate(SectionType.Root, new DefaultSpec(getRoom()))
  areaBuilder.addRoomTemplate(SectionType.Connection, new DefaultSpec(getRoom()))
  areaBuilder.addMobTemplate(SectionType.Connection, newCritter(), CRITTER_CHANCE_TO_POP)
  areaBuilder.addItemTemplate(SectionType.Connection, newForestItem(), FOREST_ITEM_CHANCE_TO_POP)
  await areaBuilder.buildSection(SectionType.Root, direction)
  for (let i = 0; i < length; i++) {
    await areaBuilder.buildSection(SectionType.Connection, direction)
  }
  const allRooms = areaBuilder.getAllRooms()
  areaBuilder.setExitRoom(allRooms[allRooms.length - 1])

  return areaBuilder
}
