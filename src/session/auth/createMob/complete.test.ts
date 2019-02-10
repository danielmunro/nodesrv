import { Mob } from "../../../mob/model/mob"
import { getMobRepository } from "../../../mob/repository/mob"
import {getConnection, initializeConnection} from "../../../support/db/connection"
import TestBuilder from "../../../test/testBuilder"
import { default as FinalComplete } from "../complete"
import Request from "../request"
import { ResponseStatus } from "../responseStatus"
import Complete from "./complete"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

const mockAuthService = jest.fn()

describe("create mob auth step: complete", () => {
  it("should proceed to the final step unconditionally", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const client = await testBuilder.withClient()

    // when
    const response = await new Complete(mockAuthService(), client.player).processRequest(new Request(client, ""))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(FinalComplete)
  })

  it("should persist the mob", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const client = await testBuilder.withClient()

    // expect
    expect(client.player.sessionMob.id).toBeUndefined()

    // when
    await new Complete(mockAuthService(), client.player).processRequest(new Request(client, ""))

    // then
    expect(client.player.sessionMob.id).not.toBeUndefined()

    // and
    const repository = await getMobRepository()
    expect(await repository.findOne(client.player.sessionMob.uuid)).toBeInstanceOf(Mob)
  })
})
