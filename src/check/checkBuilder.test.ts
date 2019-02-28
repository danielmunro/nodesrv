import {AffectType} from "../affect/affectType"
import {newAffect} from "../affect/factory"
import {Disposition} from "../mob/enum/disposition"
import {Mob} from "../mob/model/mob"
import {RequestType} from "../request/requestType"
import TestBuilder from "../test/testBuilder"
import getActionPartTable from "./actionPartCheckTable"
import CheckBuilder from "./checkBuilder"

const FAIL_MESSAGE = "this is a fail"

let testBuilder: TestBuilder
let checkBuilder: CheckBuilder
let mob: Mob

beforeEach(async () => {
  testBuilder = new TestBuilder()
  const gameService = await testBuilder.getService()
  mob = testBuilder.withMob().mob
  checkBuilder = new CheckBuilder(
    gameService.mobService,
    testBuilder.createRequest(RequestType.Noop),
    getActionPartTable(gameService.mobService))
  checkBuilder.capture(mob)
})

describe("checkBuilder", () => {

  describe("requireFight", () => {
    it("should fail if a fight is not started", async () => {
      // given
      checkBuilder.requireFight()

      // when
      const check = await checkBuilder.create()

      // then
      expect(check.isOk()).toBeFalsy()
    })

    it("should succeed if a fight is started", async () => {
      // given
      await testBuilder.fight()
      checkBuilder.requireFight()

      // when
      const check = await checkBuilder.create()

      // then
      expect(check.isOk()).toBeTruthy()
    })
  })

  describe("requireDisposition", () => {
    it("requires a standing disposition with the default mob", async () => {
      // given
      checkBuilder.requireDisposition(Disposition.Standing, FAIL_MESSAGE)

      // when
      const check = await checkBuilder.create()

      // then
      expect(check.isOk()).toBeTruthy()
    })

    it("fails if the mob has a different disposition", async () => {
      // given
      mob.disposition = Disposition.Sitting
      checkBuilder.requireDisposition(Disposition.Standing, FAIL_MESSAGE)

      // when
      const check = await checkBuilder.create()

      // then
      expect(check.isOk()).toBeFalsy()
      expect(check.result).toBe(FAIL_MESSAGE)
    })
  })

  describe("requireAffect", () => {
    it("fails if an affect is missing", async () => {
      // given
      checkBuilder.requireAffect(AffectType.Noop, FAIL_MESSAGE)

      // when
      const check = await checkBuilder.create()

      // then
      expect(check.isOk()).toBeFalsy()
    })

    it("succeeds if the mob has the affect", async () => {
      // given
      mob.affects.push(newAffect(AffectType.Noop))
      checkBuilder.requireAffect(AffectType.Noop, FAIL_MESSAGE)

      // when
      const check = await checkBuilder.create()

      // then
      expect(check.isOk()).toBeTruthy()
    })

    it("succeeds if the mob does not have the affect", async () => {
      // given
      checkBuilder.not().requireAffect(AffectType.Noop, FAIL_MESSAGE)

      // when
      const check = await checkBuilder.create()

      // then
      expect(check.isOk()).toBeTruthy()
    })

    it("fails when the mob has an affect and required not to have it", async () => {
      // given
      mob.affects.push(newAffect(AffectType.Noop))
      checkBuilder.not().requireAffect(AffectType.Noop, FAIL_MESSAGE)

      // when
      const check = await checkBuilder.create()

      // then
      expect(check.isOk()).toBeFalsy()
    })

    it("fails if the mob requires multiple affects", async () => {
      // given
      mob.affects.push(newAffect(AffectType.Noop))
      checkBuilder.requireAffect(AffectType.Noop, FAIL_MESSAGE)
      checkBuilder.requireAffect(AffectType.Blind, FAIL_MESSAGE)

      // when
      const check = await checkBuilder.create()

      // then
      expect(check.isOk()).toBeFalsy()
    })

    it("succeeds if the mob requires multiple affects and has them", async () => {
      // given
      mob.affects.push(newAffect(AffectType.Noop), newAffect(AffectType.Blind))
      checkBuilder.requireAffect(AffectType.Noop, FAIL_MESSAGE)
      checkBuilder.requireAffect(AffectType.Blind, FAIL_MESSAGE)

      // when
      const check = await checkBuilder.create()

      // then
      expect(check.isOk()).toBeTruthy()
    })
  })

  describe("atLevelOrGreater", () => {
    it("fails if the required level is too high", async () => {
      // given
      checkBuilder.atLevelOrGreater(2)

      // when
      const check = await checkBuilder.create()

      // then
      expect(check.isOk()).toBeFalsy()
    })

    it("fails if the required level is too low", async () => {
      // given
      checkBuilder.atLevelOrGreater(2)

      // when
      const check = await checkBuilder.create()

      // then
      expect(check.isOk()).toBeFalsy()
    })

    it("succeeds if the required level is not too high", async () => {
      // given
      checkBuilder.not().atLevelOrGreater(2)

      // when
      const check = await checkBuilder.create()

      // then
      expect(check.isOk()).toBeTruthy()
    })

    it("fails if the mob level is greater than the maximum level", async () => {
      // given
      mob.level = 3
      checkBuilder.not().atLevelOrGreater(2)

      // when
      const check = await checkBuilder.create()

      // then
      expect(check.isOk()).toBeFalsy()
    })
  })

  describe("requirePlayer", () => {
    it("fails if the mob is not a player mob", async () => {
      // given
      checkBuilder.requirePlayer(mob)

      // when
      const check = await checkBuilder.create()

      // then
      expect(check.isOk()).toBeFalsy()
    })

    it("succeeds if the mob is a player mob", async () => {
      // given
      const playerBuilder = await testBuilder.withPlayer()
      checkBuilder.requirePlayer(playerBuilder.player.sessionMob)

      // when
      const check = await checkBuilder.create()

      // then
      expect(check.isOk()).toBeTruthy()
    })
  })
})
