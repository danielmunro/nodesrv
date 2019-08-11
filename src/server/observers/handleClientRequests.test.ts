import {createTestAppContainer} from "../../app/factory/testFactory"
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

let clientService: ClientService
let observer: HandleClientRequests

beforeEach(async () => {
  const app = await createTestAppContainer()
  clientService = app.get<ClientService>(Types.ClientService)
  observer = app.get<HandleClientRequests>(Types.HandleClientRequestsObserver)
})

const mockSocket = jest.fn(() => ({
  onmessage: jest.fn(),
  send: jest.fn(),
}))
const mockRequest = jest.fn()
const authStep = jest.fn(() => ({
  getStepMessage: () => "",
}))
const mockInputRequest = jest.fn(() => ({
  fail: jest.fn(),
  input: "email@foo.com",
  ok: (request: AuthRequest) => createResponse(request, ResponseStatus.OK, authStep() as any),
}))

describe("handleClientRequests", () => {
  it("should be able to handle requests on clients", async () => {
    const client = clientService.createNewClient(mockSocket() as any, mockRequest())
    client.addRequest(mockInputRequest() as any)

    expect(client.hasRequests()).toBe(true)
    await observer.notify([client])
    expect(client.hasRequests()).toBe(false)
  })

  it("should not notify a client if the client has a delay", async () => {
    const client = clientService.createNewClient(mockSocket() as any, mockRequest())
    const player = getTestPlayer()
    await client.session.login(client, player)
    client.addRequest(
      new Request(player.sessionMob, getTestRoom(), new InputContext(RequestType.Any)))
    client.player.delay += 1

    expect(client.hasRequests()).toBe(true)
    await observer.notify([client])
    expect(client.hasRequests()).toBe(true)
  })
})
