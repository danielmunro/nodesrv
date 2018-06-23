import * as uuid from "uuid"
import { getTestClient } from "../../../test/client"
import Request from "../request"
import { ResponseStatus } from "../responseStatus"
import Complete from "./complete"
import Password from "./password"
import PasswordConfirm from "./passwordConfirm"

describe("create player password confirm auth step", () => {
  it("should work with matching passwords", async () => {
    // given
    const password = uuid.v4()
    const client = getTestClient()

    // setup
    const passwordConfirm = new PasswordConfirm(client.player, password)

    // when
    const response = await passwordConfirm.processRequest(new Request(client, password))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Complete)
  })

  it("should reject mismatched passwords", async () => {
    // given
    const password1 = uuid.v4()
    const password2 = uuid.v4()
    const client = getTestClient()

    // setup
    const passwordConfirm = new PasswordConfirm(client.player, password1)

    // when
    const response = await passwordConfirm.processRequest(new Request(client, password2))

    // then
    expect(response.status).toBe(ResponseStatus.FAILED)
    expect(response.authStep).toBeInstanceOf(Password)
  })
})
