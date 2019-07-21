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
    const player = this.playerTable.getPlayerFromMob(mob).get()
    await this.paymentService.addPaymentMethod(player, nickname, ccNumber, expMonth, expYear)
    await this.playerRepository.save(player)
  }

  public async removePaymentMethod(mob: MobEntity, nickname: string) {
    const player = this.getPlayerFromMob(mob).get()
    if (!player.paymentMethods) {
      throw new Error("no payment methods defined")
    }
    const paymentMethod = player.paymentMethods.find(p => p.nickname === nickname)
    if (!paymentMethod) {
      throw new Error("that payment method was not found")
    }
    await this.paymentService.removePaymentMethod(player, paymentMethod)
    await this.playerRepository.save(player)
  }

  public async subscribe(mob: MobEntity) {
    const player = this.getPlayerFromMob(mob).get()
    if (player.stripeSubscriptionId) {
      throw new Error("subscription already active")
    }
    const success = await this.paymentService.purchaseSubscription(player)
    if (!success) {
      throw new Error("Error purchasing subscription. Do you have an active credit card?")
    }
    await this.playerRepository.save(player)
  }

  public async unsubscribe(mob: MobEntity) {
    const player = this.getPlayerFromMob(mob).get()
    const success = await this.paymentService.removeSubscription(player)
    if (!success) {
      throw new Error("Error unsubscribing. Do you have an active subscription?")
    }
    await this.playerRepository.save(player)
  }

  public getLoggedInMobs(): MobEntity[] {
    return this.playerTable.getPlayers().filter(player => player.sessionMob)
      .map(player => player.sessionMob)
  }
}
