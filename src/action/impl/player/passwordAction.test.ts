import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import {PlayerEntity} from "../../../player/entity/playerEntity"
import verify from "../../../player/password/verify"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"

let testRunner: TestRunner
let player: PlayerEntity
const pass = "al33tp@ssw0rd"

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  player = (await testRunner.createPlayer()).get()
})

describe("password action", () => {
  it("resets a password", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Password, `password ${pass} ${pass}`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Password.Success)
    expect(verify(pass, player.password)).toBeTruthy()
  })

  it("requires a minimum length", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Password, `password foo foo`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Password.TooShort)
  })

  it("requires passwords to match", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Password, `password foo bar`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Password.MustMatch)
  })
})
