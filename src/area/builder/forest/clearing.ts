import { newForestItem } from "../../../item/factory/trail"
import { newRoom } from "../../../room/factory"
import { Room } from "../../../room/model/room"
import Service from "../../../room/service"
import AreaBuilder from "../areaBuilder"
import DefaultSpec from "../../sectionSpec/defaultSpec"
import MatrixSpec from "../../sectionSpec/matrixSpec"
import { SectionType } from "../../sectionType"

const FOREST_ITEM_CHANCE_TO_POP = 0.5

function getRootRoom(): Room {
  return newRoom(
    "The edge of a meadow",
    "The forest thins out, giving way to a meadow of wildflowers.")
}

function getConnectionRoom(): Room {
  return newRoom(
    "A hidden forest meadow",
    "A patch of lush green grass is surrounded by a massive forest.")
}

export async function newClearing(outsideConnection: Room, width: number, height: number): Promise<AreaBuilder> {
  const areaBuilder = new AreaBuilder(outsideConnection, await Service.new())
  areaBuilder.addRoomTemplate(SectionType.Root, new DefaultSpec(getRootRoom()))
  areaBuilder.addRoomTemplate(SectionType.Matrix, new MatrixSpec(getConnectionRoom(), width, height))
  areaBuilder.addItemTemplate(SectionType.Connection, newForestItem(), FOREST_ITEM_CHANCE_TO_POP)
  await areaBuilder.buildSection(SectionType.Root)
  const collection = await areaBuilder.buildSection(SectionType.Matrix)
  areaBuilder.setExitRoom(collection.exitRooms[0])

  return areaBuilder
}
