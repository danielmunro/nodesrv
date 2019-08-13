import {createTestAppContainer} from "../../app/factory/testFactory"
import Socket from "../../client/socket"
import InputContext from "../../request/context/inputContext"
import {RequestType} from "../../request/enum/requestType"
import Request from "../../request/request"
import {ResponseStatus} from "../../session/auth/enum/responseStatus"
import {createResponse} from "../../session/auth/factory/requestAuthFactory"
import { default as AuthRequest } from "../../session/auth/request"
import {getTestPlayer} from "../../support/test/player"
import {getTestRoom} from "../../support/test/room"
import {Types} from "../../support/types"
import ClientService from "../service/clientService"
import {HandleClientRequests} from "./handleClientRequests"

jest.mock("../../client/socket")
let clientService: ClientService
let observer: HandleClientRequests

beforeEach(async () => {
  const app = await createTestAppContainer()
  clientService = app.get<ClientService>(Types.ClientService)
  observer = app.get<HandleClientRequests>(Types.HandleClientRequestsObserver)
})

const mockSocket = jest.fn()
const mockRequest = jest.fn()
const authStep = jest.fn(() => ({
  getStepMessage: () => "",
}))
const mockInputRequest = jest.fn(() => ({
  fail: jest.fn(),
  input: "email@foo.com",
  // @ts-ignore
  ok: (request: AuthRequest) => createResponse(request, ResponseStatus.OK, authStep()),
}))

describe("handleClientRequests", () => {
  it("should be able to handle requests on clients", async () => {
    // setup
    const client = clientService.createNewClient(new Socket(mockSocket()), mockRequest())

    // given
    // @ts-ignore
    client.addRequest(mockInputRequest())

    // expect
    expect(client.hasRequests()).toBe(true)

    // when
    await observer.notify([client])

    // then
    expect(client.hasRequests()).toBe(false)
  })

  it("should not notify a client if the client has a delay", async () => {
    // setup
    const client = clientService.createNewClient(new Socket(mockSocket()), mockRequest())
    const player = getTestPlayer()
    await client.session.login(client, player)

    // given
    client.addRequest(
      new Request(player.sessionMob, getTestRoom(), new InputContext(RequestType.Any)))
    client.player.delay += 1

    // when
    await observer.notify([client])

    // then
    expect(client.hasRequests()).toBe(true)
  })
})
