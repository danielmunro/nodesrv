import {inject, injectable} from "inversify"
import * as Stripe from "stripe"
import {Environment} from "../../app/enum/environment"
import {Types} from "../../support/types"
import {PaymentMethodEntity} from "../entity/paymentMethodEntity"
import {PlayerEntity} from "../entity/playerEntity"
import ICardSourceCreationOptions = Stripe.cards.ICardSourceCreationOptions

@injectable()
export default class PaymentService {
  constructor(
    @inject(Types.StripeClient) private readonly stripeClient: Stripe,
    @inject(Types.StripePlanId) private readonly stripePlanId: string,
    @inject(Types.Environment) private readonly environment: Environment) {}

  public async createCustomer(player: PlayerEntity) {
    const response = await this.stripeClient.customers.create({
      name: player.uuid,
    })
    player.stripeCustomerId = response.id
  }

  public async addPaymentMethod(
    player: PlayerEntity, nickname: string, ccNumber: string, expMonth: number, expYear: number) {
    if (!player.stripeCustomerId) {
      await this.createCustomer(player)
    }
    const response = await this.stripeClient.customers.createSource(player.stripeCustomerId, {
      source: this.getSource(ccNumber, expMonth, expYear),
    })
    const paymentMethod = new PaymentMethodEntity()
    paymentMethod.nickname = nickname
    paymentMethod.stripePaymentMethodId = response.id
    paymentMethod.player = player
    if (!player.paymentMethods) {
      player.paymentMethods = []
    }
    player.paymentMethods.push(paymentMethod)
  }

  public async removePaymentMethod(player: PlayerEntity, paymentMethod: PaymentMethodEntity): Promise<boolean> {
    const response = await this.stripeClient.customers.deleteSource(
      player.stripeCustomerId, paymentMethod.stripePaymentMethodId)
    if (response.deleted) {
      player.paymentMethods = player.paymentMethods.filter(p => p !== paymentMethod)
    }
    return response.deleted
  }

  public async purchaseSubscription(player: PlayerEntity): Promise<boolean> {
    if (!player.stripeCustomerId) {
      await this.createCustomer(player)
    }
    if (!player.paymentMethods) {
      return false
    }
    const response = await this.stripeClient.subscriptions.create({
      customer: player.stripeCustomerId,
      items: [{ plan: this.stripePlanId }],
    })
    player.stripeSubscriptionId = response.id
    return response.status === "active"
  }

  public async removeSubscription(player: PlayerEntity): Promise<boolean> {
    const response = await this.stripeClient.subscriptions.del(player.stripeSubscriptionId)

    if (response.status === "canceled") {
      player.stripeSubscriptionId = ""
    }

    return response.status === "canceled"
  }

  private getSource(ccNumber: string, expMonth: number, expYear: number): string | ICardSourceCreationOptions {
    return this.environment === Environment.Production ? {
      exp_month: expMonth,
      exp_year: expYear,
      number: ccNumber,
      object: "card",
    } : "tok_visa"
  }
}
