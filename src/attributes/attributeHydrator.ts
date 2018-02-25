import { ModelHydrator } from "./../db/model"
import { Attributes } from "./attributes"
import { HitDam } from "./hitdam"
import { Stats } from "./stats"
import { Vitals } from "./vitals"

export class AttributesHydrator implements ModelHydrator {
  public hydrate(data): Attributes {
    return new Attributes(
      new HitDam(data.hit, data.dam),
      new Stats(data.str, data.int, data.wis, data.dex, data.con, data.sta),
      new Vitals(data.hp, data.mana, data.mv),
    )
  }
}
