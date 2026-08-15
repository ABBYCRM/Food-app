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
import { recipeLocales } from "./recipe-locales";

export interface RecipeLocale {
  title: string;
  subtitle: string;
  story: string;
  chefNotes: string;
  method: { step: number; text: string }[];
}

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
  mealSlots: ("breakfast" | "brunch" | "lunch" | "dinner" | "snack" | "dessert" | "side")[];
  healthy: boolean;
  /** Translations for non-English locales */
  locales?: { es?: RecipeLocale; pt?: RecipeLocale };
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
      { step: 1, text: "Place the 4 dried guajillo chiles in a dry skillet over medium heat and press them flat with a spatula, toasting for 20–30 seconds per side until they puff slightly, turn fragrant, and release a deep earthy aroma — you want them supple and darkened, not scorched and bitter. Remove immediately and submerge them in a bowl of warm (not boiling) water, using a small plate to keep them submerged. Soak for 20 minutes until the flesh is fully rehydrated and pliable; the soaking liquid will turn brick red." },
      { step: 2, text: "Drain the rehydrated chiles and transfer them to a blender. Add the 4 tbsp red miso paste, 3 tbsp prepared mole negro, 500 ml dark beef stock, and 2 tbsp agave nectar. Blend on high for 60–90 seconds, stopping once to scrape down the sides, until the sauce is completely smooth, deeply colored, and smells of chocolate and chile — no visible chile skin fragments should remain. The sauce will be thick enough to coat the back of a spoon heavily." },
      { step: 3, text: "Pat the 1.5 kg bone-in short ribs completely dry with paper towels — moisture is the enemy of a good sear, and any dampness will cause steaming rather than browning. Season generously with salt and black pepper on all surfaces. Heat a heavy Dutch oven over high heat until smoking, then sear the ribs in batches without crowding, pressing each piece flat for the first 30 seconds to maximize contact. Cook 3–4 minutes per side until deeply mahogany-brown on all surfaces — this Maillard crust is the backbone of the dish's flavor." },
      { step: 4, text: "Pour the blended miso-mole sauce over the seared ribs in the Dutch oven, ensuring every piece is at least half-submerged — the sauce should come up about two-thirds of the way. Tuck the piece of dried kombu alongside the ribs; it will slowly release glutamates that amplify every other savory note in the pot. Cover tightly with the lid and transfer to an oven preheated to 300°F (150°C). Braise for 4 hours, resisting the urge to lift the lid — the low, moist heat gently collapses the collagen into glossy gelatin that enriches the sauce." },
      { step: 5, text: "After 4 hours the meat should be so tender it separates at the touch of a spoon — pull a piece: if it resists at all, return it for another 30 minutes. Lift the ribs out, discard the kombu, and use two forks to gently shred the meat into large, luxurious pieces, discarding the bones. Warm the 12 small white corn tortillas directly over a gas flame or in a dry skillet for 30 seconds per side until charred at the edges and pliable. Layer the short rib onto each tortilla, spoon a little braising sauce over the top, and finish with paper-thin red onion slices and a generous squeeze of fresh lime." }
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
      { step: 1, text: "Place the 4 ears of corn directly on a gas burner grate set to high, or on a grill preheated to high for 10 minutes. Rotate the corn with tongs every 90 seconds, letting each side develop deep char — you want genuine black blistering on at least a third of the kernels, not just a little color. The whole process takes 8–10 minutes; the corn is ready when the husks are gone, the kernels are deeply charred in patches, and the ear smells intensely sweet and smoky. A few kernels may pop — that is fine." },
      { step: 2, text: "While the corn chars, whisk together the 4 tbsp sour cream and 2 tbsp mayonnaise in a small bowl until completely smooth and uniform — no white streaks from either component. The mixture should be thick enough to cling to a spoon rather than drip off it; this is your adhesive layer, and if it is too thin, the toppings will slide right off the hot corn. Season lightly with a pinch of salt." },
      { step: 3, text: "Using tongs or a folded kitchen towel to hold each hot cob, slather the sour cream-mayonnaise mixture generously over all sides of the charred corn, rotating as you go so every kernel gets coated — work quickly while the corn is still hot, as the heat helps the cream mixture adhere and warm through slightly. Aim for a thick, even layer with no bare patches." },
      { step: 4, text: "Spoon the 100 g of chopped kimchi over each cob, pressing the pieces gently into the cream coating so they stick. Dust the 1 tsp gochugaru evenly over all four ears — it should appear as a faint red veil over the surface, intensifying the fermented heat of the kimchi without overwhelming it. Shower the 50 g of crumbled queso fresco over the top; the salty, crumbly cheese should make the surface look generously snow-dusted." },
      { step: 5, text: "Cut the lime in half and squeeze both halves liberally over all four ears right as they are about to be eaten — do not do this in advance, as the acid immediately begins to soften the crispy bits of kimchi and dilute the cream. The lime juice is not just garnish; it cuts through the richness of the sour cream and mayo and brightens the entire flavor. Serve immediately on individual plates or skewered with corn holders." }
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
      { step: 1, text: "In a small bowl, whisk together the white miso paste, honey, and soy sauce until completely smooth — the glaze should be thick, glossy, and flow slowly off the spoon with no lumps. Brush it generously over the flesh side of the salmon, covering every millimeter. Let it rest 5 minutes so it adheres before the pan gets hot." },
      { step: 2, text: "Heat the olive oil in a heavy skillet — cast iron is ideal — over high heat until it just begins to shimmer and smoke. Lay the salmon skin-side down, pressing gently with a spatula for the first 30 seconds so the skin stays flat and can't curl. Cook completely undisturbed for 5 minutes; you'll see the flesh turn from translucent to opaque from the bottom up, roughly two-thirds of the way through. Flip and cook 2 more minutes. The miso glaze should caramelize to a deep amber-bronze — not black." },
      { step: 3, text: "Add the seeded serrano chiles, lime juice, the full bunch of cilantro (stems and all — the stems carry the most flavor), and 3 tbsp of cold water to a blender. Blend on high for 45–60 seconds until the sauce is completely smooth and a vivid electric green. Taste it: fiery, bracingly acidic, herbaceous. Season with a pinch of salt. The sauce should be thin enough to pour but not watery." },
      { step: 4, text: "Fan the thinly sliced cucumber across the base of two shallow bowls, overlapping the rounds like fish scales. Tuck the paper-thin red onion in between the cucumber layers so it's visible but not dominant. Pour the aguachile sauce over the arrangement, letting it pool at the base — use enough so the cucumber is half-submerged. The acid will gently cure the onion while you finish the fish." },
      { step: 5, text: "Set the warm glazed salmon directly in the center of the aguachile pool, skin-side up so it stays crisp against the cold sauce. The dramatic contrast between the hot, caramelized fish and the icy, acidic broth is the entire point — serve the moment it's plated, before the heat can dissipate." }
    ],
    chefNotes: "Look for center-cut Atlantic salmon fillets — widely available at every major supermarket. The miso glaze can be made 2 days ahead and kept refrigerated. Use a mandoline for ultra-thin cucumber and onion slices; hand-cutting produces uneven thickness that bruises rather than cures in the aguachile.",
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
      { step: 1, text: "Place the 3 guajillo chiles and 2 ancho chiles in a dry skillet over medium heat and press flat with a spatula, toasting for 30 seconds per side until they puff and become fragrant — the kitchen should smell of deep dried fruit and mild smoke, not bitter char. Remove immediately and submerge in a bowl of warm water, using a small plate to keep them under the surface. Soak for 20 minutes until completely soft and pliable throughout." },
      { step: 2, text: "Drain the rehydrated chiles and add them to a blender along with the 1 tbsp achiote paste, 2 tbsp white vinegar, 1 tsp five-spice powder, and 1 tbsp soy sauce. Blend on high for 60 seconds until completely smooth — the marinade should be a deep brick-red with no visible chile skin and a complex aroma that hits you as simultaneously Mexican and Chinese. Taste for salt; it should be assertively seasoned since it will dilute as it coats the meat." },
      { step: 3, text: "Place the 700 g of thinly sliced pork shoulder in a large bowl, pour the marinade over it, and use your hands to massage every surface until each slice is uniformly coated in deep red. Cover the bowl tightly with plastic wrap and refrigerate for at least 2 hours — overnight is better. The acid in the vinegar and the bromelain in the marinade will begin tenderizing the pork at the surface, allowing the achiote and chile flavors to penetrate deeply." },
      { step: 4, text: "Heat a large cast iron skillet or heavy-bottomed pan over high heat until smoking. Working in batches without crowding — packing the pan causes steaming rather than searing — lay the marinated pork slices flat in a single layer. Cook 2–3 minutes per side without moving them; you are looking for deeply caramelized, almost charred edges where the achiote sugars have darkened. The pork should smell smoky-sweet and slightly spiced. Repeat with remaining pork." },
      { step: 5, text: "While the pork rests for 2 minutes, steam the 12 thawed bao buns: arrange them in a bamboo or metal steamer basket over vigorously boiling water, cover, and steam for 3–4 minutes until they are puffy, glossy, and spring back when pressed gently. Open each bao and fill generously with the caramelized pork, a few cubes of fresh pineapple (which cuts the richness beautifully), and fresh cilantro leaves — close the bun and serve immediately while the steam still rises." }
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
      { step: 1, text: "Place the 1 kg pork neck bones and 500 g pork trotters in a large pot, cover completely with cold water, and bring to a vigorous boil over high heat. Boil hard for 10 minutes — the water will become grey and foamy as impurities, blood, and myoglobin purge from the bones. Pour off all of this blanching water, then rinse each bone thoroughly under cold running water until the water runs perfectly clear. This step is not optional: it is what separates a clean, luminous broth from a murky, gamy one." },
      { step: 2, text: "Return the cleaned bones to the pot. Add the white onion (halved), the head of garlic (halved crosswise so the cut faces expose the cloves), the piece of dried kombu, and enough fresh cold water to cover everything by at least 3 inches. Bring to a gentle simmer over medium heat — you want just a lazy bubble, not a rolling boil. Maintain this low simmer for 3 hours, skimming any foam that rises to the surface in the first 30 minutes. At the end, the broth should be milky-white, deeply porky, and deeply savory. Strain through a fine sieve and discard solids." },
      { step: 3, text: "While the broth simmers, toast the 3 guajillo chiles and 2 chile de árbol in a dry skillet over medium heat for 30 seconds per side until fragrant, then rehydrate in warm water for 15 minutes. Drain and blend the rehydrated chiles with 1 cup of the strained pork broth until completely smooth, producing a vivid red paste. Heat the 60 ml of vegetable oil in a medium saucepan over medium-high heat, pour the chile paste in, and fry it for 3–4 minutes, stirring constantly, until it darkens slightly and smells toasty and complex rather than raw — this frying step is essential for developing depth." },
      { step: 4, text: "Stir the fried chile paste into the full batch of strained pork broth, mixing until the broth turns an even, deep brick-red. Add the 400 g of drained canned white hominy, which will look like large, plump, starchy kernels that have already been nixtamalized. Bring to a gentle simmer and cook for 30 minutes, during which the hominy will absorb the chile-pork broth and become tender to the tooth — they should have a slight chewiness at the center, not be mushy. Season generously with salt." },
      { step: 5, text: "Bring a separate pot of salted water to a rolling boil and cook the 320 g of ramen noodles according to the package instructions — typically 2–3 minutes for fresh, 4–5 for dried. Drain immediately and divide among four deep, warmed bowls. Ladle the red pozole broth and hominy over the noodles generously, ensuring each bowl gets a good ratio of kernels. Halve the 4 soft-boiled eggs lengthwise and nestle two halves into each bowl, yolk side up. Crumble the dried oregano between your fingers directly over the broth to release its oils, and finish with a squeeze of fresh lime." }
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
      { step: 1, text: "Add the 2 tbsp neutral vegetable oil and three test kernels to a large, heavy-bottomed pot with a tight-fitting lid and set it over medium-high heat. Wait for the test kernels to pop — this tells you the oil has reached roughly 400°F (200°C) and the batch is ready. Add all 100 g of popcorn kernels in a single layer, immediately cover the pot, and shake it gently to ensure no kernel sits directly on the bare hot metal. Once popping begins in earnest, shake the pot every 15–20 seconds; when the pops slow to one every 2–3 seconds, remove from heat immediately to avoid scorching." },
      { step: 2, text: "Transfer the freshly popped corn to the largest mixing bowl you own — you need room to toss without spillage, and a too-small bowl means uneven coating. Let the popcorn sit uncovered for 1 minute to release steam; trapping it causes the kernels to become soft and chewy rather than staying crisp. Discard any unpopped kernels at the bottom of the pot so they don't create an unpleasant surprise mid-snack." },
      { step: 3, text: "Melt the 3 tbsp of butter in the now-empty pot over low heat until just liquid and lightly golden — do not brown it unless you want a nuttier flavor. Pour the melted butter in a thin, steady stream over the popcorn while tossing with a large spoon or your clean hands, moving quickly so it coats evenly before it solidifies. Every kernel should have a faint butter sheen; pooling at the bottom means you are not tossing fast enough." },
      { step: 4, text: "Drizzle the 2 tbsp of chamoy sauce in a zigzag pattern over the buttered popcorn, then immediately toss aggressively for 30 seconds — the chamoy is thick and sweet-sour-spicy, and it needs to be worked into the batch rather than just settling at the bottom. Some kernels will cluster together from the chamoy's stickiness; gently break these apart while tossing. The color of the popcorn should shift from yellow to a warm, unevenly reddish-orange." },
      { step: 5, text: "Sprinkle the 2 tbsp of furikake and 1 tsp of Tajín evenly across the surface, then give the bowl one final vigorous toss to distribute the dry seasonings throughout. The furikake brings toasted sesame, dried seaweed, and salt; the Tajín adds bright citric acid and chile heat — together they make every bite different from the last. Serve immediately from the bowl; this popcorn is at its absolute best in the first 10 minutes before any humidity softens the coating." }
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
      { step: 1, text: "Place the 180 g of sugar in a heavy, light-colored saucepan — light-colored so you can track the caramel's color accurately. Cook over medium heat without stirring, watching as the edges begin to melt and turn amber after 3–4 minutes. At that point, gently swirl the pan (do not stir with a spoon, which causes crystallization) until all the sugar is melted and a deep amber the color of dark honey — this happens fast, so keep your eyes fixed on it. Remove from heat, add the 1 tsp mezcal carefully (it will hiss and spit), and swirl to incorporate. Working quickly, pour an equal amount of caramel into each of 6 ramekins, tilting each to coat the bottom. The caramel will harden as it cools — that is exactly right." },
      { step: 2, text: "In a large mixing bowl, whisk together the 500 ml whole milk, 200 ml sweetened condensed milk, and 2 tbsp white miso paste for 2 full minutes until the miso is completely dissolved and the mixture is uniform — hold the bowl to the light and check there are absolutely no visible lumps of miso. The miso provides a quiet savory undertone that prevents the flan from being one-dimensionally sweet; do not skip or reduce it." },
      { step: 3, text: "Add the 5 whole eggs, 2 egg yolks, and 2 tsp vanilla extract to the milk mixture and whisk gently — not vigorously — for about 45 seconds, just until everything is combined. The goal is incorporation without aeration; excessive whisking creates bubbles that rise to the surface of the flan and leave an unpleasant pocked texture on what will become the top (and eventually, after unmolding, the bottom). Slow and deliberate is the right pace here." },
      { step: 4, text: "Set a fine-mesh sieve over a large measuring jug or pitcher and strain the custard mixture through it, pressing gently — this removes any chalazae (the white stringy egg parts) and any undissolved miso fragments, guaranteeing a silky, pore-free surface. Pour the strained custard evenly into the caramel-lined ramekins, filling each to within 5 mm of the rim. Place the ramekins in a deep baking dish and fill the dish with hot tap water until it reaches halfway up the sides of the ramekins — this bain-marie (water bath) regulates the heat so the custard cooks gently and evenly rather than curdling at the edges." },
      { step: 5, text: "Slide the baking dish carefully into an oven preheated to 325°F (165°C) and bake for 45–50 minutes. The flan is done when the edges are fully set and the center jiggles like firm gelatin — a single, unified wobble rather than a liquid sloshing — when you nudge the ramekin. Remove the ramekins from the water bath and let cool to room temperature, then cover each with plastic wrap and refrigerate for a minimum of 4 hours, ideally overnight. To unmold, run a thin knife around the edge, place a plate on top, and invert with confidence — the caramel will pool around the flan in a glossy amber puddle." }
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
      { step: 1, text: "Pat the 1 kg of chicken wings completely dry with paper towels — any surface moisture will prevent the skin from crisping and create steam in the oven instead. In a large bowl, toss the wings with the 1 tsp baking powder and 1 tsp salt until every piece is evenly coated in a thin, chalky layer. The baking powder raises the skin's pH and draws moisture outward, setting up the irreversibly crunchy result. Arrange the wings on a wire rack set over a rimmed baking sheet in a single layer with space between each wing; crowding traps steam." },
      { step: 2, text: "Place the rack in an oven preheated to 425°F (220°C) — the high heat is deliberate and important for rendering the fat and achieving crackling skin. Bake for 22–25 minutes until the undersides are golden, then flip each wing with tongs and return to the oven for another 20–22 minutes. At the end the skin should be deeply golden, visibly puffed and blistered, and snap audibly when you press it — it will not be this crispy again once glazed, so take it all the way." },
      { step: 3, text: "While the wings finish baking, combine the 3 tbsp tamarind concentrate, 3 tbsp soy sauce, 3 tbsp brown sugar, the minced Fresno chile, and 2 minced garlic cloves in a small saucepan over medium heat. Stir to dissolve the sugar, then bring to a gentle simmer. The tamarind will give the sauce a dark, almost chocolatey color; the soy adds umami depth; the brown sugar provides glossy body. Cook for 3–4 minutes, stirring occasionally, until the sauce smells like a rich sweet-sour-savory lacquer." },
      { step: 4, text: "Reduce the heat to medium-low and continue cooking the glaze, stirring frequently, until it thickens enough to coat the back of a spoon heavily — drag your finger through the spoon coating and it should leave a clean line that holds its shape for several seconds. This typically takes 5–7 minutes total. If it thickens too fast and becomes jammy, add a splash of water and stir to loosen; the glaze should flow slowly, not solidify into a sticky paste." },
      { step: 5, text: "Transfer the hot, crispy wings directly from the wire rack into a large mixing bowl. Pour three-quarters of the warm glaze over them and toss vigorously with tongs for 30 seconds until every surface is lacquered and glossy — the glaze should coat each wing like a second skin, not pool at the bottom of the bowl. Add the remaining glaze and toss once more. Transfer to a serving platter and serve immediately; the glaze sets and the skin softens within minutes, so the table should already be set when the wings go in the bowl." }
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
      { step: 1, text: "Separate the 5 eggs into two clean bowls — yolks in a large mixing bowl, whites in a spotlessly clean and completely grease-free bowl (any fat residue will prevent the whites from whipping). Add the 200 g of sugar to the yolks and beat with an electric mixer on high speed for 4–5 minutes until the mixture is very pale, almost white, and has roughly tripled in volume — when you lift the beaters, a thick ribbon of batter should fall and hold its shape on the surface for 3 seconds before dissolving. This ribbon stage is the structural foundation of the cake." },
      { step: 2, text: "Sift the 180 g cake flour and 1 tsp ground cinnamon together over the yolk mixture and fold in very gently with a large rubber spatula using slow, wide strokes — you are preserving the air you just spent 5 minutes building, so do not stir or beat. Fold until no streaks of flour remain, then stop. In a separate clean bowl, whip the egg whites with an electric mixer to stiff peaks — the peaks should stand straight up without drooping. Fold the whites into the batter in three additions, again with slow, deliberate strokes to deflate as little as possible." },
      { step: 3, text: "Pour the batter into a lightly greased 9×13-inch baking dish and spread it to an even layer with a spatula — tap the dish gently on the counter once to release any large air pockets. Bake in an oven preheated to 350°F (175°C) for 30–35 minutes. The cake is done when it pulls away slightly from the sides of the dish, springs back firmly when pressed in the center, and a toothpick inserted in the middle comes out clean with no wet batter. Allow the cake to cool completely in the pan before proceeding — adding the soak to a warm cake causes it to become gummy." },
      { step: 4, text: "Once the cake is completely cool, use a fork, skewer, or toothpick to poke holes all over the surface — space them about 1 inch apart and go all the way to the bottom of the cake; these channels are how the milk soak travels through every layer. In a bowl, whisk together the 300 ml horchata, 200 ml evaporated milk, and 200 ml sweetened condensed milk until combined. Pour this three-milk mixture slowly and evenly over the surface of the perforated cake, letting each pour absorb before adding the next. Cover and refrigerate for at least 4 hours — the cake transforms completely, turning from a light sponge into a dense, impossibly moist, custard-like block." },
      { step: 5, text: "To make the matcha cream, sift the 2 tsp of matcha powder into a medium bowl to remove any lumps — unmixed lumps of matcha will create bitter green pockets in the whipped cream. Pour in the 200 ml cold heavy cream and 1 tsp vanilla extract and whip with an electric mixer starting on low then increasing to medium-high, until the cream holds soft peaks — it should mound slightly but curl at the tips. Do not overwhip to stiff peaks or it will taste grainy. Spread the matcha cream in billowy swaths over the entire surface of the chilled cake, then dust the top with extra matcha powder through a fine sieve for an elegant, even green finish." }
    ],
    chefNotes: "Horchata is in the beverage section at most grocery stores (look for Cali brand). Culinary-grade matcha is now at Target, Trader Joe's, and Whole Foods. Store-bought horchata works beautifully.",
    pairing: "Iced matcha latte or mezcal sour",
    mealSlots: ["dessert"],
    healthy: false
  }
];

/** Merge locale translations into every recipe at load time */
function withLocales(r: Recipe): Recipe {
  const loc = recipeLocales[r.slug];
  if (!loc) return r;
  return { ...r, locales: loc };
}

export const recipes: Recipe[] = [
  ...existingRecipes,
  ...dinnerRecipes,
  ...breakfastRecipes,
  ...lunchRecipes,
  ...snackRecipes,
].map(withLocales);

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find(r => r.slug === slug);
}
