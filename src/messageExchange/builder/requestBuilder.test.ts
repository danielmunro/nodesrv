import {createTestAppContainer} from "../../app/factory/testFactory"
import {MobEntity} from "../../mob/entity/mobEntity"
import LocationService from "../../mob/service/locationService"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import {RequestType} from "../enum/requestType"
import RequestBuilder from "./requestBuilder"

let requestBuilder: RequestBuilder
let target: MobEntity

beforeEach(async () => {
  // setup
  const app = await createTestAppContainer()
  const testRunner = app.get<TestRunner>(Types.TestRunner)
  // action creator
  const mob = (await testRunner.createMob()).get()
  // potential target
  target = (await testRunner.createMob()).get()
  requestBuilder = new RequestBuilder(
    // app.get<Action[]>(Types.ActionTable),
    app.get<LocationService>(Types.LocationService),
    mob,
    testRunner.getStartRoom().get())
})

describe("request builder", () => {
  it("does not find a target when an action does not specify one", async () => {
    // when
    const request = requestBuilder.create(RequestType.Look)

    // then
    expect(request.getTargetMobInRoom()).toBeUndefined()
  })

  it("does not find a target when an action has a target but input does not specify one", async () => {
    // when
    const request = requestBuilder.create(RequestType.Kill)

    // then
    expect(request.getTargetMobInRoom()).toBeUndefined()
  })

  it("does find a target when an action has a target and input does specify one", async () => {
    // when
    const request = requestBuilder.create(RequestType.Kill, `kill ${target.name}`)

    // then
    expect(request.getTargetMobInRoom()).toBeDefined()
  })
})
