import type { Season } from '@/data/plants';

export type WildlifeType =
  | 'hedgehog' | 'robin' | 'blue_tit' | 'frog' | 'newt' | 'dragonfly'
  | 'ladybird' | 'butterfly' | 'bumblebee' | 'stag_beetle' | 'wren'
  | 'slow_worm' | 'bat' | 'hoverfly' | 'earthworm' | 'song_thrush';

export interface WildlifeVisitor {
  id: WildlifeType;
  name: string;
  emoji: string;
  description: string;
  /** Which biodiversity features attract this creature */
  attractedBy: string[];   // BiodiversityType IDs
  /** How many of the attracting features needed (minimum) */
  minFeatures: number;
  /** Growth bonus this visitor provides to nearby plants */
  bonusType: 'pollinator' | 'pest_control' | 'soil_health' | 'seed_dispersal';
  bonusMultiplier: number;
  /** Rarity affects visit frequency: common ~60%, uncommon ~30%, rare ~10% */
  rarity: 'common' | 'uncommon' | 'rare';
  /** Real educational facts */
  funFacts: string[];
  /** Conservation status note */
  conservationNote: string;
  /** What season(s) you're most likely to see them */
  activeSeasons: ('spring' | 'summer' | 'autumn' | 'winter')[];
}

export const wildlifeVisitors: WildlifeVisitor[] = [
  {
    id: 'hedgehog',
    name: 'Hedgehog',
    emoji: '🦔',
    description: 'A spiny nocturnal mammal that patrols gardens at night, eating slugs, beetles, and caterpillars.',
    attractedBy: ['log_pile', 'compost_heap'],
    minFeatures: 1,
    bonusType: 'pest_control',
    bonusMultiplier: 1.15,
    rarity: 'common',
    funFacts: [
      'Hedgehog numbers in the UK have fallen from 30 million in the 1950s to under 1 million today.',
      'A single hedgehog can eat up to 200 grams of slugs, beetles, and caterpillars in one night.',
      'Hedgehogs hibernate from November to March, curling into a tight ball in leaf piles or log stacks.',
      'Baby hedgehogs are called hoglets and are born with soft white spines hidden under a layer of skin.',
    ],
    conservationNote: 'UK hedgehog populations have declined by over 50% since 2000. Creating hedgehog highways (13cm holes in fences) helps them roam between gardens.',
    activeSeasons: ['spring', 'summer', 'autumn'],
  },
  {
    id: 'robin',
    name: 'Robin',
    emoji: '🐦',
    description: 'Britain\'s favourite bird, famous for its red breast and bold, friendly character around gardeners.',
    attractedBy: ['compost_heap', 'log_pile', 'bird_box'],
    minFeatures: 1,
    bonusType: 'seed_dispersal',
    bonusMultiplier: 1.1,
    rarity: 'common',
    funFacts: [
      'Robins are fiercely territorial and will fight other robins that enter their patch — their red breast is a warning signal.',
      'Robins follow gardeners closely because digging exposes earthworms and insects in the soil.',
      'The robin was voted Britain\'s national bird in 2015 with over 34% of the public vote.',
      'Robins sing year-round, even in winter, and are one of the few birds that sing after dark near streetlights.',
    ],
    conservationNote: 'Robins are widespread across the UK with a stable population of around 6.7 million breeding pairs.',
    activeSeasons: ['spring', 'summer', 'autumn', 'winter'],
  },
  {
    id: 'blue_tit',
    name: 'Blue Tit',
    emoji: '🐤',
    description: 'A colourful acrobatic bird with blue and yellow plumage that nests in boxes and hunts caterpillars.',
    attractedBy: ['bird_box', 'bug_hotel'],
    minFeatures: 1,
    bonusType: 'pest_control',
    bonusMultiplier: 1.1,
    rarity: 'common',
    funFacts: [
      'A pair of blue tits can eat over 10,000 caterpillars while raising a single brood of chicks.',
      'Blue tits are one of only a few birds clever enough to learn to open milk bottle tops — a behaviour first recorded in the 1920s.',
      'They lay 7-13 eggs per clutch, one of the largest clutch sizes of any British bird.',
      'Blue tits can hang upside down from branches to reach insects that other birds cannot get to.',
    ],
    conservationNote: 'Blue tits are common across the UK with around 3.6 million breeding pairs. Providing nest boxes with a 25mm hole helps them compete with larger species.',
    activeSeasons: ['spring', 'summer', 'autumn', 'winter'],
  },
  {
    id: 'frog',
    name: 'Common Frog',
    emoji: '🐸',
    description: 'An amphibian that breeds in ponds in spring and patrols the garden eating slugs and other pests.',
    attractedBy: ['pond', 'log_pile'],
    minFeatures: 1,
    bonusType: 'pest_control',
    bonusMultiplier: 1.12,
    rarity: 'common',
    funFacts: [
      'A single frog can eat over 100 slugs and snails in a summer — they are one of the gardener\'s best friends.',
      'Frogs return to the same pond where they were born to lay their spawn each spring.',
      'Frogspawn clumps contain 1,000-2,000 eggs, but only about 1 in 50 tadpoles survives to become a frog.',
      'Frogs breathe partly through their skin, which must stay moist — that\'s why they love damp gardens.',
    ],
    conservationNote: 'Common frogs have declined across the UK, mainly due to habitat loss. Garden ponds are now one of their most important breeding sites.',
    activeSeasons: ['spring', 'summer', 'autumn'],
  },
  {
    id: 'newt',
    name: 'Smooth Newt',
    emoji: '🦎',
    description: 'A small amphibian with a spotted belly that hunts in ponds and shelters under logs on land.',
    attractedBy: ['pond', 'log_pile'],
    minFeatures: 2,
    bonusType: 'pest_control',
    bonusMultiplier: 1.1,
    rarity: 'uncommon',
    funFacts: [
      'The great crested newt is one of the UK\'s most strictly protected species — it\'s illegal to disturb them or their habitat.',
      'Male smooth newts grow a wavy crest along their back in spring to impress females during underwater courtship dances.',
      'Newts can regenerate lost limbs, tails, and even parts of their eyes and heart.',
      'Newts spend most of their lives on land, only returning to water to breed between March and June.',
    ],
    conservationNote: 'Smooth newts are locally common but great crested newts have declined by 50% in the last 25 years. Garden ponds are vital stepping stones between wild populations.',
    activeSeasons: ['spring', 'summer'],
  },
  {
    id: 'dragonfly',
    name: 'Dragonfly',
    emoji: '🪰',
    description: 'A spectacular aerial predator that catches mosquitoes and midges on the wing at speeds up to 30mph.',
    attractedBy: ['pond', 'wildflower_meadow'],
    minFeatures: 1,
    bonusType: 'pollinator',
    bonusMultiplier: 1.1,
    rarity: 'uncommon',
    funFacts: [
      'Dragonflies can fly at up to 30mph and are among the most agile flyers in the insect world, able to hover, fly backwards, and turn on the spot.',
      'A single dragonfly can eat hundreds of mosquitoes in a day — they catch prey mid-flight with 95% accuracy.',
      'Dragonfly larvae live underwater for up to 5 years before crawling out and transforming into adults.',
      'Dragonflies have been on Earth for over 300 million years — long before the dinosaurs.',
    ],
    conservationNote: 'Several UK dragonfly species have expanded their range northward due to climate change, while others remain rare and vulnerable to habitat loss.',
    activeSeasons: ['summer'],
  },
  {
    id: 'ladybird',
    name: 'Ladybird',
    emoji: '🐞',
    description: 'A tiny beetle with bright warning colours that devours aphids, one of the garden\'s most valuable pest controllers.',
    attractedBy: ['bug_hotel', 'wildflower_meadow'],
    minFeatures: 1,
    bonusType: 'pest_control',
    bonusMultiplier: 1.15,
    rarity: 'common',
    funFacts: [
      'A single 7-spot ladybird can eat up to 5,000 aphids in its lifetime.',
      'Ladybirds hibernate in groups through winter, sometimes gathering in clusters of hundreds in sheltered spots.',
      'Their bright red and black colouring warns predators that they taste horrible — they release a foul-smelling yellow fluid when threatened.',
      'The UK has 46 native ladybird species, but the invasive harlequin ladybird is outcompeting many of them.',
    ],
    conservationNote: 'Native UK ladybird species like the 2-spot are declining due to competition from the invasive harlequin ladybird, which arrived from Asia in 2004.',
    activeSeasons: ['spring', 'summer'],
  },
  {
    id: 'butterfly',
    name: 'Butterfly',
    emoji: '🦋',
    description: 'A pollinator that flutters between wildflowers, carrying pollen and adding beauty to any garden.',
    attractedBy: ['wildflower_meadow', 'food_forest'],
    minFeatures: 1,
    bonusType: 'pollinator',
    bonusMultiplier: 1.15,
    rarity: 'common',
    funFacts: [
      'Painted lady butterflies migrate from North Africa to the UK each spring — a journey of up to 9,000 miles across generations.',
      'Butterflies taste with their feet! They have chemical receptors on their legs to identify the right plants for laying eggs.',
      'A caterpillar increases its body mass by up to 1,000 times before pupating into a butterfly.',
      'The UK has 59 resident butterfly species, but over three-quarters have declined in the last 40 years.',
    ],
    conservationNote: 'UK butterfly populations have declined by 46% since 1976. Wildflower meadows and native plants in gardens are critical for their survival.',
    activeSeasons: ['spring', 'summer'],
  },
  {
    id: 'bumblebee',
    name: 'Bumblebee',
    emoji: '🐝',
    description: 'A fluffy pollinator that uses "buzz pollination" to shake pollen loose from flowers, vital for food production.',
    attractedBy: ['wildflower_meadow', 'food_forest', 'polytunnel'],
    minFeatures: 1,
    bonusType: 'pollinator',
    bonusMultiplier: 1.2,
    rarity: 'common',
    funFacts: [
      'Bumblebees use "buzz pollination" — vibrating their flight muscles at a specific frequency to shake pollen from flowers like tomatoes and blueberries.',
      'A bumblebee colony is much smaller than a honeybee hive, typically containing only 50-400 workers.',
      'Bumblebees can fly in colder temperatures and lower light than most other pollinators, making them vital for early spring plants.',
      'The queen bumblebee hibernates alone underground through winter, emerging in spring to start a brand new colony.',
    ],
    conservationNote: 'Two UK bumblebee species have become extinct in the last 80 years, and several others are endangered. Planting bee-friendly flowers from March to October provides vital food.',
    activeSeasons: ['spring', 'summer', 'autumn'],
  },
  {
    id: 'stag_beetle',
    name: 'Stag Beetle',
    emoji: '🪲',
    description: 'The UK\'s largest beetle, whose larvae spend years in dead wood recycling nutrients back into the soil.',
    attractedBy: ['log_pile', 'compost_heap'],
    minFeatures: 2,
    bonusType: 'soil_health',
    bonusMultiplier: 1.15,
    rarity: 'rare',
    funFacts: [
      'Stag beetles are the UK\'s largest beetle, growing up to 7.5cm long including their antler-like mandibles.',
      'Stag beetle larvae live in rotting wood for 3-7 years, slowly breaking it down and enriching the soil before emerging as adults.',
      'Male stag beetles use their enormous jaws to wrestle rivals for mates — like miniature deer locking antlers.',
      'Adult stag beetles live for only a few weeks in summer, just long enough to mate and lay eggs.',
    ],
    conservationNote: 'Stag beetles are a priority conservation species in the UK, mainly found in southern England. Leaving dead wood and log piles in gardens is one of the best ways to help them.',
    activeSeasons: ['summer'],
  },
  {
    id: 'wren',
    name: 'Wren',
    emoji: '🪶',
    description: 'One of the UK\'s smallest birds, with an astonishingly loud song that rings through gardens year-round.',
    attractedBy: ['bug_hotel', 'compost_heap', 'log_pile'],
    minFeatures: 2,
    bonusType: 'pest_control',
    bonusMultiplier: 1.1,
    rarity: 'uncommon',
    funFacts: [
      'The wren has the loudest song relative to its body size of any European bird — 10 times louder per gram than a cockerel.',
      'Male wrens build up to 12 "dummy" nests each spring, and the female picks her favourite before lining it with feathers.',
      'Wrens are the UK\'s most common breeding bird, despite being one of the smallest, with around 8.6 million territories.',
      'In cold winter nights, wrens huddle together for warmth — up to 63 have been recorded roosting in a single nest box.',
    ],
    conservationNote: 'Wrens are abundant but can suffer major population crashes during harsh winters. Dense shrubs and ivy provide vital winter shelter.',
    activeSeasons: ['spring', 'summer', 'autumn', 'winter'],
  },
  {
    id: 'slow_worm',
    name: 'Slow Worm',
    emoji: '🐍',
    description: 'Not a snake but a legless lizard! Slow worms are gentle, harmless slug-eaters that love compost heaps.',
    attractedBy: ['compost_heap', 'log_pile'],
    minFeatures: 2,
    bonusType: 'pest_control',
    bonusMultiplier: 1.12,
    rarity: 'uncommon',
    funFacts: [
      'Slow worms are not snakes — they are legless lizards. Unlike snakes, they have eyelids and can blink!',
      'Slow worms can live for over 30 years, making them one of the longest-lived lizards in the world.',
      'They eat mainly slugs and snails, making them incredibly valuable to gardeners.',
      'If grabbed by a predator, a slow worm can shed its tail, which continues to wriggle as a decoy while it escapes.',
    ],
    conservationNote: 'Slow worms are protected by law in the UK. Compost heaps and log piles provide crucial basking and hibernation sites.',
    activeSeasons: ['spring', 'summer'],
  },
  {
    id: 'bat',
    name: 'Pipistrelle Bat',
    emoji: '🦇',
    description: 'The UK\'s smallest and most common bat, eating thousands of insects each night using echolocation.',
    attractedBy: ['pond', 'food_forest'],
    minFeatures: 2,
    bonusType: 'pest_control',
    bonusMultiplier: 1.2,
    rarity: 'rare',
    funFacts: [
      'A single pipistrelle bat can eat over 3,000 tiny insects in one night — that\'s one every few seconds!',
      'Bats use echolocation to navigate and hunt, sending out ultrasonic calls up to 130 times per second and listening for the echoes.',
      'Pipistrelle bats weigh about 5 grams — less than a 20p coin — yet they can live for over 15 years.',
      'All 18 UK bat species are protected by law. It\'s illegal to deliberately disturb a bat or damage its roost.',
    ],
    conservationNote: 'UK bat populations have declined dramatically over the past century due to habitat loss, pesticide use, and roost disturbance. All bats and their roosts are legally protected.',
    activeSeasons: ['spring', 'summer', 'autumn'],
  },
  {
    id: 'hoverfly',
    name: 'Hoverfly',
    emoji: '🪰',
    description: 'A wasp mimic that is actually a harmless and brilliant pollinator, whose larvae devour aphids by the hundred.',
    attractedBy: ['wildflower_meadow', 'polytunnel'],
    minFeatures: 1,
    bonusType: 'pollinator',
    bonusMultiplier: 1.15,
    rarity: 'common',
    funFacts: [
      'Hoverflies mimic the stripes of wasps and bees to fool predators, but they have no sting and are completely harmless.',
      'A single hoverfly larva can eat up to 400 aphids before it pupates — making them fantastic natural pest controllers.',
      'Hoverflies are the second most important group of pollinators after bees, visiting flowers to feed on nectar and pollen.',
      'Some hoverfly species migrate to the UK from mainland Europe each spring, travelling hundreds of miles on the wind.',
    ],
    conservationNote: 'Hoverflies are common but declining in agricultural areas due to pesticide use. Organic gardens with wildflowers provide vital refuges.',
    activeSeasons: ['summer'],
  },
  {
    id: 'earthworm',
    name: 'Earthworm',
    emoji: '🪱',
    description: 'Charles Darwin\'s favourite animal! Earthworms process soil, creating rich humus and aerating the ground for plant roots.',
    attractedBy: ['compost_heap', 'compost_loo'],
    minFeatures: 1,
    bonusType: 'soil_health',
    bonusMultiplier: 1.2,
    rarity: 'common',
    funFacts: [
      'Charles Darwin spent 39 years studying earthworms and wrote that "it may be doubted whether there are many other animals which have played so important a part in the history of the world."',
      'Earthworms can process their own body weight in soil and organic matter every single day.',
      'There are 27 species of earthworm in the UK, and a healthy garden soil can contain over 400 worms per square metre.',
      'Earthworm tunnels improve soil drainage and aeration by up to 50%, allowing plant roots to grow deeper and stronger.',
    ],
    conservationNote: 'Earthworm populations are threatened by soil compaction, chemical fertilisers, and tilling. No-dig gardening methods help protect them.',
    activeSeasons: ['spring', 'summer', 'autumn', 'winter'],
  },
  {
    id: 'song_thrush',
    name: 'Song Thrush',
    emoji: '🐦‍⬛',
    description: 'A beautifully spotted bird famous for smashing snails on "anvil stones" and singing the same phrase three times.',
    attractedBy: ['pond', 'log_pile', 'compost_heap'],
    minFeatures: 2,
    bonusType: 'pest_control',
    bonusMultiplier: 1.15,
    rarity: 'rare',
    funFacts: [
      'Song thrushes use favourite "anvil stones" to smash open snail shells — you can often find a pile of broken shells around a favourite stone.',
      'They sing each musical phrase two or three times before moving to the next, making their song one of the most distinctive in the garden.',
      'Song thrush populations have declined by over 50% since the 1970s, earning them a place on the UK Red List of conservation concern.',
      'A song thrush can eat over 100 snails in a single day during the breeding season when feeding hungry chicks.',
    ],
    conservationNote: 'Song thrushes are Red Listed in the UK due to severe population decline. Pesticide-free gardens with damp areas and log piles provide vital feeding habitat.',
    activeSeasons: ['spring', 'summer'],
  },
];

const wildlifeMap = new Map(wildlifeVisitors.map(v => [v.id, v]));

export function getVisitorById(id: WildlifeType): WildlifeVisitor | undefined {
  return wildlifeMap.get(id);
}

export function getAttractedVisitors(featureIds: string[], season: Season): WildlifeVisitor[] {
  return wildlifeVisitors.filter(visitor => {
    // Check season
    if (!visitor.activeSeasons.includes(season)) return false;
    // Count how many attracting features the player has
    const matchCount = visitor.attractedBy.filter(f => featureIds.includes(f)).length;
    return matchCount >= visitor.minFeatures;
  });
}
