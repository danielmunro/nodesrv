import Action from "../action/action"
import {createTestAppContainer} from "../app/testFactory"
import {Mob} from "../mob/model/mob"
import LocationService from "../mob/service/locationService"
import TestRunner from "../support/test/testRunner"
import {Types} from "../support/types"
import RequestBuilder from "./requestBuilder"
import {RequestType} from "./requestType"

let requestBuilder: RequestBuilder
let target: Mob

beforeEach(async () => {
  // setup
  const app = await createTestAppContainer()
  const testRunner = app.get<TestRunner>(Types.TestRunner)
  // action creator
  const mob = testRunner.createMob().get()
  // potential target
  target = testRunner.createMob().get()
  requestBuilder = new RequestBuilder(
    app.get<Action[]>(Types.Actions),
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
