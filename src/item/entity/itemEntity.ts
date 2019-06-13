import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { AffectEntity } from "../../affect/entity/affectEntity"
import AffectService from "../../affect/service/affectService"
import AttributesEntity from "../../attributes/entity/attributesEntity"
import { Equipment } from "../enum/equipment"
import { ItemType } from "../enum/itemType"
import { MaterialType } from "../enum/materialType"
import ContainerEntity from "./containerEntity"
import DrinkEntity from "./drinkEntity"
import FoodEntity from "./foodEntity"
import ForgeEntity from "./forgeEntity"
import { InventoryEntity } from "./inventoryEntity"

@Entity()
export class ItemEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @Column("text", { nullable: true })
  public canonicalId: string

  @Column("text", { nullable: true })
  public canonicalIdentifier: string

  @Column("text")
  public name: string

  @Column("text")
  public brief: string

  @Column("text")
  public description: string

  @Column("text", { nullable: true })
  public equipment: Equipment

  @Column("integer")
  public itemType: ItemType

  @Column("integer")
  public value: number = 0

  @Column("integer", { nullable: true })
  public hunger: number

  @Column("boolean", { default: true })
  public isTransferable: boolean = true

  @Column("integer")
  public level: number = 0

  @Column("integer")
  public weight: number = 0

  @Column("text")
  public material: MaterialType = MaterialType.Undefined

  @Column("integer")
  public condition: number = 1

  @Column("boolean", { default: true })
  public identified = true

  @Column("integer", { nullable: true })
  public capacity: number

  @Column("integer", { nullable: true })
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
      `\n\n${this.name} contents:\n${this.container.toString()}` : "")
  }

  public toString(): string {
    return this.name
  }
}
