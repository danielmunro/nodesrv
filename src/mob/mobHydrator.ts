import { AttributesHydrator } from "./../attributes/attributeHydrator"
import { ModelHydrator } from "./../db/model"
import { findRoom } from "./../room/repository"
import { Mob } from "./mob"
import { Race } from "./race/race"

function getRaceEnum(race: string): Race {
  return Race[race]
}

export class MobHydrator implements ModelHydrator {
  public hydrate(data): Promise<Mob> {
    return Promise.all([
      findRoom(data.room),
      new AttributesHydrator().hydrate(data),
    ]).then((values) => new Mob(
      data.name,
      getRaceEnum(data.race),
      data.level,
      data.trains,
      data.practices,
      values[1],
      values[0]))
  }
}
