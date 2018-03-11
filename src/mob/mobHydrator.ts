import { AttributesHydrator } from "./../attributes/attributeHydrator"
import { ModelHydrator } from "./../db/model"
import { findRoom } from "./../room/repository"
import { Mob } from "./mob"

export class MobHydrator implements ModelHydrator {
  public hydrate(data): Promise<Mob> {
    return Promise.all([
      findRoom(data.room),
      new AttributesHydrator().hydrate(data),
    ]).then((values) => new Mob(
      data.identifier,
      data.name,
      data.race,
      data.level,
      data.trains,
      data.practices,
      values[1],
      values[0]))
  }
}