import DamageEvent from "../../../../event/damageEvent"
import {RaceType} from "../../../enum/raceType"
import RaceDamageAbsorption from "../raceDamageAbsorption"

export default class OgreSizeMismatchVuln extends RaceDamageAbsorption {
  protected modifier = -0.1

  protected doesConsumerApply(event: DamageEvent): boolean {
    if (!event.source) {
      return false
    }

    return event.source.raceType === RaceType.Ogre &&
      event.source.race().size !== event.mob.race().size
  }
}
