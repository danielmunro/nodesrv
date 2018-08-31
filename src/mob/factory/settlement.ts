import { newAttributes, newHitroll, newStartingStats, newVitals } from "../../attributes/factory"
import { newMob } from "../factory"
import { Mob } from "../model/mob"
import { Race } from "../race/race"

export function newTraveller(): Mob {
  return newMob(
    "a wandering vagabond is here",
    "",
    Race.Human,
    newVitals(80, 100, 100),
    newAttributes(
      newVitals(80, 100, 100),
      newStartingStats(),
      newHitroll(2, 1)),
  )
}

export function newSailor(): Mob {
  return newMob(
    "a sailor stomps by, carrying a large net",
    "",
    Race.Human,
    newVitals(100, 100, 100),
    newAttributes(
      newVitals(100, 100, 100),
      newStartingStats(),
      newHitroll(2, 3)),
  )
}

export function newMerchant(): Mob {
  return newMob(
    "a merchant walks briskly through the street, counting items off a checklist",
    "",
    Race.Human,
    newVitals(100, 100, 100),
    newAttributes(
      newVitals(100, 100, 100),
      newStartingStats(),
      newHitroll(2, 3)),
  )
}
