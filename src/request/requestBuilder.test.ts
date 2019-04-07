import {Mob} from "../mob/model/mob"
import TestBuilder from "../support/test/testBuilder"
import RequestBuilder from "./requestBuilder"
import {RequestType} from "./requestType"

let requestBuilder: RequestBuilder
let target: Mob

beforeEach(async () => {
  // setup
  const testBuilder = new TestBuilder()
  // action creator
  testBuilder.withMob()
  // potential target
  target = testBuilder.withMob().mob
  requestBuilder = await testBuilder.createRequestBuilder()
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
