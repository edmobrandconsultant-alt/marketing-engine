export type TradeStatus = 'open' | 'accepted' | 'declined' | 'expired';

export interface TradeOffer {
  id: string;
  fromPlayerId: string;
  fromPlayerName: string;
  offeredItems: string[];
  requestedItems: string[];
  message: string;
  createdAt: number;
  status: TradeStatus;
}

export interface NPCTrader {
  id: string;
  name: string;
  sprite: string;
  specialty: string;
  offers: TradeOffer[];
}

function makeOffer(
  traderId: string,
  traderName: string,
  id: string,
  offeredItems: string[],
  requestedItems: string[],
  message: string,
): TradeOffer {
  return {
    id,
    fromPlayerId: traderId,
    fromPlayerName: traderName,
    offeredItems,
    requestedItems,
    message,
    createdAt: Date.now(),
    status: 'open',
  };
}

export const npcTraders: NPCTrader[] = [
  {
    id: 'old_tom',
    name: 'Old Tom',
    sprite: '👴',
    specialty: 'Veteran allotmenteer — has been growing for 50 years. Trades tools and knowledge.',
    offers: [
      makeOffer('old_tom', 'Old Tom', 'tom_1', ['copper_trowel'], ['pressed_flower_bookmark', 'woven_bark_bracelet'],
        "I've got a lovely copper trowel here, barely used. Swap you for a couple of trinkets?"),
      makeOffer('old_tom', 'Old Tom', 'tom_2', ['brass_watering_rose'], ['wildflower_seed_bomb'],
        "This watering rose gives the gentlest shower you've ever seen. Just need some wildflower seeds for the missus."),
      makeOffer('old_tom', 'Old Tom', 'tom_3', ['carved_walking_stick'], ['hand_forged_hori_hori'],
        "Carved this from my old hazel coppice. I've been eyeing up one of those Japanese knives though..."),
    ],
  },
  {
    id: 'meadow',
    name: 'Meadow',
    sprite: '🧝‍♀️',
    specialty: 'Wildflower specialist and nature artist. Trades seeds, flowers, and botanical crafts.',
    offers: [
      makeOffer('meadow', 'Meadow', 'meadow_1', ['flower_crown'], ['seed_saving_pouch'],
        "I wove this crown from meadow flowers this morning! I could really use a proper seed pouch though."),
      makeOffer('meadow', 'Meadow', 'meadow_2', ['wildflower_seed_bomb', 'wildflower_seed_bomb'], ['wicker_visor'],
        "Two seed bombs for a nice visor? The sun gets in my eyes when I'm sketching flowers!"),
      makeOffer('meadow', 'Meadow', 'meadow_3', ['pressed_flower_bookmark'], ['straw_sun_hat'],
        "I pressed these myself — real forget-me-nots and buttercups. Trade for a sun hat?"),
    ],
  },
  {
    id: 'the_blacksmith',
    name: 'The Blacksmith',
    sprite: '⚒️',
    specialty: 'Artisan metalworker and jeweller. Trades rare hand-forged tools and silver jewellery.',
    offers: [
      makeOffer('the_blacksmith', 'The Blacksmith', 'smith_1', ['hand_forged_hori_hori'], ['copper_trowel', 'handmade_willow_basket'],
        "Forged this hori hori myself — Japanese carbon steel. Worth a good trowel and a basket, I reckon."),
      makeOffer('the_blacksmith', 'The Blacksmith', 'smith_2', ['silver_leaf_pendant'], ['dowdings_signature_fleece'],
        "Cast this pendant from a real oak leaf. I get cold in the forge though — got a warm fleece?"),
      makeOffer('the_blacksmith', 'The Blacksmith', 'smith_3', ['robin_feather_pin'], ['mushroom_cap_hat'],
        "Enamelled this robin pin myself. I fancy that mushroom hat for my daughter — she loves fungi!"),
    ],
  },
  {
    id: 'fungi_fred',
    name: 'Fungi Fred',
    sprite: '🧙',
    specialty: 'Mushroom expert and forager. Trades mushroom items and forest treasures.',
    offers: [
      makeOffer('fungi_fred', 'Fungi Fred', 'fred_1', ['mushroom_cap_hat'], ['linen_apron'],
        "Found the cap for this hat on a giant puffball! Trade for an apron? Mine's covered in spore prints."),
      makeOffer('fungi_fred', 'Fungi Fred', 'fred_2', ['woven_bark_bracelet', 'woven_bark_bracelet'], ['purple_sprouting_broccoli'],
        "Made these bark bracelets from fallen birch. I'm craving some purple sprouting broccoli seeds though!"),
      makeOffer('fungi_fred', 'Fungi Fred', 'fred_3', ['solstice_lantern'], ['beekeepers_veil'],
        "This lantern was lit on midsummer's eve! Swap for a beekeeper's veil? The wasps keep getting in my mushroom logs."),
    ],
  },
  {
    id: 'seed_sarah',
    name: 'Seed Sarah',
    sprite: '👩‍🌾',
    specialty: 'Heritage seed saver — preserves rare and ancient crop varieties.',
    offers: [
      makeOffer('seed_sarah', 'Seed Sarah', 'sarah_1', ['heirloom_tomato_seeds'], ['wooden_dibber', 'straw_sun_hat'],
        "These Brandywine seeds have been in my family for generations. A dibber and a hat would be grand!"),
      makeOffer('seed_sarah', 'Seed Sarah', 'sarah_2', ['purple_sprouting_broccoli'], ['pressed_flower_bookmark', 'pressed_flower_bookmark'],
        "Purple sprouting broccoli — the king of spring! Just need some bookmarks for my seed catalogue."),
      makeOffer('seed_sarah', 'Seed Sarah', 'sarah_3', ['heritage_apple_cutting'], ['silver_leaf_pendant', 'seed_saving_pouch'],
        "This cutting is from a 200-year-old Bramley tree. Only for someone who truly values heritage — bring me the pendant and a seed pouch."),
    ],
  },
];

export function getTraderById(id: string): NPCTrader | undefined {
  return npcTraders.find(t => t.id === id);
}

/**
 * Get the "market day" selection — rotates which traders are available.
 * For now, all 5 are always available in the mock version.
 */
export function getMarketDayTraders(): NPCTrader[] {
  return npcTraders;
}
