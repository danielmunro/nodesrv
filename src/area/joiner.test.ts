import { Direction } from "../room/constants"
import { newRoom } from "../room/factory"
import { persistRoom } from "../room/service"
import { newTrail } from "./builder/forest/trail"
import { Exploration } from "./exploration"
import { newArena } from "./factory"
import joinAreas from "./joiner"
import { SectionType } from "./sectionType"

describe("area joiner", () => {
  it("should join two areas", async () => {
    // given
    const root = await persistRoom(newRoom("test", "test"))
    const rooms1 = await newTrail(root, Direction.South, 5)
    const rooms2 = await newArena(root, 3, 3)

    // and
    await joinAreas(SectionType.Connection, rooms1, SectionType.Matrix, rooms2.rooms)

    // when
    const exploration = new Exploration(root)
    exploration.explore()

    // then
    expect(exploration.map.getRoomCount()).toBe(new Set([...rooms1, ...rooms2.rooms]).size)
  })
})
