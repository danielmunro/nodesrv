import look from "../action/action/look"
import { Collection } from "../action/definition/collection"
import doNTimes from "../functional/times"
import { getFights } from "../mob/fight/fight"
import { Role } from "../mob/role"
import { Player } from "../player/model/player"
import InputContext from "../request/context/inputContext"
import { getNewRequestFromMessageEvent, Request } from "../request/request"
import { RequestType } from "../request/requestType"
import { default as AuthRequest } from "../session/auth/request"
import { SkillType } from "../skill/skillType"
import { Channel } from "../social/channel"
import { getTestClient, getTestClientLoggedOut } from "../test/client"
import { getTestMob } from "../test/mob"
import { getTestRoom } from "../test/room"
import TestBuilder from "../test/testBuilder"
import { Client, getDefaultUnhandledMessage } from "./client"
import { MESSAGE_NOT_UNDERSTOOD } from "./constants"

function getNewTestMessageEvent(message = "hello world") {
  return new MessageEvent("test", {data: "{\"request\": \"" + message + "\"}"})
}

let client: Client

describe("client sanity checks", () => {
  beforeEach(async () => client = await getTestClient())

  it("getSessionMob sanity check", () => {
    expect(client.getSessionMob()).toBe(client.session.getMob())
  })

  it("has requests sanity check", () => {
    // expect
    expect(client.hasRequests()).toBeFalsy()

    // when
    client.addRequest(new Request(client.getSessionMob(), getTestRoom(), new InputContext(RequestType.Any)))

    // then
    expect(client.hasRequests()).toBeTruthy()
  })

  it("can handle requests sanity check", () => {
    // expect
    expect(client.canHandleRequests()).toBeFalsy()

    // when
    client.addRequest(new Request(client.player.sessionMob, getTestRoom(), new InputContext(RequestType.Any)))

    // then
    expect(client.canHandleRequests()).toBeTruthy()

    // when
    client.player.delay += 1

    // then
    expect(client.canHandleRequests()).toBeFalsy()
  })

  it("create result sanity checks", () => {
    // when
    const messageString = "this is a test"
    const message = client.createMessage(Channel.Gossip, messageString)

    // then
    expect(message.message).toBe(messageString)
  })

  it("send sanity test", () => {
    // setup
    const send = jest.fn()
    const ws = jest.fn(() => ({
      send,
    }))
    client = new Client(ws(), "127.0.0.1", new Collection([], []), jest.fn(), jest.fn(), jest.fn())

    // expect
    expect(send.mock.calls.length).toBe(0)

    // when
    client.send({})

    // then
    expect(send.mock.calls.length).toBe(1)
  })

  it("on result sanity test", () => {
    // expect
    expect(client.hasRequests()).toBeFalsy()

    // when
    client.ws.onmessage(getNewTestMessageEvent("hello"))

    // then
    expect(client.hasRequests()).toBeTruthy()
  })
})

describe("clients", () => {
  beforeEach(async () => client = await getTestClient())

  it("should delegate handling requests to the session if not logged in", async () => {
    const newClient = await getTestClientLoggedOut()
    const authStep = newClient.session.getAuthStepMessage()
    newClient.addRequest(new AuthRequest(newClient, "testemail@email.com"))
    await newClient.handleNextRequest()
    expect(newClient.session.getAuthStepMessage()).not.toBe(authStep)
  })

  it("should recognize its own messages as its own and not others", async () => {
    // setup
    const message = client.createMessage(
      Channel.Gossip,
      "this is a test of the public broadcasting system",
    )

    // expect
    expect(client.isOwnMessage(message)).toBe(true)

    // when
    const anotherClient = await getTestClient()
    const newMessage = anotherClient.createMessage(Channel.Gossip, "hullo")

    // then
    expect(client.isOwnMessage(newMessage)).toBe(false)
  })

  it("should be able to get a request from a result event", () => {
    // setup
    const testMessage = "this is a test"
    const testEvent = getNewTestMessageEvent(testMessage)
    const request = getNewRequestFromMessageEvent(client, testEvent) as Request

    // expect
    expect(request.getContextAsInput().input).toEqual(testMessage)
  })

  it("should use the default action when no handlers match", async () => {
    // setup
    const request = getNewRequestFromMessageEvent(client, getNewTestMessageEvent()) as Request
    expect.assertions(1)

    // when
    const response = await client.handleRequest(request)

    // then
    expect(response).toEqual(await getDefaultUnhandledMessage(request))
  })

  it("should be able to invoke a valid action", async () => {
    // setup
    const request = getNewRequestFromMessageEvent(client, getNewTestMessageEvent("look")) as Request

    // when
    const response = await client.handleRequest(request)
    const lookResponse = await look(request, client.service)

    // then
    expect(response).toEqual(lookResponse)
  })

  it("invokes the default request action when input has no action handler", async () => {
    // setup
    const request = getNewRequestFromMessageEvent(client, getNewTestMessageEvent("foo")) as Request

    // when
    const response = await client.handleRequest(request)

    // then
    expect(response.message.getMessageToRequestCreator()).toContain(MESSAGE_NOT_UNDERSTOOD)
  })

  it("should pass tick info through the socket", () => {
    // setup
    const buf = []
    const ws = jest.fn(() => ({
        send: (message) => buf.push(message),
      }))
    client = new Client(ws(), "127.0.0.1", new Collection([], []), jest.fn(), jest.fn(), jest.fn())
    const id = "test-tick-id"
    const timestamp = new Date()

    // expect
    expect(buf.length).toBe(0)

    // when
    client.tick(id, timestamp)

    // then
    expect(buf.length).toBe(1)
    expect(buf[0]).toContain("tick")
  })

  it("should remove a player's session mob from its room when the client shuts down", () => {
    // setup
    const room = client.player.sessionMob.room

    // expect
    expect(room.mobs).toContain(client.player.sessionMob)

    // when
    client.shutdown()

    // then
    expect(room.mobs).not.toContain(client.player.sessionMob)
  })

  it("not logged in clients should always be able to handle requests if ones are available", () => {
    // setup
    const newClient = new Client(jest.fn(), "127.0.0.1", jest.fn(), jest.fn(), jest.fn(), jest.fn())
    newClient.player = new Player()
    newClient.addRequest(new AuthRequest(newClient, RequestType.Any))

    // expect
    expect(newClient.isLoggedIn()).toBeFalsy()

    // when
    newClient.player.delay += 1

    // then
    expect(newClient.canHandleRequests()).toBeTruthy()
  })

  it("training will apply the cost appropriately", async () => {
    // setup
    const room = getTestRoom()
    const trainer = getTestMob()
    trainer.role = Role.Trainer
    room.addMob(trainer)
    room.addMob(client.player.sessionMob)
    client.player.sessionMob.playerMob.trains = 1
    client.addRequest(new Request(client.player.sessionMob, room, new InputContext(RequestType.Train, "train str")))

    // when
    await client.handleNextRequest()

    // then
    expect(client.player.sessionMob.playerMob.trains).toBe(0)
  })

  it("should create a fight if the action outcome is such", async () => {
    await doNTimes(1000, async () => {
      const testBuilder = new TestBuilder()
      await testBuilder.withPlayerAndSkill(SkillType.Steal, 5)
      testBuilder.withMob("bob").withAxeEq()
      const response = await client.handleRequest(testBuilder.createRequest(RequestType.Steal))
      expect(getFights()).toHaveLength(response.responseAction.wasFightStarted() ? 1 : 0)
    })
  })
})
