import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import v4 from "uuid"
import { AffectEntity } from "../../affect/entity/affectEntity"
import AffectService from "../../affect/service/affectService"
import AttributesEntity from "../../attributes/entity/attributesEntity"
import {AttackVerb} from "../../mob/enum/attackVerb"
import {DamageType} from "../../mob/fight/enum/damageType"
import {SpellType} from "../../mob/spell/spellType"
import { Equipment } from "../enum/equipment"
import { ItemType } from "../enum/itemType"
import { MaterialType } from "../enum/materialType"
import {WeaponEffect} from "../enum/weaponEffect"
import {WeaponType} from "../enum/weaponType"
import ContainerEntity from "./containerEntity"
import DrinkEntity from "./drinkEntity"
import FoodEntity from "./foodEntity"
import ForgeEntity from "./forgeEntity"
import { InventoryEntity } from "./inventoryEntity"

@Entity()
export class ItemEntity {
  public static maxCondition: number = 100

  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  @Generated("uuid")
  public uuid: string = v4()

  @Column({ nullable: true })
  public canonicalId: string

  @Column({ nullable: true })
  public canonicalIdentifier: string

  @Column()
  public name: string

  @Column()
  public brief: string

  @Column()
  public description: string

  @Column("text", { nullable: true })
  public equipment: Equipment

  @Column("integer")
  public itemType: ItemType

  @Column({ default: 0 })
  public value: number = 0

  @Column({ nullable: true })
  public hunger: number

  @Column({ default: true })
  public isTransferable: boolean = true

  @Column({ default: 1 })
  public level: number = 1

  @Column({ default: 0 })
  public weight: number = 0

  @Column("text")
  public material: MaterialType = MaterialType.Undefined

  @Column({ default: 100 })
  public condition: number = 100

  @Column({ default: true })
  public identified: boolean = true

  @Column({ nullable: true })
  public capacity: number

  @Column({ nullable: true })
  public wearTimer: number

  @ManyToOne(() => InventoryEntity, inventory => inventory.items)
  public inventory: InventoryEntity

  @OneToOne(() => AttributesEntity, { cascade: true, eager: true })
  @JoinColumn()
  public attributes: AttributesEntity

  @OneToMany(() => AffectEntity, affect => affect.item, { cascade: true, eager: true })
  public affects: AffectEntity[]

  @OneToOne(() => ContainerEntity, { cascade: true })
  @JoinColumn()
  public container: ContainerEntity

  @OneToOne(() => FoodEntity, food => food.item, { cascade: true, eager: true})
  @JoinColumn()
  public food: FoodEntity

  @OneToOne(() => DrinkEntity, drink => drink.item, { cascade: true, eager: true })
  @JoinColumn()
  public drink: DrinkEntity

  @OneToOne(() => ForgeEntity, { eager: true, cascade: true })
  @JoinColumn()
  public forge: ForgeEntity

  @Column("text", { nullable: true })
  public weaponType: WeaponType

  @Column("text", { nullable: true })
  public damageType: DamageType

  @Column("simple-array", { nullable: true })
  public weaponEffects: WeaponEffect[]

  @Column("text", { nullable: true })
  public attackVerb: AttackVerb

  @Column({ nullable: true })
  public maxCharges: number

  @Column({ nullable: true })
  public currentCharges: number

  @Column("text", { nullable: true })
  public spellType: SpellType

  @Column({ nullable: true })
  public castLevel: number

  public carriedBy: any

  public affect(): AffectService {
    return new AffectService(this)
  }

  public isFood(): boolean {
    return this.itemType === ItemType.Food
  }

  public isContainer(): boolean {
    return !!this.container
  }

  public describe(): string {
    return this.description + (this.itemType === ItemType.Container ?
      `\n\n${this.brief}, made of ${this.material}. Level ${this.level}, ${this.value} worth, ${this.weight} weight.
Contents:
${this.container.toString()}` : "")
  }

  public toString(): string {
    return this.name
  }
}
