import {inject, injectable} from "inversify"
import "reflect-metadata"
import KafkaService from "../../../kafka/kafkaService"
import {MobEntity} from "../../../mob/entity/mobEntity"
import MobRepository from "../../../mob/repository/mob"
import Customization from "../../../mob/specialization/customization"
import SpecializationService from "../../../mob/specialization/service/specializationService"
import SpecializationGroup from "../../../mob/specialization/specializationGroup"
import SpecializationLevel from "../../../mob/specialization/specializationLevel"
import { PlayerEntity } from "../../../player/entity/playerEntity"
import PlayerRepository from "../../../player/repository/player"
import Maybe from "../../../support/functional/maybe"
import match from "../../../support/matcher/match"
import {Types} from "../../../support/types"

@injectable()
export default class CreationService {
  constructor(
    @inject(Types.PlayerRepository) private readonly playerRepository: PlayerRepository,
    @inject(Types.MobRepository) private readonly mobRepository: MobRepository,
    @inject(Types.SpecializationGroups) private readonly specializationGroups: SpecializationGroup[],
    @inject(Types.SpecializationService) private readonly specializationService: SpecializationService,
    @inject(Types.KafkaService) private readonly kafkaService: KafkaService) {}

  public getOnePlayer(email: string): Promise<PlayerEntity> {
    return this.playerRepository.findOneByEmail(email)
  }

  public findOnePlayerMob(name: string) {
    return this.mobRepository.findOneByName(name)
  }

  public getUnknownCustomization(mob: MobEntity, subject: string): Customization | undefined {
    return new Maybe(this.getUnknownSpecializationGroups(mob)
      .find(specializationGroup => match(specializationGroup.groupName, subject)))
      .do(it => it)
      .or(() => this.getUnknownSkills(mob)
        .find(specializationLevel => match(specializationLevel.abilityType, subject)))
      .get()
  }

  public getKnownCustomization(mob: MobEntity, subject: string): Customization | undefined {
    return new Maybe(this.getKnownSpecializationGroups(mob)
      .find(specializationGroup => match(specializationGroup.groupName, subject)))
      .do(it => it)
      .or(() => this.getKnownSkills(mob)
        .find(specializationLevel => match(specializationLevel.abilityType, subject)))
      .get()
  }

  public getUnknownSpecializationGroups(mob: MobEntity): SpecializationGroup[] {
    return this.specializationGroups.filter(
      specializationGroup =>
        specializationGroup.specializationType === mob.specializationType
        && !mob.playerMob.customizations.includes(specializationGroup))
  }

  public getUnknownSkills(mob: MobEntity): SpecializationLevel[] {
    return this.specializationService.getAvailableSkills(mob)
  }

  public getKnownSpecializationGroups(mob: MobEntity): SpecializationGroup[] {
    return this.specializationGroups.filter(
      specializationGroup => mob.playerMob.customizations.includes(specializationGroup))
  }

  public getKnownSkills(mob: MobEntity): SpecializationLevel[] {
    return this.specializationService.getUnavailableSkills(mob)
  }

  public async savePlayer(player: PlayerEntity) {
    const savedPlayer = await this.playerRepository.save(player)
    await this.kafkaService.publishPlayer(savedPlayer)
    return savedPlayer
  }

  public async saveMob(mob: MobEntity) {
    const savedMob = await this.mobRepository.save(mob)
    await this.kafkaService.publishMob(savedMob)
    return savedMob
  }
}
