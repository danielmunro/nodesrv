import {createTestAppContainer} from "../../app/testFactory"
import {EventType} from "../../event/enum/eventType"
import {createMobEvent} from "../../event/factory"
import {Room} from "../../room/model/room"
import {getTestMob} from "../../support/test/mob"
import {Types} from "../../support/types"
import MobService from "../service/mobService"
import MobCreated from "./mobCreated"

describe("mob created event consumer", () => {
  it("adds a created mob to the mob service", async () => {
    // setup
    const app = await createTestAppContainer()
    const mobService = app.get<MobService>(Types.MobService)
    const startRoom = app.get<Room>(Types.StartRoom)

    // given
    const mobCreated = new MobCreated(mobService, startRoom)

    // when
    await mobCreated.consume(createMobEvent(EventType.MobCreated, getTestMob()))

    // then
    expect(mobService.mobTable.getMobs()).toHaveLength(1)
  })
})
