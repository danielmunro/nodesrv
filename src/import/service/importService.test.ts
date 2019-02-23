import {getItemRepository} from "../../item/repository/item"
import {getMobRepository} from "../../mob/repository/mob"
import {getRoomRepository} from "../../room/repository/room"
import {getConnection, initializeConnection} from "../../support/db/connection"
import ItemBuilder from "../itemBuilder"
import ImportService from "./importService"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

describe("import service aggregate counts", () => {
  it("should import Midgaard", async () => {
    // given
    const importService = new ImportService(
        await getMobRepository(),
        await getRoomRepository(),
        await getItemRepository(),
        ItemBuilder.new())

    // when
    const file = await importService.parseAreaFile("areas/midgaard.are")

    // then
    expect(file.items).toHaveLength(210)
    expect(file.mobs).toHaveLength(86)
    expect(file.resets).toHaveLength(789)
    expect(file.rooms).toHaveLength(150)

    // and
    file.items.forEach(item => expect(item.id).toBeDefined())
    file.mobs.forEach(mob => expect(mob.id).toBeDefined())
    file.rooms.forEach(room => expect(room.id).toBeDefined())
  }, 10000)

  it("should import new thalos", async () => {
    // given
    const importService = new ImportService(
        await getMobRepository(),
        await getRoomRepository(),
        await getItemRepository(),
        ItemBuilder.new(),
        false)

    // when
    const file = await importService.parseAreaFile("areas/newthalos.are")

    // then
    expect(file.items).toHaveLength(108)
    expect(file.mobs).toHaveLength(111)
    expect(file.resets).toHaveLength(1081)
    expect(file.rooms).toHaveLength(261)
  }, 10000)

  it("should import buldtown", async () => {
    // given
    const importService = new ImportService(
        await getMobRepository(),
        await getRoomRepository(),
        await getItemRepository(),
        ItemBuilder.new(),
        false)

    // when
    const file = await importService.parseAreaFile("areas/buldtown.are")

    // then
    expect(file.items).toHaveLength(188)
    expect(file.mobs).toHaveLength(6)
    expect(file.resets).toHaveLength(774)
    expect(file.rooms).toHaveLength(316)
  }, 10000)
})
