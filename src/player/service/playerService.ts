import {inject, injectable} from "inversify"
import {MobEntity} from "../../mob/entity/mobEntity"
import Maybe from "../../support/functional/maybe/maybe"
import {Types} from "../../support/types"
import {PlayerEntity} from "../entity/playerEntity"
import PlayerRepository from "../repository/player"
import PlayerTable from "../table/playerTable"
import PaymentService from "./paymentService"

@injectable()
export default class PlayerService {
  constructor(
    @inject(Types.PlayerTable) private readonly playerTable: PlayerTable,
    @inject(Types.PlayerRepository) private readonly playerRepository: PlayerRepository,
    @inject(Types.PaymentService) private readonly paymentService: PaymentService) {}

  public getPlayerFromMob(mob: MobEntity): Maybe<PlayerEntity> {
    return this.playerTable.getPlayerFromMob(mob)
  }

  public async addPaymentMethod(
    mob: MobEntity, nickname: string, ccNumber: string, expMonth: number, expYear: number) {
    this.playerTable.getPlayerFromMob(mob)
      .do(async player => {
        await this.paymentService.addPaymentMethod(player, nickname, ccNumber, expMonth, expYear)
        await this.playerRepository.save(player)
      })
      .get()
  }

  public async removePaymentMethod(mob: MobEntity, nickname: string) {
    this.playerTable.getPlayerFromMob(mob)
      .do(async (player: PlayerEntity) => {
        if (!player.paymentMethods) {
          return
        }
        const paymentMethod = player.paymentMethods.find(p => p.nickname === nickname)
        if (!paymentMethod) {
          return
        }
        const success = await this.paymentService.removePaymentMethod(player, paymentMethod)
        if (success) {
          await this.playerRepository.save(player)
        }
      })
      .get()
  }

  public async subscribe(mob: MobEntity) {
    this.playerTable.getPlayerFromMob(mob)
      .do(async player => {
        const success = await this.paymentService.purchaseSubscription(player)
        if (success) {
          await this.playerRepository.save(player)
        }
      })
      .get()
  }

  public async  unsubscribe(mob: MobEntity) {
    this.playerTable.getPlayerFromMob(mob)
      .do(async player => {
        const success = await this.paymentService.removeSubscription(player)
        if (success) {
          await this.playerRepository.save(player)
        }
      })
      .get()
  }
}
