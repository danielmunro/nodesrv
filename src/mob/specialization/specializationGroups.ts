import {SpecializationType} from "./enum/specializationType"
import BenedictionSpecializationGroup from "./group/benedictionSpecializationGroup"
import CombatSpecializationGroup from "./group/combatSpecializationGroup"
import CurativeSpecializationGroup from "./group/curativeSpecializationGroup"
import DetectionSpecializationGroup from "./group/detectionSpecializationGroup"
import EnchantmentSpecializationGroup from "./group/enchantmentSpecializationGroup"
import EnhancementSpecializationGroup from "./group/enhancementSpecializationGroup"
import HealingSpecializationGroup from "./group/healingSpecializationGroup"
import IllusionSpecializationGroup from "./group/illusionSpecializationGroup"
import MaladictionSpecializationGroup from "./group/maladictionSpecializationGroup"
import NecromancySpecializationGroup from "./group/necromancySpecializationGroup"
import OrbSpecializationGroup from "./group/orbSpecializationGroup"
import PietySpecializationGroup from "./group/pietySpecializationGroup"
import ProtectionSpecializationGroup from "./group/protectionSpecializationGroup"
import PsionicsSpecializationGroup from "./group/psionicsSpecializationGroup"
import TransportationSpecializationGroup from "./group/transportationSpecializationGroup"
import SpecializationService from "./service/specializationService"

export default function(specializationService: SpecializationService) {
  return [
    new BenedictionSpecializationGroup().create(SpecializationType.Cleric, specializationService, 4),
    new CurativeSpecializationGroup().create(SpecializationType.Cleric, specializationService, 4),
    new DetectionSpecializationGroup().create(SpecializationType.Cleric, specializationService, 3),
    new EnhancementSpecializationGroup().create(SpecializationType.Cleric, specializationService, 8),
    new IllusionSpecializationGroup().create(SpecializationType.Mage, specializationService, 8),
    new HealingSpecializationGroup().create(SpecializationType.Cleric, specializationService, 6),
    new OrbSpecializationGroup().create(SpecializationType.Cleric, specializationService, 4),
    new PietySpecializationGroup().create(SpecializationType.Cleric, specializationService, 4),
    new ProtectionSpecializationGroup().create(SpecializationType.Cleric, specializationService, 4),
    new PsionicsSpecializationGroup().create(SpecializationType.Cleric, specializationService, 4),
    new TransportationSpecializationGroup().create(SpecializationType.Cleric, specializationService, 8),

    new CombatSpecializationGroup().create(SpecializationType.Mage, specializationService, 6),
    new DetectionSpecializationGroup().create(SpecializationType.Mage, specializationService, 4),
    new EnchantmentSpecializationGroup().create(SpecializationType.Mage, specializationService, 6),
    new EnhancementSpecializationGroup().create(SpecializationType.Mage, specializationService, 5),
    new IllusionSpecializationGroup().create(SpecializationType.Mage, specializationService, 6),
    new MaladictionSpecializationGroup().create(SpecializationType.Mage, specializationService, 5),
    new NecromancySpecializationGroup().create(SpecializationType.Mage, specializationService, 4),
    new OrbSpecializationGroup().create(SpecializationType.Mage, specializationService, 8),
    new PsionicsSpecializationGroup().create(SpecializationType.Mage, specializationService, 8),
    new TransportationSpecializationGroup().create(SpecializationType.Mage, specializationService, 4),
  ]
}
