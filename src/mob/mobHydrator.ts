import { AttributesHydrator } from "./../attributes/attributeHydrator"
import { ModelHydrator } from "./../db/model"
import { Mob } from "./mob"
import { Race } from "./race/race"

function getRaceEnum(race: string): Race {
  return Race[race]
}

export class MobHydrator implements ModelHydrator {
  public hydrate(data): Mob {
    return new Mob(
      data.name,
      getRaceEnum(data.race),
      data.level,
      data.trains,
      data.practices,
      new AttributesHydrator().hydrate(data),
    )
  }
}
