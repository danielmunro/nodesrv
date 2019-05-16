import {AffectType} from "../affect/enum/affectType"
import {newAffect} from "../affect/factory"
import {getTestMob} from "../support/test/mob"
import CheckComponent from "./checkComponent"
import {CheckType} from "./checkType"

describe("createDefaultCheckFor component", () => {
  it("should be required if a fail message has provided", () => {
    // given
    const checkComponent = new CheckComponent(CheckType.Unspecified, true, true, "this has a fail message")

    // expect
    expect(checkComponent.isRequired).toBeTruthy()
  })

  it("should not be required with no fail message", () => {
    // given
    const checkComponent = new CheckComponent(CheckType.Unspecified, true, true)

    // expect
    expect(checkComponent.isRequired).toBeFalsy()
  })

  it("should be able to use a function as the thing being evaluated", () => {
    // given
    const checkComponentTrue = new CheckComponent(CheckType.Unspecified, true, () => true)
    const checkComponentFalse = new CheckComponent(CheckType.Unspecified, true, () => false)

    // expect
    expect(checkComponentTrue.getThing()).toBeTruthy()
    expect(checkComponentFalse.getThing()).toBeFalsy()
  })

  it("should re-evaluate thing for subsequent requests (not cache the first result)", () => {
    // given
    const checkComponent = new CheckComponent(CheckType.HasAffect, true, m =>
      m.affects.find(a => a.affectType === AffectType.Noop))
    const mob = getTestMob()

    // expect
    expect(checkComponent.getThing(mob)).toBeFalsy()

    // and when
    mob.affects.push(newAffect(AffectType.Noop))

    // then
    expect(checkComponent.getThing(mob)).toBeTruthy()
  })

  it("negative evaluation should work", () => {
    // given
    const checkComponent = new CheckComponent(CheckType.HasAffect, false, m =>
      m.affects.find(a => a.affectType === AffectType.Noop))
    const mob = getTestMob()

    // expect
    expect(checkComponent.getThing(mob)).toBeTruthy()
  })
})
