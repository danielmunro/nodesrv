import {createTestAppContainer} from "../../app/factory/testFactory"
import {EventType} from "../../event/enum/eventType"
import {createMobEvent} from "../../event/factory/eventFactory"
import {RoomEntity} from "../../room/entity/roomEntity"
import {getTestMob} from "../../support/test/mob"
import {Types} from "../../support/types"
import MobService from "../service/mobService"
import MobCreatedEventConsumer from "./mobCreatedEventConsumer"

describe("mob created event consumer", () => {
  it("adds a created mob to the mob service", async () => {
    // setup
    const app = await createTestAppContainer()
    const mobService = app.get<MobService>(Types.MobService)
    const startRoom = app.get<RoomEntity>(Types.StartRoom)

    // given
    const mobCreated = new MobCreatedEventConsumer(mobService, startRoom)

    // when
    await mobCreated.consume(createMobEvent(EventType.MobCreated, getTestMob()))

    // then
    expect(mobService.mobTable.getMobs()).toHaveLength(1)
  })
})
