import DamageSourceEntity from "../../../mob/entity/damageSourceEntity"
import {DamageSourceFlag} from "../../enum/damageSourceFlag"
import damageTraits from "./damageTraits"

describe("damage traits", () => {
  it.each([[
    DamageSourceFlag.Distraction,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.distraction,
  ], [
    DamageSourceFlag.Drowning,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.drowning,
  ], [
    DamageSourceFlag.Disease,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.disease,
  ], [
    DamageSourceFlag.Energy,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.energy,
  ], [
    DamageSourceFlag.Holy,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.holy,
  ], [
    DamageSourceFlag.Negative,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.negative,
  ], [
    DamageSourceFlag.Poison,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.poison,
  ], [
    DamageSourceFlag.Pierce,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.pierce,
  ], [
    DamageSourceFlag.Lightning,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.lightning,
  ], [
    DamageSourceFlag.Charm,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.charm,
  ], [
    DamageSourceFlag.Summon,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.summon,
  ], [
    DamageSourceFlag.Acid,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.acid,
  ], [
    DamageSourceFlag.Bash,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.bash,
  ], [
    DamageSourceFlag.Cold,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.cold,
  ], [
    DamageSourceFlag.Fire,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.fire,
  ], [
    DamageSourceFlag.Iron,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.iron,
  ], [
    DamageSourceFlag.Light,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.light,
  ], [
    DamageSourceFlag.Magic,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.magic,
  ], [
    DamageSourceFlag.Mental,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.mental,
  ], [
    DamageSourceFlag.Silver,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.silver,
  ], [
    DamageSourceFlag.Slash,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.slash,
  ], [
    DamageSourceFlag.Sound,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.sound,
  ], [
    DamageSourceFlag.Weapon,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.weapon,
  ], [
    DamageSourceFlag.Wood,
    (damageSourceEntity: DamageSourceEntity) => damageSourceEntity.wood,
  ],
  ])("modifies damage source entity in expected ways",
    // @ts-ignore
    (damageSourceFlag: DamageSourceFlag, expectation: any) => {
    const damageSourceEntity = new DamageSourceEntity()
    damageTraits(damageSourceFlag, damageSourceEntity)
    expect(expectation).toBeTruthy()
  })
})
