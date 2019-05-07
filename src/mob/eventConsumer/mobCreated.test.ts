import {EventType} from "../../event/eventType"
import {createTestAppContainer} from "../../inversify.config"
import {Room} from "../../room/model/room"
import {getTestMob} from "../../support/test/mob"
import {Types} from "../../support/types"
import MobEvent from "../event/mobEvent"
import MobService from "../mobService"
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
    await mobCreated.consume(new MobEvent(EventType.MobCreated, getTestMob()))

    // then
    expect(mobService.mobTable.getMobs()).toHaveLength(1)
  })
})
