import misoMoleHero from "@assets/generated_images/miso-mole-short-rib-tacos.jpg";
import kimchiEloteHero from "@assets/generated_images/kimchi-elote.jpg";
import salmonAguachileHero from "@assets/generated_images/miso-glazed-salmon-aguachile.jpg";
import alPastorBaoHero from "@assets/generated_images/al-pastor-bao.jpg";
import pozoleHero from "@assets/generated_images/ramen-pozole-rojo.jpg";
import popcornHero from "@assets/generated_images/chamoy-furikake-popcorn.jpg";
import flanHero from "@assets/generated_images/miso-mezcal-flan.jpg";
import wingsHero from "@assets/generated_images/tamarindo-shoyu-glazed-wings.jpg";
import tresLechesHero from "@assets/generated_images/horchata-tres-leches-matcha.jpg";

import { breakfastRecipes } from "./breakfast-recipes";
import { lunchRecipes } from "./lunch-recipes";
import { dinnerRecipes } from "./dinner-recipes";
import { snackRecipes } from "./snack-recipes";

export interface Recipe {
  slug: string;
  title: string;
  subtitle: string;
  story: string;           
  category: string;        
  tags: string[];          
  allergens: string[];
  difficulty: "Easy" | "Medium" | "Advanced";
  prepTime: string;        
  cookTime: string;        
  servings: number;
  spiceLevel: 0 | 1 | 2 | 3;  
  umamiLevel: 1 | 2 | 3;
  origin: string;          
  heroImage: string;       
  thumbImage: string;      
  ingredients: { qty: string; unit: string; item: string; note?: string }[];
  method: { step: number; text: string }[];
  chefNotes: string;
  pairing: string;
  mealSlots: ("breakfast" | "lunch" | "dinner" | "snack" | "dessert")[];
  healthy: boolean;
}

export const existingRecipes: Recipe[] = [
  {
    slug: "miso-mole-short-rib-tacos",
    title: "Miso-Mole Short Rib Tacos",
    subtitle: "A 36-hour braise of pure umami.",
    story: "The first time umami met mole, both were changed forever. Red miso deepens the chocolate-chile complexity of classic mole negro into something extraordinary — a 36-hour braise that perfumes your kitchen for an entire afternoon.",
    category: "Tacos",
    tags: ["Dairy-Free"],
    allergens: ["soy", "gluten", "sesame"],
    difficulty: "Advanced",
    prepTime: "30 min",
    cookTime: "4 hrs",
    servings: 4,
    spiceLevel: 2,
    umamiLevel: 3,
    origin: "Mexico City × Osaka",
    heroImage: misoMoleHero,
    thumbImage: misoMoleHero,
    ingredients: [
      { qty: "1.5", unit: "kg", item: "bone-in beef short rib" },
      { qty: "4", unit: "tbsp", item: "red miso paste" },
      { qty: "3", unit: "tbsp", item: "prepared mole negro" },
      { qty: "4", unit: "", item: "dried guajillo chiles" },
      { qty: "1", unit: "piece", item: "dried kombu" },
      { qty: "500", unit: "ml", item: "dark beef stock" },
      { qty: "2", unit: "tbsp", item: "agave nectar" },
      { qty: "12", unit: "", item: "small white corn tortillas" },
      { qty: "1", unit: "", item: "red onion", note: "thinly sliced" },
      { qty: "2", unit: "", item: "lime" }
    ],
    method: [
      { step: 1, text: "Toast guajillo chiles in a dry pan until fragrant, then rehydrate in warm water for 20 minutes." },
      { step: 2, text: "Blend the rehydrated chiles with miso, mole, beef stock, and agave until perfectly smooth." },
      { step: 3, text: "Sear short ribs aggressively in a heavy Dutch oven until heavily browned on all sides." },
      { step: 4, text: "Pour the blended sauce over the ribs, add kombu, cover, and braise low and slow at 300°F (150°C) for 4 hours." },
      { step: 5, text: "Remove meat, shred gently, and serve on warm corn tortillas with pickled red onion and lime." }
    ],
    chefNotes: "Substitute mole negro with 2 tbsp dark cocoa powder + 1 chipotle in adobo if you can't find prepared mole. The kombu is optional but adds a whisper of sea depth.",
    pairing: "Oaxacan mezcal on the rocks or a cold Modelo Negra",
    mealSlots: ["dinner"],
    healthy: false
  },
  {
    slug: "kimchi-elote",
    title: "Kimchi Elote",
    subtitle: "Street food elevated by fermentation.",
    story: "Mexico's most beloved street food meets Korea's most fermented treasure. The sour funk of aged kimchi plays perfectly against sweet charred corn and salty cotija. A 15-minute revelation.",
    category: "Snacks",
    tags: ["Vegetarian", "Gluten-Free"],
    allergens: ["dairy", "egg"],
    difficulty: "Easy",
    prepTime: "10 min",
    cookTime: "15 min",
    servings: 4,
    spiceLevel: 2,
    umamiLevel: 2,
    origin: "Oaxaca × Seoul",
    heroImage: kimchiEloteHero,
    thumbImage: kimchiEloteHero,
    ingredients: [
      { qty: "4", unit: "", item: "sweet corn on cob" },
      { qty: "100", unit: "g", item: "napa kimchi", note: "chopped" },
      { qty: "4", unit: "tbsp", item: "sour cream" },
      { qty: "2", unit: "tbsp", item: "mayonnaise" },
      { qty: "1", unit: "tsp", item: "gochugaru" },
      { qty: "50", unit: "g", item: "queso fresco", note: "crumbled" },
      { qty: "1", unit: "", item: "lime" }
    ],
    method: [
      { step: 1, text: "Grill corn over high heat until charred and blistered on all sides." },
      { step: 2, text: "In a small bowl, whisk together the sour cream and mayonnaise." },
      { step: 3, text: "Slather the charred corn with the cream mixture evenly." },
      { step: 4, text: "Top generously with chopped kimchi, gochugaru, and crumbled queso fresco." },
      { step: 5, text: "Squeeze fresh lime over everything right before serving." }
    ],
    chefNotes: "Kimchi is now at every major grocery chain — look for it in the refrigerated Asian foods section. The older and more sour the kimchi, the better it works here.",
    pairing: "Ice-cold lager or a sparkling agua fresca",
    mealSlots: ["snack", "lunch"],
    healthy: false
  },
  {
    slug: "miso-glazed-salmon-aguachile",
    title: "Miso-Glazed Salmon Aguachile",
    subtitle: "Electric green chile broth meets white miso.",
    story: "Aguachile's electric green chile broth reimagined with a white miso glaze that glazes seared Atlantic salmon — silky, spicy, complex. This is the recipe that replaced hamachi on our menu when we realized salmon was available everywhere and just as glorious.",
    category: "Seafood",
    tags: ["Gluten-Free", "Dairy-Free", "Pescatarian"],
    allergens: ["fish", "soy"],
    difficulty: "Medium",
    prepTime: "25 min",
    cookTime: "8 min",
    servings: 2,
    spiceLevel: 2,
    umamiLevel: 3,
    origin: "Sinaloa × Tokyo",
    heroImage: salmonAguachileHero,
    thumbImage: salmonAguachileHero,
    ingredients: [
      { qty: "300", unit: "g", item: "Atlantic salmon fillet", note: "skin-on" },
      { qty: "2", unit: "tbsp", item: "white miso paste" },
      { qty: "1", unit: "tbsp", item: "honey" },
      { qty: "1", unit: "tsp", item: "soy sauce" },
      { qty: "2", unit: "", item: "serrano chile", note: "deseeded" },
      { qty: "4", unit: "tbsp", item: "lime juice" },
      { qty: "1", unit: "", item: "cucumber", note: "thinly sliced" },
      { qty: "0.5", unit: "", item: "red onion", note: "paper-thin" },
      { qty: "1", unit: "bunch", item: "fresh cilantro" },
      { qty: "1", unit: "tbsp", item: "olive oil" }
    ],
    method: [
      { step: 1, text: "Whisk miso, honey, and soy sauce into a smooth glaze. Brush generously over the salmon." },
      { step: 2, text: "Heat olive oil in a skillet. Sear salmon skin-down for 5 minutes, flip, and cook 2 more minutes." },
      { step: 3, text: "Blend serrano chiles, lime juice, cilantro, and a splash of water until completely smooth." },
      { step: 4, text: "Arrange cucumber and onion slices elegantly in a shallow bowl. Pour the aguachile sauce over them." },
      { step: 5, text: "Place the warm glazed salmon in the center of the pool. Serve immediately." }
    ],
    chefNotes: "Look for center-cut Atlantic salmon fillets — widely available at every major supermarket. The miso glaze can be made 2 days ahead. Use a mandoline for ultra-thin cucumber slices.",
    pairing: "Dry sake or a crisp Sauvignon Blanc",
    mealSlots: ["dinner", "lunch"],
    healthy: true
  },
  {
    slug: "al-pastor-bao",
    title: "Al Pastor Bao",
    subtitle: "Shawarma became al pastor, al pastor became bao.",
    story: "Lebanese shawarma became al pastor in Mexico. Al pastor became bao in this kitchen. The pineapple-achiote marinade is pure Mexico; the pillowy steamed bun is pure China. Together: unstoppable.",
    category: "Tacos",
    tags: ["Dairy-Free"],
    allergens: ["gluten", "pork"],
    difficulty: "Medium",
    prepTime: "20 min",
    cookTime: "45 min",
    servings: 4,
    spiceLevel: 1,
    umamiLevel: 2,
    origin: "Guadalajara × Shanghai",
    heroImage: alPastorBaoHero,
    thumbImage: alPastorBaoHero,
    ingredients: [
      { qty: "700", unit: "g", item: "pork shoulder", note: "thinly sliced" },
      { qty: "3", unit: "", item: "dried guajillo chiles" },
      { qty: "2", unit: "", item: "dried ancho chiles" },
      { qty: "1", unit: "tbsp", item: "achiote paste" },
      { qty: "2", unit: "tbsp", item: "white vinegar" },
      { qty: "200", unit: "g", item: "fresh pineapple", note: "cubed" },
      { qty: "1", unit: "tsp", item: "five-spice powder" },
      { qty: "1", unit: "tbsp", item: "soy sauce" },
      { qty: "12", unit: "", item: "frozen bao buns", note: "thawed" }
    ],
    method: [
      { step: 1, text: "Rehydrate dried chiles in warm water." },
      { step: 2, text: "Blend chiles, achiote, vinegar, five-spice, and soy sauce into a marinade." },
      { step: 3, text: "Toss pork in marinade and let rest for at least 2 hours in the fridge." },
      { step: 4, text: "Cook pork in a smoking hot skillet until edges are charred and caramelized." },
      { step: 5, text: "Steam bao buns according to package instructions. Fill with pork, fresh pineapple cubes, and cilantro." }
    ],
    chefNotes: "Frozen bao buns are available at most Asian grocery stores and now at Whole Foods and larger Kroger/Albertsons locations. Achiote paste is in the Hispanic foods aisle — look for Goya or La Morena brands.",
    pairing: "Tsingtao lager or a hibiscus-lime agua fresca",
    mealSlots: ["dinner", "lunch"],
    healthy: false
  },
  {
    slug: "ramen-pozole-rojo",
    title: "Ramen Pozole Rojo",
    subtitle: "Pork bone broth, hominy, and noodles.",
    story: "Pozole's soul is pork bone broth and hominy. Ramen's soul is pork bone broth and noodles. This is not a fusion — it is a recognition that they were always cousins separated by the Pacific.",
    category: "Rice & Noodles",
    tags: ["Dairy-Free"],
    allergens: ["gluten", "pork", "sesame", "egg"],
    difficulty: "Advanced",
    prepTime: "30 min",
    cookTime: "3 hrs",
    servings: 4,
    spiceLevel: 2,
    umamiLevel: 3,
    origin: "Jalisco × Fukuoka",
    heroImage: pozoleHero,
    thumbImage: pozoleHero,
    ingredients: [
      { qty: "1", unit: "kg", item: "pork neck bones" },
      { qty: "500", unit: "g", item: "pork trotters" },
      { qty: "1", unit: "", item: "white onion" },
      { qty: "1", unit: "head", item: "garlic", note: "halved" },
      { qty: "1", unit: "piece", item: "dried kombu" },
      { qty: "3", unit: "", item: "dried guajillo chiles" },
      { qty: "2", unit: "", item: "dried chile de árbol" },
      { qty: "60", unit: "ml", item: "vegetable oil" },
      { qty: "400", unit: "g", item: "canned white hominy", note: "drained" },
      { qty: "320", unit: "g", item: "ramen noodles" },
      { qty: "4", unit: "", item: "soft-boiled eggs" },
      { qty: "2", unit: "", item: "fresh lime" },
      { qty: "1", unit: "tsp", item: "dried oregano" }
    ],
    method: [
      { step: 1, text: "Blanch the bones in boiling water for 10 minutes, then rinse completely clean." },
      { step: 2, text: "Cover bones with fresh water, add onion, garlic, and kombu. Simmer gently for 3 hours, then strain to yield a rich broth." },
      { step: 3, text: "Toast guajillo and árbol chiles, rehydrate, and blend into a paste. Stir into the strained broth." },
      { step: 4, text: "Add hominy to the red broth and simmer for 30 minutes." },
      { step: 5, text: "Cook ramen noodles separately, place in bowls, and ladle the hot pozole broth and hominy over top. Finish with soft-boiled egg, oregano, and lime." }
    ],
    chefNotes: "Canned hominy is in the Hispanic foods aisle at every major supermarket. Dried guajillo chiles and chile de árbol are standard pantry items at Walmart, Target, and grocery stores with Hispanic sections.",
    pairing: "Cold Modelo Especial or jasmine iced tea",
    mealSlots: ["dinner", "lunch"],
    healthy: false
  },
  {
    slug: "chamoy-furikake-popcorn",
    title: "Chamoy Furikake Popcorn",
    subtitle: "Sweet, sour, spicy, and profoundly savory.",
    story: "The snack that started a thousand conversations. Chamoy's sweet-sour-spicy punch meets the savory sesame depth of furikake. Eat one piece and you cannot stop.",
    category: "Snacks",
    tags: ["Vegan", "Gluten-Free"],
    allergens: ["sesame"],
    difficulty: "Easy",
    prepTime: "5 min",
    cookTime: "10 min",
    servings: 4,
    spiceLevel: 1,
    umamiLevel: 2,
    origin: "Mexico City × Tokyo",
    heroImage: popcornHero,
    thumbImage: popcornHero,
    ingredients: [
      { qty: "100", unit: "g", item: "popcorn kernels" },
      { qty: "2", unit: "tbsp", item: "neutral vegetable oil" },
      { qty: "3", unit: "tbsp", item: "butter", note: "can omit for vegan" },
      { qty: "2", unit: "tbsp", item: "chamoy sauce" },
      { qty: "2", unit: "tbsp", item: "furikake" },
      { qty: "1", unit: "tsp", item: "Tajín chile-lime seasoning" }
    ],
    method: [
      { step: 1, text: "Pop the kernels in the hot vegetable oil in a large covered pot." },
      { step: 2, text: "Transfer the popped popcorn to a very large mixing bowl." },
      { step: 3, text: "Drizzle melted butter over the popcorn and toss." },
      { step: 4, text: "Drizzle chamoy sauce and toss again until evenly coated." },
      { step: 5, text: "Sprinkle furikake and Tajín over the top, tossing one final time. Serve immediately." }
    ],
    chefNotes: "Chamoy sauce is in the Mexican foods aisle at most major grocery stores — look for Miguelito or Baja Fresh brands. Furikake is in the Asian foods section. Tajín is everywhere now.",
    pairing: "Michelada or sparkling water with lime",
    mealSlots: ["snack"],
    healthy: false
  },
  {
    slug: "miso-mezcal-flan",
    title: "Miso Mezcal Flan",
    subtitle: "Classic Mexican flan elevated with white miso.",
    story: "Classic Mexican flan elevated with white miso — the fermented soybean paste that adds a whisper of savory depth to the caramel. A splash of mezcal in the caramel transforms dessert into a ceremony.",
    category: "Desserts",
    tags: ["Vegetarian", "Gluten-Free"],
    allergens: ["dairy", "egg"],
    difficulty: "Medium",
    prepTime: "20 min",
    cookTime: "55 min",
    servings: 6,
    spiceLevel: 0,
    umamiLevel: 2,
    origin: "Mexico City × Kyoto",
    heroImage: flanHero,
    thumbImage: flanHero,
    ingredients: [
      { qty: "180", unit: "g", item: "sugar" },
      { qty: "1", unit: "tsp", item: "mezcal" },
      { qty: "500", unit: "ml", item: "whole milk" },
      { qty: "200", unit: "ml", item: "sweetened condensed milk" },
      { qty: "2", unit: "tbsp", item: "white miso paste" },
      { qty: "5", unit: "", item: "whole eggs" },
      { qty: "2", unit: "", item: "egg yolks" },
      { qty: "2", unit: "tsp", item: "vanilla extract" }
    ],
    method: [
      { step: 1, text: "Melt sugar in a saucepan until deep amber. Carefully stir in mezcal. Quickly pour into the base of 6 ramekins." },
      { step: 2, text: "In a large bowl, whisk together whole milk, condensed milk, and white miso until perfectly smooth." },
      { step: 3, text: "Add the eggs, extra yolks, and vanilla. Whisk gently to combine without incorporating too much air." },
      { step: 4, text: "Strain the mixture through a fine sieve and pour into the caramel-lined ramekins." },
      { step: 5, text: "Bake in a water bath at 325°F (165°C) for 45-50 minutes. Chill overnight before unmolding." }
    ],
    chefNotes: "White miso is now at every Whole Foods, Sprouts, and most Kroger locations — check the refrigerated section near tofu. Do not skip the bain-marie (water bath); it is non-negotiable for silky flan.",
    pairing: "A shot of mezcal or strong black coffee",
    mealSlots: ["dessert", "snack"],
    healthy: false
  },
  {
    slug: "tamarindo-shoyu-glazed-wings",
    title: "Tamarind-Shoyu Glazed Wings",
    subtitle: "Lacquered glossy wings, impossibly addictive.",
    story: "Tamarind brings the sour-sweet backbone that makes these wings impossibly addictive. Soy sauce adds the savory depth. Together they create a glaze that lacquers each wing like lacquerware — glossy, complex, and gone in minutes.",
    category: "Wings",
    tags: ["Dairy-Free"],
    allergens: ["soy", "sesame"],
    difficulty: "Easy",
    prepTime: "15 min",
    cookTime: "50 min",
    servings: 4,
    spiceLevel: 1,
    umamiLevel: 3,
    origin: "Mexico × Japan",
    heroImage: wingsHero,
    thumbImage: wingsHero,
    ingredients: [
      { qty: "1", unit: "kg", item: "chicken wings", note: "flats and drumettes" },
      { qty: "1", unit: "tsp", item: "baking powder" },
      { qty: "1", unit: "tsp", item: "salt" },
      { qty: "3", unit: "tbsp", item: "tamarind concentrate" },
      { qty: "3", unit: "tbsp", item: "soy sauce" },
      { qty: "3", unit: "tbsp", item: "brown sugar" },
      { qty: "1", unit: "", item: "Fresno chile", note: "minced" },
      { qty: "2", unit: "cloves", item: "garlic", note: "minced" }
    ],
    method: [
      { step: 1, text: "Toss wings with baking powder and salt. Arrange on a wire rack over a baking sheet." },
      { step: 2, text: "Bake at 425°F (220°C) for 45 minutes, flipping halfway, until skin is crackling and crisp." },
      { step: 3, text: "In a small saucepan, simmer tamarind concentrate, soy sauce, brown sugar, Fresno chile, and garlic." },
      { step: 4, text: "Reduce the glaze until it thickens and heavily coats the back of a spoon." },
      { step: 5, text: "Toss the hot wings in the warm glaze and serve immediately." }
    ],
    chefNotes: "Tamarind concentrate is in the Asian or Hispanic foods aisle at most major supermarkets — look for Tamicon brand. It keeps for months in the fridge. Fresno chiles are widely available; substitute red jalapeño if needed.",
    pairing: "Cold lager, sparkling water with citrus, or a whiskey highball",
    mealSlots: ["dinner", "snack"],
    healthy: false
  },
  {
    slug: "horchata-tres-leches-matcha",
    title: "Horchata-Tres Leches with Matcha",
    subtitle: "A dessert that reconciles two ideas of sweetness.",
    story: "Mexico's most beloved cake — soaked in three milks until impossibly moist — meets the earthy bitterness of Japanese matcha whipped cream. Cinnamon-scented sponge, horchata soak, matcha cloud. A dessert that reconciles two completely different ideas of sweetness.",
    category: "Desserts",
    tags: ["Vegetarian"],
    allergens: ["dairy", "egg", "gluten"],
    difficulty: "Medium",
    prepTime: "30 min",
    cookTime: "35 min",
    servings: 8,
    spiceLevel: 0,
    umamiLevel: 1,
    origin: "Mexico × Kyoto",
    heroImage: tresLechesHero,
    thumbImage: tresLechesHero,
    ingredients: [
      { qty: "5", unit: "", item: "eggs" },
      { qty: "200", unit: "g", item: "sugar" },
      { qty: "180", unit: "g", item: "cake flour" },
      { qty: "1", unit: "tsp", item: "ground cinnamon" },
      { qty: "300", unit: "ml", item: "horchata" },
      { qty: "200", unit: "ml", item: "evaporated milk" },
      { qty: "200", unit: "ml", item: "sweetened condensed milk" },
      { qty: "300", unit: "ml", item: "heavy cream" },
      { qty: "200", unit: "ml", item: "heavy cream", note: "for topping" },
      { qty: "2", unit: "tsp", item: "matcha powder", note: "plus extra for dusting" },
      { qty: "1", unit: "tsp", item: "vanilla extract" }
    ],
    method: [
      { step: 1, text: "Separate eggs. Beat yolks with sugar until pale and fluffy." },
      { step: 2, text: "Gently fold in sifted cake flour and cinnamon. Whip egg whites to stiff peaks and fold into the batter." },
      { step: 3, text: "Pour into a baking dish and bake at 350°F (175°C) for 30-35 minutes. Let cool completely." },
      { step: 4, text: "Poke holes all over the cake. Whisk horchata, evaporated milk, and condensed milk. Pour over cake and refrigerate 4+ hours." },
      { step: 5, text: "Whip the remaining cream with matcha powder and vanilla. Spread over cake and dust with extra matcha." }
    ],
    chefNotes: "Horchata is in the beverage section at most grocery stores (look for Cali brand). Culinary-grade matcha is now at Target, Trader Joe's, and Whole Foods. Store-bought horchata works beautifully.",
    pairing: "Iced matcha latte or mezcal sour",
    mealSlots: ["dessert"],
    healthy: false
  }
];

export const recipes: Recipe[] = [
  ...existingRecipes,
  ...dinnerRecipes,
  ...breakfastRecipes,
  ...lunchRecipes,
  ...snackRecipes,
];

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find(r => r.slug === slug);
}
