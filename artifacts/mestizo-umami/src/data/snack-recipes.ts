import type { Recipe } from "./recipes";
import snackDipsHero from "@assets/generated_images/snack-dips.jpg";
import snackBitesHero from "@assets/generated_images/snack-bites.jpg";

export const snackRecipes: Recipe[] = [

  {
    slug: "miso-guacamole",
    title: "Miso Guacamole",
    subtitle: "The classic dip, deepened with fermentation.",
    story: "Avocado is essentially green butter. By replacing the salt in traditional guacamole with white miso paste, you add a complex, fermented savoriness that makes it impossible to stop eating.",
    category: "Dips",
    tags: ["Vegan", "Gluten-Free"],
    allergens: ["soy"],
    difficulty: "Easy",
    prepTime: "10 min",
    cookTime: "0 min",
    servings: 4,
    spiceLevel: 1,
    umamiLevel: 3,
    origin: "Mexico City x Tokyo",
    heroImage: snackDipsHero,
    thumbImage: snackDipsHero,
    ingredients: [
      { qty: "3", unit: "", item: "large ripe hass avocados" },
      { qty: "1.5", unit: "tbsp", item: "white miso paste" },
      { qty: "1/4", unit: "cup", item: "white onion", note: "finely diced" },
      { qty: "1", unit: "", item: "serrano chile", note: "minced" },
      { qty: "1/4", unit: "cup", item: "fresh cilantro", note: "chopped" },
      { qty: "2", unit: "tbsp", item: "fresh lime juice" }
    ],
    method: [
      { step: 1, text: "Halve the 3 large ripe Hass avocados, remove the pits, and scoop the flesh into a large wide bowl. Use a fork to mash it with firm, deliberate strokes — you want a chunky texture with visible pale-green chunks, not a smooth paste. Stop when roughly half the avocado is still in discernible pieces." },
      { step: 2, text: "Drizzle the 2 tbsp fresh lime juice over the mashed avocado and fold it in gently with a spoon, coating every piece. The acid does two jobs: brightens the flavor and slows browning by keeping the surface pH low. The mixture should look glossy and slightly looser than before." },
      { step: 3, text: "Add the 1.5 tbsp white miso paste, the 1/4 cup finely diced white onion, and the 1 minced serrano chile to the bowl. Fold everything together for about 20 seconds until the miso disappears into the avocado — no visible beige streaks should remain. Taste at this point; because miso is salty, you almost certainly will not need additional salt." },
      { step: 4, text: "Scatter the 1/4 cup chopped fresh cilantro over the top and fold it in with just three or four strokes so the green flecks remain visible and evenly spread throughout the dip rather than becoming bruised and dark." },
      { step: 5, text: "Transfer to a serving bowl and press a piece of plastic wrap directly onto the surface of the guacamole to exclude all air. Serve within 10 minutes for peak color — the surface should look bright, vivid green. If any browning appears before serving, scrape it off; the layer beneath will be perfect." }
    ],
    chefNotes: "Because miso is salty, you likely will not need to add any additional salt to this recipe. Always taste before seasoning.",
    pairing: "Ice cold Margarita",
    mealSlots: ["snack"],
    healthy: true
  },
  {
    slug: "wasabi-queso-fundido",
    title: "Wasabi Queso Fundido",
    subtitle: "Melted cheese with a sinus-clearing kick.",
    story: "Queso fundido is rich and heavy. A dollop of wasabi cuts right through the molten cheese, providing a sharp, bright heat that completely changes the dynamic of the dish.",
    category: "Dips",
    tags: ["Vegetarian", "Gluten-Free"],
    allergens: ["dairy"],
    difficulty: "Easy",
    prepTime: "5 min",
    cookTime: "15 min",
    servings: 4,
    spiceLevel: 2,
    umamiLevel: 2,
    origin: "Chihuahua x Shizuoka",
    heroImage: snackDipsHero,
    thumbImage: snackDipsHero,
    ingredients: [
      { qty: "2", unit: "cups", item: "Oaxaca cheese", note: "shredded" },
      { qty: "1", unit: "cup", item: "Monterey Jack cheese", note: "shredded" },
      { qty: "2", unit: "tsp", item: "prepared wasabi paste" },
      { qty: "2", unit: "tbsp", item: "whole milk" },
      { qty: "1", unit: "tbsp", item: "scallions", note: "thinly sliced" }
    ],
    method: [
      { step: 1, text: "Position your oven rack about 6 inches from the broiler element and preheat the oven to 400°F (200°C). While it heats, shred the 2 cups Oaxaca cheese and 1 cup Monterey Jack cheese if you haven't already — pre-shredded bags work but freshly shredded melts more smoothly because it lacks anti-caking starch." },
      { step: 2, text: "Combine the 2 cups Oaxaca cheese and 1 cup Monterey Jack in an 8-inch cast-iron skillet or any small ovenproof dish, spreading them into an even, flat layer. Pour the 2 tbsp whole milk evenly over the surface — this small amount of liquid prevents the cheese proteins from seizing up and turning grainy as they melt." },
      { step: 3, text: "Dot the 2 tsp prepared wasabi paste over the cheese in four or five small blobs, spaced evenly so every scoop of the finished dip gets a hit of heat. Do not stir it in — it will incorporate naturally as the cheese melts around it during baking." },
      { step: 4, text: "Bake at 400°F for 12–15 minutes. Watch through the oven window: the cheese should bubble vigorously all the way to the center, and the surface should show patches of light gold. If it's bubbling only at the edges after 12 minutes, give it 2 more minutes." },
      { step: 5, text: "Remove the skillet from the oven the moment the top looks lightly browned — any longer and the wasabi compounds will fully cook off and lose their heat. Scatter the 1 tbsp thinly sliced scallions over the top and serve immediately, straight from the pan, with warm tortillas on the side." }
    ],
    chefNotes: "Wasabi loses its punch when exposed to high heat for too long, so bake the cheese quickly and eat it immediately.",
    pairing: "Cold Asahi beer",
    mealSlots: ["snack"],
    healthy: false
  },
  {
    slug: "chipotle-edamame-hummus",
    title: "Chipotle Edamame Hummus",
    subtitle: "Smoky, spicy, and vibrantly green.",
    story: "Trading chickpeas for edamame creates a sweeter, greener base for hummus. Blending in chipotle peppers in adobo adds a deep, smoky Mexican heat that pairs perfectly with the sweet beans.",
    category: "Dips",
    tags: ["Vegan", "Gluten-Free", "Dairy-Free"],
    allergens: ["soy", "sesame"],
    difficulty: "Easy",
    prepTime: "10 min",
    cookTime: "5 min",
    servings: 6,
    spiceLevel: 2,
    umamiLevel: 2,
    origin: "Puebla x Tokyo",
    heroImage: snackDipsHero,
    thumbImage: snackDipsHero,
    ingredients: [
      { qty: "2", unit: "cups", item: "frozen shelled edamame" },
      { qty: "1/4", unit: "cup", item: "tahini" },
      { qty: "2", unit: "tbsp", item: "chipotle in adobo", note: "chopped" },
      { qty: "2", unit: "cloves", item: "garlic", note: "smashed" },
      { qty: "3", unit: "tbsp", item: "fresh lime juice" },
      { qty: "1/4", unit: "cup", item: "olive oil" }
    ],
    method: [
      { step: 1, text: "Bring a medium saucepan of generously salted water to a rolling boil over high heat. Add the 2 cups frozen shelled edamame directly from frozen — no need to thaw — and cook for exactly 5 minutes. They should be fully tender and bright vivid green when done; taste one to confirm it's soft all the way through." },
      { step: 2, text: "Drain the edamame in a colander and cool under cold running water for 30 seconds to stop the cooking and lock in the vibrant green color. Shake the colander well and let the beans drain for 2 minutes — excess water will dilute the hummus and make it watery rather than creamy." },
      { step: 3, text: "Add the drained edamame, the 2 smashed garlic cloves, and the 2 tbsp chopped chipotle in adobo to a food processor. Pulse 8–10 times in short bursts until the mixture resembles a rough, coarse paste — you're building the structure before adding liquids." },
      { step: 4, text: "Add the 1/4 cup tahini and the 3 tbsp fresh lime juice to the processor. Run it continuously for 60 seconds, scraping the bowl halfway through. The mixture will look grainy at first, then begin to smooth out as the tahini emulsifies." },
      { step: 5, text: "With the processor running, slowly drizzle in the 1/4 cup olive oil through the feed tube over about 30 seconds. The hummus should transform noticeably — it will turn lighter, glossier, and airy. Process for a final 60 seconds until completely smooth. If it's still thick, add ice water one tablespoon at a time until it flows smoothly off a spoon." }
    ],
    chefNotes: "If the hummus is too thick after adding the oil, blend in ice water, one tablespoon at a time, until it reaches a fluffy consistency.",
    pairing: "Crispy pita chips",
    mealSlots: ["snack", "lunch"],
    healthy: true
  },
  {
    slug: "miso-refried-bean-dip",
    title: "Miso Refried Bean Dip",
    subtitle: "Earthy pinto beans laced with red miso.",
    story: "Refried beans traditionally rely on lard for depth. Here, red miso provides that deep, savory backbone without the meat, creating a rich dip that clings perfectly to a warm tortilla chip.",
    category: "Dips",
    tags: ["Vegetarian", "Gluten-Free"],
    allergens: ["soy", "dairy"],
    difficulty: "Easy",
    prepTime: "5 min",
    cookTime: "15 min",
    servings: 6,
    spiceLevel: 1,
    umamiLevel: 3,
    origin: "Sonora x Nagoya",
    heroImage: snackDipsHero,
    thumbImage: snackDipsHero,
    ingredients: [
      { qty: "2", unit: "cans", item: "pinto beans", note: "rinsed and drained" },
      { qty: "2", unit: "tbsp", item: "red miso paste" },
      { qty: "2", unit: "tbsp", item: "unsalted butter" },
      { qty: "1/2", unit: "cup", item: "white onion", note: "minced" },
      { qty: "1", unit: "tsp", item: "ground cumin" },
      { qty: "1/4", unit: "cup", item: "water" }
    ],
    method: [
      { step: 1, text: "Melt the 2 tbsp unsalted butter in a 10-inch skillet over medium heat until it foams and the foam subsides — about 90 seconds. Add the 1/2 cup minced white onion and cook, stirring occasionally, for 5 minutes until the onion is soft and translucent with light golden edges. You should be able to smell its sweetness." },
      { step: 2, text: "Sprinkle in the 1 tsp ground cumin and stir constantly for 45 seconds. The cumin will bloom in the hot butter, turning darker and releasing a toasty, warm fragrance — this is the key flavor step. If it smells at all burnt, reduce the heat immediately." },
      { step: 3, text: "In a small bowl, whisk the 2 tbsp red miso paste with the 1/4 cup water until completely smooth — no lumps. Red miso is dense and salty, so take 30 seconds to whisk it thoroughly before adding it to the pan." },
      { step: 4, text: "Add the 2 cans rinsed and drained pinto beans to the skillet. Pour in the miso-water mixture and stir everything together. The liquid should sizzle when it hits the pan — that's fine. Stir to coat all the beans evenly." },
      { step: 5, text: "Use a potato masher or the back of a heavy wooden spoon to mash the beans directly in the pan. Aim for a mostly smooth texture with a few small intact beans remaining for textural interest — not a perfectly smooth paste. Stir vigorously as you mash so the beans don't stick." },
      { step: 6, text: "Cook the mashed beans over medium heat for 3–5 minutes, stirring constantly with a wooden spoon, until the dip is thick enough that a trail drawn across the bottom of the pan holds for 2 seconds before closing. Remove from heat and serve immediately while hot and glossy." }
    ],
    chefNotes: "Red miso is stronger than white miso. It provides a beefy savoriness that perfectly complements the earthiness of pinto beans.",
    pairing: "Agua de Jamaica (Hibiscus Tea)",
    mealSlots: ["snack"],
    healthy: false
  },
  {
    slug: "jalapeno-miso-cream-cheese-dip",
    title: "Jalapeño Miso Cream Cheese Dip",
    subtitle: "A tangy, spicy spread for crackers or bagels.",
    story: "Cream cheese loves both spice and umami. Blending fiery jalapeños with salty white miso elevates a simple block of cream cheese into an addictive spread that straddles two culinary worlds.",
    category: "Dips",
    tags: ["Vegetarian", "Gluten-Free"],
    allergens: ["dairy", "soy"],
    difficulty: "Easy",
    prepTime: "10 min",
    cookTime: "0 min",
    servings: 8,
    spiceLevel: 2,
    umamiLevel: 2,
    origin: "Texas x Tokyo",
    heroImage: snackDipsHero,
    thumbImage: snackDipsHero,
    ingredients: [
      { qty: "1", unit: "block", item: "cream cheese", note: "8 oz, softened" },
      { qty: "1", unit: "tbsp", item: "white miso paste" },
      { qty: "2", unit: "", item: "jalapeños", note: "minced, seeds removed for less heat" },
      { qty: "1", unit: "tbsp", item: "fresh lime juice" },
      { qty: "1", unit: "tbsp", item: "cilantro", note: "finely chopped" }
    ],
    method: [
      { step: 1, text: "Set the 8 oz block of cream cheese on the counter at least 30 minutes before you begin — it must be genuinely room temperature, not just slightly less cold. Press it with a finger: it should indent easily with no resistance. Cold cream cheese will not blend smoothly and will leave lumps that no amount of mixing can fix." },
      { step: 2, text: "Beat the softened cream cheese in a medium bowl with a hand mixer or sturdy wooden spoon for about 60 seconds until it is completely smooth, pale, and fluffy. There should be zero lumps visible when you drag a spoon through it." },
      { step: 3, text: "Add the 1 tbsp white miso paste and beat for another 60 seconds. The miso will resist blending at first — keep going until the mixture is one uniform color and no beige streaks remain. Taste it: the savory-salty punch of the miso should be immediately apparent." },
      { step: 4, text: "Add the 2 minced jalapeños (seeds removed for moderate heat), the 1 tbsp fresh lime juice, and the 1 tbsp finely chopped cilantro. Fold everything together with a spoon for 20 seconds until the green flecks are evenly distributed throughout. The lime juice will loosen the texture slightly, which is correct." },
      { step: 5, text: "Transfer the dip to a serving bowl, smooth the surface, and press plastic wrap directly onto it. Refrigerate for at least 30 minutes — chilling firms the dip and allows the jalapeño and miso flavors to bloom and meld. It will keep refrigerated for up to 4 days." },
      { step: 6, text: "Before serving, let the dip stand at room temperature for 10 minutes so it becomes spreadable again. Taste one more time and adjust lime juice if it needs brightness — the final dip should taste simultaneously tangy, savory, and spicy with no single flavor dominating." }
    ],
    chefNotes: "To achieve the perfect texture, let the cream cheese sit at room temperature for an hour before mixing.",
    pairing: "Ritz crackers or toasted bagel chips",
    mealSlots: ["snack", "breakfast"],
    healthy: false
  },
  {
    slug: "white-miso-tzatziki",
    title: "White Miso Tzatziki",
    subtitle: "A Mediterranean classic meets Japanese umami.",
    story: "Tzatziki is refreshing but sometimes lacks depth. A spoonful of white miso paste acts as a secret ingredient, amplifying the garlic and cucumber without overpowering the yogurt's tang.",
    category: "Dips",
    tags: ["Vegetarian", "Gluten-Free"],
    allergens: ["dairy", "soy"],
    difficulty: "Easy",
    prepTime: "15 min",
    cookTime: "0 min",
    servings: 6,
    spiceLevel: 0,
    umamiLevel: 2,
    origin: "Greece x Kyoto",
    heroImage: snackDipsHero,
    thumbImage: snackDipsHero,
    ingredients: [
      { qty: "2", unit: "cups", item: "plain whole milk Greek yogurt" },
      { qty: "1", unit: "tbsp", item: "white miso paste" },
      { qty: "1", unit: "", item: "English cucumber", note: "grated and squeezed dry" },
      { qty: "2", unit: "cloves", item: "garlic", note: "grated" },
      { qty: "1", unit: "tbsp", item: "fresh mint", note: "chopped" },
      { qty: "1", unit: "tbsp", item: "lemon juice" }
    ],
    method: [
      { step: 1, text: "Grate the English cucumber on the large holes of a box grater directly into a clean kitchen towel. Gather the towel into a bundle, hold it over the sink, and squeeze firmly and repeatedly until no more water drips out — this may take 30–45 seconds of squeezing. Skipping this step will result in watery tzatziki that cannot be fixed." },
      { step: 2, text: "In a medium bowl, whisk the 1 tbsp white miso paste into the 2 cups plain whole milk Greek yogurt until completely incorporated with no visible pale streaks. The miso will feel sticky and resist at first — give it a full 30 seconds of vigorous whisking until the mixture looks uniformly ivory and creamy." },
      { step: 3, text: "Add the 2 cloves grated garlic, 1 tbsp lemon juice, and 1 tbsp chopped fresh mint to the yogurt mixture. Stir with a spoon for 30 seconds until everything is evenly distributed. The lemon juice will slightly thin the dip — this is expected and will firm back up during chilling." },
      { step: 4, text: "Fold the squeezed cucumber into the yogurt with three or four gentle folds so the shreds are evenly distributed without deflating the yogurt's body. The finished mixture should look thick, speckled green, and hold a soft peak when you lift the spoon." },
      { step: 5, text: "Cover the bowl tightly and refrigerate for at least 1 hour — the flavors need this time to develop and deepen. The garlic will mellow, the miso will integrate, and the cucumber will release a final bit of moisture that the yogurt will absorb, tightening the texture." },
      { step: 6, text: "Give the chilled tzatziki a thorough stir before serving. Taste and adjust — it may want a few more drops of lemon juice or a pinch of salt. Serve in a wide, shallow bowl with a drizzle of olive oil and a few mint leaves on top." }
    ],
    chefNotes: "Never skip squeezing the cucumber. Excess water will dilute the tzatziki and ruin the creamy texture.",
    pairing: "Warm pita bread or grilled chicken skewers",
    mealSlots: ["snack", "lunch"],
    healthy: true
  },
  {
    slug: "avocado-miso-mousse",
    title: "Avocado Miso Mousse",
    subtitle: "Silky, airy avocado with a savory backbone.",
    story: "By whipping avocado in a food processor with silken tofu and miso, you create a mousse that is lighter than guacamole but richer in umami. It is an elegant dip that feels luxurious.",
    category: "Dips",
    tags: ["Vegan", "Gluten-Free", "Dairy-Free"],
    allergens: ["soy"],
    difficulty: "Easy",
    prepTime: "10 min",
    cookTime: "0 min",
    servings: 4,
    spiceLevel: 0,
    umamiLevel: 2,
    origin: "California x Japan",
    heroImage: snackDipsHero,
    thumbImage: snackDipsHero,
    ingredients: [
      { qty: "2", unit: "", item: "ripe avocados" },
      { qty: "1/2", unit: "cup", item: "silken tofu", note: "drained" },
      { qty: "1.5", unit: "tbsp", item: "white miso paste" },
      { qty: "1", unit: "tbsp", item: "rice vinegar" },
      { qty: "1", unit: "tsp", item: "sesame oil" }
    ],
    method: [
      { step: 1, text: "Halve the 2 ripe avocados, remove the pits, and scoop the flesh cleanly into a food processor — use a large spoon and scrape all the way to the skin. The avocados should be perfectly ripe: they yield to gentle pressure at the stem end and show no brown spots inside." },
      { step: 2, text: "Drain the 1/2 cup silken tofu by setting it on a paper-towel-lined plate for 2 minutes — do not press it, just let the surface water drip off naturally. Then add it to the processor with the avocado, along with the 1.5 tbsp white miso paste, 1 tbsp rice vinegar, and 1 tsp sesame oil." },
      { step: 3, text: "Process on high for 90 seconds, stopping once to scrape the bowl with a spatula. The mixture will look grainy at first, then dramatically smooth as the tofu and avocado emulsify together. It should be completely lump-free and pale green with a glossy sheen before you stop." },
      { step: 4, text: "Transfer the mousse to a chilled serving bowl — run the bowl under cold water and dry it first to keep the mousse cool. Smooth the surface with the back of a spoon. It should hold a soft, gentle shape rather than spreading flat." },
      { step: 5, text: "Press plastic wrap directly onto the surface of the mousse to exclude all air and refrigerate for at least 20 minutes. This chilling step firms the texture and allows the miso and rice vinegar to meld into the avocado. Serve cold with a light drizzle of sesame oil and a scattering of sesame seeds if desired." }
    ],
    chefNotes: "Silken tofu must be drained well, but do not press it. Just let the surface water drip off before blending.",
    pairing: "Crisp cucumber rounds and radish slices",
    mealSlots: ["snack"],
    healthy: true
  },
  {
    slug: "tofu-cotija-dip",
    title: "Tofu Cotija Dip",
    subtitle: "A creamy, salty alternative to queso fresco.",
    story: "Blending firm tofu with salty, pungent cotija cheese creates a high-protein spread that mimics the texture of whipped feta, but with a uniquely Mexican-Japanese profile.",
    category: "Dips",
    tags: ["Vegetarian", "Gluten-Free"],
    allergens: ["soy", "dairy"],
    difficulty: "Easy",
    prepTime: "10 min",
    cookTime: "0 min",
    servings: 6,
    spiceLevel: 1,
    umamiLevel: 2,
    origin: "Oaxaca x Kyoto",
    heroImage: snackDipsHero,
    thumbImage: snackDipsHero,
    ingredients: [
      { qty: "1", unit: "block", item: "firm tofu", note: "14 oz, drained and pressed" },
      { qty: "1", unit: "cup", item: "cotija cheese", note: "crumbled" },
      { qty: "2", unit: "tbsp", item: "olive oil" },
      { qty: "1", unit: "tbsp", item: "lime juice" },
      { qty: "1/2", unit: "tsp", item: "Tajín chile-lime seasoning" }
    ],
    method: [
      { step: 1, text: "Wrap the 14 oz block of firm tofu in three layers of paper towels, set it on a plate, and place a heavy cutting board on top. Press for 15 minutes until the paper towels are visibly saturated. This step is mandatory — un-pressed tofu contains too much water and will make the dip watery and bland instead of thick and creamy." },
      { step: 2, text: "Unwrap the pressed tofu and crumble it by hand into rough, thumbnail-sized pieces directly into a food processor. The uneven chunks actually help the processor break it down more evenly than adding it in one large block." },
      { step: 3, text: "Add the 1 cup crumbled cotija cheese, 2 tbsp olive oil, and 1 tbsp lime juice to the processor. Cotija varies greatly in saltiness — crumble some between your fingers and taste it before adding so you know what to expect." },
      { step: 4, text: "Process for 90 seconds to 2 minutes, stopping once to scrape the bowl. The dip should transform from grainy to a texture resembling thick whipped feta — mostly smooth with a very slight, pleasant graininess from the cheese. Do not over-process into a paste." },
      { step: 5, text: "Add the 1/2 tsp Tajín chile-lime seasoning and pulse just 8–10 times to distribute it without changing the texture. Taste the dip: it should be salty (from the cotija), bright (from the lime), and mildly spicy (from the Tajín). Adjust with a few more drops of lime juice if needed." },
      { step: 6, text: "Transfer to a wide, shallow bowl and drag the back of a spoon across the surface to create a swirl. The finished dip should look rustic and generously flecked with orange-red Tajín and pale cotija. Serve immediately at room temperature for the best spreadability." }
    ],
    chefNotes: "Cotija varies greatly in saltiness. Taste the dip after blending before deciding if it needs a pinch of salt.",
    pairing: "Toasted baguette slices or sturdy tortilla chips",
    mealSlots: ["snack"],
    healthy: true
  },
  {
    slug: "salsa-roja-miso",
    title: "Miso Salsa Roja",
    subtitle: "Roasted tomato salsa anchored by fermented depth.",
    story: "Salsa roja relies on roasted tomatoes for its base. Stirring in red miso paste adds an undetectable meatiness that makes the salsa taste as though it was cooked alongside a roasting chicken.",
    category: "Dips",
    tags: ["Vegan", "Gluten-Free", "Dairy-Free"],
    allergens: ["soy"],
    difficulty: "Easy",
    prepTime: "10 min",
    cookTime: "15 min",
    servings: 8,
    spiceLevel: 2,
    umamiLevel: 3,
    origin: "Mexico City x Osaka",
    heroImage: snackDipsHero,
    thumbImage: snackDipsHero,
    ingredients: [
      { qty: "4", unit: "", item: "Roma tomatoes", note: "halved" },
      { qty: "1/2", unit: "", item: "white onion", note: "cut into chunks" },
      { qty: "2", unit: "", item: "jalapeños", note: "halved" },
      { qty: "2", unit: "cloves", item: "garlic", note: "unpeeled" },
      { qty: "1.5", unit: "tbsp", item: "red miso paste" },
      { qty: "1/4", unit: "cup", item: "fresh cilantro" }
    ],
    method: [
      { step: 1, text: "Set the broiler to high and let it preheat for 5 minutes — the element should glow red and the oven should read around 500°F (260°C). Line a large rimmed baking sheet with foil for easy cleanup. Arrange the 4 halved Roma tomatoes cut-side up, the 1/2 white onion in chunks, the 2 halved jalapeños cut-side down, and the 2 unpeeled garlic cloves in a single layer." },
      { step: 2, text: "Slide the baking sheet under the broiler and roast for 10–15 minutes total. Watch carefully: you want the tomato skins to blister and burst, the onion edges to char to deep brown, and the jalapeños to blacken in patches. Flip the tomatoes and jalapeños once halfway through so both sides get color." },
      { step: 3, text: "Remove the pan when the vegetables look dramatically charred — not just golden, but genuinely darkened in spots. The garlic skins should be papery and the cloves should feel soft when squeezed. Cool everything on the pan for 5 minutes, then peel the garlic by squeezing the softened cloves out of their skins." },
      { step: 4, text: "Transfer all the roasted vegetables and every drop of their accumulated juices into a blender. Add the 1.5 tbsp red miso paste — it will sink into the warm vegetables and begin to dissolve immediately. Do not skip this step: the miso adds a roasted, meaty depth that makes the salsa taste slow-cooked." },
      { step: 5, text: "Add the 1/4 cup fresh cilantro and pulse the blender 10–15 times in one-second bursts. The goal is a salsa that is chunky and textured — spoonable but not smooth. You should still see small flecks of tomato skin and jalapeño. Pour into a serving bowl and cool for 10 minutes; it thickens slightly as it cools." },
      { step: 6, text: "Taste the salsa and assess: it should be smoky, spicy, and savory with a deep tomato sweetness. If it tastes flat, add a squeeze of lime juice. If it's too thick, stir in a tablespoon of water. Serve at room temperature — refrigerating it dulls the roasted flavors." },
      { step: 7, text: "Store any leftover salsa in a sealed container in the refrigerator for up to 5 days. When reheating or serving from cold, stir vigorously and taste again — it may need a fresh squeeze of lime to revive the brightness lost during chilling." }
    ],
    chefNotes: "Red miso paste is key here. White miso is too sweet and delicate to stand up to the robust charred vegetables.",
    pairing: "Paloma cocktail",
    mealSlots: ["snack"],
    healthy: true
  },
  {
    slug: "eggplant-miso-spread",
    title: "Roasted Eggplant Miso Spread",
    subtitle: "Smoky, charred eggplant with sweet-savory miso.",
    story: "Inspired by Japanese Nasu Dengaku (miso-glazed eggplant) and Middle Eastern Baba Ganoush, this spread blends smoky charred eggplant with a sweet white miso glaze for a deeply savory dip.",
    category: "Dips",
    tags: ["Vegan", "Gluten-Free", "Dairy-Free"],
    allergens: ["soy", "sesame"],
    difficulty: "Medium",
    prepTime: "10 min",
    cookTime: "40 min",
    servings: 6,
    spiceLevel: 0,
    umamiLevel: 3,
    origin: "Levant x Kyoto",
    heroImage: snackDipsHero,
    thumbImage: snackDipsHero,
    ingredients: [
      { qty: "2", unit: "medium", item: "eggplants", note: "Italian or globe" },
      { qty: "2", unit: "tbsp", item: "white miso paste" },
      { qty: "1", unit: "tbsp", item: "mirin" },
      { qty: "1", unit: "tbsp", item: "sesame oil" },
      { qty: "1", unit: "tbsp", item: "lemon juice" },
      { qty: "1", unit: "tsp", item: "toasted sesame seeds" }
    ],
    method: [
      { step: 1, text: "Heat the oven to 450°F (230°C) and place a rack in the center position. Use a fork to prick the skin of the 2 medium eggplants all over — about 15–20 punctures each. This is critical: without ventilation holes, steam builds inside and the eggplant can burst violently in the oven." },
      { step: 2, text: "Place the pricked eggplants directly on a rimmed baking sheet lined with foil. Roast for 40 minutes, turning once at the 20-minute mark with tongs. The eggplants are done when they have visibly collapsed and deflated, the skins are deeply wrinkled and charred in patches, and a skewer slides through the thickest part with no resistance." },
      { step: 3, text: "Remove the eggplants from the oven and let them cool on the baking sheet for 10 minutes until safe to handle. Then cut each one in half lengthwise and use a large spoon to scoop the soft, smoky flesh away from the charred skin. Transfer the flesh to a fine-mesh strainer set over a bowl." },
      { step: 4, text: "Let the eggplant flesh drain in the strainer for at least 10 minutes — the liquid that drips out is bitter and watery. Do not press or rush this step. The drained flesh should look compact and dry, not pooled in liquid. Discarding this liquid concentrates the smoky flavor dramatically." },
      { step: 5, text: "In a medium bowl, whisk together the 2 tbsp white miso paste, 1 tbsp mirin, 1 tbsp sesame oil, and 1 tbsp lemon juice until smooth and glossy. The mirin adds sweetness, the sesame oil adds nuttiness, and together they create a dressing that balances the eggplant's bitterness." },
      { step: 6, text: "Add the drained eggplant flesh to the bowl and use a fork to mash and fold it into the dressing. Work gently — you want a textured, rustic spread with visible fibrous pieces, not a smooth purée. Fold until no white miso streaks remain and the spread looks evenly glossy and tawny." },
      { step: 7, text: "Transfer to a serving plate, spreading it into a flat swoosh with the back of a spoon. Scatter the 1 tsp toasted sesame seeds over the top. The spread can be served warm, at room temperature, or cold — it is actually best at room temperature where the miso and sesame flavors shine most clearly." }
    ],
    chefNotes: "Draining the roasted eggplant flesh is critical. If you skip this, your spread will be watery and lack flavor concentration.",
    pairing: "Chilled green tea",
    mealSlots: ["snack"],
    healthy: true
  },
  {
    slug: "wasabi-white-bean-dip",
    title: "Wasabi White Bean Dip",
    subtitle: "Creamy cannellini beans with a horseradish kick.",
    story: "White beans provide a blank, creamy canvas. Whipping them with a touch of wasabi and olive oil creates an elegant, pungent dip that clears the palate and leaves you craving another bite.",
    category: "Dips",
    tags: ["Vegan", "Gluten-Free", "Dairy-Free"],
    allergens: [],
    difficulty: "Easy",
    prepTime: "10 min",
    cookTime: "0 min",
    servings: 4,
    spiceLevel: 2,
    umamiLevel: 1,
    origin: "Tuscany x Tokyo",
    heroImage: snackDipsHero,
    thumbImage: snackDipsHero,
    ingredients: [
      { qty: "1", unit: "can", item: "cannellini beans", note: "15 oz, rinsed and drained" },
      { qty: "2", unit: "tsp", item: "prepared wasabi paste" },
      { qty: "1", unit: "clove", item: "garlic", note: "smashed" },
      { qty: "3", unit: "tbsp", item: "extra virgin olive oil" },
      { qty: "1", unit: "tbsp", item: "rice vinegar" },
      { qty: "1/4", unit: "tsp", item: "sea salt" }
    ],
    method: [
      { step: 1, text: "Open the 15 oz can of cannellini beans and pour them into a fine-mesh strainer. Rinse under cold running water for 30 seconds — you want to wash off the starchy canning liquid, which has a tinny, flat taste that would dull the finished dip. Shake the strainer well and let the beans drain for 2 minutes until they feel dry to the touch." },
      { step: 2, text: "Add the drained beans and the 1 smashed garlic clove to a food processor. The garlic goes in whole and smashed rather than minced, which allows you to control how intensely garlicky the dip becomes — the processor will break it down completely but won't create the sharp bite of raw minced garlic." },
      { step: 3, text: "Add the 2 tsp prepared wasabi paste, 1 tbsp rice vinegar, and 1/4 tsp sea salt. Pulse the mixture 8–10 times in short bursts until everything is roughly broken down. This pre-processing before adding the oil makes the final emulsification much smoother." },
      { step: 4, text: "With the food processor running, slowly drizzle in the 3 tbsp extra virgin olive oil through the feed tube in a thin, steady stream over about 20 seconds. The dip will visibly lighten in color and become glossy and creamy as the oil emulsifies with the bean starch — this is the moment when it transforms from chunky to silky." },
      { step: 5, text: "Process for a final 60 seconds until completely smooth, then taste. The wasabi should provide a sharp, nose-clearing heat — if you want more, add another 1/2 tsp and process again. If the texture is too thick, add ice water one tablespoon at a time until it flows smoothly off a spoon." },
      { step: 6, text: "Transfer to a serving bowl and drizzle with a final thread of olive oil. The surface should look glossy and ivory-white. Serve immediately at room temperature — cold bean dips lose their creamy texture and the wasabi heat becomes muted and flat when chilled." }
    ],
    chefNotes: "Do not use cheap, flavorless olive oil here. The raw oil dictates the finish of the dip, so use a peppery extra virgin variety.",
    pairing: "Crisp white wine, like a dry Riesling",
    mealSlots: ["snack", "lunch"],
    healthy: true
  },
  {
    slug: "ponzu-salsa-verde",
    title: "Ponzu Salsa Verde",
    subtitle: "Tomatillo tartness enhanced by citrus soy.",
    story: "Tomatillos are naturally tart and bright. Blending them with ponzu—a citrus-infused soy sauce—creates a salsa verde with an unparalleled zing and a deep, savory finish.",
    category: "Dips",
    tags: ["Vegan", "Dairy-Free"],
    allergens: ["soy", "gluten"],
    difficulty: "Easy",
    prepTime: "10 min",
    cookTime: "15 min",
    servings: 6,
    spiceLevel: 1,
    umamiLevel: 2,
    origin: "Veracruz x Osaka",
    heroImage: snackDipsHero,
    thumbImage: snackDipsHero,
    ingredients: [
      { qty: "1", unit: "lb", item: "tomatillos", note: "husked and rinsed" },
      { qty: "1", unit: "", item: "jalapeño", note: "stemmed" },
      { qty: "1/4", unit: "", item: "white onion" },
      { qty: "2", unit: "tbsp", item: "ponzu sauce" },
      { qty: "1/4", unit: "cup", item: "cilantro", note: "roughly chopped" }
    ],
    method: [
      { step: 1, text: "Set the broiler to high and let it preheat fully for 5 minutes. Line a large baking sheet with foil. Husk and rinse the 1 lb tomatillos in warm water, rubbing away their sticky residue — this coating is naturally bitter and will negatively affect the flavor if not removed. Pat them dry and place them on the baking sheet along with the stemmed jalapeño and 1/4 white onion." },
      { step: 2, text: "Slide the pan under the broiler and cook for 10–12 minutes without touching the vegetables. You want dramatic blistering: the tomatillos should turn from bright green to a dull olive color, develop blackened patches on top, and feel completely soft when pressed. The jalapeño should look blackened and collapsed, and the onion edges should be deeply charred." },
      { step: 3, text: "Transfer all the roasted vegetables and every drop of their accumulated juices to a blender. Those juices are intensely flavored and must not be left on the pan." },
      { step: 4, text: "Add the 2 tbsp ponzu sauce and the 1/4 cup roughly chopped cilantro to the blender. Pulse 10–15 times in one-second bursts — count the pulses deliberately. The salsa should be chunky and textured, with small visible pieces of tomatillo skin and pepper. If you over-blend, it becomes smooth and loses its rustic character." },
      { step: 5, text: "Pour the salsa into a serving bowl and let it cool to room temperature for at least 10 minutes before serving. As it cools, the ponzu's citrus and soy notes will deepen and integrate with the roasted tomatillos. Taste and adjust: if it needs brightness, add a squeeze of lime; if it needs more depth, add a few more drops of ponzu." }
    ],
    chefNotes: "Always rinse tomatillos in warm water after husking them to remove their sticky residue, which can taste bitter.",
    pairing: "Pork carnitas or thick tortilla chips",
    mealSlots: ["snack", "dinner"],
    healthy: true
  },
  {
    slug: "chipotle-miso-aioli",
    title: "Chipotle Miso Aioli",
    subtitle: "The ultimate dipping sauce for fries and vegetables.",
    story: "A simple blend of Japanese mayonnaise, spicy chipotle, and savory white miso. This aioli is a powerhouse condiment that improves literally everything it touches.",
    category: "Dips",
    tags: ["Vegetarian", "Dairy-Free"],
    allergens: ["egg", "soy"],
    difficulty: "Easy",
    prepTime: "5 min",
    cookTime: "0 min",
    servings: 4,
    spiceLevel: 2,
    umamiLevel: 3,
    origin: "Los Angeles x Tokyo",
    heroImage: snackDipsHero,
    thumbImage: snackDipsHero,
    ingredients: [
      { qty: "1/2", unit: "cup", item: "Japanese mayonnaise", note: "Kewpie preferred" },
      { qty: "1", unit: "tbsp", item: "chipotle in adobo", note: "puréed or finely minced" },
      { qty: "1", unit: "tsp", item: "white miso paste" },
      { qty: "1", unit: "tsp", item: "lime juice" },
      { qty: "1/2", unit: "tsp", item: "garlic powder" }
    ],
    method: [
      { step: 1, text: "In a small bowl, whisk together the 1/2 cup Japanese Kewpie mayonnaise and 1 tbsp chipotle in adobo until the orange-red color is completely uniform with no white streaks. Kewpie mayo is richer and slightly more acidic than American mayo, providing a much better base — use it if at all possible." },
      { step: 2, text: "In a separate very small bowl, whisk the 1 tsp white miso paste with the 1 tsp lime juice for a full 30 seconds until the miso is completely dissolved and the mixture looks smooth and fluid. Miso will not blend evenly if added directly to the mayo in its dense paste form." },
      { step: 3, text: "Add the dissolved miso-lime mixture to the mayonnaise-chipotle bowl and whisk for 20 seconds until the aioli looks uniformly brick-orange with a glossy sheen. No pale or dark streaks should remain." },
      { step: 4, text: "Add the 1/2 tsp garlic powder and whisk for another 10 seconds until fully incorporated. The garlic powder should disappear completely — if you see dry flecks, keep whisking. Taste the aioli at this point: it should be simultaneously spicy, savory, and tangy." },
      { step: 5, text: "Cover the bowl with plastic wrap and refrigerate for at least 15 minutes before serving. This rest period is important — the chipotle's heat and the miso's savoriness both bloom and meld as the aioli chills. It will keep refrigerated for up to one week and actually improves on day two." }
    ],
    chefNotes: "Using Kewpie mayo is critical because it relies heavily on egg yolks and MSG, providing a richer base than standard American mayonnaise.",
    pairing: "Sweet potato fries or roasted broccoli",
    mealSlots: ["snack", "lunch"],
    healthy: false
  },
  {
    slug: "miso-ranch-dip",
    title: "Miso Ranch Dip",
    subtitle: "A midwestern staple gets an umami upgrade.",
    story: "Ranch dressing is an American obsession. By blending a classic buttermilk and herb base with a spoonful of white miso, the dip gains an earthy, savory complexity that makes raw vegetables taste incredible.",
    category: "Dips",
    tags: ["Vegetarian", "Gluten-Free"],
    allergens: ["dairy", "soy", "egg"],
    difficulty: "Easy",
    prepTime: "10 min",
    cookTime: "0 min",
    servings: 6,
    spiceLevel: 0,
    umamiLevel: 2,
    origin: "Midwest x Kyoto",
    heroImage: snackDipsHero,
    thumbImage: snackDipsHero,
    ingredients: [
      { qty: "1/2", unit: "cup", item: "sour cream" },
      { qty: "1/4", unit: "cup", item: "mayonnaise" },
      { qty: "2", unit: "tbsp", item: "buttermilk" },
      { qty: "1", unit: "tbsp", item: "white miso paste" },
      { qty: "1", unit: "tbsp", item: "fresh dill", note: "chopped" },
      { qty: "1", unit: "tsp", item: "onion powder" }
    ],
    method: [
      { step: 1, text: "In a medium bowl, combine the 1/2 cup sour cream and 1/4 cup mayonnaise. Whisk vigorously for 30 seconds until the two fats are fully combined and the mixture looks uniformly creamy and slightly glossy. The mayo adds richness; the sour cream adds tang — together they form the backbone of the ranch." },
      { step: 2, text: "In a very small bowl, whisk the 1 tbsp white miso paste with the 2 tbsp buttermilk for about 30 seconds until the miso is completely dissolved and no paste lumps remain. The buttermilk thins the miso just enough to incorporate it evenly into the dairy base without streaking." },
      { step: 3, text: "Pour the miso-buttermilk mixture into the sour cream bowl and whisk for another 20 seconds. The dip should look uniformly ivory with no darker miso patches. The texture should be thick but pourable — like a slightly looser sour cream." },
      { step: 4, text: "Add the 1 tsp onion powder and 1 tbsp chopped fresh dill. Fold gently with a spoon until the green dill flecks are evenly distributed throughout without over-mixing, which would bruise the herb and turn it dark." },
      { step: 5, text: "Cover the bowl tightly with plastic wrap and refrigerate for at least 2 hours — this is non-negotiable. The dry onion powder needs time to fully hydrate and meld with the dairy, and the miso needs time to integrate. A freshly made ranch will taste thin and disconnected; a properly rested one will taste unified and deeply savory. If it thickens too much after chilling, stir in a few extra drops of buttermilk until it reaches your desired consistency." }
    ],
    chefNotes: "If the dip is too thick after chilling, thin it out with a few extra drops of buttermilk until you reach your desired consistency.",
    pairing: "Raw celery, carrots, and radishes",
    mealSlots: ["snack"],
    healthy: false
  }
,

  {
    slug: "chamoy-furikake-popcorn-v2",
    title: "Chamoy Furikake Popcorn",
    subtitle: "Sweet, sour, spicy, and profoundly savory.",
    story: "The snack that started a thousand conversations. Chamoy's sweet-sour-spicy punch meets the savory sesame depth of furikake. Eat one piece and you cannot stop.",
    category: "Popcorn",
    tags: ["Vegetarian", "Gluten-Free"],
    allergens: ["sesame", "dairy"],
    difficulty: "Easy",
    prepTime: "5 min",
    cookTime: "10 min",
    servings: 4,
    spiceLevel: 1,
    umamiLevel: 2,
    origin: "Mexico City x Tokyo",
    heroImage: snackBitesHero,
    thumbImage: snackBitesHero,
    ingredients: [
      { qty: "1/2", unit: "cup", item: "popcorn kernels" },
      { qty: "2", unit: "tbsp", item: "neutral oil", note: "canola or grapeseed" },
      { qty: "3", unit: "tbsp", item: "unsalted butter", note: "melted" },
      { qty: "2", unit: "tbsp", item: "chamoy sauce" },
      { qty: "2", unit: "tbsp", item: "furikake seasoning" },
      { qty: "1", unit: "tsp", item: "Tajín chile-lime seasoning" }
    ],
    method: [
      { step: 1, text: "Heat the 2 tbsp neutral oil in a large, heavy-bottomed pot over medium-high heat for 2 minutes. Test the oil by dropping in 3 kernels — when all three pop, the oil is the correct temperature (about 400°F). Add the remaining 1/2 cup kernels in one even layer across the bottom of the pot." },
      { step: 2, text: "Cover the pot, remove it from the heat for exactly 30 seconds, then return it to medium-high. This brief pause lets all the kernels reach a more uniform temperature so they pop together rather than sequentially — fewer unpopped kernels result. Keep the lid slightly cracked to let steam escape and keep the popcorn crisp." },
      { step: 3, text: "Shake the pot constantly by sliding it back and forth over the burner. You will hear popping become rapid and then slow to one pop every 2–3 seconds — the moment it slows to that pace, remove the pot from the heat immediately. Waiting longer risks burning the bottom layer." },
      { step: 4, text: "Transfer the popped corn to a very large bowl — you need the extra space for tossing. Pick out and discard any unpopped kernels you can see; they are rock-hard and will chip a tooth." },
      { step: 5, text: "Whisk the 3 tbsp melted unsalted butter and 2 tbsp chamoy sauce together in a small bowl until evenly combined — the chamoy's thick, sticky consistency will resist at first but will emulsify into the butter. Drizzle this mixture over the hot popcorn in a thin, sweeping motion so it doesn't all land in one spot." },
      { step: 6, text: "Toss the popcorn with two large spoons for 30 seconds until every kernel looks lightly glossy and coated. Then add the 2 tbsp furikake seasoning and 1 tsp Tajín in two stages, tossing after each addition. Serve immediately — chamoy will make the popcorn soggy if it sits more than 10 minutes." },
      { step: 7, text: "Taste a piece before serving: the popcorn should hit all four notes in sequence — sweet from the chamoy, sour from the lime in the Tajín, spicy from the chile, and savory-oceanic from the furikake. If any flavor is missing, adjust by adding another pinch of the relevant seasoning." }
    ],
    chefNotes: "Chamoy can make the popcorn soggy if it sits too long. Always dress this popcorn right before serving, never in advance.",
    pairing: "Michelada with a Tajín rim",
    mealSlots: ["snack"],
    healthy: false
  },
  {
    slug: "miso-caramel-popcorn",
    title: "Miso Caramel Popcorn",
    subtitle: "Crunchy, sweet, and aggressively savory.",
    story: "Standard caramel corn is one-dimensionally sweet. Stirring white miso into the hot caramel right before coating the popcorn adds an earthy, salty depth that makes the sweetness shine brighter.",
    category: "Popcorn",
    tags: ["Vegetarian", "Gluten-Free"],
    allergens: ["dairy", "soy"],
    difficulty: "Medium",
    prepTime: "10 min",
    cookTime: "45 min",
    servings: 6,
    spiceLevel: 0,
    umamiLevel: 2,
    origin: "Chicago x Kyoto",
    heroImage: snackBitesHero,
    thumbImage: snackBitesHero,
    ingredients: [
      { qty: "1/2", unit: "cup", item: "popcorn kernels", note: "popped" },
      { qty: "1", unit: "cup", item: "brown sugar" },
      { qty: "1/2", unit: "cup", item: "unsalted butter" },
      { qty: "1/4", unit: "cup", item: "corn syrup" },
      { qty: "2", unit: "tbsp", item: "white miso paste" },
      { qty: "1/2", unit: "tsp", item: "baking soda" }
    ],
    method: [
      { step: 1, text: "Preheat the oven to 250°F (120°C) and line two large baking sheets with parchment. Pop your 1/2 cup kernels and spread them across the parchment-lined sheets. Pick out unpopped kernels and discard them — they will ruin the texture. Set the sheets aside while you make the caramel." },
      { step: 2, text: "Combine the 1 cup brown sugar, 1/2 cup unsalted butter, and 1/4 cup corn syrup in a medium, heavy-bottomed saucepan over medium heat. Stir gently as the butter melts, then stop stirring completely once the mixture comes to a boil. Stirring after this point can cause the sugar to crystallize and seize." },
      { step: 3, text: "Boil the caramel without stirring for exactly 5 minutes. It will darken from amber to a deep mahogany color and smell intensely of toffee. Do not walk away — caramel goes from perfect to scorched in under 30 seconds at this stage." },
      { step: 4, text: "Remove the saucepan from the heat and immediately whisk in the 2 tbsp white miso paste and 1/2 tsp baking soda. The mixture will foam dramatically — this is the baking soda reacting with the acidic miso and brown sugar, aerating the caramel so it will coat every kernel with a light, crisp shell rather than a dense, sticky coating. Whisk until the foam subsides." },
      { step: 5, text: "Working quickly while the caramel is still fluid, pour it in a thin stream over the popcorn on the baking sheets, then use two silicone spatulas to fold and toss the corn until every piece is coated. Spread into a single layer and bake for 45 minutes total, stirring every 15 minutes to prevent sticking and ensure even caramelization." },
      { step: 6, text: "Slide the pans out of the oven and let the caramel corn cool completely on the baking sheets for at least 20 minutes — do not touch it while hot, as molten caramel will burn your skin. Once cool, it should be completely crisp and shatter when you bite it, not flex or stick to your teeth." }
    ],
    chefNotes: "The baking soda reacts with the acidic brown sugar and miso, aerating the caramel so it coats the popcorn in a crisp, brittle shell rather than a sticky mess.",
    pairing: "Hot black coffee",
    mealSlots: ["snack", "dessert"],
    healthy: false
  },
  {
    slug: "nori-popcorn-tajin",
    title: "Nori Popcorn with Tajín",
    subtitle: "Oceanic brine meets chili-lime tang.",
    story: "Crumbled toasted nori sheets provide a deep, savory oceanic flavor. When paired with the bright, citrusy heat of Tajín, it creates a popcorn that tastes like eating on a breezy beach in Baja.",
    category: "Popcorn",
    tags: ["Vegan", "Gluten-Free"],
    allergens: [],
    difficulty: "Easy",
    prepTime: "5 min",
    cookTime: "10 min",
    servings: 4,
    spiceLevel: 1,
    umamiLevel: 2,
    origin: "Baja x Tokyo",
    heroImage: snackBitesHero,
    thumbImage: snackBitesHero,
    ingredients: [
      { qty: "1/2", unit: "cup", item: "popcorn kernels" },
      { qty: "2", unit: "tbsp", item: "olive oil" },
      { qty: "3", unit: "tbsp", item: "melted coconut oil" },
      { qty: "2", unit: "sheets", item: "roasted nori", note: "finely crushed" },
      { qty: "1", unit: "tbsp", item: "Tajín chile-lime seasoning" }
    ],
    method: [
      { step: 1, text: "If you have a gas burner, briefly wave each of the 2 nori sheets over the flame for 2–3 seconds per side until they become rigid and crackly — they will darken slightly from green to dark olive. If you have electric, toast them in a dry skillet for 30 seconds per side over medium heat. Toasted nori is far more flavorful and crushable than untoasted." },
      { step: 2, text: "Crush the toasted nori sheets into fine flakes by crumbling them between your palms over a small bowl, or pulse them briefly in a spice grinder. The flakes should be small enough to cling to the popcorn — aim for crumbs no larger than 1/4 inch. Set aside." },
      { step: 3, text: "Heat the 2 tbsp olive oil in a large, heavy-bottomed pot over medium-high heat. Add the 1/2 cup kernels in a single layer and cover tightly. When popping begins, shake the pot every 15 seconds, leaving the lid slightly cracked to vent steam. Remove from heat when pops are 2–3 seconds apart." },
      { step: 4, text: "Transfer the hot popcorn immediately to a very large bowl and drizzle the 3 tbsp melted coconut oil evenly over it while tossing. The coconut oil should coat every kernel — its mild sweetness complements the savory nori beautifully." },
      { step: 5, text: "Sprinkle the crushed nori flakes and 1 tbsp Tajín over the popcorn in two separate additions, tossing vigorously between each addition to distribute the seasonings evenly. Serve immediately — nori will soften and lose its texture if the popcorn sits for more than 15 minutes." }
    ],
    chefNotes: "Toast the nori sheets by waving them over a gas burner for a few seconds before crushing. This makes them brittle and amplifies their flavor.",
    pairing: "Sparkling water with a splash of lime",
    mealSlots: ["snack"],
    healthy: true
  },
  {
    slug: "spicy-soy-butter-popcorn",
    title: "Spicy Soy Butter Popcorn",
    subtitle: "A rich, savory gloss on every kernel.",
    story: "Soy butter is a classic Japanese flavor profile. Melting rich butter with soy sauce and a dash of fiery hot sauce creates a savory glaze that sinks perfectly into the crevices of hot popcorn.",
    category: "Popcorn",
    tags: ["Vegetarian", "Gluten-Free"],
    allergens: ["dairy", "soy"],
    difficulty: "Easy",
    prepTime: "5 min",
    cookTime: "10 min",
    servings: 4,
    spiceLevel: 2,
    umamiLevel: 2,
    origin: "Osaka x Texas",
    heroImage: snackBitesHero,
    thumbImage: snackBitesHero,
    ingredients: [
      { qty: "1/2", unit: "cup", item: "popcorn kernels", note: "popped" },
      { qty: "4", unit: "tbsp", item: "unsalted butter" },
      { qty: "1", unit: "tbsp", item: "soy sauce" },
      { qty: "1", unit: "tbsp", item: "Mexican hot sauce", note: "Cholula or Valentina" },
      { qty: "1", unit: "tsp", item: "nutritional yeast", note: "optional, for extra depth" }
    ],
    method: [
      { step: 1, text: "Pop the 1/2 cup kernels using your preferred stovetop or air-pop method. Transfer immediately to a very large bowl and pick out any unpopped kernels. The popcorn should be piping hot — the heat is what allows the butter glaze to absorb into each kernel's crevices rather than sitting on the surface." },
      { step: 2, text: "Melt the 4 tbsp unsalted butter in a small saucepan over low heat, 2–3 minutes, until fully liquid but not browned. Remove from heat and stir in the 1 tbsp soy sauce and 1 tbsp Mexican hot sauce (Cholula or Valentina). Whisk for 10 seconds — the mixture will look slightly separated because of the water content in the soy sauce, but that's fine." },
      { step: 3, text: "Pour the soy-butter glaze over the hot popcorn in a slow, sweeping motion, starting at the edges of the bowl and spiraling inward so no single area gets too much. Toss immediately and continuously with two large spoons for about 30 seconds until every kernel looks glossy and evenly coated." },
      { step: 4, text: "If using the 1 tsp nutritional yeast (optional), sprinkle it over the tossed popcorn now and fold it in with 5–6 more strokes. Nutritional yeast adds a cheesy, savory depth that amplifies the soy flavor significantly — highly recommended." },
      { step: 5, text: "Serve immediately and eat quickly — this popcorn softens within 10–15 minutes because the soy sauce and hot sauce contain water that slowly steams the kernels. It is best eaten straight from the bowl while still warm." },
      { step: 6, text: "Taste before serving and adjust: if it needs more heat, add a few more drops of hot sauce; if it needs more savoriness, add a light sprinkle of soy sauce. Do not add additional salt — the soy sauce already provides more than enough." }
    ],
    chefNotes: "Because this dressing contains water from the soy and hot sauce, the popcorn will soften slightly. Eat it quickly for the best texture.",
    pairing: "Cold amber ale",
    mealSlots: ["snack"],
    healthy: false
  },
  {
    slug: "furikake-kettle-corn",
    title: "Furikake Kettle Corn",
    subtitle: "Sweet, salty, and bursting with umami.",
    story: "Kettle corn relies on sugar and salt. Adding furikake right as the sugar crystallizes creates a sweet and savory masterpiece that highlights the roasted sesame seeds and nori.",
    category: "Popcorn",
    tags: ["Vegetarian", "Gluten-Free"],
    allergens: ["sesame", "fish"],
    difficulty: "Medium",
    prepTime: "5 min",
    cookTime: "10 min",
    servings: 4,
    spiceLevel: 0,
    umamiLevel: 2,
    origin: "Hawaii x Mexico",
    heroImage: snackBitesHero,
    thumbImage: snackBitesHero,
    ingredients: [
      { qty: "1/2", unit: "cup", item: "popcorn kernels" },
      { qty: "1/4", unit: "cup", item: "white sugar" },
      { qty: "3", unit: "tbsp", item: "neutral oil" },
      { qty: "3", unit: "tbsp", item: "furikake seasoning" },
      { qty: "1/2", unit: "tsp", item: "fine sea salt" }
    ],
    method: [
      { step: 1, text: "Have a large parchment-lined baking sheet ready before you begin — speed matters when the corn is done, and you will not have time to prepare it in the middle of cooking. Heat a 6-quart pot (the biggest you have) over medium heat for 2 minutes, then add the 3 tbsp neutral oil, 1/2 cup kernels, and 1/4 cup white sugar all at once." },
      { step: 2, text: "Cover the pot immediately and begin shaking it constantly — never stop moving it for more than 3 seconds at a time. The sugar needs continuous movement to melt evenly around the kernels rather than pooling at the bottom and scorching." },
      { step: 3, text: "Popping will begin after about 2 minutes. Keep shaking through the entire pop cycle — you will hear the pops become rapid and furious, then slow. The moment the pops slow to one every 2–3 seconds, remove the pot from the heat immediately. Do not wait for silence; the residual heat will handle any remaining kernels and waiting will burn the sugar." },
      { step: 4, text: "Quickly pour the popcorn onto the parchment-lined baking sheet and use two silicone spatulas to spread it into a single layer as fast as possible. The sugar coating is still liquid and will cause the corn to clump if left in a heap — spreading it immediately prevents this." },
      { step: 5, text: "While the sugar coating is still tacky and warm (within the first 60 seconds after spreading), sprinkle the 3 tbsp furikake seasoning and 1/2 tsp fine sea salt evenly over the entire sheet. The sticky sugar will grip the seasoning and hold it to every piece. Let the kettle corn cool for 10 minutes untouched, until the coating is completely crisp and no longer feels sticky." }
    ],
    chefNotes: "Kettle corn goes from perfect to burnt in seconds. The moment the popping slows, get it out of the pot immediately.",
    pairing: "Iced green tea",
    mealSlots: ["snack"],
    healthy: false
  },
  {
    slug: "chipotle-cheese-popcorn",
    title: "Chipotle Cheese Popcorn",
    subtitle: "Nacho flavor turned into popcorn.",
    story: "Using nutritional yeast and a touch of smoked chipotle powder mimics the addictive quality of nacho cheese dust, but with deeper, smokier flavors and real ingredients.",
    category: "Popcorn",
    tags: ["Vegan", "Gluten-Free"],
    allergens: [],
    difficulty: "Easy",
    prepTime: "5 min",
    cookTime: "10 min",
    servings: 4,
    spiceLevel: 2,
    umamiLevel: 2,
    origin: "Sonora x California",
    heroImage: snackBitesHero,
    thumbImage: snackBitesHero,
    ingredients: [
      { qty: "1/2", unit: "cup", item: "popcorn kernels", note: "popped" },
      { qty: "3", unit: "tbsp", item: "olive oil", note: "or melted vegan butter" },
      { qty: "1/4", unit: "cup", item: "nutritional yeast" },
      { qty: "1", unit: "tsp", item: "chipotle powder" },
      { qty: "1/2", unit: "tsp", item: "garlic powder" },
      { qty: "1", unit: "tsp", item: "kosher salt" }
    ],
    method: [
      { step: 1, text: "Pop the 1/2 cup kernels and transfer immediately to the largest bowl you own. Pick out and discard any unpopped kernels you can see. Keep the popcorn hot — warm kernels absorb the oil and seasoning far better than popcorn that has cooled." },
      { step: 2, text: "In a small bowl, stir together the 1/4 cup nutritional yeast, 1 tsp chipotle powder, 1/2 tsp garlic powder, and 1 tsp kosher salt until the spice blend is uniformly dark orange. Pre-mixing the dry spices ensures they distribute evenly over the popcorn rather than clumping in isolated pockets." },
      { step: 3, text: "Drizzle the 3 tbsp olive oil (or melted vegan butter) evenly over the popcorn in a slow, spiraling stream while tossing with your other hand. The oil must coat every kernel — it is the adhesive that holds the seasoning in place. Toss vigorously for 20 seconds until every kernel looks lightly glossy." },
      { step: 4, text: "Sprinkle half the spice blend over the oiled popcorn and toss for 15 seconds. Add the remaining half and toss again for another 15 seconds. Adding it in two stages ensures much more even distribution than adding it all at once." },
      { step: 5, text: "Taste a piece and assess: it should be simultaneously smoky, savory, and faintly cheesy, with a pleasant heat from the chipotle that builds over a few seconds. Serve immediately while warm — the flavors are most vivid and the texture is crispest right after seasoning." }
    ],
    chefNotes: "Grinding the nutritional yeast in a spice blender before using turns it into a fine powder that sticks to popcorn much better than flakes.",
    pairing: "Cold IPA",
    mealSlots: ["snack"],
    healthy: true
  },
  {
    slug: "sesame-tajin-tortilla-chips",
    title: "Sesame Tajín Baked Tortilla Chips",
    subtitle: "Thick, crunchy, and aggressively seasoned.",
    story: "Making your own tortilla chips takes 15 minutes and yields a thicker, crunchier chip. Tossing them in toasted sesame oil and Tajín creates a unique fusion snack that works on its own or dipped.",
    category: "Snacks",
    tags: ["Vegan", "Gluten-Free"],
    allergens: ["sesame"],
    difficulty: "Easy",
    prepTime: "5 min",
    cookTime: "15 min",
    servings: 4,
    spiceLevel: 1,
    umamiLevel: 1,
    origin: "Mexico City x Tokyo",
    heroImage: snackBitesHero,
    thumbImage: snackBitesHero,
    ingredients: [
      { qty: "8", unit: "", item: "corn tortillas", note: "preferably stale" },
      { qty: "2", unit: "tbsp", item: "neutral oil" },
      { qty: "1", unit: "tbsp", item: "toasted sesame oil" },
      { qty: "1", unit: "tbsp", item: "Tajín chile-lime seasoning" },
      { qty: "1", unit: "tbsp", item: "white sesame seeds" }
    ],
    method: [
      { step: 1, text: "Preheat the oven to 375°F (190°C) and line two large baking sheets with parchment paper. If your tortillas are fresh, lay them out on a wire rack for 20 minutes to dry slightly — stale tortillas produce dramatically crispier chips because they have less moisture to steam off during baking." },
      { step: 2, text: "Stack the 8 corn tortillas in groups of 4 and cut through the stack with a sharp knife into 6 even triangles each, giving you 48 triangles total. Consistent size is important for even baking — uneven pieces will have some chips burning while others are still soft." },
      { step: 3, text: "Place the 48 triangles in a large bowl. Whisk the 2 tbsp neutral oil and 1 tbsp toasted sesame oil together — the sesame oil is too intense to use alone, but combined with neutral oil it distributes beautifully. Drizzle the oil mixture over the chips and toss with your hands for 30 seconds until every piece feels lightly but evenly coated." },
      { step: 4, text: "Spread the oiled triangles across the two baking sheets in a single, uncrowded layer — any overlapping will cause steaming instead of crisping. Sprinkle the 1 tbsp Tajín and 1 tbsp white sesame seeds evenly over all the chips. The Tajín's red-orange color should dust every piece visibly." },
      { step: 5, text: "Bake for 12–15 minutes, rotating the pans halfway through and flipping the chips with a spatula. They are done when they look golden-brown at the edges and feel completely rigid when you press one — not flexible. Transfer to a wire rack and cool completely; they crisp further as they cool." }
    ],
    chefNotes: "Using stale tortillas is the secret to perfect chips; fresh tortillas hold too much moisture and tend to steam rather than crisp in the oven.",
    pairing: "Miso Guacamole",
    mealSlots: ["snack"],
    healthy: true
  },
  {
    slug: "miso-pita-chips",
    title: "Miso Pita Chips",
    subtitle: "Salty, savory, shattering crunch.",
    story: "Pita chips are an excellent vehicle for dips, but brushing them with a miso-butter glaze before baking turns them into a standalone savory snack that shatters beautifully when bitten.",
    category: "Snacks",
    tags: ["Vegetarian"],
    allergens: ["gluten", "dairy", "soy"],
    difficulty: "Easy",
    prepTime: "10 min",
    cookTime: "12 min",
    servings: 4,
    spiceLevel: 0,
    umamiLevel: 3,
    origin: "Levant x Kyoto",
    heroImage: snackBitesHero,
    thumbImage: snackBitesHero,
    ingredients: [
      { qty: "4", unit: "", item: "pita breads", note: "split horizontally" },
      { qty: "3", unit: "tbsp", item: "unsalted butter", note: "melted" },
      { qty: "1", unit: "tbsp", item: "white miso paste" },
      { qty: "1", unit: "tsp", item: "garlic powder" },
      { qty: "1", unit: "tsp", item: "dried oregano" }
    ],
    method: [
      { step: 1, text: "Preheat the oven to 400°F (200°C) with a rack in the center position. While the oven heats, split each of the 4 pita breads horizontally — insert a knife into the seam and run it around the edge, separating each pita into two thinner rounds. You will have 8 rounds total. The rough, porous inner surface that is now exposed will absorb the butter glaze far better than the smooth outer surface." },
      { step: 2, text: "In a small bowl, whisk together the 3 tbsp melted unsalted butter, 1 tbsp white miso paste, 1 tsp garlic powder, and 1 tsp dried oregano for about 30 seconds until the miso is completely dissolved and no lumps remain. The glaze should look uniformly pale gold and smell intensely savory." },
      { step: 3, text: "Lay the 8 pita rounds rough-side up on a clean work surface. Use a pastry brush to coat the rough inner surface of each round generously with the miso butter — don't be shy. Make sure every millimeter of the surface is covered, including the edges, which tend to get bypassed and end up pale and bland." },
      { step: 4, text: "Use a sharp knife or pizza cutter to cut each glazed round into 6 wedges, then arrange all 48 wedges in a single layer across two large baking sheets. No overlapping — any stacked pieces will steam instead of crisp." },
      { step: 5, text: "Bake for 10–12 minutes until the chips are deeply golden and feel rigid when pressed. They will continue to crisp significantly as they cool on the pan, so err on the side of slightly underdone rather than overdone. Transfer to a wire rack and cool fully before serving — a warm pita chip will seem crunchy but will soften as it cools." }
    ],
    chefNotes: "Splitting the pitas horizontally creates thinner chips that crisp up faster and have a fantastic shattering texture.",
    pairing: "White Miso Tzatziki",
    mealSlots: ["snack"],
    healthy: false
  },
  {
    slug: "chili-lime-rice-crackers",
    title: "Chile Lime Rice Crackers",
    subtitle: "A spicy twist on Japanese arare.",
    story: "Japanese rice crackers (arare) are famously savory and soy-forward. Tossing them in fresh lime juice and chili powder before roasting them again creates a bright, acidic snap that completely redefines the snack.",
    category: "Snacks",
    tags: ["Vegan", "Gluten-Free"],
    allergens: ["soy"],
    difficulty: "Easy",
    prepTime: "5 min",
    cookTime: "10 min",
    servings: 4,
    spiceLevel: 2,
    umamiLevel: 2,
    origin: "Mexico x Japan",
    heroImage: snackBitesHero,
    thumbImage: snackBitesHero,
    ingredients: [
      { qty: "3", unit: "cups", item: "plain Japanese rice crackers", note: "arare or mixed shapes" },
      { qty: "1", unit: "tbsp", item: "neutral oil" },
      { qty: "1", unit: "tbsp", item: "fresh lime juice" },
      { qty: "1", unit: "tsp", item: "chili powder", note: "ancho or guajillo" },
      { qty: "1/2", unit: "tsp", item: "fine sea salt" }
    ],
    method: [
      { step: 1, text: "Preheat the oven to 300°F (150°C) — this low temperature is intentional. Rice crackers are already cooked and just need gentle drying, not high-heat crisping; higher temperatures cause them to burn before the coating has time to set. Line a large baking sheet with parchment and place the 3 cups rice crackers in a large bowl." },
      { step: 2, text: "In a small bowl, stir together the 1 tbsp neutral oil, 1 tbsp fresh lime juice, 1 tsp ancho or guajillo chili powder, and 1/2 tsp fine sea salt until evenly combined. The lime juice and oil will separate slightly — stir again right before using." },
      { step: 3, text: "Pour the seasoning mixture over the 3 cups rice crackers and toss gently with your hands for 30 seconds, being careful not to crush the crackers. Every piece should feel lightly moist and coated; you should see a faint reddish-orange tint from the chili powder on each cracker." },
      { step: 4, text: "Spread the coated crackers in a single layer on the baking sheet, making sure no two pieces overlap. Overlapping causes uneven drying and results in some pieces being soggy while others are over-toasted." },
      { step: 5, text: "Bake for 10 minutes total, then pull the pan out and let the crackers cool completely on the baking sheet — they will feel slightly soft immediately out of the oven but will firm to a crisp, snappy texture within 5 minutes of cooling. The finished cracker should taste simultaneously salty, sour, smoky, and savory." }
    ],
    chefNotes: "Do not exceed 300°F when baking. Rice crackers burn very easily once they have been coated in oil.",
    pairing: "Cold green tea",
    mealSlots: ["snack"],
    healthy: true
  },
  {
    slug: "furikake-pretzels",
    title: "Furikake Covered Pretzels",
    subtitle: "A buttery, umami-rich party snack.",
    story: "Mini pretzels act as the perfect canvas for a rich glaze. Tossing them in butter, soy, and furikake creates an addictive bar snack that balances the maltiness of the pretzel with intense oceanic savoriness.",
    category: "Snacks",
    tags: ["Vegetarian"],
    allergens: ["gluten", "dairy", "soy", "sesame", "fish"],
    difficulty: "Easy",
    prepTime: "5 min",
    cookTime: "45 min",
    servings: 6,
    spiceLevel: 0,
    umamiLevel: 3,
    origin: "USA x Japan",
    heroImage: snackBitesHero,
    thumbImage: snackBitesHero,
    ingredients: [
      { qty: "4", unit: "cups", item: "mini twist pretzels" },
      { qty: "1/4", unit: "cup", item: "unsalted butter", note: "melted" },
      { qty: "1", unit: "tbsp", item: "soy sauce" },
      { qty: "1", unit: "tbsp", item: "honey" },
      { qty: "3", unit: "tbsp", item: "furikake seasoning" }
    ],
    method: [
      { step: 1, text: "Preheat the oven to 250°F (120°C) — this low, slow temperature is critical for this recipe. The goal is to dry the glaze onto the pretzels without burning the honey, which scorches rapidly at higher temperatures. Line a large baking sheet with parchment paper and set out the 4 cups mini twist pretzels in a large mixing bowl." },
      { step: 2, text: "In a small saucepan, warm the 1/4 cup melted unsalted butter over low heat, then add the 1 tbsp soy sauce and 1 tbsp honey. Whisk for 30 seconds until the honey is fully incorporated and the glaze looks uniformly glossy — the honey will resist blending at first but will dissolve into the warm butter within a few seconds." },
      { step: 3, text: "Pour the glaze over the 4 cups mini twist pretzels and toss with two spoons for 30–45 seconds until every pretzel looks evenly coated and slightly shiny. Be methodical — reach to the bottom of the bowl on each toss so no dry pretzels hide underneath." },
      { step: 4, text: "Add the 3 tbsp furikake seasoning and toss for another 20 seconds, pressing gently so the furikake adheres to the sticky glaze coating the pretzels. Every piece should show visible green nori flecks and sesame seeds." },
      { step: 5, text: "Spread the seasoned pretzels in a single layer on the parchment-lined baking sheet without overlapping. Bake for 45 minutes total, stirring every 15 minutes to prevent sticking and ensure even drying on all sides." },
      { step: 6, text: "Remove from the oven and cool completely on the baking sheet — this is where the magic happens. As they cool, the glaze dries from sticky to completely crisp. The finished pretzels should feel dry and crunchy, not tacky. They keep in an airtight container at room temperature for up to 5 days." }
    ],
    chefNotes: "The low and slow baking time is crucial; it dries out the glaze without burning the honey, resulting in a perfectly crisp, non-sticky pretzel.",
    pairing: "Miso Whiskey Sour",
    mealSlots: ["snack"],
    healthy: false
  },
  {
    slug: "soy-glazed-nuts-tajin",
    title: "Soy Glazed Nuts with Tajín",
    subtitle: "Sweet, salty, and spicy roasted nuts.",
    story: "Mixed nuts tossed in a classic soy-honey glaze are a staple, but finishing them with a heavy dusting of Tajín right as they come out of the oven introduces a Mexican acidity that cuts the richness perfectly.",
    category: "Snacks",
    tags: ["Vegetarian", "Gluten-Free"],
    allergens: ["tree nuts", "soy"],
    difficulty: "Easy",
    prepTime: "5 min",
    cookTime: "20 min",
    servings: 6,
    spiceLevel: 1,
    umamiLevel: 2,
    origin: "Mexico x Japan",
    heroImage: snackBitesHero,
    thumbImage: snackBitesHero,
    ingredients: [
      { qty: "3", unit: "cups", item: "mixed raw nuts", note: "almonds, cashews, pecans" },
      { qty: "2", unit: "tbsp", item: "soy sauce" },
      { qty: "2", unit: "tbsp", item: "maple syrup" },
      { qty: "1", unit: "tbsp", item: "sesame oil" },
      { qty: "1", unit: "tbsp", item: "Tajín chile-lime seasoning" }
    ],
    method: [
      { step: 1, text: "Preheat the oven to 325°F (165°C) and line a large, rimmed baking sheet with parchment. The parchment is essential — the soy-maple glaze will caramelize and weld itself to a bare metal sheet, making cleanup nearly impossible. Set out the 3 cups mixed raw nuts in a large bowl." },
      { step: 2, text: "In a small bowl, whisk together the 2 tbsp soy sauce, 2 tbsp maple syrup, and 1 tbsp sesame oil until completely combined and glossy. This glaze is intentionally thin — thick glazes don't penetrate the nuts; thin glazes coat them evenly and bake into a crisp shell." },
      { step: 3, text: "Pour the glaze over the 3 cups nuts and toss vigorously for 30–45 seconds until every nut is coated and the bowl looks nearly clean — all the glaze should have transferred onto the nuts. They should look slightly wet and glistening." },
      { step: 4, text: "Spread the glazed nuts in a single, even layer on the baking sheet. Roast for 15–20 minutes, stirring once at the halfway mark. Watch carefully in the final 5 minutes: the sugars in the maple syrup will caramelize rapidly at the end and can go from golden to burnt within a minute." },
      { step: 5, text: "Remove the baking sheet from the oven when the nuts look deeply golden and smell like toffee. Immediately and generously sprinkle all 1 tbsp Tajín chile-lime seasoning over the hot nuts and toss on the pan. The heat helps the Tajín adhere. Spread back into a single layer and cool completely — at least 15 minutes — until the coating is crisp and dry." }
    ],
    chefNotes: "Nuts continue to roast from their internal heat after being removed from the oven, so pull them out when they look slightly underdone.",
    pairing: "Dry cider",
    mealSlots: ["snack"],
    healthy: true
  },
  {
    slug: "sesame-chile-almonds",
    title: "Sesame Chile Almonds",
    subtitle: "A spicy, crunchy, protein-packed bite.",
    story: "Roasting almonds with toasted sesame oil and crushed red pepper flakes creates an incredibly simple but aggressively flavorful snack that hits all the right savory notes.",
    category: "Snacks",
    tags: ["Vegan", "Gluten-Free"],
    allergens: ["tree nuts", "sesame"],
    difficulty: "Easy",
    prepTime: "5 min",
    cookTime: "15 min",
    servings: 4,
    spiceLevel: 2,
    umamiLevel: 1,
    origin: "California x Sichuan",
    heroImage: snackBitesHero,
    thumbImage: snackBitesHero,
    ingredients: [
      { qty: "2", unit: "cups", item: "whole raw almonds" },
      { qty: "1", unit: "tbsp", item: "toasted sesame oil" },
      { qty: "1", unit: "tsp", item: "chile de árbol powder", note: "or cayenne" },
      { qty: "1", unit: "tsp", item: "flaky sea salt" },
      { qty: "1", unit: "tbsp", item: "white sesame seeds" }
    ],
    method: [
      { step: 1, text: "Preheat the oven to 350°F (175°C) and line a baking sheet with parchment. In a medium bowl, toss the 2 cups whole raw almonds with the 1 tbsp toasted sesame oil, coating them thoroughly for about 20 seconds. The sesame oil should lightly coat each almond — they should glisten but not drip." },
      { step: 2, text: "Sprinkle the 1 tsp chile de árbol powder (or cayenne) over the oiled almonds and toss again for 15 seconds until the red powder coats every almond evenly. Add the 1 tbsp white sesame seeds and fold them in so they adhere to the oil-coated almonds rather than falling to the bottom of the bowl." },
      { step: 3, text: "Spread the seasoned almonds in a single layer on the prepared baking sheet. Roast for 12–15 minutes, shaking the pan once at the 8-minute mark. To check doneness, cut one almond in half — the interior should be uniformly pale brown throughout, not white in the center, which indicates they are still raw inside." },
      { step: 4, text: "Remove the almonds from the oven and immediately scatter the 1 tsp flaky sea salt over them while they are still hot — the salt adheres much better to warm, oily nuts than to cool ones. Toss the almonds on the baking sheet to distribute the salt evenly." },
      { step: 5, text: "Cool the almonds completely on the baking sheet for at least 15 minutes before tasting. They will feel soft and pliable when hot but become firm and crunchy as they cool. Store in an airtight container at room temperature for up to 2 weeks — if they last that long." }
    ],
    chefNotes: "To test if an almond is properly roasted, cut one in half. The interior should be a uniform pale brown, not white.",
    pairing: "Mezcal neat",
    mealSlots: ["snack"],
    healthy: true
  }
,
{slug:"spicy-tuna-tostaditas",title:"Spicy Tuna Tostaditas",subtitle:"Bite-sized oceanic crunch.",story:"Tiny tostadas act as the vehicle for spicy tuna. This merges sushi staples with Mexican street food for an unstoppable bite.",category:"Bites",tags:["Pescatarian"],allergens:["fish","soy","egg"],difficulty:"Easy",prepTime:"15 min",cookTime:"0 min",servings:4,spiceLevel:2,umamiLevel:3,origin:"Baja x Tokyo",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"8",unit:"oz",item:"tuna",note:"minced"},{qty:"2",unit:"tbsp",item:"sriracha"},{qty:"1",unit:"tbsp",item:"Kewpie mayo"},{qty:"1",unit:"bag",item:"mini tostadas"}],method:[
      { step: 1, text: "Keep the 8 oz tuna refrigerated until the very last second — sushi-grade tuna is safe to eat raw but its texture degrades quickly at room temperature. Finely mince it with a sharp knife into uniform pieces no larger than 1/4 inch, using a gentle rocking motion so you chop rather than smash the flesh." },
      { step: 2, text: "In a chilled bowl, combine the minced 8 oz tuna with the 2 tbsp sriracha and 1 tbsp Kewpie mayo. Fold gently with a spoon — don't stir aggressively, which breaks down the fish. The mixture should look creamy and glossy, with each tuna piece coated but still visible as a distinct piece." },
      { step: 3, text: "Taste the mixture: it should be spicy, rich, and slightly sweet from the Kewpie. Adjust the sriracha level now — once assembled on the tostadas, you cannot add more without making the shells soggy." },
      { step: 4, text: "Arrange the mini tostadas from the bag on a chilled serving platter in a single layer, flat-side up. Inspect each one and discard any that have cracks — a cracked tostada will shatter when picked up." },
      { step: 5, text: "Spoon the spicy tuna mixture onto each mini tostada — about 1 rounded tablespoon per piece — and serve within 2 minutes. The moment the creamy tuna touches the shell, it begins softening it, so speed is essential for the best texture contrast." }
    ],chefNotes:"Keep tuna ice cold until assembly to maintain texture.",pairing:"Cold dry sake",mealSlots:["snack"],healthy:true},
{slug:"chile-lime-edamame",title:"Chile Lime Edamame",subtitle:"Fiery twist on a bar snack.",story:"Steamed edamame is a perfect canvas. Tossing them in Tajín and lime transforms them into a messy, lick-your-fingers appetizer.",category:"Bites",tags:["Vegan"],allergens:["soy"],difficulty:"Easy",prepTime:"2 min",cookTime:"5 min",servings:2,spiceLevel:2,umamiLevel:2,origin:"Mexico x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"lb",item:"frozen edamame in pods"},{qty:"1",unit:"tbsp",item:"Tajín"},{qty:"1",unit:"tbsp",item:"lime juice"}],method:[
      { step: 1, text: "Bring a large pot of heavily salted water to a rolling boil over high heat. The water should taste like mild seawater — this generously salted water seasons the edamame through their thin skins. While the water heats, measure your Tajín and lime juice and have them ready at the stove." },
      { step: 2, text: "Add the 1 lb frozen edamame in pods directly to the boiling water without thawing. Boil for exactly 5 minutes — the pods should turn bright vivid green and feel tender when you squeeze one between your fingers. Do not cook longer or the beans become mushy and lose their satisfying snap." },
      { step: 3, text: "Drain the edamame immediately in a colander, shaking it two or three times to remove excess water. Do not rinse them — you want them hot so the Tajín and lime juice cling to the warm, slightly damp pods." },
      { step: 4, text: "Transfer the hot, drained edamame to a large serving bowl. Immediately drizzle the 1 tbsp lime juice over them and toss to coat — the acid will sizzle and steam slightly on contact, filling the air with a citrus aroma." },
      { step: 5, text: "Sprinkle the 1 tbsp Tajín evenly over the pods and toss vigorously for 15 seconds until every pod shows a dusting of red-orange seasoning. Serve immediately in a large bowl alongside a separate empty bowl for discarded pods — eating edamame is a communal, tactile experience." }
    ],chefNotes:"Blister edamame in a dry skillet first for a charred flavor.",pairing:"Cold beer",mealSlots:["snack"],healthy:true},
{slug:"miso-corn-ribs",title:"Miso Corn Ribs",subtitle:"Curling strips of sweet corn.",story:"Cutting corn into strips makes them curl like ribs when fried. Brushing them with miso butter adds a deep, savory glaze.",category:"Bites",tags:["Vegetarian"],allergens:["dairy","soy"],difficulty:"Medium",prepTime:"10 min",cookTime:"15 min",servings:4,spiceLevel:1,umamiLevel:3,origin:"Oaxaca x Kyoto",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"2",unit:"",item:"corn cobs"},{qty:"2",unit:"tbsp",item:"white miso"},{qty:"2",unit:"tbsp",item:"butter"}],method:[
      { step: 1, text: "Stand each corn cob vertically on a cutting board and cut straight down through the core with a sturdy cleaver or heavy chef's knife, splitting it in half lengthwise. Then cut each half lengthwise again into quarters, giving you 8 long, narrow ribs total — 4 per cob. This is the hardest step; keep the knife steady, apply even downward pressure, and never rush." },
      { step: 2, text: "Melt the 2 tbsp butter in a small saucepan over low heat for about 2 minutes until fully liquid but not browned. Remove the pan from heat and whisk in the 2 tbsp white miso paste vigorously for 30 seconds until the glaze is completely smooth and no lumps of miso remain. The glaze should look creamy, pale gold, and glossy." },
      { step: 3, text: "Brush the miso butter generously over all cut surfaces of the 8 corn ribs — the kernels, the inner cob surface, and the edges. Use a pastry brush and go over each rib twice to build up a visible coating. The miso glaze will soak into the corn slightly, which is exactly what you want." },
      { step: 4, text: "Arrange the glazed corn ribs in a single layer in an air fryer basket, kernels facing up. Cook at 400°F for 15 minutes, turning once at the 8-minute mark. You will see the ribs curl inward as they cook — this is the moisture evaporating from the inside of the cob, causing the natural tension to release." },
      { step: 5, text: "Remove the ribs when the kernel tips are browned in spots, the edges show light char, and the ribs have visibly curled like a loose C-shape. Brush on a final coat of the remaining miso butter immediately while hot, so it soaks in while the surface is open and warm. Serve immediately." }
    ],chefNotes:"Use a heavy cleaver to safely cut through the hard corn core.",pairing:"Margarita",mealSlots:["snack"],healthy:false},
{slug:"japanese-sliders-miso",title:"Mini Japanese Sliders",subtitle:"Bite-sized umami bombs.",story:"Small beef patties glazed with miso and soy offer incredible depth. Served on sweet Hawaiian rolls, they bridge two continents.",category:"Bites",tags:[],allergens:["gluten","soy","dairy"],difficulty:"Medium",prepTime:"15 min",cookTime:"10 min",servings:4,spiceLevel:0,umamiLevel:3,origin:"Tokyo x LA",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"lb",item:"ground beef"},{qty:"2",unit:"tbsp",item:"red miso"},{qty:"4",unit:"",item:"Hawaiian rolls"}],method:[
      { step: 1, text: "Divide the 1 lb ground beef into 4 equal portions — about 4 oz each. Form each portion into a patty about 3/4 inch thick and slightly wider than the Hawaiian rolls, as the meat will shrink inward by roughly 20% as it cooks. Press a shallow dimple in the center of each patty with your thumb to prevent it from puffing into a dome." },
      { step: 2, text: "Heat a 10-inch cast-iron or heavy skillet over medium-high heat for 3 full minutes until it is very hot — a drop of water should vaporize on contact within 2 seconds. Add the patties without any oil; the fat in the beef will render immediately and prevent sticking on a properly preheated pan." },
      { step: 3, text: "Sear the patties undisturbed for 4 minutes. Do not press them down with a spatula — pressing squeezes out juices that cannot be reclaimed. You should hear a loud, steady sizzle. Flip once when the bottom is deeply browned and the sides are mostly opaque." },
      { step: 4, text: "In the final 60 seconds of cooking, brush the 2 tbsp red miso over the top of each patty in a thin, even layer. The sugars in the miso will caramelize rapidly against the pan's heat — watch for a deep amber color rather than black. If it begins to char too quickly, reduce the heat immediately." },
      { step: 5, text: "Remove the patties from the pan and toast the 4 Hawaiian rolls cut-side down in the residual fat for 1–2 minutes until lightly golden and slightly caramelized. Build each slider by placing one patty on each toasted roll and serve immediately while the glaze is still sticky and the rolls are warm." }
    ],chefNotes:"Do not glaze too early, as the miso sugars will burn rapidly.",pairing:"Sapporo beer",mealSlots:["lunch","snack"],healthy:false},
{slug:"nori-wrapped-chicken-skewers",title:"Nori Wrapped Chicken",subtitle:"Savory oceanic skewers.",story:"Wrapping chicken in nori before grilling protects the meat and imparts a sea-salt brine. A simple but profound technique.",category:"Bites",tags:["Dairy-Free"],allergens:["soy"],difficulty:"Medium",prepTime:"15 min",cookTime:"12 min",servings:4,spiceLevel:0,umamiLevel:2,origin:"Osaka x Sonora",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"lb",item:"chicken thighs",note:"cubed"},{qty:"2",unit:"sheets",item:"nori"},{qty:"2",unit:"tbsp",item:"soy sauce"}],method:[
      { step: 1, text: "Cut the 1 lb chicken thighs into uniform 1.5-inch cubes — consistency in size is critical so every piece finishes cooking at the same time. Place the cubes in a bowl, pour over the 2 tbsp soy sauce, and toss to coat every surface. Marinate for a minimum of 15 minutes at room temperature; the salt in the soy will penetrate about 1/4 inch into the meat." },
      { step: 2, text: "Cut the 2 sheets of nori into rectangular strips about 1.5 inches wide — wide enough to wrap around each chicken cube once with a slight overlap. If the nori feels brittle, briefly wave it over a gas flame for 2 seconds to make it more pliable and aromatic." },
      { step: 3, text: "Wrap each marinated chicken cube with one nori strip, overlapping the ends by about 1/4 inch and pressing the seam gently to seal it. The moisture from the marinated chicken will help the nori adhere — it should feel slightly damp. Thread 3–4 wrapped cubes onto each skewer, pressing them together so no gaps let heat escape." },
      { step: 4, text: "Heat a grill or grill pan to medium — about 400°F (200°C). Grill the nori-wrapped skewers for 4–5 minutes per side. During cooking, the nori will first go limp, then firm up and turn dark and crisp as it chars. Do not turn the skewers before 4 minutes or the nori will stick to the grates." },
      { step: 5, text: "Check that the chicken is cooked through by inserting an instant-read thermometer into the thickest cube — it should read 165°F and the juices should run clear. The nori should look deeply browned and slightly crisp at the edges." },
      { step: 6, text: "Rest the skewers for 5 minutes before serving — this is especially important for chicken thighs, which have more fat that needs time to redistribute. Serve with extra soy sauce for dipping, though the well-seasoned chicken rarely needs it." }
    ],chefNotes:"Soak wooden skewers for 30 minutes to prevent them from catching fire.",pairing:"Sake",mealSlots:["snack","dinner"],healthy:true},
{slug:"chipotle-gyoza",title:"Chipotle Pork Gyoza",subtitle:"Smoky heat meets a crisp dumpling.",story:"Traditional pork gyoza filling gets an injection of smoky chipotle in adobo. The result is a dumpling that bites back.",category:"Bites",tags:["Dairy-Free"],allergens:["gluten","soy","pork"],difficulty:"Advanced",prepTime:"30 min",cookTime:"10 min",servings:4,spiceLevel:2,umamiLevel:2,origin:"Puebla x Tokyo",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"lb",item:"ground pork"},{qty:"2",unit:"tbsp",item:"chipotle in adobo"},{qty:"1",unit:"pack",item:"gyoza wrappers"}],method:[
      { step: 1, text: "In a large bowl, combine the 1 lb ground pork and 2 tbsp chipotle in adobo. Mix with your hands for 60–90 seconds, squeezing the filling through your fingers until completely uniform — every bite should have the same smoky heat. The filling is properly mixed when it looks cohesive and slightly sticky, rather than crumbly." },
      { step: 2, text: "Keep the gyoza wrappers from the pack covered with a slightly damp kitchen towel as you work — they dry out in minutes and become brittle and impossible to seal. Lay one wrapper flat on a clean surface and place 1 rounded teaspoon of filling in the center, leaving a 1/2-inch border around the edges." },
      { step: 3, text: "Dip your finger in water and run it around the entire edge of the wrapper. Fold the wrapper in half over the filling to form a half-moon, then press the center to seal. Starting from the center and working toward each end, pleat the front edge of the wrapper with your thumb and forefinger in 4–5 small folds, pressing each pleat firmly against the flat back edge. Sealed gyoza should look like a crescent with a crimped ridge." },
      { step: 4, text: "Heat a nonstick 10-inch skillet over medium heat and add 1 tablespoon of neutral oil. Arrange the gyoza flat-side down in a single concentric layer — they can touch but not overlap. Cook undisturbed for 4 minutes until the bottoms are deeply golden-brown. Flip one to check: the bottom should look caramel-colored and crisp." },
      { step: 5, text: "Carefully add 1/4 cup of water to the skillet — it will spatter aggressively. Immediately cover with a lid and reduce the heat to medium-low. Steam the gyoza for 6–8 minutes until all the water has evaporated and you hear the sizzling return." },
      { step: 6, text: "Remove the lid and cook for 1 final minute to re-crisp the bottoms. The gyoza are done when the bottoms are golden-brown and sound hollow when tapped, and an internal temperature probe reads 160°F. Serve immediately, flat-side up, so the crisp bottom is visible." }
    ],chefNotes:"Keep wrappers covered with a damp towel while folding so they do not dry out.",pairing:"Cerveza",mealSlots:["snack","dinner"],healthy:false},
{slug:"miso-crab-tostada",title:"Miso Crab Tostada",subtitle:"Sweet crab on a crispy shell.",story:"Lump crab meat tossed in miso mayo provides a rich, sweet topping. Served on a crisp tostada, the texture contrast is perfect.",category:"Bites",tags:["Pescatarian"],allergens:["shellfish","soy","egg"],difficulty:"Easy",prepTime:"10 min",cookTime:"0 min",servings:4,spiceLevel:1,umamiLevel:2,origin:"Baja x Hokkaido",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"8",unit:"oz",item:"lump crab meat"},{qty:"2",unit:"tbsp",item:"Kewpie mayo"},{qty:"1",unit:"tsp",item:"white miso"},{qty:"4",unit:"",item:"tostadas"}],method:[
      { step: 1, text: "In a small bowl, whisk the 2 tbsp Kewpie mayo and 1 tsp white miso paste together for about 45 seconds until the miso is completely dissolved and the mixture looks uniformly ivory and glossy with no beige streaks. Taste it — the miso should amplify the mayo's richness without tasting salty on its own." },
      { step: 2, text: "Open the 8 oz lump crab meat and carefully pick through every piece with your fingers, feeling for small shell fragments — even a single shell shard can ruin a bite. Drain off any excess liquid by tipping the container briefly." },
      { step: 3, text: "Add the picked crab to the miso-mayo bowl and fold gently with a spoon using slow, wide strokes. You want every piece of crab coated but still intact — aggressive stirring will shred the lump meat into stringy fibers that lose their luxurious texture." },
      { step: 4, text: "Refrigerate the mixture for 10 minutes — this brief chill firms the mayo slightly and allows the miso and crab flavors to meld. While it chills, inspect the 4 tostadas and confirm each one is completely crisp and rigid — any soft spots will collapse under the weight of the topping." },
      { step: 5, text: "Divide the chilled crab mixture evenly among the 4 tostadas, spooning it gently into a mounded pile in the center of each shell. The shells are fragile, so handle them from the edges." },
      { step: 6, text: "Serve immediately the moment the topping hits the shell — the creamy mayo will begin softening the tostada within 2 minutes. Garnish with a few drops of lime juice and a pinch of Tajín if desired." }
    ],chefNotes:"Pick through the crab meat for hidden shells before mixing.",pairing:"White wine",mealSlots:["snack"],healthy:true},
{slug:"yakitori-skewers",title:"Chicken Yakitori with Salsa Verde",subtitle:"Charcoal grilled with bright acid.",story:"Classic Japanese yakitori relies on sweet soy tare. Swapping the tare for a bright, acidic salsa verde creates a wildly refreshing skewer.",category:"Bites",tags:["Dairy-Free"],allergens:[],difficulty:"Medium",prepTime:"15 min",cookTime:"10 min",servings:4,spiceLevel:1,umamiLevel:2,origin:"Mexico City x Tokyo",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"lb",item:"chicken thighs"},{qty:"1/2",unit:"cup",item:"salsa verde"},{qty:"1",unit:"tbsp",item:"oil"}],method:[
      { step: 1, text: "Trim the 1 lb chicken thighs of any large pieces of excess fat, then cut into uniform 1-inch cubes. Uniformity is everything for skewers — if pieces vary in size, smaller ones will dry out while larger ones are still raw. Pat the pieces dry with paper towels so they sear rather than steam on the grill." },
      { step: 2, text: "Thread the chicken cubes onto metal skewers or pre-soaked wooden skewers, packing them tightly together with no gaps between pieces. Tightly packed skewers cook more evenly and the pieces protect each other from drying out on the hot grill." },
      { step: 3, text: "Heat the grill to high heat — it should be hot enough that you can hold your hand 6 inches above the grates for only 2 seconds. Brush the skewers lightly with the 1 tbsp oil, coating every exposed surface to prevent sticking." },
      { step: 4, text: "Grill the skewers for 10–12 minutes total, turning every 2–3 minutes so all four sides develop even, golden-brown sear marks. Resist the urge to move them between turns — letting them sit undisturbed for the full rotation time develops a proper crust that releases cleanly from the grill." },
      { step: 5, text: "In the final 60 seconds, brush the 1/2 cup salsa verde generously over the chicken on all sides, turning once so it caramelizes slightly on the hot grates. The acid in the tomatillos will sizzle and the brightness will bloom." },
      { step: 6, text: "Remove from the grill when every piece reads 165°F internally and the surface looks deeply browned with slightly charred edges. The salsa verde coating should look glossy and lightly charred, not burnt. Serve with remaining salsa verde on the side for dipping." }
    ],chefNotes:"Chicken thighs are far superior to breasts for grilling as they will not dry out.",pairing:"Mezcal",mealSlots:["snack","dinner"],healthy:true},
{slug:"elote-cups",title:"Street Elote Cups",subtitle:"Esquites elevated with miso mayo.",story:"Serving Mexican street corn in cups makes it easier to eat. Adding miso to the mayonnaise dressing brings a massive umami upgrade.",category:"Bites",tags:["Vegetarian"],allergens:["dairy","egg","soy"],difficulty:"Easy",prepTime:"10 min",cookTime:"10 min",servings:4,spiceLevel:2,umamiLevel:2,origin:"Mexico x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"3",unit:"cups",item:"corn kernels"},{qty:"2",unit:"tbsp",item:"Kewpie mayo"},{qty:"1",unit:"tsp",item:"white miso"},{qty:"1/4",unit:"cup",item:"cotija cheese"}],method:[
      { step: 1, text: "Heat a 10-inch dry cast-iron or heavy skillet over high heat for 3 full minutes until it is screaming hot — a drop of water should vaporize instantly. Add the 3 cups corn kernels in a single layer and resist stirring for the first 2 minutes. This prolonged contact with the hot pan creates deep char marks rather than just steaming the corn." },
      { step: 2, text: "Cook the corn for 6–8 minutes total, stirring only every 2 minutes so each stir allows another batch of kernels to char. The finished corn should show obvious dark spots on 30–40% of the kernels — if everything is uniformly pale yellow, the skillet wasn't hot enough or it was stirred too frequently." },
      { step: 3, text: "While the corn cooks, whisk the 2 tbsp Kewpie mayo and 1 tsp white miso together in the bottom of a serving bowl for 30 seconds until completely smooth. The white miso will dissolve into the Kewpie's richness and amplify its savory, eggy depth enormously." },
      { step: 4, text: "Transfer the hot charred corn directly from the skillet to the serving bowl containing the miso-mayo, scraping in every last kernel. Toss immediately and aggressively — the heat from the corn will slightly loosen the mayo, helping it coat every kernel." },
      { step: 5, text: "Divide the dressed corn among four small serving cups while still hot. Crumble the 1/4 cup cotija cheese heavily over the top of each cup — it should form a visible white crust. The contrast between the sweet charred corn, creamy miso-mayo, and salty crumbled cotija is what makes this dish extraordinary." },
      { step: 6, text: "Serve immediately with a lime wedge on the side — a squeeze of fresh lime right before eating brightens all the flavors and cuts through the richness. Do not skip this step." }
    ],chefNotes:"Frozen corn works perfectly if you thaw and dry it thoroughly before charring.",pairing:"Horchata",mealSlots:["snack"],healthy:false},
{slug:"japanese-nachos",title:"Japanese Nachos",subtitle:"Wonton chips and spicy tuna.",story:"Swapping tortilla chips for fried wonton wrappers creates a lighter, shatteringly crisp nacho base. Topped with spicy tuna and avocado.",category:"Bites",tags:["Pescatarian"],allergens:["gluten","soy","fish"],difficulty:"Medium",prepTime:"15 min",cookTime:"5 min",servings:4,spiceLevel:2,umamiLevel:2,origin:"LA x Tokyo",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"pack",item:"wonton wrappers"},{qty:"8",unit:"oz",item:"spicy tuna"},{qty:"1",unit:"",item:"avocado"}],method:[
      { step: 1, text: "Preheat the oven to 400°F (200°C). Cut each wonton wrapper from the pack diagonally in half to form two even triangles. Keep the wrappers in a stack and cover with a damp paper towel as you work — they dry and curl within a minute of exposure to air." },
      { step: 2, text: "Lay the wonton triangles in a single layer across two large baking sheets, leaving space between each piece. Lightly spray or brush with neutral oil — this thin coat of fat is what transforms them from chewy to shatteringly crisp." },
      { step: 3, text: "Bake for 5–7 minutes, watching closely through the oven window. Wonton wrappers are paper-thin and go from pale to deeply golden to burnt in under 60 seconds — pull them the moment they look uniformly golden. They will continue darkening slightly from residual heat, so err on the side of pulling them early." },
      { step: 4, text: "Cool the wonton chips for 2 minutes on the baking sheet until they feel completely rigid. A chip that flexes is underbaked and will go soggy under the toppings within seconds." },
      { step: 5, text: "Arrange the cooled chips in a single overlapping layer on a large serving platter. Spoon the 8 oz spicy tuna evenly across the chips in small, marble-sized portions so every chip gets some topping." },
      { step: 6, text: "Dice the 1 avocado into 1/2-inch cubes and scatter over the spicy tuna. Serve within 3 minutes of assembly — the moisture from the tuna and avocado will begin softening the chips rapidly, so this dish cannot wait." }
    ],chefNotes:"Watch the wontons closely while frying; they go from golden to burnt in seconds.",pairing:"Sapporo",mealSlots:["snack"],healthy:false},
{slug:"tempura-jalapeno-poppers",title:"Tempura Jalapeño Poppers",subtitle:"Cream cheese stuffed, shatteringly crisp.",story:"Traditional breaded poppers can be heavy. A lacy, ice-cold tempura batter provides a delicate crunch that highlights the spicy pepper.",category:"Bites",tags:["Vegetarian"],allergens:["dairy","gluten"],difficulty:"Medium",prepTime:"15 min",cookTime:"10 min",servings:4,spiceLevel:3,umamiLevel:1,origin:"Texas x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"6",unit:"",item:"jalapeños"},{qty:"4",unit:"oz",item:"cream cheese"},{qty:"1",unit:"cup",item:"tempura batter mix"}],method:[
      { step: 1, text: "Halve the 6 jalapeños lengthwise with a sharp paring knife, making clean cuts through the stem so each half retains the stem as a handle. Use a small spoon to scrape out all seeds and white membranes — these contain most of the capsaicin. For maximum heat, leave half the seeds in. Wear gloves if you are sensitive; capsaicin oil stays on skin for hours." },
      { step: 2, text: "Let the 4 oz cream cheese come to room temperature for 20 minutes until it is soft enough to be piped or spooned easily. Fill each of the 12 jalapeño halves with cream cheese, pressing it firmly into the cavity so it is completely level with the cut edges — any mounds will fall off in the hot oil." },
      { step: 3, text: "Make the tempura batter: pour ice-cold water (use water straight from the refrigerator with ice cubes) into the 1 cup tempura batter mix and stir just 3–4 times. The batter should be lumpy and look slightly underworked — this is correct. Overworked batter develops gluten and fries into a dense, chewy coating rather than a light, lacy one." },
      { step: 4, text: "Heat 2 inches of neutral oil in a deep 10-inch skillet to 350°F — use a thermometer, as temperature is critical. Dip each stuffed jalapeño half into the batter, letting excess drip off for 3 seconds, then lower it into the oil cream-side down. Fry 3 or 4 at a time — overcrowding drops the oil temperature and produces a greasy, soggy batter." },
      { step: 5, text: "Fry for 2–3 minutes until the batter is light gold and sounds hollow when tapped with a spoon. Transfer to a wire rack — never paper towels, which trap steam and soften the crust. Cool for 2 minutes before eating; the cream cheese inside will be molten." }
    ],chefNotes:"Ice water in the batter stops gluten development, ensuring the crust is crisp, not chewy.",pairing:"Cold IPA",mealSlots:["snack"],healthy:false},
{slug:"miso-glazed-chicken-wings",title:"Miso Glazed Chicken Wings",subtitle:"Sticky, savory, and roasted.",story:"Baking wings with a miso glaze caramelizes the sugars, creating a sticky, savory coating that rivals any deep-fried wing.",category:"Bites",tags:["Dairy-Free"],allergens:["soy"],difficulty:"Easy",prepTime:"10 min",cookTime:"40 min",servings:4,spiceLevel:1,umamiLevel:3,origin:"Kyoto x USA",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"lb",item:"chicken wings"},{qty:"2",unit:"tbsp",item:"red miso"},{qty:"1",unit:"tbsp",item:"honey"}],method:[
      { step: 1, text: "Preheat the oven to 400°F (200°C) with a rack in the upper third of the oven. Pat the 1 lb chicken wings completely dry with paper towels — this is the most important step for crispy skin. Any surface moisture creates steam during roasting, which prevents browning and produces a rubbery, pale skin. Arrange the wings in a single layer on a large foil-lined rimmed baking sheet with space between each piece." },
      { step: 2, text: "In a small bowl, whisk the 2 tbsp red miso and 1 tbsp honey together for 60 seconds until the glaze is completely smooth, glossy, and free of miso lumps. Red miso's intensity is perfectly balanced by the honey's sweetness — do not substitute white miso, which is too mild to stand up to the wings during roasting." },
      { step: 3, text: "Bake the dry wings at 400°F for 30 minutes undisturbed. During this first phase, the fat under the skin will render out and the skin will turn from pale and flabby to golden and slightly crisp. You will see fat pooling on the foil around the wings — this is correct and expected." },
      { step: 4, text: "Remove the pan from the oven and use tongs to transfer all the wings to a large bowl. Pour the miso-honey glaze over them and toss vigorously until every wing is completely coated — the hot wings will absorb the glaze more readily than cold ones." },
      { step: 5, text: "Return the glazed wings to the baking sheet and roast for 10 more minutes. Watch them carefully: the honey in the glaze will caramelize to a deep amber-bronze. The wings are done when the glaze looks glossy, sticky, and deeply colored but not black, and the internal temperature reads 165°F. Rest for 2 minutes before serving." }
    ],chefNotes:"Line your baking sheet with foil, as the honey-miso glaze will burn onto the pan.",pairing:"Whiskey Highball",mealSlots:["snack","dinner"],healthy:false},
{slug:"salmon-nori-cups",title:"Salmon Nori Cups",subtitle:"Baked salmon in crispy seaweed.",story:"Pressing nori into a muffin tin creates an edible cup. Filled with baked salmon and spicy mayo, it is a one-bite sushi roll.",category:"Bites",tags:["Pescatarian"],allergens:["fish","soy","egg"],difficulty:"Medium",prepTime:"15 min",cookTime:"12 min",servings:4,spiceLevel:1,umamiLevel:2,origin:"Tokyo x California",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"4",unit:"sheets",item:"nori"},{qty:"8",unit:"oz",item:"salmon"},{qty:"2",unit:"tbsp",item:"spicy mayo"}],method:[
      { step: 1, text: "Preheat the oven to 375°F (190°C). Cut each of the 4 nori sheets into 3 squares, giving you 12 squares total. Each square needs to be large enough to drape over the walls of a standard muffin cup with a slight overhang — typically about 4 inches per side. If they are too small, they will pull away from the cup walls during baking." },
      { step: 2, text: "Lightly spray a standard 12-cup muffin tin with cooking spray. Press one nori square into each cup, folding and overlapping the corners to form a small bowl shape. The nori will be stiff at first — press firmly and hold each corner in place for a few seconds until it holds its form. It will soften and conform more as it bakes." },
      { step: 3, text: "Cut the 8 oz salmon into small, uniform 1/2-inch cubes — skin removed. In a bowl, gently fold the salmon with the 2 tbsp spicy mayo until each piece is lightly coated. Do not over-mix; you want intact cubes, not a paste." },
      { step: 4, text: "Divide the salmon mixture evenly among the 12 nori cups — about 1 heaped teaspoon per cup. Do not overfill past the rim of the nori cup; excess moisture from the salmon will boil over and soak the nori, making it soggy rather than crisp." },
      { step: 5, text: "Bake for 10–12 minutes until the salmon in each cup is opaque throughout and flakes easily when pressed with a fork. The nori walls should feel rigid and lightly toasted. Cool in the tin for 2 minutes before carefully lifting each cup out with a small offset spatula." }
    ],chefNotes:"Do not overfill the cups, or the salmon will boil over and make the nori soggy.",pairing:"Green Tea",mealSlots:["snack"],healthy:true},
{slug:"edamame-guac-crostini",title:"Edamame Guacamole Crostini",subtitle:"Bright green protein spread.",story:"Blending edamame with avocado stretches the dip and adds protein. Served on toasted bread, it is a hearty, satisfying bite.",category:"Bites",tags:["Vegan"],allergens:["soy","gluten"],difficulty:"Easy",prepTime:"10 min",cookTime:"5 min",servings:4,spiceLevel:1,umamiLevel:1,origin:"Mexico x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"cup",item:"edamame"},{qty:"1",unit:"",item:"avocado"},{qty:"1",unit:"baguette",item:"sliced bread"}],method:[
      { step: 1, text: "Cook the 1 cup shelled edamame in boiling salted water for 5 minutes until fully tender, then drain and cool for 2 minutes. Transfer to a food processor and pulse 8–10 times until broken down into small pieces — you should see tiny irregular chunks, not a smooth paste. The coarse texture is intentional and provides structure to the spread." },
      { step: 2, text: "Halve the 1 avocado, remove the pit, and scoop the flesh directly into the food processor with the edamame. Process for 20–30 seconds in continuous bursts until the mixture is creamy but still has small visible pieces of both edamame and avocado. Season with a pinch of salt and a squeeze of lime juice, then pulse twice more to incorporate." },
      { step: 3, text: "Slice the baguette into 1/2-inch rounds on the diagonal — the diagonal cut gives you a wider surface for spreading and looks more elegant. Lay them on a large baking sheet in a single layer." },
      { step: 4, text: "Toast the baguette slices at 400°F for 8–10 minutes, flipping once halfway through, until golden and completely rigid — a properly toasted crostini should feel like a cracker, not flex when you apply pressure. Let them cool on the pan for 2 minutes so any residual steam can escape." },
      { step: 5, text: "Spoon the edamame-avocado mixture generously onto each toasted crostini in a thick layer that mounds slightly above the bread's rim. The green spread should look vivid and bright. Serve immediately — the moisture from the spread will begin softening the crostini within 5 minutes." }
    ],chefNotes:"The edamame prevents the avocado from browning as quickly as standard guacamole.",pairing:"Sparkling Water",mealSlots:["snack","lunch"],healthy:true},
{slug:"tamarind-glazed-pork-skewers",title:"Tamarind Pork Skewers",subtitle:"Sour, sweet, and heavily charred.",story:"Tamarind provides a sour tang that cuts through fatty pork shoulder. Skewered and grilled, they are street food perfection.",category:"Bites",tags:["Dairy-Free"],allergens:["soy","pork"],difficulty:"Medium",prepTime:"20 min",cookTime:"15 min",servings:4,spiceLevel:1,umamiLevel:2,origin:"Mexico x Asia",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"lb",item:"pork shoulder"},{qty:"2",unit:"tbsp",item:"tamarind paste"},{qty:"1",unit:"tbsp",item:"soy sauce"}],method:[
      { step: 1, text: "Trim the 1 lb pork shoulder of any large sinew but leave the fat — the fat is essential for juiciness and flavor on the grill. Cut into uniform 1-inch cubes. Uniformity matters more than it might seem: even one piece that is 50% larger will require significantly more time and will still be raw when the rest are done." },
      { step: 2, text: "In a large bowl, whisk the 2 tbsp tamarind paste with the 1 tbsp soy sauce until the mixture is completely smooth and fluid with no lumps of paste remaining. The tamarind's thick, sticky consistency will resist at first — keep whisking for a full 30 seconds." },
      { step: 3, text: "Add the 1 lb pork cubes to the tamarind-soy marinade and toss to coat every surface thoroughly. Let the pork rest in the marinade for at least 15 minutes at room temperature — the tamarind's natural acids begin tenderizing the surface layer of the meat almost immediately." },
      { step: 4, text: "Thread the marinated pork onto skewers, pressing the pieces together tightly. Heat the grill to 450°F (high heat) until the grates are very hot — grill marks should appear within 30 seconds of the meat making contact. Grill for 3–4 minutes per side without moving the skewers; moving them prematurely causes the meat to tear and stick." },
      { step: 5, text: "Continue grilling for 2–4 more minutes as needed, turning occasionally, until the pork reaches at least 145°F internally and the exterior is charred in spots with visible caramelized tamarind. The tamarind's sugars will blacken around the edges — this is desirable, not burning." },
      { step: 6, text: "Rest the skewers for 5 minutes before serving — this allows the muscle fibers to relax and the juices to redistribute so every bite is moist. The tamarind glaze will look sticky and slightly shiny; if it has gone completely matte, brush on a thin coat of fresh tamarind paste before serving." }
    ],chefNotes:"Pork shoulder needs high heat to render the fat and become tender quickly.",pairing:"Michelada",mealSlots:["snack","dinner"],healthy:false},
{slug:"miso-ceviche-chips",title:"Miso Ceviche with Chips",subtitle:"Raw fish cured in lime and umami.",story:"Standard ceviche relies purely on acid. Adding a dash of white miso brings a savory baseline that grounds the bright citrus.",category:"Bites",tags:["Pescatarian"],allergens:["fish","soy"],difficulty:"Easy",prepTime:"20 min",cookTime:"0 min",servings:4,spiceLevel:2,umamiLevel:2,origin:"Peru x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"8",unit:"oz",item:"white fish"},{qty:"1/4",unit:"cup",item:"lime juice"},{qty:"1",unit:"tsp",item:"white miso"}],method:[
      { step: 1, text: "Use only sushi-grade or freshly caught white fish — ceviche acid cures the surface but does not cook the interior to food-safe temperatures the way heat does. Cut the 8 oz white fish into precise 1/2-inch cubes with a sharp knife, working quickly to minimize the time the fish spends at room temperature. Place the cubes in a pre-chilled glass or ceramic bowl." },
      { step: 2, text: "In a small bowl, whisk the 1 tsp white miso into the 1/4 cup fresh lime juice — use a small fine whisk or a fork — for about 30 seconds until the miso is completely dissolved and no lumps remain. The miso will turn the lime juice slightly cloudy and opaque, which is correct." },
      { step: 3, text: "Pour the miso-lime mixture over the fish cubes and stir gently with a spoon so every piece is coated. Watch as the lime acid begins its work: the fish will visibly turn from translucent and glossy to opaque and white-edged within the first 2 minutes. This is acid denaturation — essentially a cold cook." },
      { step: 4, text: "Cover the bowl tightly and refrigerate at 40°F for exactly 15 minutes. Set a timer — under-cured fish is translucent in the center; over-cured fish becomes tough and chalky like rubber. At 15 minutes, the exterior should be fully opaque while the very center remains slightly translucent." },
      { step: 5, text: "Remove from the refrigerator and check a cube: the outside should be firm and white, the interior pale and just barely yielding. Season with a pinch of salt, add minced serrano or jalapeño if desired, and fold in fresh cilantro. Serve immediately with chips on the side." }
    ],chefNotes:"Do not over-cure the fish, or it will become tough and chalky.",pairing:"Pisco Sour",mealSlots:["snack"],healthy:true},
{slug:"sesame-chicken-tacos",title:"Sesame Chicken Mini Tacos",subtitle:"Sweet soy chicken in a warm tortilla.",story:"Taking the flavors of classic sesame chicken and serving them inside a charred corn tortilla proves that a taco can hold anything.",category:"Bites",tags:["Dairy-Free"],allergens:["soy","sesame","gluten"],difficulty:"Medium",prepTime:"15 min",cookTime:"10 min",servings:4,spiceLevel:1,umamiLevel:2,origin:"USA x Mexico",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"lb",item:"chicken breast"},{qty:"2",unit:"tbsp",item:"sesame sauce"},{qty:"8",unit:"",item:"mini tortillas"}],method:[
      { step: 1, text: "Cut the 1 lb chicken breast into small, uniform 3/4-inch pieces — about the size of a large grape. Heat a 10-inch skillet over medium-high heat with a drizzle of neutral oil until the oil shimmers. Add the chicken pieces in a single layer and cook without stirring for 3–4 minutes until the bottoms develop a golden-brown sear." },
      { step: 2, text: "Stir the chicken and cook for 3–4 more minutes until all pieces are opaque throughout with no pink visible at the centers. An instant-read thermometer should read 165°F in the thickest piece. Transfer the cooked chicken back to the skillet over low heat and add the 2 tbsp sesame sauce, stirring for 1–2 minutes until the sauce thickens and clings to every piece." },
      { step: 3, text: "While the chicken glazes, warm the 8 mini tortillas one at a time directly over a gas flame on medium heat, using tongs to flip them every 5–10 seconds. They should develop small black char spots and become pliable and aromatic — a properly charred tortilla smells toasted and smoky, not raw." },
      { step: 4, text: "Divide the sauced chicken evenly among the 8 warm tortillas, placing it in the center of each tortilla rather than spread edge-to-edge so you have room to fold." },
      { step: 5, text: "Serve the 8 assembled tacos immediately while the tortillas are still supple and warm. Cold corn tortillas become brittle and crack — if any tortillas cool before serving, briefly rewarm them over the flame for 5 seconds per side." }
    ],chefNotes:"Warm tortillas are essential; cold corn tortillas will crack and ruin the taco.",pairing:"Lager",mealSlots:["snack","dinner"],healthy:true},
{slug:"panko-jalapeno-bites",title:"Panko Jalapeño Bites",subtitle:"Crispy, cheesy, fiery morsels.",story:"Coating cream-cheese filled jalapeños in Japanese panko rather than standard breadcrumbs yields a dramatically crunchier exterior.",category:"Bites",tags:["Vegetarian"],allergens:["dairy","gluten","egg"],difficulty:"Medium",prepTime:"20 min",cookTime:"15 min",servings:4,spiceLevel:2,umamiLevel:1,origin:"Texas x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"6",unit:"",item:"jalapeños"},{qty:"4",unit:"oz",item:"cream cheese"},{qty:"1",unit:"cup",item:"panko breadcrumbs"}],method:[
      { step: 1, text: "Slice the 6 jalapeños crosswise into thick rings — about 3/4 inch each — giving you approximately 24 rings total. Use a small paring knife or a small melon baller to carefully remove the seeds and white membrane from the center of each ring, creating a clean hollow cavity. Wear gloves; the oils from jalapeño seeds are difficult to wash off and will irritate your eyes if you touch them." },
      { step: 2, text: "Bring the 4 oz cream cheese to room temperature — it should be soft enough to be pressed into the jalapeño rings with a spoon without cracking them. Fill the hollow center of each jalapeño ring with cream cheese, pressing firmly so the cheese is flush and level with both cut faces of the pepper — no protruding mounds." },
      { step: 3, text: "Spread the 1 cup panko breadcrumbs on a flat plate. Press each filled jalapeño ring firmly onto the panko on both flat sides and around the curved edge, turning and pressing until the cream cheese is completely covered in crumbs. The panko should adhere to the cream cheese without needing any egg wash because the cream cheese is sticky enough." },
      { step: 4, text: "Arrange the panko-coated rings on a parchment-lined baking sheet and spray liberally with cooking spray — panko browns best when it has a thin coat of fat. Bake at 400°F for 15 minutes until the panko is deeply golden-brown and the cream cheese is beginning to bubble at the edges." },
      { step: 5, text: "Cool the jalapeño bites on the baking sheet for 5 minutes before serving. The cream cheese inside will be molten immediately out of the oven — waiting prevents burns. The finished bites should have a shattering panko crust that gives way to warm, soft cheese and the sharp bite of barely-cooked jalapeño." }
    ],chefNotes:"Panko browns best if you spray it lightly with cooking oil before baking.",pairing:"Agua Fresca",mealSlots:["snack"],healthy:false}
,
{slug:"churro-mochi-bites",title:"Churro Mochi Bites",subtitle:"Chewy, cinnamon-sugar perfection.",story:"Mochi's incredible chew combined with a fresh churro coating. A hybrid dessert that delivers texturally on every level.",category:"Desserts",tags:["Vegetarian","Gluten-Free"],allergens:["dairy"],difficulty:"Easy",prepTime:"10 min",cookTime:"45 min",servings:6,spiceLevel:0,umamiLevel:1,origin:"Mexico x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"lb",item:"sweet rice flour"},{qty:"2",unit:"cups",item:"whole milk"},{qty:"1/2",unit:"cup",item:"butter"},{qty:"1.5",unit:"cups",item:"sugar"},{qty:"1/4",unit:"cup",item:"cinnamon-sugar"}],method:[
      { step: 1, text: "Preheat the oven to 350°F (175°C) and line an 8-inch square baking pan with parchment, leaving an overhang on two sides for easy removal. Melt the 1/2 cup butter in a medium saucepan over low heat, then add the 2 cups whole milk and 1.5 cups sugar, whisking until the sugar is completely dissolved and the mixture is warm but not simmering — about 3 minutes." },
      { step: 2, text: "Add the 1 lb sweet rice flour to the warm milk mixture and whisk vigorously for 2 full minutes until the batter is completely smooth with no dry pockets or lumps. It will be thick and look almost like pancake batter — this is correct. Underworked batter will have a gummy, uneven texture after baking." },
      { step: 3, text: "Pour the batter into the prepared pan and smooth the surface with a wet spatula — the batter will be slightly sticky. Bake at 350°F for 45 minutes until the surface is lightly golden and a skewer inserted in the center comes out clean with no wet batter attached." },
      { step: 4, text: "Cool the mochi in the pan for 20 full minutes — it will firm significantly as it cools and cannot be cut cleanly while hot. Once cooled, lift out using the parchment overhang and transfer to a cutting board." },
      { step: 5, text: "Dip a plastic or very sharp metal knife in water before each cut — mochi is extremely sticky and a dry knife will drag and deform the pieces. Cut into bite-sized squares, approximately 1.5 inches. Immediately toss all the squares in the 1/4 cup cinnamon-sugar, pressing gently so the coating adheres to every sticky surface." }
    ],chefNotes:"Use a wet plastic knife to cut the mochi cleanly.",pairing:"Horchata",mealSlots:["dessert"],healthy:false},
{slug:"matcha-tres-leches",title:"Matcha Tres Leches",subtitle:"A sponge soaked in earthy milks.",story:"Infusing the tres leches soak with matcha balances the intense sweetness. The grassy notes ground the rich dairy perfectly.",category:"Desserts",tags:["Vegetarian"],allergens:["dairy","gluten","egg"],difficulty:"Medium",prepTime:"20 min",cookTime:"30 min",servings:8,spiceLevel:0,umamiLevel:1,origin:"Mexico x Kyoto",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"",item:"sponge cake"},{qty:"1",unit:"can",item:"evaporated milk"},{qty:"1",unit:"can",item:"condensed milk"},{qty:"1.5",unit:"tbsp",item:"matcha"}],method:[
      { step: 1, text: "Bake or acquire a 9-by-13-inch sponge cake and let it cool completely to room temperature — at least 1 hour. Place it on a rimmed serving dish (the soaking liquid must be contained). Use a fork or wooden skewer to poke holes all over the surface, spacing them about 1 inch apart. The holes must go deep — at least halfway through the cake — to allow the tres leches liquid to penetrate the center." },
      { step: 2, text: "Sift the 1.5 tbsp matcha powder through a fine-mesh sieve into a bowl, pressing any clumps through with a spoon. Sifting is mandatory — unsifted matcha will leave dark green chalky spots in the finished soak that look and taste uneven." },
      { step: 3, text: "Whisk the sifted 1.5 tbsp matcha with 3 tablespoons of the evaporated milk from the can for 60 seconds until completely smooth and evenly bright green — no dark streaks. Then add the remaining evaporated milk and the entire can of condensed milk and whisk until thoroughly combined." },
      { step: 4, text: "Pour the matcha milk soak slowly and evenly over the entire surface of the poked cake, working from the center outward. Pour in three passes — waiting 30 seconds between each pass — so the cake has time to absorb each addition before being overwhelmed. The surface should look visibly moist and the holes should begin to close as the liquid soaks in." },
      { step: 5, text: "Cover the soaked cake tightly with plastic wrap and refrigerate for at least 4 hours — overnight is ideal. During this time the cake absorbs all the liquid and transforms from a dry sponge into a dense, incredibly moist dessert. Before serving, spread softly whipped cream over the surface and dust lightly with additional sifted matcha." }
    ],chefNotes:"Sifting the matcha is mandatory to prevent chalky green spots.",pairing:"Coffee",mealSlots:["dessert"],healthy:false},
{slug:"miso-mezcal-flan-v2",title:"Miso Caramel Flan",subtitle:"Classic flan with fermented depth.",story:"Adding white miso to the caramel brings a savory edge. A splash of mezcal transforms it into a complex, adult dessert.",category:"Desserts",tags:["Vegetarian","Gluten-Free"],allergens:["dairy","egg"],difficulty:"Medium",prepTime:"20 min",cookTime:"50 min",servings:6,spiceLevel:0,umamiLevel:2,origin:"Mexico x Kyoto",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"cup",item:"sugar"},{qty:"2",unit:"tbsp",item:"white miso"},{qty:"1",unit:"tsp",item:"mezcal"},{qty:"5",unit:"",item:"eggs"}],method:[
      { step: 1, text: "Heat the 1 cup sugar in a dry, heavy 10-inch skillet over medium heat without stirring. After about 3 minutes, the edges will begin to melt and turn amber. At that point, gently swirl the pan (do not stir with a spoon) to help the unmelted sugar contact the hot edges. Cook for 6–8 minutes total until fully melted and a deep amber — the color of dark honey." },
      { step: 2, text: "Remove the skillet from the heat immediately and carefully add the 1 tsp mezcal — it will spatter aggressively as the alcohol hits the molten sugar. Stir once with a heatproof spatula. The mezcal will flash off instantly but leave behind a faint smokiness that defines this dessert." },
      { step: 3, text: "Immediately pour the hot caramel into six 6-ounce ramekins, tilting each ramekin quickly to coat the base before the caramel sets. You have about 20 seconds before it hardens — work decisively. Let the caramel cool and harden completely in the ramekins while you prepare the custard, about 10 minutes." },
      { step: 4, text: "In a large bowl, whisk the 5 eggs with the 2 tbsp white miso for 2 full minutes until completely smooth and homogeneous — no miso streaks or egg strands. Then whisk in the dairy component (typically 1 can condensed milk and 1 can evaporated milk, if including). Pour the mixture through a fine-mesh sieve to remove any cooked egg bits or miso lumps." },
      { step: 5, text: "Divide the strained custard evenly among the ramekins over the hardened caramel. Place the filled ramekins in a deep roasting pan and pour hot tap water into the pan until it reaches halfway up the sides of the ramekins — this water bath (bain-marie) prevents the egg proteins from seizing and ensures a silky, smooth texture." },
      { step: 6, text: "Bake at 325°F for 35–45 minutes. The flans are done when the edges look firmly set but the centers still jiggle like loose Jell-O when you gently shake a ramekin. The jiggle is critical — overbaked flan becomes grainy and full of bubbles." },
      { step: 7, text: "Remove from the water bath, cool to room temperature, then refrigerate for at least 4 hours until completely cold and firm. To unmold, run a thin knife around the edge of each ramekin, invert onto a plate, and tap firmly once. The caramel will flow down the sides of the flan in a dramatic amber cascade." }
    ],chefNotes:"The water bath is non-negotiable for achieving a silky, bubble-free texture.",pairing:"Mezcal neat",mealSlots:["dessert"],healthy:false},
{slug:"horchata-matcha-panna-cotta",title:"Horchata Matcha Panna Cotta",subtitle:"Layered creamy elegance.",story:"A brilliant layered dessert featuring sweet cinnamon horchata topped with a bitter matcha cream. Visually striking and deeply flavorful.",category:"Desserts",tags:["Vegetarian","Gluten-Free"],allergens:["dairy"],difficulty:"Advanced",prepTime:"30 min",cookTime:"10 min",servings:4,spiceLevel:0,umamiLevel:1,origin:"Oaxaca x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"2",unit:"cups",item:"heavy cream"},{qty:"1",unit:"cup",item:"horchata"},{qty:"1",unit:"tbsp",item:"matcha"},{qty:"2",unit:"tsp",item:"gelatin"}],method:[
      { step: 1, text: "Combine the 2 tsp gelatin with the 1 cup horchata in a small saucepan and stir briefly to distribute the gelatin granules. Let the mixture stand undisturbed for 5 minutes — this is blooming, the process where gelatin granules absorb the horchata liquid and swell. Properly bloomed gelatin dissolves cleanly; underbloomed gelatin leaves rubbery lumps in the finished dessert." },
      { step: 2, text: "Add the 2 cups heavy cream to the saucepan and place over medium-low heat. Warm for 5 minutes, stirring occasionally, until the mixture is steaming and tiny bubbles form around the edges of the pan — about 160°F. Do not boil; boiling breaks the gelatin's setting ability and scalds the cream." },
      { step: 3, text: "Stir the warmed mixture for 1–2 minutes until the bloomed gelatin has completely dissolved and is no longer visible. Lift the spoon and look for any undissolved granules — they will look like small clear beads. If any remain, continue stirring over very low heat for another minute." },
      { step: 4, text: "Divide the warm cream into two equal portions — approximately 1.5 cups each — in two separate bowls. Whisk the 1 tbsp matcha powder into one portion for 60 seconds until the mixture is completely smooth and uniformly bright green." },
      { step: 5, text: "Pour the plain horchata cream portion into four tall glasses or ramekins tilted at a 45-degree angle — prop them with a folded towel. Refrigerate for 1–2 hours until the first layer is completely firm and does not flow when you tilt the glass to check." },
      { step: 6, text: "Once the horchata layer is firm, stand the glasses upright and pour the matcha cream portion over it slowly and carefully. Refrigerate for 4 more hours until the matcha layer is completely set. The finished panna cotta should show a clean diagonal line between the cream-white and matcha-green layers when viewed from the side." },
      { step: 7, text: "Serve directly in the glasses. The layers should be visually distinct and clean — any blurring indicates the first layer was not fully set before the second was added. Run a small knife around the rim of each glass to release the surface tension before eating." }
    ],chefNotes:"Ensure the first layer is completely firm before pouring the second.",pairing:"Hot tea",mealSlots:["dessert"],healthy:false},
{slug:"churro-ice-cream-sandwich",title:"Churro Ice Cream Sandwich",subtitle:"Crispy spirals and cold vanilla.",story:"Piping churro dough into flat spirals creates the ultimate ice cream sandwich cookie. Crispy, warm, and heavily spiced.",category:"Desserts",tags:["Vegetarian"],allergens:["dairy","gluten","egg"],difficulty:"Advanced",prepTime:"20 min",cookTime:"15 min",servings:4,spiceLevel:0,umamiLevel:1,origin:"Mexico x USA",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"batch",item:"churro dough"},{qty:"1",unit:"pint",item:"vanilla ice cream"},{qty:"1/2",unit:"cup",item:"cinnamon sugar"}],method:[
      { step: 1, text: "Prepare the churro dough and load it into a piping bag fitted with a large star tip. On a parchment-lined surface, pipe tight, even spirals about 3 inches in diameter — start at the center and work outward in concentric rings, leaving no gaps. Each spiral will become one sandwich disc, so uniformity of size ensures the sandwiches look professional." },
      { step: 2, text: "Slide the parchment onto a baking sheet and freeze the piped spirals for 20 minutes until completely firm and rigid — they should lift cleanly from the parchment without deforming. Frozen dough holds its spiral shape during frying; unfrozen dough will unravel in the hot oil." },
      { step: 3, text: "Heat 2 inches of neutral oil in a deep, wide saucepan to 350°F — measure with a thermometer, not by eye. Carefully lower 2–3 frozen spirals into the oil using a slotted spoon or spider strainer. They will immediately sizzle aggressively. Fry for 3–4 minutes, turning once, until deeply golden-brown on both sides and cooked through to the center." },
      { step: 4, text: "Transfer the hot churro discs immediately to the 1/2 cup cinnamon sugar, tossing and pressing so the entire surface is coated. The sugar adheres while the discs are hot and greasy — do not delay this step. Set the coated discs on a wire rack to cool slightly but assemble while still warm." },
      { step: 5, text: "Scoop the 1 pint vanilla ice cream into thick, even portions and sandwich between two warm churro discs. Press gently so the ice cream reaches the edges without squeezing out. Serve within 60 seconds — the warm churro will begin melting the ice cream immediately, creating a contrast of temperatures and textures that is the entire point of this dessert." }
    ],chefNotes:"Freezing the dough spirals prevents them from unraveling in the oil.",pairing:"Cold milk",mealSlots:["dessert"],healthy:false},
{slug:"matcha-churros",title:"Matcha Churros",subtitle:"Green tea spiked dough.",story:"Folding matcha powder directly into the choux pastry gives these churros an earthy flavor and a stunning green interior.",category:"Desserts",tags:["Vegetarian"],allergens:["dairy","gluten","egg"],difficulty:"Medium",prepTime:"15 min",cookTime:"15 min",servings:6,spiceLevel:0,umamiLevel:1,origin:"Mexico x Tokyo",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"cup",item:"flour"},{qty:"2",unit:"tbsp",item:"matcha"},{qty:"1",unit:"cup",item:"water"},{qty:"1/2",unit:"cup",item:"butter"}],method:[
      { step: 1, text: "Sift the 1 cup flour and 2 tbsp matcha together through a fine-mesh sieve into a bowl, pressing any clumps through. Sifting accomplishes two things: it aerates the flour for a lighter dough and it breaks up matcha clumps that would otherwise appear as dark green spots in the finished churros." },
      { step: 2, text: "Combine the 1 cup water and 1/2 cup butter in a 2-quart saucepan over medium heat. Bring to a full, vigorous boil — large bubbles should be breaking the entire surface. Do not add the flour before the water is fully boiling or the starch will not gelatinize properly, resulting in a dough that is too wet to pipe." },
      { step: 3, text: "Remove the saucepan from the heat and immediately add the sifted flour-matcha mixture all at once. Stir aggressively with a wooden spoon for 2 minutes over medium-low heat until the dough forms a smooth ball and pulls cleanly away from the sides of the pot — this is the 'paste' stage. The dough should look uniformly green throughout." },
      { step: 4, text: "Cool the dough for 10 minutes in the pot, stirring occasionally to release steam. The dough must cool before adding eggs (if your recipe includes them) — too-hot dough will scramble the eggs. Load the cooled dough into a piping bag fitted with a large star tip and pipe 4-inch lengths over hot oil." },
      { step: 5, text: "Fry the piped churros in neutral oil heated to exactly 350°F for 3–4 minutes, turning once with tongs, until the exterior is deeply golden and the churros feel rigid when pressed. They should sound hollow when tapped. Drain on a wire rack and roll immediately in cinnamon sugar while hot." }
    ],chefNotes:"The dough must pull away from the sides of the pot before adding eggs.",pairing:"White chocolate sauce",mealSlots:["dessert"],healthy:false},
{slug:"mochi-churro-donuts",title:"Mochi Churro Donuts",subtitle:"Chewy baked rings.",story:"Using sweet rice flour in a donut pan creates a chewy, mochi-like interior with a crisp, cinnamon-dusted exterior.",category:"Desserts",tags:["Vegetarian","Gluten-Free"],allergens:["dairy","egg"],difficulty:"Easy",prepTime:"15 min",cookTime:"20 min",servings:6,spiceLevel:0,umamiLevel:1,origin:"USA x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"cup",item:"mochiko flour"},{qty:"1/2",unit:"cup",item:"sugar"},{qty:"1",unit:"tsp",item:"baking powder"},{qty:"1/2",unit:"cup",item:"milk"}],method:[
      { step: 1, text: "Preheat the oven to 350°F (175°C) and generously grease a standard 6-cavity donut pan with butter or nonstick spray, paying particular attention to the center post of each cavity — mochi batter is extremely sticky and will bond to any ungreased surface. In a medium bowl, whisk together the 1 cup mochiko flour, 1/2 cup sugar, and 1 tsp baking powder for 30 seconds until evenly combined." },
      { step: 2, text: "Add the 1/2 cup milk to the dry mixture and stir with a spoon for about 60 seconds until a smooth, thick, slightly stretchy batter forms. Mochiko batter should look denser and stickier than regular cake batter — it will be difficult to stir and will pull away from the spoon in long strands. This stickiness is the natural glutinous rice starch doing its job." },
      { step: 3, text: "Load the batter into a piping bag or use two spoons to fill each donut cavity about 3/4 full. The batter will puff during baking, so do not overfill — overfilled cavities produce flat tops that lack the classic donut ring shape." },
      { step: 4, text: "Bake at 350°F for 20 minutes. The donuts are done when the tops are lightly golden-brown and spring back immediately when pressed gently with a finger — if they leave an indentation, they need 2–3 more minutes. Do not overbake; mochi loses its signature chewiness when overbaked and becomes dry and dense." },
      { step: 5, text: "Cool in the pan for 5 minutes — the mochi donuts will be too fragile to remove immediately but will firm up considerably as they cool. Run a thin knife or small offset spatula around each donut, including around the center post, then lift out carefully. Toss immediately in cinnamon sugar while the surface is still warm and slightly tacky." }
    ],chefNotes:"Do not over-bake, or the mochi will lose its signature chewiness.",pairing:"Cold brew coffee",mealSlots:["dessert"],healthy:false},
{slug:"cajeta-mochi-ice-cream",title:"Cajeta Mochi Ice Cream",subtitle:"Goat milk caramel hidden inside.",story:"Wrapping a scoop of cajeta-swirled ice cream in a thin layer of sweet mochi dough. A handheld explosion of caramel.",category:"Desserts",tags:["Vegetarian","Gluten-Free"],allergens:["dairy"],difficulty:"Advanced",prepTime:"45 min",cookTime:"5 min",servings:6,spiceLevel:0,umamiLevel:1,origin:"Celaya x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"pint",item:"vanilla ice cream"},{qty:"1/4",unit:"cup",item:"cajeta"},{qty:"1",unit:"cup",item:"sweet rice flour"}],method:[
      { step: 1, text: "Let the 1 pint vanilla ice cream soften at room temperature for 5–8 minutes until it is soft enough to stir but has not melted. Transfer to a large bowl and fold in the 1/4 cup cajeta with four or five broad strokes — you want visible caramel ribbons throughout, not a fully uniform mixture. Refreeze for 2 hours until completely firm and scoopable." },
      { step: 2, text: "Scoop the cajeta-swirled ice cream into 6 smooth, compact rounds using a small ice cream scoop. Place on a parchment-lined plate and freeze for a minimum of 1 hour until rock solid — they must be completely frozen before wrapping or they will melt faster than you can work with the mochi." },
      { step: 3, text: "Combine the 1 cup sweet rice flour with 1.5 cups water in a large microwave-safe bowl. Microwave for 3 minutes at full power, stopping to stir thoroughly at the 1-minute and 2-minute marks. The dough is ready when it looks translucent, feels hot and very sticky, and pulls away from the bowl walls in a cohesive mass." },
      { step: 4, text: "Dust your work surface generously with cornstarch — mochi dough is incredibly sticky and will bond to any un-dusted surface. While the dough is still warm and pliable, roll it to about 1/8-inch thickness and cut 6 circles, each roughly 5 inches wide. Work quickly; cooled mochi dough becomes stiff and tears when stretched." },
      { step: 5, text: "Working one at a time and keeping unused circles covered, place one frozen ice cream ball in the center of a mochi circle. Stretch the dough up and over the ice cream, pinching the seam tightly shut underneath the ball. Roll gently between your palms to smooth the surface and close any cracks. Place seam-side down on parchment and freeze immediately for 2 more hours before serving." }
    ],chefNotes:"The ice cream scoops must be rock hard before you attempt to wrap them.",pairing:"Black tea",mealSlots:["dessert"],healthy:false},
{slug:"miso-chocolate-chip-cookies",title:"Miso Chocolate Chip Cookies",subtitle:"Salty, sweet, and deeply savory.",story:"Replacing the salt in a chocolate chip cookie with white miso creates an umami-rich dough that elevates the dark chocolate.",category:"Desserts",tags:["Vegetarian"],allergens:["dairy","gluten","egg","soy"],difficulty:"Easy",prepTime:"15 min",cookTime:"12 min",servings:12,spiceLevel:0,umamiLevel:2,origin:"USA x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"2",unit:"cups",item:"flour"},{qty:"1",unit:"cup",item:"brown sugar"},{qty:"3",unit:"tbsp",item:"white miso"},{qty:"1",unit:"cup",item:"chocolate chips"}],method:[
      { step: 1, text: "In a large bowl, cream together softened butter and the 1 cup brown sugar until light and fluffy — about 3 minutes with a hand mixer on medium. The mixture should increase in volume and look pale and airy. Then add the 3 tbsp white miso paste and beat for another 60 seconds until fully incorporated and no beige miso streaks remain." },
      { step: 2, text: "Add eggs (per your base recipe) one at a time, beating after each addition until fully combined. The dough may look slightly curdled after the first egg — this is normal and will smooth out as the flour is added. Scrape the bowl sides thoroughly before adding the flour." },
      { step: 3, text: "Add the 2 cups flour gradually, folding with a wooden spoon or spatula — do not use the mixer at this stage, which would overdevelop the gluten and make the cookies tough. Fold just until no dry flour streaks remain, then fold in the 1 cup chocolate chips." },
      { step: 4, text: "Cover the dough tightly and refrigerate for at least 1 hour — overnight is better. Chilling deepens the miso flavor substantially and produces cookies that spread less and have a chewier texture. Preheat the oven to 350°F (175°C) and line baking sheets with parchment. Scoop the cold dough into balls and space them 3 inches apart." },
      { step: 5, text: "Bake for 12 minutes until the edges are set and lightly golden but the centers still look underdone and slightly glossy — this is correct. The cookies will firm up as they cool on the pan. They are overbaked the moment the centers look set in the oven." },
      { step: 6, text: "Cool on the baking sheet for 10 minutes before transferring. The fully cooled cookie should have a slightly crisp edge that gives way to a soft, chewy center with a deep, complex savory-sweet flavor from the miso. Flaky sea salt on top immediately before serving is an excellent finishing touch." }
    ],chefNotes:"Let the dough rest in the fridge for an hour to deepen the miso flavor.",pairing:"Cold milk",mealSlots:["dessert","snack"],healthy:false},
{slug:"matcha-flan",title:"Matcha Flan",subtitle:"Earthy green custard.",story:"Infusing the custard base of a Mexican flan with ceremonial matcha cuts the richness of the condensed milk beautifully.",category:"Desserts",tags:["Vegetarian","Gluten-Free"],allergens:["dairy","egg"],difficulty:"Medium",prepTime:"20 min",cookTime:"45 min",servings:6,spiceLevel:0,umamiLevel:1,origin:"Mexico x Kyoto",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"can",item:"condensed milk"},{qty:"1",unit:"tbsp",item:"matcha"},{qty:"1",unit:"cup",item:"sugar"},{qty:"4",unit:"",item:"eggs"}],method:[
      { step: 1, text: "Place the 1 cup sugar in a dry, heavy saucepan over medium heat. Resist stirring for the first 3 minutes — the sugar needs direct, even contact with the hot pan to melt. Once the edges begin liquefying and turning amber, swirl the pan gently to distribute the heat. Cook for 5–8 minutes total until the caramel is a deep, dark amber — the color of a copper coin, not pale gold." },
      { step: 2, text: "Immediately pour the hot caramel into six 6-ounce ramekins or one 9-inch round baking dish, tilting each quickly to coat the base. Move decisively — the caramel will begin hardening within 15–20 seconds. Let the caramel cool and harden completely, about 10 minutes." },
      { step: 3, text: "Whisk the 1 tbsp matcha with 2 tablespoons of warm water in a small bowl for 45 seconds until completely smooth and no dry matcha clumps remain — this pre-dissolving step is critical, as undissolved matcha will leave dark specks in the finished custard. Then combine in a blender with the 4 eggs, 1 can condensed milk, and 1 cup whole milk. Blend for 60 seconds until uniformly smooth and pale green." },
      { step: 4, text: "Pour the blended custard through a fine-mesh sieve into a large measuring cup with a pour spout. Straining catches any cooked egg bits and ensures a completely smooth, silky texture. Divide the strained custard evenly among the ramekins over the hardened caramel." },
      { step: 5, text: "Place the ramekins in a deep roasting pan and fill the pan with hot tap water until it reaches halfway up the sides of the ramekins. Bake at 325°F for 45–55 minutes until the custard is set around the edges but jiggles gently in the center like loose Jell-O when you shake the pan." },
      { step: 6, text: "Remove from the water bath and cool to room temperature, then refrigerate overnight until completely cold and firmly set. To serve, run a knife around the edge, invert onto a plate, and hold for 5 seconds before lifting — the caramel will pour down the green custard in a beautiful amber stream." }
    ],chefNotes:"Blend the matcha with a tiny splash of hot water first to prevent clumps.",pairing:"Green tea",mealSlots:["dessert"],healthy:false},
{slug:"churro-bread-pudding",title:"Churro Bread Pudding",subtitle:"Crispy tops, soft interior.",story:"Using stale croissants tossed in cinnamon sugar as the base for a bread pudding creates a churro-like texture with custard underneath.",category:"Desserts",tags:["Vegetarian"],allergens:["dairy","gluten","egg"],difficulty:"Medium",prepTime:"15 min",cookTime:"45 min",servings:8,spiceLevel:0,umamiLevel:1,origin:"Mexico x Europe",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"4",unit:"cups",item:"stale bread cubes"},{qty:"2",unit:"cups",item:"milk"},{qty:"3",unit:"",item:"eggs"},{qty:"1",unit:"tbsp",item:"cinnamon"}],method:[
      { step: 1, text: "Preheat the oven to 350°F (175°C) and butter an 8-inch square baking dish generously. The bread must be truly stale — if your bread is fresh, spread the 4 cups of cubed bread on a baking sheet and leave them out uncovered overnight, or bake at 300°F for 10 minutes until dry and firm. Fresh bread turns to mush in the custard rather than absorbing it and puffing." },
      { step: 2, text: "Arrange the stale bread cubes in the buttered baking dish, piling them in a slightly mounded layer rather than pressing them flat. Sprinkle the 1 tbsp cinnamon evenly over the surface so every cube shows a dusting of warm spice." },
      { step: 3, text: "In a medium bowl, whisk the 3 eggs with the 2 cups milk for 60 seconds until completely combined — no visible egg strands. Pour the custard evenly over the bread, pressing down gently with a spoon so every cube contacts the liquid. Let it soak for 20 minutes at room temperature — the center cubes need time to absorb as much custard as the surface cubes." },
      { step: 4, text: "After soaking, the bread should have absorbed most of the liquid and feel heavy and saturated. Press the surface down one final time to submerge any floating dry pieces. Bake at 350°F for 45 minutes until the top is puffed, deeply golden-brown, and the center no longer jiggles when you shake the pan." },
      { step: 5, text: "Cool the pudding in the baking dish for 10 minutes before serving — the custard needs this time to set so it doesn't collapse when cut. The interior should be soft and custardy while the exposed bread tops are crispy and caramelized. Serve warm with a drizzle of cajeta or vanilla sauce." },
      { step: 6, text: "Serve directly from the baking dish while warm. Spoon each portion so it captures both the crispy golden top and the soft, custardy interior underneath. The contrast of textures — crispy, pudding-soft, and creamy — is what makes this dessert exceptional." }
    ],chefNotes:"The bread must be truly stale to absorb the custard without becoming mush.",pairing:"Coffee",mealSlots:["dessert"],healthy:false},
{slug:"horchata-ice-cream",title:"Horchata Ice Cream",subtitle:"Cinnamon rice milk frozen solid.",story:"Churning a concentrated horchata base in an ice cream maker yields a refreshing, spiced dessert that melts beautifully on the tongue.",category:"Desserts",tags:["Vegetarian","Gluten-Free"],allergens:["dairy"],difficulty:"Medium",prepTime:"20 min",cookTime:"0 min",servings:6,spiceLevel:0,umamiLevel:1,origin:"Oaxaca x USA",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"2",unit:"cups",item:"heavy cream"},{qty:"1",unit:"cup",item:"horchata concentrate"},{qty:"1",unit:"tsp",item:"cinnamon"}],method:[
      { step: 1, text: "In a large bowl, whisk the 2 cups heavy cream with the 1 cup horchata concentrate for 60 seconds until completely combined. The horchata will initially resist blending with the cream — keep whisking until the mixture looks uniform and pale ivory with no separation." },
      { step: 2, text: "Add the 1 tsp cinnamon and whisk for another 20 seconds until the spice is evenly dispersed throughout with no visible dry pockets or clumps of cinnamon. Taste the base: it should be intensely flavored — slightly sweeter and more aromatic than you'd expect in a finished ice cream, because freezing dulls flavors slightly." },
      { step: 3, text: "Cover the bowl tightly with plastic wrap and refrigerate for at least 2 hours until the mixture is thoroughly cold — below 40°F. A properly chilled base churns faster, which creates smaller ice crystals and a creamier, smoother finished texture. A warm or room-temperature base produces a coarse, icy result." },
      { step: 4, text: "Pour the chilled mixture into a pre-frozen ice cream maker bowl and churn according to the manufacturer's instructions — typically 20–30 minutes. The ice cream is done churning when it looks thick, pale, and holds defined ribbon swirls when you drag a spoon through it. It will feel like very soft-serve at this point." },
      { step: 5, text: "Transfer the churned ice cream to a chilled, freezer-safe container and smooth the surface. Press a piece of plastic wrap directly onto the surface to prevent ice crystals from forming. Freeze for at least 4 hours until firm enough to scoop. Let it stand at room temperature for 5 minutes before scooping if it feels too hard." },
      { step: 6, text: "Serve in chilled bowls with a dusting of ground cinnamon on top. The ice cream should melt slowly and evenly on the tongue — if it feels icy or grainy, it was either not churned long enough or the base was not cold enough before churning." }
    ],chefNotes:"Using a concentrate prevents the ice cream from becoming icy and hard.",pairing:"Churro bites",mealSlots:["dessert"],healthy:false},
{slug:"mexican-chocolate-mochi",title:"Mexican Chocolate Mochi",subtitle:"Spiced cocoa in a chewy shell.",story:"A rich ganache spiked with cinnamon and cayenne, wrapped in a soft mochi dough. An intense, warming bite.",category:"Desserts",tags:["Vegetarian","Gluten-Free"],allergens:["dairy"],difficulty:"Advanced",prepTime:"40 min",cookTime:"5 min",servings:6,spiceLevel:1,umamiLevel:1,origin:"Mexico x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"cup",item:"mochiko"},{qty:"4",unit:"oz",item:"Mexican chocolate"},{qty:"1/4",unit:"cup",item:"cream"}],method:[
      { step: 1, text: "Break the 4 oz Mexican chocolate into pieces and place in a microwave-safe bowl. Add half of the 1/4 cup cream (about 2 tbsp). Microwave at 50% power for 60 seconds, then stir. If the chocolate has not fully melted, continue in 20-second bursts at 50% power, stirring between each. The finished ganache should be completely smooth, glossy, and deeply brown — no white cream streaks." },
      { step: 2, text: "Pour the ganache into a shallow dish, spread to about 1 inch depth, and refrigerate for 45 minutes until firm enough to scoop without collapsing. Using a small melon baller or two spoons, scoop 8 even portions, then roll each between your palms into a smooth ball. Freeze the ganache balls for 30 minutes until rock solid." },
      { step: 3, text: "Combine the 1 cup mochiko with the remaining 2 tbsp cream and 1/4 cup water in a large microwave-safe bowl. Microwave for 60 seconds at full power, stir thoroughly, then microwave in 30-second increments, stirring between each, until the dough is translucent, very hot, and pulls away from the bowl in a cohesive mass. It should be extremely sticky and stretchy." },
      { step: 4, text: "Dust your work surface generously with cornstarch. While the mochi dough is still warm — it will become unworkable as it cools — roll it to 1/8-inch thickness and cut 8 circles with a 3-inch round cutter. Work quickly; cover any circles not in use with a damp cloth." },
      { step: 5, text: "Place one frozen chocolate ball on each mochi circle, then stretch the dough up and over the chocolate, pinching the seam firmly shut. Roll gently between your palms until smooth and sealed with no cracks. Place seam-side down on a cornstarch-dusted plate and refrigerate for 30 minutes before serving." }
    ],chefNotes:"Keep your hands dusted with cornstarch; mochi dough is incredibly sticky.",pairing:"Espresso",mealSlots:["dessert"],healthy:false},
{slug:"piloncillo-matcha-creme-brulee",title:"Piloncillo Matcha Crème Brûlée",subtitle:"Earthy custard, raw sugar shell.",story:"The molasses notes of raw piloncillo sugar provide the perfect bruleed crust over a bitter, grassy matcha custard.",category:"Desserts",tags:["Vegetarian","Gluten-Free"],allergens:["dairy","egg"],difficulty:"Medium",prepTime:"15 min",cookTime:"35 min",servings:4,spiceLevel:0,umamiLevel:1,origin:"Mexico x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"2",unit:"cups",item:"heavy cream"},{qty:"1",unit:"tbsp",item:"matcha"},{qty:"4",unit:"",item:"egg yolks"},{qty:"1/4",unit:"cup",item:"grated piloncillo"}],method:[
      { step: 1, text: "Preheat the oven to 300°F (150°C). Set aside 2 tablespoons of the 1/4 cup grated piloncillo for the brûlée topping — keep these separate. In a large bowl, whisk the remaining piloncillo with the 4 egg yolks for 2 minutes until the mixture is pale, thick, and forms a ribbon when you lift the whisk." },
      { step: 2, text: "In a medium saucepan, heat the 2 cups heavy cream over medium-low heat to 170°F — just below simmering, with steam rising but no bubbles breaking the surface. Remove from heat and whisk in the 1 tbsp matcha for 60 seconds until the cream is uniformly bright green with no dry matcha clumps." },
      { step: 3, text: "Temper the hot cream into the egg yolk mixture: pour the hot matcha cream in a thin, steady stream into the yolks while whisking constantly and vigorously. Pouring too fast or failing to whisk will cook the eggs into scrambled flecks. The combined mixture should look smooth and uniformly green." },
      { step: 4, text: "Pour the custard through a fine-mesh sieve into a large measuring cup, then divide evenly among four 6-ounce ramekins. Place the ramekins in a 9-by-13-inch roasting pan, then pour hot tap water into the pan until it reaches halfway up the sides of the ramekins. Bake at 300°F for 35–40 minutes until the edges are set but the centers jiggle like loose Jell-O." },
      { step: 5, text: "Remove from the water bath and cool to room temperature, then refrigerate for at least 2 hours until completely cold and firmly set throughout. The custard must be cold before brûléeing or the heat from the torch will cook it through rather than just caramelizing the surface." },
      { step: 6, text: "When ready to serve, sprinkle the reserved 2 tablespoons of grated piloncillo in an even, thin layer over each custard. Using a kitchen torch, move the flame in small circles about 2 inches from the surface. Piloncillo caramelizes faster than white sugar due to its molasses content — keep the torch moving constantly and stop the moment the surface turns glassy and bubbles stop." }
    ],chefNotes:"Piloncillo burns faster than white sugar, so keep the torch moving constantly.",pairing:"Black tea",mealSlots:["dessert"],healthy:false},
{slug:"tamarind-mango-paleta",title:"Tamarind Mango Paleta",subtitle:"Sweet, sour, and frozen.",story:"A classic Mexican ice pop combining the tropical sweetness of mango with the tart, acidic punch of tamarind.",category:"Desserts",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"15 min",cookTime:"0 min",servings:6,spiceLevel:1,umamiLevel:1,origin:"Michoacán",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"2",unit:"cups",item:"mango chunks"},{qty:"1/4",unit:"cup",item:"tamarind paste"},{qty:"1",unit:"tbsp",item:"Tajín"}],method:[
      { step: 1, text: "Blend the 2 cups mango chunks in a blender on high for 60 seconds, scraping the sides once midway through. The puree should be completely smooth — no fibrous strands — and look a vivid, deep orange. Taste it: good mango puree is intensely sweet and floral. If your mango is bland, add a pinch of sugar and a squeeze of lime to amplify it." },
      { step: 2, text: "Add the 1/4 cup tamarind paste to the blender and pulse just 4–5 times — do not fully blend. You want dark tamarind swirls running through the orange mango, not a fully uniform brownish mixture. The contrast in color and flavor is part of what makes this paleta extraordinary." },
      { step: 3, text: "Pour the mixture into 6 popsicle molds, filling each to about 1/4 inch below the rim to allow for expansion during freezing. Tap each mold firmly on the counter 3–4 times to release any air bubbles. Insert popsicle sticks and hold them vertically for 30 seconds — they will stand on their own once the mixture begins to partially freeze." },
      { step: 4, text: "Freeze at 0°F for at least 6 hours — overnight is better. The paletas are fully frozen when the molds feel solid and rigid throughout with no soft spots when squeezed. Underfrozen paletas will collapse and slide off the stick the moment you unmold them." },
      { step: 5, text: "To unmold, run warm water over the outside of the molds for 15–20 seconds and pull the paleta gently out by its stick. Immediately sprinkle the 1 tbsp Tajín evenly over all surfaces of each paleta — the frozen surface will grip the Tajín immediately. Serve within a few minutes, as paletas melt quickly once unmolded." }
    ],chefNotes:"Do not fully blend the tamarind; the distinct swirls provide flavor contrast.",pairing:"Sparkling water",mealSlots:["snack","dessert"],healthy:true},
{slug:"miso-caramel-apple",title:"Miso Caramel Apple",subtitle:"A fall classic with umami.",story:"Dipping crisp tart apples into a miso-spiked caramel elevates the traditional fairground treat into a sophisticated dessert.",category:"Desserts",tags:["Vegetarian","Gluten-Free"],allergens:["dairy","soy"],difficulty:"Medium",prepTime:"15 min",cookTime:"15 min",servings:4,spiceLevel:0,umamiLevel:2,origin:"USA x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"4",unit:"",item:"Granny Smith apples"},{qty:"1",unit:"cup",item:"caramel candies"},{qty:"1",unit:"tbsp",item:"white miso"}],method:[
      { step: 1, text: "Wash the 4 Granny Smith apples under hot water while scrubbing their skins with a brush to remove the commercial wax coating — this invisible wax coating is what causes caramel to slide right off rather than adhering. Dry each apple completely with a clean towel; any surface moisture will cause the hot caramel to seize and crystallize rather than coat smoothly." },
      { step: 2, text: "Remove the stem from each apple and push a sturdy wooden skewer or lollipop stick firmly toward the core — it should penetrate at least 2 inches deep to support the weight of the caramel. Test each skewer by picking the apple up by it and shaking gently; the apple should not wobble." },
      { step: 3, text: "Melt the 1 cup caramel candies in a small, deep saucepan over low heat, stirring constantly for about 4 minutes until completely smooth. Add the 1 tbsp white miso paste and whisk for 30 seconds until the miso is fully incorporated. The caramel should look smooth, glossy, and slightly darker than before. Test the dipping consistency: when you lift the spoon, the caramel should fall in a slow, thick ribbon — not drip rapidly." },
      { step: 4, text: "Working quickly while the caramel is hot and fluid, dip each apple into the saucepan, submerging it and turning slowly until the entire apple is coated — including the bottom. Lift the apple out and hold it over the saucepan for 15 seconds, slowly rotating it so the dripping excess caramel redistributes evenly rather than pooling at the base." },
      { step: 5, text: "Set each coated apple on a parchment-lined baking sheet at room temperature for at least 30 minutes. Do not refrigerate — cold will make the caramel brittle and it will crack when bitten. The caramel is ready to eat when it feels firm to a gentle press and no longer looks shiny — it should have a dull, satiny finish." }
    ],chefNotes:"If the apples are waxy, the caramel will slide off. Scrub them in hot water first.",pairing:"Hot cider",mealSlots:["dessert","snack"],healthy:false},
{slug:"chamoy-lime-cheesecake",title:"Chamoy Lime Cheesecake",subtitle:"Tart, creamy, and violently red.",story:"A no-bake lime cheesecake base gets a vibrant, spicy-sweet topping of chamoy reduction. A stunning visual and flavor contrast.",category:"Desserts",tags:["Vegetarian"],allergens:["dairy","gluten"],difficulty:"Easy",prepTime:"20 min",cookTime:"0 min",servings:8,spiceLevel:1,umamiLevel:1,origin:"Mexico x USA",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"2",unit:"blocks",item:"cream cheese"},{qty:"1/4",unit:"cup",item:"lime juice"},{qty:"1",unit:"cup",item:"graham cracker crumbs"},{qty:"1/4",unit:"cup",item:"chamoy"}],method:[
      { step: 1, text: "Mix the 1 cup graham cracker crumbs with 4 tablespoons of melted butter until the mixture resembles wet sand and holds together when you press it between two fingers. Press it firmly and evenly into the bottom of a 9-inch pie pan using the flat bottom of a measuring cup, applying firm, even pressure to create a dense, compact crust with no gaps or thin spots." },
      { step: 2, text: "Let both 8 oz blocks of cream cheese come to room temperature for at least 1 hour — they must be genuinely soft. Beat the softened cream cheese with a hand mixer for 2 minutes until completely smooth and fluffy, then add the 1/4 cup lime juice and beat for another 60 seconds. The lime juice will slightly loosen the mixture and add a bright citrus tang that balances the cream cheese's richness." },
      { step: 3, text: "Pour the cream cheese mixture over the graham cracker crust and smooth the surface with an offset spatula, spreading it evenly to the edges. Refrigerate the 9-inch pie pan for at least 4 hours until the filling is completely firm — it should not jiggle when you shake the pan and should feel solid, not soft, when you press the center gently." },
      { step: 4, text: "When ready to serve, pour the 1/4 cup chamoy into a small saucepan and simmer over medium-low heat for 5–8 minutes, stirring constantly. The chamoy is ready when it coats the back of a spoon and a trail drawn through it with your finger holds for 2 seconds. Remove from heat and cool for 5 minutes — it should be pourable but thick." },
      { step: 5, text: "Drizzle the reduced chamoy over the chilled cheesecake in bold, sweeping stripes or spirals. The vivid red-orange chamoy against the white cheesecake creates a dramatic visual contrast. Slice with a warm, dry knife and wipe the blade between cuts for the cleanest presentation." }
    ],chefNotes:"Ensure the cream cheese is at room temperature before beating to avoid lumps.",pairing:"Margarita",mealSlots:["dessert"],healthy:false},
{slug:"horchata-matcha-cake",title:"Horchata Matcha Layer Cake",subtitle:"Alternating sponges of flavor.",story:"Layers of cinnamon horchata sponge cake alternate with layers of vibrant green matcha sponge, bound by cream cheese frosting.",category:"Desserts",tags:["Vegetarian"],allergens:["dairy","gluten","egg"],difficulty:"Advanced",prepTime:"30 min",cookTime:"35 min",servings:8,spiceLevel:0,umamiLevel:1,origin:"Mexico x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"batch",item:"vanilla cake batter"},{qty:"1",unit:"tbsp",item:"matcha"},{qty:"2",unit:"tsp",item:"cinnamon"},{qty:"2",unit:"cups",item:"frosting"}],method:[
      { step: 1, text: "Prepare the 1 batch vanilla cake batter according to your base recipe, then immediately divide it into two equal portions using a kitchen scale for precision — visual estimation will produce unequal layers that affect the final look of the cake. Place each portion in a separate large bowl." },
      { step: 2, text: "Sift the 1 tbsp matcha into one bowl and the 2 tsp cinnamon into the other. Fold each flavoring into its respective batter with a spatula using broad, gentle strokes — about 12–15 folds each. The matcha batter should be uniformly pale green with no dry pockets; the cinnamon batter should be pale tan and fragrant. Do not overfold, which would deflate the batter." },
      { step: 3, text: "Grease and flour two 8-inch round cake pans. Pour one batter into each pan and smooth the surfaces. Bake at 350°F for 25–30 minutes. Do not open the oven in the first 20 minutes — early opening causes cakes to sink in the center. Test with a toothpick: it should come out with just one or two moist crumbs, not wet batter." },
      { step: 4, text: "Cool the cakes in their pans on a wire rack for 10 minutes, then invert and cool completely for at least 1 hour. Do not frost a warm cake — the frosting will melt and slide. Use a long serrated knife to slice off the domed tops of each layer, creating perfectly flat surfaces that will stack cleanly and look professional." },
      { step: 5, text: "Place the cinnamon layer on a cake board and spread 1 cup of the 2 cups frosting evenly to the edges using an offset spatula. Set the matcha layer on top, pressing gently. Apply the remaining frosting to the top and sides, working with long, even strokes. The finished cake should show the green and tan layers dramatically when cut." }
    ],chefNotes:"Use gel food coloring if you want the green layer to be neon, though natural matcha is preferred.",pairing:"Cold milk",mealSlots:["dessert"],healthy:false},
{slug:"matcha-alfajores",title:"Matcha Alfajores",subtitle:"Crumbly cookies, dulce de leche.",story:"Traditional South American cornstarch cookies infused with matcha, sandwiching a thick layer of dulce de leche.",category:"Desserts",tags:["Vegetarian"],allergens:["dairy","gluten","egg"],difficulty:"Medium",prepTime:"20 min",cookTime:"12 min",servings:12,spiceLevel:0,umamiLevel:1,origin:"Argentina x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"cup",item:"cornstarch"},{qty:"1",unit:"cup",item:"flour"},{qty:"1",unit:"tbsp",item:"matcha"},{qty:"1/2",unit:"cup",item:"dulce de leche"}],method:[
      { step: 1, text: "Sift the 1 cup cornstarch, 1 cup flour, and 1 tbsp matcha together through a fine-mesh sieve into a large bowl. Sifting is critical for alfajores: clumps of cornstarch create dense, hard spots in the finished cookie, and unsifted matcha creates dark green specks rather than a uniform green hue. Whisk the sifted mixture for 10 seconds to ensure everything is evenly distributed." },
      { step: 2, text: "Work in softened butter (per your base recipe) and egg yolks until the dough just comes together — it should look crumbly at first, then cohere when pressed firmly between your palms. The cornstarch-heavy dough is very fragile: if you overwork it, the gluten in the flour will tighten and the cookies will be tough rather than melt-in-your-mouth tender." },
      { step: 3, text: "On a lightly floured surface, gently roll the dough to 1/4-inch thickness. Use a 2-inch round cutter to cut circles, pressing straight down without twisting — twisting seals the edges and prevents clean spreading. Gather and re-roll scraps once, handling as gently as possible. Place circles on parchment-lined baking sheets." },
      { step: 4, text: "Bake at 350°F for 10–12 minutes. The cookies should be pale — they should show almost no color change except very faint golden-tan at the edges. They will look underdone when you remove them, which is correct. Overbaked alfajores become hard and lose their crumbly, delicate texture." },
      { step: 5, text: "Cool completely on the pan — at least 20 minutes — before attempting to handle them. They are extremely fragile when warm. Once fully cooled, spread a generous teaspoon of the 1/2 cup dulce de leche on the flat side of one cookie, then press a second cookie on top, flat-side down. The filling should reach the edges without squeezing out." }
    ],chefNotes:"The high cornstarch content makes the dough fragile. Handle gently.",pairing:"Coffee",mealSlots:["dessert","snack"],healthy:false},
{slug:"miso-brownies",title:"Miso Brownies",subtitle:"Fudgy, salty dark chocolate.",story:"White miso replaces salt in this dense, fudgy brownie recipe, heightening the dark chocolate and providing a chewy, satisfying edge.",category:"Desserts",tags:["Vegetarian"],allergens:["dairy","gluten","egg","soy"],difficulty:"Easy",prepTime:"15 min",cookTime:"25 min",servings:9,spiceLevel:0,umamiLevel:2,origin:"USA x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"cup",item:"dark chocolate"},{qty:"1/2",unit:"cup",item:"butter"},{qty:"2",unit:"tbsp",item:"white miso"},{qty:"3",unit:"",item:"eggs"}],method:[
      { step: 1, text: "Preheat the oven to 350°F (175°C) and line an 8-inch square baking pan with parchment, leaving an overhang on two sides. Chop or break the 1 cup dark chocolate into pieces no larger than 1/2 inch — smaller pieces melt more evenly and reduce the risk of scorching. Combine the chocolate with the 1/2 cup butter in a heatproof bowl set over a saucepan of barely simmering water, ensuring the bowl does not touch the water." },
      { step: 2, text: "Stir the chocolate and butter gently as they melt — about 3–4 minutes — until the mixture is completely smooth, glossy, and liquid. Remove from the double boiler and let it cool for 5 minutes. A too-hot mixture will scramble the eggs when they're added in the next step." },
      { step: 3, text: "Whisk the 2 tbsp white miso paste into the melted chocolate mixture for 30 seconds until completely incorporated. The miso will briefly make the mixture look broken or grainy — keep whisking and it will smooth out into a unified, glossy mass that smells deeply of chocolate with a subtle fermented undertone." },
      { step: 4, text: "Add the 3 eggs one at a time, whisking vigorously after each addition until fully combined before adding the next. The batter will look lumpy and separated after the first egg, then smooth and glossy by the third. Beat for a full 60 seconds after the final egg to incorporate air, which gives the brownies their characteristic crinkled top." },
      { step: 5, text: "Fold in the flour (per your base recipe) and any additional ingredients with a rubber spatula — just until no dry streaks remain. Pour the batter into the prepared pan and smooth the surface. Bake for 25 minutes. The edges should look completely set and the center should look just barely underdone and glossy — not wet, but not fully matte." }
    ],chefNotes:"Underbake these slightly; they will set as they cool in the pan.",pairing:"Red wine",mealSlots:["dessert"],healthy:false},
{slug:"tamarind-gummy-candy",title:"Tamarind Gummy Candy",subtitle:"Chewy, sour, chili-dusted.",story:"Making homemade gummies with concentrated tamarind paste yields an incredibly sour, chewy candy heavily coated in chili powder.",category:"Desserts",tags:["Dairy-Free","Gluten-Free"],allergens:[],difficulty:"Medium",prepTime:"15 min",cookTime:"10 min",servings:8,spiceLevel:1,umamiLevel:1,origin:"Mexico",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1/2",unit:"cup",item:"tamarind paste"},{qty:"3",unit:"tbsp",item:"gelatin"},{qty:"1",unit:"cup",item:"sugar"},{qty:"1",unit:"tbsp",item:"Tajín"}],method:[
      { step: 1, text: "Pour the 1/2 cup tamarind paste into a small saucepan. Sprinkle the 3 tbsp gelatin evenly over the surface and let it stand undisturbed for 5 minutes — this blooming step is mandatory. The gelatin granules will visibly absorb the tamarind's moisture and swell. Properly bloomed gelatin dissolves cleanly and produces smooth, bouncy gummies; unbloomed gelatin creates rubbery, lumpy candies." },
      { step: 2, text: "Add the 1 cup sugar to the saucepan and place over medium heat. Stir constantly with a heatproof spatula as the mixture heats — the sugar will begin dissolving into the tamarind while the gelatin blooms further. The mixture will look granular at first, then progressively smoother as the sugar melts." },
      { step: 3, text: "Continue heating and stirring for 2–3 minutes until the mixture reaches a gentle boil and the gelatin has completely dissolved. You can test this by lifting the spatula — there should be no visible granules on its surface. The mixture should look smooth, dark brown, and fluid." },
      { step: 4, text: "Remove from heat immediately and pour into silicone gummy molds or a lightly greased square container, working quickly before the gelatin begins to set. If using a container, the gummies will be cut into squares after setting. Refrigerate for at least 2 hours until completely firm and springy to the touch." },
      { step: 5, text: "Unmold the gummies and place them in a bowl with the 1 tbsp Tajín. Toss gently until every piece is evenly coated in the red-orange seasoning. The Tajín should cling to the slightly sticky gummy surface. Store in an airtight container in the refrigerator — these gummies will melt in warm temperatures above 75°F." }
    ],chefNotes:"These gummies will melt in extreme heat, so keep them refrigerated.",pairing:"Agua fresca",mealSlots:["snack"],healthy:true},
{slug:"coconut-matcha-rice-pudding",title:"Coconut Matcha Rice Pudding",subtitle:"Creamy, green, comforting.",story:"Cooking short-grain rice in coconut milk creates a luscious pudding. Whisking in matcha adds a vibrant color and earthy finish.",category:"Desserts",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"5 min",cookTime:"30 min",servings:4,spiceLevel:0,umamiLevel:1,origin:"Asia",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"cup",item:"sushi rice"},{qty:"2",unit:"cans",item:"coconut milk"},{qty:"1",unit:"tbsp",item:"matcha"},{qty:"1/2",unit:"cup",item:"sugar"}],method:[
      { step: 1, text: "Place the 1 cup sushi rice in a fine-mesh sieve and rinse under cold running water, swirling with your hand, until the water runs nearly clear — about 60 seconds. This removes excess surface starch that would make the pudding gluey rather than creamy. Drain thoroughly and let the rice drip dry for 1 minute." },
      { step: 2, text: "Combine the rinsed sushi rice and both cans of coconut milk in a heavy-bottomed 3-quart saucepan. Give it one initial stir to prevent the rice from clumping, then place over medium heat. Bring to a gentle simmer — small bubbles breaking the surface, not a rolling boil, which would scorch the bottom." },
      { step: 3, text: "Reduce the heat to low and cook for 25 minutes total, stirring thoroughly every 3–4 minutes by scraping all the way across the bottom of the pot. The starch from the sushi rice will thicken the coconut milk gradually — if you stop stirring for more than a few minutes, the bottom layer will scorch and the entire pot will taste burnt." },
      { step: 4, text: "When the rice is tender and the pudding has thickened to the consistency of a loose porridge — where a spoon dragged through it leaves a trail that slowly closes — add the 1/2 cup sugar. Stir for 2 minutes until completely dissolved and the pudding has tightened slightly from the added sweetness." },
      { step: 5, text: "Remove from heat and whisk in the 1 tbsp matcha, working quickly for 60 seconds to prevent green clumps from forming in the cooling pudding. The pudding should turn uniformly pale green. It can be served immediately as a warm, flowing porridge or chilled for 2 hours to set into a firmer, scoopable consistency." },
      { step: 6, text: "Taste the finished pudding and adjust sweetness if needed — coconut milk's natural sweetness varies between brands. Serve warm or cold with a light dusting of matcha on top and, if desired, a drizzle of coconut cream for added richness." }
    ],chefNotes:"Stir frequently while simmering to prevent the rice from scorching on the bottom.",pairing:"Hot tea",mealSlots:["dessert"],healthy:true}
,
{slug:"horchata-matcha-latte",title:"Horchata Matcha Latte",subtitle:"Earthy, creamy, spiced iced drink.",story:"The rich, cinnamon-laced sweetness of horchata forms the base, while a potent shot of whisked matcha floats on top.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:1,origin:"Oaxaca x Kyoto",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"1",unit:"cup",item:"horchata"},{qty:"1",unit:"tsp",item:"matcha"},{qty:"1",unit:"cup",item:"ice"}],method:[
      { step: 1, text: "In a small bowl, whisk the 1 tsp matcha with 2 tablespoons of warm (not hot) water for 45 seconds until the matcha is completely dissolved and the mixture looks smooth, bright green, and lightly frothy. Warm water dissolves matcha faster and more evenly than cold — cold water will leave grainy clumps that sink to the bottom of your latte." },
      { step: 2, text: "Fill a tall 16-oz glass with the 1 cup ice, leaving about 1 inch of space below the rim. The glass should be cold — if it's warm from the dishwasher, rinse it under cold water and dry it first." },
      { step: 3, text: "Pour the 1 cup chilled horchata over the ice in a slow, steady stream, filling the glass about three-quarters full. The horchata should look pale ivory and slightly opaque from the rice and cinnamon." },
      { step: 4, text: "Slowly pour the dissolved matcha mixture over the back of a spoon held just above the horchata surface — this technique slows the pour and creates a distinct green layer that floats on top of the horchata rather than mixing in immediately. You should see a clear visual division between the cream-white horchata and the vivid green matcha." },
      { step: 5, text: "Serve immediately with a straw and stir before drinking — the layers will mix as you sip, creating a beautiful gradient of green into cream. If you prefer a uniform drink, stir before serving until the entire glass is uniformly celadon green." }
    ],chefNotes:"Pouring the matcha directly over an ice cube helps maintain the visual layers.",pairing:"Churros",mealSlots:["snack","breakfast"],healthy:true},
{slug:"jalapeno-margarita-yuzu",title:"Jalapeño Margarita",subtitle:"Spicy citrus refreshment.",story:"Replacing hard-to-find yuzu with a mix of lime and grapefruit zest mimics its floral aroma perfectly. Jalapeño adds a sharp bite.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:2,umamiLevel:1,origin:"Mexico x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"tequila"},{qty:"1",unit:"oz",item:"lime juice"},{qty:"3",unit:"slices",item:"jalapeño"},{qty:"1",unit:"pinch",item:"grapefruit zest"}],method:[
      { step: 1, text: "Chill a large rocks glass and a cocktail shaker in the freezer for 5–10 minutes. A cold shaker chills the drink faster, requiring less ice and less dilution. While the glasses chill, measure out the 2 oz tequila, 1 oz fresh lime juice, and have the 3 jalapeño slices and 1 pinch grapefruit zest ready." },
      { step: 2, text: "Add the 3 slices of jalapeño to the chilled shaker and press down firmly with a muddler for about 20 seconds. You want to release the jalapeño's juice and oils without completely obliterating the flesh — pressed but not mashed. You will see the translucent jalapeño juice pooling in the bottom of the shaker." },
      { step: 3, text: "Add the 2 oz tequila, 1 oz fresh lime juice, and 1 pinch grapefruit zest to the shaker over the muddled jalapeño. The grapefruit zest mimics yuzu's floral, citrus quality — rub it between your fingers before adding to release its aromatic oils." },
      { step: 4, text: "Fill the shaker with ice cubes and seal it firmly. Shake vigorously for 15 full seconds — count them out loud. The outside of the shaker should feel uncomfortably cold and frosted when you're done. The drink should be well-chilled and slightly diluted by the melted ice." },
      { step: 5, text: "Double-strain the cocktail through a hawthorne strainer and a fine-mesh sieve into the chilled rocks glass over fresh ice. Double-straining removes the jalapeño pulp and ice chips, leaving a clear, vivid drink. Taste: it should hit with citrus first, then build to a lingering, clean jalapeño heat over 5–10 seconds." }
    ],chefNotes:"Remove jalapeño seeds before muddling if you prefer a milder drink.",pairing:"Chips and salsa",mealSlots:["snack","dinner"],healthy:true},
{slug:"tamarind-agua-fresca",title:"Tamarind Agua Fresca",subtitle:"Tart, deeply refreshing.",story:"Boiling raw tamarind pods extracts their intense, sour flavor. Diluted with water and sweetened, it is the ultimate thirst quencher.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Medium",prepTime:"10 min",cookTime:"20 min",servings:4,spiceLevel:0,umamiLevel:1,origin:"Mexico",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"10",unit:"",item:"tamarind pods"},{qty:"4",unit:"cups",item:"water"},{qty:"1/4",unit:"cup",item:"sugar"}],method:[
      { step: 1, text: "Crack the hard brown shells of the 10 tamarind pods by pressing them firmly between your palms or against a cutting board. Peel away and discard all the shell fragments, then remove and discard the stringy fibers running along each pod. Keep the sticky, dark brown pulp — this is the flavor." },
      { step: 2, text: "Place the cleaned tamarind pulp and the 4 cups water in a medium saucepan. Bring to a boil over high heat, then reduce to a vigorous simmer. Cook for 15 minutes, pressing the softening pods with the back of a spoon every few minutes to help them release their pulp into the water. The water will turn a deep brown-amber color." },
      { step: 3, text: "Cool the mixture for 10 minutes until safe to handle. Pour it through a fine-mesh sieve set over a large bowl, pressing firmly and repeatedly with the back of a spoon for 2–3 minutes to force as much pulp through as possible. Only seeds and coarse fiber should remain in the strainer — discard them." },
      { step: 4, text: "Stir the 1/4 cup sugar into the still-warm strained liquid for 60 seconds until completely dissolved. Hot liquid dissolves sugar far faster than cold. Taste the agua fresca: it should be intensely tart with a deep, complex sourness. Add more sugar one tablespoon at a time until it suits your preference." },
      { step: 5, text: "Chill the tamarind drink in the refrigerator for at least 1 hour until completely cold. Stir before serving — the dense tamarind pulp will settle slightly to the bottom. Serve over ice in tall glasses with a lime wedge on the rim." }
    ],chefNotes:"Using whole pods provides a brighter flavor than pre-made concentrate.",pairing:"Tacos",mealSlots:["lunch","dinner"],healthy:true},
{slug:"matcha-arnold-palmer",title:"Matcha Arnold Palmer",subtitle:"Green tea and lemonade.",story:"Replacing traditional black tea with iced matcha brings a grassy, vibrant green contrast to the tart, sweet lemonade.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:1,origin:"USA x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"1/2",unit:"cup",item:"lemonade"},{qty:"1/2",unit:"cup",item:"iced matcha"},{qty:"1",unit:"cup",item:"ice"}],method:[
      { step: 1, text: "Prepare the iced matcha by whisking 1 tsp matcha powder with 2 tbsp warm water until completely smooth and bright green, then topping with cold water to reach the 1/2 cup measure. Using freshly squeezed lemonade makes a dramatic difference in this drink — the brightness of real citrus versus bottled concentrate is immediately apparent." },
      { step: 2, text: "Fill a 16-oz tall glass with the 1 cup ice, packing it in firmly so the ice reaches the rim. A glass full of ice chills the drinks faster and maintains the cold temperature longer than a glass with sparse ice." },
      { step: 3, text: "Pour the 1/2 cup lemonade over the ice, filling the glass exactly halfway. The lemonade will settle to the bottom because it is slightly denser than the matcha." },
      { step: 4, text: "Slowly pour the 1/2 cup iced matcha over the lemonade by holding the glass at a 45-degree angle and pouring down the inside wall — this technique allows the two liquids to meet gradually and maintain distinct layers rather than splashing together and immediately mixing." },
      { step: 5, text: "Hold the glass still and observe the layering: you should see a clear separation between the pale yellow lemonade on the bottom and the vivid green matcha on top, with a gradient zone where they meet. Serve immediately with a straw — stir before drinking for a fully blended flavor, or drink in distinct sips to experience each layer separately." }
    ],chefNotes:"Freshly squeezed lemonade makes a massive difference here.",pairing:"Sandwich",mealSlots:["lunch"],healthy:true},
{slug:"chamoy-michelada",title:"Chamoy Michelada",subtitle:"Salty, spicy beer cocktail.",story:"Coating the rim of a cold glass in chamoy and Tajín before pouring in a lime-spiked Mexican lager creates a savory, thirst-quenching masterpiece.",category:"Drinks",tags:["Dairy-Free"],allergens:["gluten","soy"],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:1,umamiLevel:2,origin:"Mexico",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"1",unit:"bottle",item:"Mexican lager"},{qty:"1",unit:"oz",item:"lime juice"},{qty:"2",unit:"tbsp",item:"chamoy"},{qty:"1",unit:"tbsp",item:"Tajín"}],method:[
      { step: 1, text: "Refrigerate the 1 bottle of Mexican lager for at least 2 hours until genuinely ice-cold — not just cool, but so cold that condensation forms on the bottle immediately upon removal from the fridge. A warm michelada poured over ice becomes watery; an ice-cold one stays flavorful throughout the entire drink." },
      { step: 2, text: "Pour the 2 tbsp chamoy onto a small flat plate. Invert a large pint glass and press the rim firmly into the chamoy, rotating it in a slow circle to coat the outer lip evenly. Lift and inspect — the chamoy coating should be visible all the way around with no bare patches." },
      { step: 3, text: "Immediately press the chamoy-coated rim into the 1 tbsp Tajín spread on a separate small plate, again rotating in a slow circle. The Tajín should adhere to the sticky chamoy and form a complete, densely-coated crust around the entire rim. This is the most important part of a michelada's presentation." },
      { step: 4, text: "Pour the 1 oz lime juice into the prepared glass, keeping it inside and below the decorated rim. Tilt the glass to swirl the lime juice around the bottom." },
      { step: 5, text: "Slowly pour the ice-cold 1 bottle Mexican lager down the inside wall of the tilted glass to minimize foam. As the lager meets the lime juice, they will combine naturally. Pause if the foam rises to within an inch of the rim and wait for it to settle before continuing to pour." },
      { step: 6, text: "Serve immediately without adding ice — ice will dilute the carefully balanced flavors. The drink should look vivid orange-red from the chamoy at the top, transitioning to pale golden lager. Sip through the Tajín-chamoy rim for the full flavor experience." }
    ],chefNotes:"Do not add ice; simply use the coldest beer possible.",pairing:"Ceviche",mealSlots:["lunch","dinner"],healthy:false},
{slug:"mezcal-hibiscus-tonic",title:"Mezcal Hibiscus Tonic",subtitle:"Smoky and floral.",story:"The deep smoke of artisanal mezcal pairs beautifully with the tart, floral notes of brewed hibiscus tea. Tonic water adds bubbles and bitter quinine.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:1,origin:"Oaxaca",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"mezcal"},{qty:"1",unit:"oz",item:"hibiscus tea"},{qty:"3",unit:"oz",item:"tonic water"}],method:[
      { step: 1, text: "Brew the hibiscus tea by steeping 1 tablespoon of dried hibiscus flowers in 2 oz of just-boiled water for 5 minutes, then strain and cool completely. The resulting tea should be a deep, translucent ruby-red. Chill for at least 30 minutes until completely cold — warm hibiscus tea will melt the ice immediately and dilute the drink." },
      { step: 2, text: "Fill a chilled highball glass with large ice cubes — large cubes melt slower and dilute the drink less than small cubes or crushed ice. A chilled glass keeps the mezcal cold longer, which is important since mezcal's smoke and complexity are most pronounced when served very cold." },
      { step: 3, text: "Pour the 2 oz mezcal over the ice in a steady stream. The mezcal should smell smoky and complex — that smokiness is the defining character of this cocktail and will balance the hibiscus's floral tartness." },
      { step: 4, text: "Add the 1 oz cold hibiscus tea, pouring it gently over the mezcal. The two liquids will briefly layer — smoky pale mezcal beneath vivid ruby hibiscus — before combining into a translucent crimson drink." },
      { step: 5, text: "Slowly pour the 3 oz tonic water down the inside wall of the glass to preserve the carbonation. Stir once, gently, with a bar spoon using a slow circular motion — just enough to combine without knocking out the bubbles. Serve immediately while the tonic is still visibly effervescent." }
    ],chefNotes:"A high-quality tonic water is essential, as cheap ones are too sweet.",pairing:"Guacamole",mealSlots:["dinner"],healthy:true},
{slug:"agua-fresca-watermelon-shiso",title:"Watermelon Shiso Agua Fresca",subtitle:"Sweet melon with herbal mint notes.",story:"Watermelon agua fresca is ubiquitous. Blending in fresh shiso leaves adds a complex, minty-basil aroma that elevates the drink.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"10 min",cookTime:"0 min",servings:4,spiceLevel:0,umamiLevel:1,origin:"Mexico x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"4",unit:"cups",item:"watermelon chunks"},{qty:"4",unit:"leaves",item:"shiso"},{qty:"1",unit:"tbsp",item:"lime juice"}],method:[
      { step: 1, text: "Pick through the 4 cups watermelon chunks and remove every seed you can find — a stray seed in the blender will puree into bitter flecks that affect the drink's clean flavor. If using seedless watermelon, give it a quick visual inspection anyway. Break the watermelon into blender-sized pieces." },
      { step: 2, text: "Add the 4 shiso leaves, 1 tbsp lime juice, and the seeded watermelon to a blender. Do not add water — the watermelon contains enough liquid on its own and diluting it will make the agua fresca taste thin and bland. Shiso has a unique flavor profile: mintier than basil, more herbal than mint. If you can't find it, use 2 mint leaves and 2 basil leaves as a substitute." },
      { step: 3, text: "Blend on high for 30–45 seconds until completely liquid with no visible chunks. The mixture should look vivid pink-red with faint green flecks from the shiso." },
      { step: 4, text: "Pour the blended mixture through a fine-mesh sieve set over a large pitcher, pressing with the back of a spoon to extract as much liquid as possible. Discard the fibrous pulp remaining in the sieve. The strained liquid should look clear, jewel-bright pink-red." },
      { step: 5, text: "Taste the agua fresca — it should be sweet, bright, and floral, with a clean shiso finish. If it needs more brightness, add a few more drops of lime juice. Serve immediately over ice in tall glasses or chill for up to 4 hours, stirring before serving as separation is natural." }
    ],chefNotes:"If you cannot find shiso, a mix of fresh mint and basil mimics it well.",pairing:"Spicy tacos",mealSlots:["lunch"],healthy:true},
{slug:"miso-whiskey-sour",title:"Miso Whiskey Sour",subtitle:"A classic cocktail with savory depth.",story:"Dissolving a tiny amount of white miso into simple syrup creates a savory backbone that perfectly complements the oak of bourbon.",category:"Drinks",tags:["Dairy-Free","Gluten-Free"],allergens:["soy"],difficulty:"Medium",prepTime:"10 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:2,origin:"USA x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"bourbon"},{qty:"1",unit:"oz",item:"lemon juice"},{qty:"1/2",unit:"oz",item:"miso simple syrup"},{qty:"1",unit:"",item:"egg white"}],method:[
      { step: 1, text: "To make the miso simple syrup: whisk 1/2 tsp white miso paste into 1 oz warm simple syrup until completely dissolved and no beige streaks remain. The miso will provide a subtle savory underpinning that balances the bourbon's sweetness without being identifiable as miso to most drinkers." },
      { step: 2, text: "Add the 2 oz bourbon, 1 oz fresh lemon juice, 1/2 oz miso simple syrup, and 1 egg white to a cocktail shaker. Do not add ice yet — this is the dry shake, which emulsifies the egg white." },
      { step: 3, text: "Seal the shaker tightly and shake vigorously without ice for a full 15–20 seconds. You will hear the liquid moving inside but no ice rattling. This dry shake beats the egg white into a foam — the proteins unfurl and create a thick, stable foam that defines the cocktail's texture. This step is mandatory; skipping it results in a thin, frothy drink instead of a silky, meringue-like one." },
      { step: 4, text: "Open the shaker, add a generous handful of ice cubes, seal again, and shake vigorously for another 15 seconds. The outside of the shaker should be extremely cold and frosted. This second shake chills and dilutes the cocktail to the correct drinking strength and temperature." },
      { step: 5, text: "Double-strain the cocktail through a hawthorne strainer and a fine-mesh sieve into a chilled coupe glass — no ice in the glass. The foam should rise on top of the drink in a thick, stable white layer. The finished cocktail should look pale golden beneath a pristine white foam. Garnish with a few drops of Angostura bitters on the foam surface." }
    ],chefNotes:"The dry shake is mandatory for a thick, luxurious foam.",pairing:"Pork skewers",mealSlots:["dinner"],healthy:false},
{slug:"tajin-bloody-mary-miso",title:"Tajín Bloody Mary",subtitle:"Spicy tomato with umami punch.",story:"Upgrading a bloody mary by using Tajín on the rim and a dash of miso in the tomato juice creates the ultimate savory brunch cocktail.",category:"Drinks",tags:["Dairy-Free"],allergens:["soy"],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:2,umamiLevel:3,origin:"Mexico x USA",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"vodka"},{qty:"4",unit:"oz",item:"tomato juice"},{qty:"1",unit:"tsp",item:"white miso"},{qty:"1",unit:"tbsp",item:"Tajín"}],method:[
      { step: 1, text: "Coat the rim of a tall glass with the 1 tbsp Tajín by running a lime wedge around the lip and then pressing it into a flat plate of Tajín, rotating to coat evenly. The Tajín rim is the first thing drinkers taste and provides the initial hit of lime-chili flavor before the savory tomato even touches the palate." },
      { step: 2, text: "In a separate small bowl, whisk the 1 tsp white miso paste with 1 tablespoon of the tomato juice for 30 seconds until completely smooth. The miso replaces Worcestershire sauce in this recipe, providing the same deep, savory backbone but with a cleaner, less fishy umami quality." },
      { step: 3, text: "Combine the dissolved miso mixture with the remaining 4 oz tomato juice in a mixing glass or shaker. Stir for 10 seconds until uniformly combined and the color looks evenly deep red throughout — no pale miso streaks." },
      { step: 4, text: "Add the 2 oz vodka to the tomato-miso base and stir for another 10 seconds. Add your preferred seasonings — hot sauce, horseradish, celery salt — tasting and adjusting as you go. The base should be intensely savory and well-seasoned before adding ice, as ice will dilute everything slightly." },
      { step: 5, text: "Pour the mixture over ice in the Tajín-rimmed glass, being careful not to disturb the rim coating. Garnish with a celery stalk, lime wedge, or pickled vegetables. Serve immediately — the ice will begin diluting the mix within a few minutes, so encourage your guest to drink it while cold and full-flavored." }
    ],chefNotes:"The miso replaces the traditional Worcestershire sauce, offering a cleaner umami.",pairing:"Eggs benedict",mealSlots:["breakfast","lunch"],healthy:true},
{slug:"horchata-cold-brew-float",title:"Horchata Cold Brew Float",subtitle:"Caffeine and cinnamon.",story:"Pouring intense, bitter cold brew coffee over a scoop of horchata ice cream creates a creamy, melting morning treat.",category:"Drinks",tags:["Vegetarian","Gluten-Free"],allergens:["dairy"],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:1,origin:"Mexico x USA",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"1",unit:"cup",item:"cold brew coffee"},{qty:"1",unit:"scoop",item:"horchata ice cream"}],method:[
      { step: 1, text: "Chill the 1 cup cold brew coffee in the refrigerator for at least 1 hour, or in the freezer for 15 minutes, until it is genuinely cold — not cool. Warm cold brew poured over ice cream will melt it instantly and turn the float into a watery mess rather than a beautiful two-component drink." },
      { step: 2, text: "Select a 10–12 ounce glass — it needs to be large enough to hold both the cold brew and the expanding ice cream without overflowing. Place the glass on a stable, flat surface where it will not be bumped." },
      { step: 3, text: "Scoop one generous, rounded portion of horchata ice cream and lower it into the center of the glass. The scoop should be rounded and tall — a flat, spread-out scoop will dissolve too quickly and fail to create the dramatic float effect." },
      { step: 4, text: "Pour the chilled 1 cup cold brew coffee slowly down the inside wall of the glass rather than directly over the ice cream — this slows the melting and creates a beautiful swirling of dark coffee around the pale ice cream scoop. Pour until the coffee reaches about 1 inch below the rim." },
      { step: 5, text: "Serve immediately with a long spoon and a straw. Watch the ice cream's surface — it should be visibly softening and melting into the cold brew, creating pale cinnamon-infused swirls throughout the dark coffee. This visual evolution happens quickly, so present it to the drinker within 30 seconds of pouring." }
    ],chefNotes:"Do not add ice, as it will dilute the melting cream.",pairing:"Pan dulce",mealSlots:["breakfast","snack"],healthy:false},
{slug:"matcha-mojito",title:"Matcha Mojito",subtitle:"Mint, lime, rum, and green tea.",story:"The grassy notes of matcha pair brilliantly with fresh mint and white rum, creating a vivid green, highly refreshing cocktail.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:1,origin:"Cuba x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"white rum"},{qty:"1",unit:"tsp",item:"matcha"},{qty:"1",unit:"oz",item:"lime juice"},{qty:"6",unit:"leaves",item:"mint"},{qty:"2",unit:"oz",item:"club soda"}],method:[
      { step: 1, text: "Place the 6 fresh mint leaves in a chilled 10-oz glass. Add the 1 oz lime juice and press the mint leaves gently with a muddler for 10 seconds — you want to bruise them to release their aromatic oils, not shred them into fragments. Shredded mint turns bitter and creates flecks throughout the drink. Properly muddled mint should smell intensely fragrant and remain mostly intact." },
      { step: 2, text: "In a separate small bowl, whisk the 1 tsp matcha with 1 tablespoon of warm water for 30 seconds until completely smooth and bright green with no dry flecks or lumps. Then stir in the 2 oz white rum until the matcha-rum mixture is uniformly green." },
      { step: 3, text: "Pour the matcha-rum mixture over the muddled mint and lime juice in the glass. Stir briefly with a bar spoon to combine the liquid and allow the matcha and lime to begin integrating." },
      { step: 4, text: "Fill the glass completely with ice — crushed ice is traditional for mojitos and creates the best texture and dilution, but large cubes work if that's what you have. Pack the ice in firmly so it rises above the rim of the glass." },
      { step: 5, text: "Pour the 2 oz club soda slowly over the ice in a thin stream down the inside of the glass, pausing once to let the foam settle. Stir once with a bar spoon using a long, slow circular motion. The cocktail should look vivid emerald green throughout with visible mint leaves suspended in the ice. Garnish with a mint sprig and lime wheel." }
    ],chefNotes:"Do not shred the mint when muddling; just press it to release the oils.",pairing:"Fish tacos",mealSlots:["dinner"],healthy:true},
{slug:"cucumber-jalapeno-seltzer",title:"Cucumber Jalapeño Seltzer",subtitle:"Crisp, cooling, with a bite.",story:"A mocktail that relies on the intense cooling power of cucumber water, punctuated by the sharp heat of fresh jalapeño.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"10 min",cookTime:"0 min",servings:1,spiceLevel:2,umamiLevel:1,origin:"Mexico",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"cucumber juice"},{qty:"2",unit:"slices",item:"jalapeño"},{qty:"4",unit:"oz",item:"sparkling water"}],method:[
      { step: 1, text: "Chill a 10-oz glass in the freezer for 10 minutes before starting. To make fresh cucumber juice: blend half a peeled cucumber with 3 oz water, then strain through a fine-mesh sieve. Fresh cucumber juice is dramatically more vibrant and cooling than the bottled variety — the difference is immediately apparent in the finished drink." },
      { step: 2, text: "Add the 2 slices of jalapeño to the chilled glass and press down with a muddler for 10 seconds. You want to release the jalapeño's heat-carrying juices without fully destroying the flesh — this is a light bruise, not a destruction. More seeds means more heat: leave them in for significant spice, remove them for a gentler warmth." },
      { step: 3, text: "Pour the 2 oz fresh cucumber juice over the muddled jalapeño. Tilt the glass and look: the cucumber juice should look clear and pale green, and the jalapeño pieces should be floating with their cut surfaces in contact with the liquid, releasing their heat into it." },
      { step: 4, text: "Add several large ice cubes to the glass — large cubes melt more slowly than small ones, keeping the drink cold and undiluted for longer. Fill the glass about three-quarters with ice." },
      { step: 5, text: "Pour the 4 oz sparkling water slowly down the inside wall of the glass over about 10 seconds, watching the carbonation rise through the green cucumber juice. Stir once gently for 3 seconds with a bar spoon. Serve immediately while the sparkling water is still actively fizzing and the jalapeño heat is just beginning to bloom." }
    ],chefNotes:"Leave the jalapeño seeds in for a much spicier drink.",pairing:"Chips and guacamole",mealSlots:["lunch","snack"],healthy:true},
{slug:"hibiscus-iced-tea-miso",title:"Hibiscus Iced Tea",subtitle:"Floral tea sweetened with miso honey.",story:"Agua de jamaica is famously tart. Sweetening it with honey that has been blended with white miso adds an addictive savory finish.",category:"Drinks",tags:["Vegetarian","Gluten-Free"],allergens:["soy"],difficulty:"Easy",prepTime:"5 min",cookTime:"15 min",servings:4,spiceLevel:0,umamiLevel:2,origin:"Mexico x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"1/2",unit:"cup",item:"dried hibiscus flowers"},{qty:"4",unit:"cups",item:"water"},{qty:"2",unit:"tbsp",item:"honey"},{qty:"1",unit:"tsp",item:"white miso"}],method:[
      { step: 1, text: "Combine the 1/2 cup dried hibiscus flowers and 4 cups water in a 2-quart saucepan. Bring to a boil over high heat, then reduce to a steady simmer. Cook for 15 minutes — the water will turn a deep, vivid ruby-red and smell strongly floral and tart. The longer you steep, the more intense and tart the tea becomes." },
      { step: 2, text: "Strain the tea through a fine-mesh sieve into a large pitcher, pressing the spent flowers with the back of a spoon to extract every drop of flavor. Discard the spent flowers. Let the tea cool for 5 minutes until it stops actively steaming but is still hot enough to dissolve the honey and miso." },
      { step: 3, text: "In a small bowl, whisk the 2 tbsp honey and 1 tsp white miso paste together for 45 seconds until the miso is completely dissolved into the honey — no lumps or streaks. The mixture should look uniformly amber and glossy." },
      { step: 4, text: "Add the honey-miso mixture to the still-warm tea and stir vigorously for 60 seconds. The warmth of the tea helps the honey and miso dissolve completely and integrate with the hibiscus — do not add them to cold tea, where they will pool at the bottom and be nearly impossible to dissolve." },
      { step: 5, text: "Cool the tea to room temperature, then refrigerate for at least 2 hours until completely chilled. Stir the cold tea before serving — the density of the hibiscus tea and the honey can cause slight settling. Serve over ice in tall glasses; the tea should taste simultaneously tart, floral, sweet, and subtly savory in a way that's hard to identify but impossible to stop drinking." }
    ],chefNotes:"The miso must be dissolved while the tea is still warm to prevent clumping.",pairing:"Chicken tinga",mealSlots:["lunch"],healthy:true},
{slug:"tamarind-paloma",title:"Tamarind Paloma",subtitle:"Grapefruit soda and sour tamarind.",story:"The classic Paloma uses grapefruit soda. Adding a spoonful of tamarind concentrate deepens the color and amps up the tartness dramatically.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:1,origin:"Mexico",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"tequila blanco"},{qty:"1",unit:"tbsp",item:"tamarind concentrate"},{qty:"4",unit:"oz",item:"grapefruit soda"},{qty:"1",unit:"pinch",item:"salt"}],method:[
      { step: 1, text: "In the bottom of a tall glass, stir together the 2 oz tequila blanco and 1 tbsp tamarind concentrate for 30 seconds using a bar spoon until completely combined and uniform in color. Tamarind concentrate is thick and dark — it takes sustained stirring to fully incorporate into the tequila." },
      { step: 2, text: "Add the 1 pinch of fine sea salt to the tequila-tamarind mixture and stir for another 10 seconds. Salt is a crucial and often-overlooked cocktail ingredient: it suppresses bitterness, amplifies sweetness, and dramatically brightens the tamarind's tartness." },
      { step: 3, text: "Fill the glass with ice — large cubes preferred. The tamarind-tequila mixture will coat the ice as you add it, turning the ice dark brown-amber." },
      { step: 4, text: "Slowly pour the 4 oz grapefruit soda (Mexican Squirt preferred) down the inside wall of the glass in a thin, steady stream to preserve as much carbonation as possible. Do not pour directly over the ice, which shatters the bubbles." },
      { step: 5, text: "Stir once, very gently, for about 3 seconds — just enough to combine the two layers without fully destroying the carbonation. Garnish with a slice of grapefruit or a wedge of lime. Taste: the drink should hit with grapefruit brightness, then follow with a deep, sour tamarind complexity, finishing with a clean tequila warmth." }
    ],chefNotes:"Use a Mexican grapefruit soda like Squirt for the most authentic flavor.",pairing:"Pork carnitas",mealSlots:["dinner"],healthy:true},
{slug:"matcha-lemonade",title:"Sparkling Matcha Lemonade",subtitle:"Bubbly, tart, and grassy.",story:"Combining fresh lemonade with sparkling water and a float of ceremonial matcha creates a visually stunning, highly refreshing afternoon drink.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:1,origin:"USA x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"lemon juice"},{qty:"1",unit:"oz",item:"simple syrup"},{qty:"1",unit:"tsp",item:"matcha"},{qty:"3",unit:"oz",item:"sparkling water"}],method:[
      { step: 1, text: "In a small bowl, whisk the 1 tsp matcha powder with 1 tablespoon of warm water for 45 seconds until completely smooth and bright green with absolutely no dry flecks or lumps. Properly dissolved matcha should look like a smooth, liquid paint — if you see any speckling, keep whisking. Then stir in the 2 oz lemon juice and 1 oz simple syrup until combined." },
      { step: 2, text: "Taste the base: it should be sweet-tart with a distinct grassy matcha note that lingers after the lemon fades. Adjust the lemon or syrup ratio if needed — these proportions are a starting point and personal preference varies widely." },
      { step: 3, text: "Fill a 12-oz glass with ice cubes, packing them to the rim. The ice will both chill and add visual texture through the glass." },
      { step: 4, text: "Pour the matcha-lemon base over the ice, then slowly add the 3 oz sparkling water by pouring it down the inside wall of the glass rather than over the center. This technique preserves the carbonation by reducing turbulence. Stop pouring when the bubbles rise to within 1 inch of the rim." },
      { step: 5, text: "Stir the drink gently for 5 seconds — just enough to integrate the layers without flattening the sparkling water. The finished drink should look vivid spring-green and have active, fine bubbles rising through it. Garnish with a thin lemon wheel and serve immediately." }
    ],chefNotes:"Using warm water to whisk the matcha ensures it doesn't clump.",pairing:"Salad",mealSlots:["lunch"],healthy:true},
{slug:"agua-fresca-cucumber-lime-shiso",title:"Cucumber Lime Shiso",subtitle:"The ultimate cooler.",story:"Blending cucumber and lime into a classic agua fresca, elevated by the aromatic mint-basil notes of fresh shiso leaves.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"10 min",cookTime:"0 min",servings:4,spiceLevel:0,umamiLevel:1,origin:"Mexico x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"",item:"cucumbers"},{qty:"1/4",unit:"cup",item:"lime juice"},{qty:"6",unit:"leaves",item:"shiso"}],method:[
      { step: 1, text: "Wash the 2 cucumbers under cool running water. Peel them with a vegetable peeler, removing all skin — the skin adds bitterness that competes with the clean, refreshing flavor profile of this drink. Cut each cucumber into rough chunks that will fit easily in your blender." },
      { step: 2, text: "Place the peeled cucumber chunks in the blender with the 1/4 cup lime juice and 6 fresh shiso leaves. Shiso is a Japanese herb with a complex flavor — simultaneously minty, basil-like, and slightly anise-forward. If you cannot source it, substitute 3 mint leaves and 3 basil leaves to approximate the profile." },
      { step: 3, text: "Blend on high for 60 seconds until completely liquefied. The mixture will look bright green and opaque. Resist adding water — cucumber is approximately 95% water and will produce enough liquid on its own to yield a properly thin agua fresca." },
      { step: 4, text: "Pour the blended mixture through a fine-mesh sieve set over a large pitcher. Press firmly and repeatedly with the back of a spoon for 2–3 minutes until only dry green pulp remains in the sieve. The strained liquid should be clear, bright, and jewel-like — almost see-through green." },
      { step: 5, text: "Taste and season: the agua fresca may need a pinch of sugar if your cucumbers were not sweet, or a few more drops of lime for brightness. Refrigerate for up to 4 hours. Stir before serving — some natural separation will occur — and pour over ice in chilled glasses." },
      { step: 6, text: "Serve ice-cold in tall glasses, garnished with a thin cucumber wheel and a shiso leaf. The drink should taste cooling, herbaceous, and bright, with a clean finish from the lime. English cucumbers produce the cleanest, least bitter result." }
    ],chefNotes:"English cucumbers are best as they have fewer bitter seeds.",pairing:"Spicy tuna bites",mealSlots:["lunch"],healthy:true},
{slug:"ponzu-spritz",title:"Ponzu Citrus Spritz",subtitle:"A savory, tart mocktail.",story:"A daring mocktail that uses a few drops of citrus-soy ponzu to add a deeply savory, complex backbone to a standard citrus spritz.",category:"Drinks",tags:["Dairy-Free"],allergens:["soy","gluten"],difficulty:"Medium",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:2,origin:"Osaka",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"1",unit:"oz",item:"orange juice"},{qty:"1/2",unit:"tsp",item:"ponzu sauce"},{qty:"4",unit:"oz",item:"tonic water"}],method:[
      { step: 1, text: "Use freshly squeezed orange juice if at all possible — the difference between fresh and bottled OJ in a drink this simple is dramatic. Measure the 1 oz orange juice into a small bowl and add the 1/2 tsp ponzu sauce. Stir for 10 seconds until combined. Taste the mixture before adding tonic: it should be simultaneously sweet, citrusy, and savory, with the ponzu's soy-citrus depth immediately apparent." },
      { step: 2, text: "Chill a 10-oz glass in the freezer for 5 minutes. Fill it with large ice cubes, packing them in firmly. A properly chilled glass with large ice will keep this delicate drink cold far longer than a room-temperature glass with crushed ice." },
      { step: 3, text: "Pour the orange juice-ponzu mixture over the ice, letting it trickle down through the cubes and chill as it settles at the bottom of the glass." },
      { step: 4, text: "Pour the 4 oz tonic water slowly down the inside wall of the glass, starting from the rim and letting it flow gently over the ice without crashing into the orange juice below. This preserves the carbonation — you should see a steady column of fine bubbles rising through the drink." },
      { step: 5, text: "Stir very gently for 3–4 seconds with a long bar spoon, using a single slow circular motion to combine the layers without flattening the bubbles. Serve immediately — tonic water loses its effervescence quickly, so this drink should be consumed within a few minutes of being made." }
    ],chefNotes:"Use a high-quality ponzu; cheap ones are too heavily salted.",pairing:"Edamame",mealSlots:["snack"],healthy:true},
{slug:"chamoy-tajin-mangonada",title:"Chamoy Tajín Mangonada",subtitle:"Frozen mango and chili sorbet.",story:"A classic Mexican street treat. Frozen mango blended into a thick slush, layered heavily with sour chamoy and spicy Tajín.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"10 min",cookTime:"0 min",servings:2,spiceLevel:2,umamiLevel:1,origin:"Mexico",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"cups",item:"frozen mango"},{qty:"1/4",unit:"cup",item:"chamoy"},{qty:"1",unit:"tbsp",item:"Tajín"}],method:[
      { step: 1, text: "Place the 2 cups frozen mango in a blender without adding any liquid — the frozen mango itself creates the thick, sorbet-like texture when blended. Blend for 60–90 seconds, stopping to scrape the sides with a spatula twice. The mixture will look crumbly at first, then transform into a smooth, thick, bright-orange slush that barely moves when you tilt the blender jar. This thick texture is essential — too liquid and it cannot support layers." },
      { step: 2, text: "Pour about 1 tablespoon of the 1/4 cup chamoy into the bottom of each serving cup, then tilt and rotate the cup to coat the inside walls with a thin layer of chamoy. The chamoy should cling to the sides, creating a visible red-orange coating." },
      { step: 3, text: "Spoon or pour half of the blended mango slush into each chamoy-coated cup. The slush should be thick enough to hold its shape when piled — if it runs immediately, it was blended too long or the mango was too warm. Tap the cup gently on the counter to settle the slush into the chamoy without fully mixing them." },
      { step: 4, text: "Sprinkle a generous portion of the 1 tbsp Tajín directly over the mango layer — about 1/2 tsp per cup — so the red-orange seasoning contrasts dramatically with the vivid yellow mango. Don't be shy; a mangonada should be aggressively seasoned." },
      { step: 5, text: "Add the remaining chamoy over the Tajín layer in a slow drizzle, then top with another layer of Tajín. Serve immediately with a wide straw or chamoy straw. The mangonada should be consumed while the mango is still frozen and thick — within about 10 minutes it will soften significantly." }
    ],chefNotes:"You must use frozen mango to achieve the thick, sorbet-like texture.",pairing:"Tortilla chips",mealSlots:["snack"],healthy:true},
{slug:"miso-hot-toddy",title:"Miso Honey Hot Toddy",subtitle:"Warming, savory winter drink.",story:"A hot toddy cures everything. Adding a dash of white miso to the honey provides a soothing, brothy quality that warms the soul.",category:"Drinks",tags:["Dairy-Free","Gluten-Free"],allergens:["soy"],difficulty:"Easy",prepTime:"5 min",cookTime:"5 min",servings:1,spiceLevel:0,umamiLevel:2,origin:"USA x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"whiskey"},{qty:"1",unit:"tbsp",item:"honey"},{qty:"1/2",unit:"tsp",item:"white miso"},{qty:"1",unit:"oz",item:"lemon juice"}],method:[
      { step: 1, text: "In a small saucepan, whisk together the 1 tbsp honey and 1/2 tsp white miso paste for 30 seconds until the miso is completely dissolved into the honey with no lumps. The miso turns the honey slightly darker and thinner — this is correct. The combination creates a savory-sweet syrup that is the secret ingredient of this toddy." },
      { step: 2, text: "Add the 1 oz lemon juice to the saucepan and whisk for 10 seconds to combine. Then add the 2 oz whiskey — pour it in last so the alcohol doesn't cook off over extended heat." },
      { step: 3, text: "Heat the saucepan over low heat, stirring constantly, for 2–3 minutes until the mixture is steaming and pleasantly hot to touch — about 150°F. Do not bring it to a boil; boiling drives off the aromatic compounds in both the whiskey and the lemon juice, leaving a flat-tasting drink." },
      { step: 4, text: "Pour the hot toddy into a pre-warmed heatproof mug. To pre-warm the mug, fill it with boiling water for 1 minute, then dump it out. A warm mug keeps the toddy at drinking temperature significantly longer than a cold one." },
      { step: 5, text: "Sip slowly and taste: the toddy should feel warming and smooth, with the whiskey's warmth deepening the honey's sweetness, the lemon providing brightness, and the miso adding an almost broth-like savoriness that lingers on the back of the palate. Garnish with a cinnamon stick or a few cloves if desired." }
    ],chefNotes:"Ensure the water is boiling hot so the miso dissolves entirely.",pairing:"Shortbread",mealSlots:["snack"],healthy:true},
{slug:"green-tea-horchata",title:"Green Tea Horchata",subtitle:"Toasted rice and matcha.",story:"Traditional horchata relies on toasted rice. Blending it with roasted green tea (hojicha) or matcha bridges the two rice cultures seamlessly.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Medium",prepTime:"10 min",cookTime:"0 min",servings:4,spiceLevel:0,umamiLevel:1,origin:"Mexico x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"1",unit:"cup",item:"white rice"},{qty:"1",unit:"tbsp",item:"matcha"},{qty:"4",unit:"cups",item:"water"},{qty:"1",unit:"stick",item:"cinnamon"}],method:[
      { step: 1, text: "In a large bowl or pitcher, combine the 1 cup white rice (unrinsed — the surface starch helps the final drink), 1 cinnamon stick, and 4 cups water. Cover and let the rice soak overnight at room temperature, or for a minimum of 8 hours in the refrigerator. The water will turn milky and the rice will swell and soften — this soaking is the foundation of horchata's creaminess. Do not skip it." },
      { step: 2, text: "Transfer the soaked rice, cinnamon, and all the soaking water to a blender. Blend on high for 2 full minutes — much longer than you think necessary. The rice must be completely liquefied, not just broken up. After 2 minutes, the mixture should look uniformly white and opaque with no visible rice grains." },
      { step: 3, text: "Line a fine-mesh sieve with a double layer of cheesecloth and set it over a large pitcher. Pour the blended rice mixture through, then gather the cheesecloth and squeeze firmly to extract every drop of the creamy rice milk. The liquid passing through should look smooth and ivory-white. This step removes the fibrous rice pulp that would give the horchata a gritty texture." },
      { step: 4, text: "In a small bowl, whisk the 1 tbsp matcha with 3 tablespoons of warm water for 45 seconds until completely smooth, bright green, and lump-free. Then whisk the matcha mixture vigorously into the strained rice milk for 60 seconds until the entire pitcher looks uniformly pale celadon green." },
      { step: 5, text: "Cover and refrigerate the horchata for at least 30 minutes. Before serving, stir or shake vigorously — rice milk separates naturally as it sits. Taste and adjust sweetness: add sugar or agave syrup one tablespoon at a time. Serve over ice in tall glasses, stirring once before each pour." }
    ],chefNotes:"Do not skip the overnight soak, or the rice will not blend smoothly.",pairing:"Almond cookies",mealSlots:["breakfast","snack"],healthy:true},
{slug:"spicy-mango-margarita",title:"Spicy Mango Margarita",subtitle:"Sweet fruit, fiery finish.",story:"Blending fresh mango puree with tequila and habanero creates a viscous, intensely flavorful cocktail that balances fire and ice.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:3,umamiLevel:1,origin:"Mexico",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"tequila"},{qty:"2",unit:"oz",item:"mango puree"},{qty:"1",unit:"slice",item:"habanero"}],method:[
      { step: 1, text: "Add the 1 slice of habanero to a cocktail shaker. Using a muddler, press it firmly for about 15 seconds — you want to extract the juice and volatile heat compounds without fully pulverizing the flesh into a mash that's impossible to strain out. Wash your hands with soap and water immediately after handling habanero; its oils will irritate eyes and skin for hours." },
      { step: 2, text: "Add the 2 oz tequila and 2 oz mango puree to the shaker over the muddled habanero. Stir briefly to combine the puree with the tequila before shaking — mango puree is thick and needs initial mixing or it will remain in a dense layer at the bottom of the shaker." },
      { step: 3, text: "Fill the shaker with ice cubes and seal it firmly. Shake vigorously for 20 full seconds — much longer than a standard cocktail because the mango puree has high viscosity and needs more agitation to properly chill and aerate. The shaker should be painfully cold and frosted when you stop." },
      { step: 4, text: "Double-strain through a hawthorne strainer and a fine-mesh sieve into a serving glass. The double straining is critical: it removes all habanero seeds and flesh (which would continue releasing heat into the drink), as well as any ice chips from the shaker." },
      { step: 5, text: "Observe the finished cocktail: it should look thick, vivid orange, and slightly frothy on the surface from the vigorous shaking. The habanero heat will build gradually — the first sip tastes sweet and fruity, and the heat arrives 5–10 seconds later. Garnish with a thin slice of mango and a tiny habanero ring if you're feeling bold." }
    ],chefNotes:"Wash your hands immediately after muddling the habanero.",pairing:"Pork belly",mealSlots:["dinner"],healthy:true},
{slug:"matcha-rum-cocktail",title:"Matcha Rum Cocktail",subtitle:"Tropical green tea.",story:"White rum and coconut water provide a tropical base that perfectly supports the earthy bitterness of ceremonial matcha.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:1,origin:"Caribbean x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"white rum"},{qty:"3",unit:"oz",item:"coconut water"},{qty:"1",unit:"tsp",item:"matcha"}],method:[
      { step: 1, text: "In a small bowl, whisk the 1 tsp matcha with 1 tablespoon of warm water for 45 seconds until completely smooth, uniformly green, and free of dry clumps. Then stir in the 2 oz white rum until the matcha-rum mixture looks evenly colored throughout." },
      { step: 2, text: "Pour the matcha-rum mixture into a chilled glass over large ice cubes. The mixture should look vivid green and slightly glossy. Check that no dry matcha is clinging to the bottom of the bowl — rinse with a little rum and add it to the glass if needed." },
      { step: 3, text: "Pour the 3 oz coconut water slowly over the back of a bar spoon held just above the surface of the rum — this slows the pour and gently layers the coconut water over the denser rum-matcha mixture, creating a brief two-tone effect before they combine." },
      { step: 4, text: "Stir gently with a bar spoon for 10 seconds using a slow, circular motion that sweeps from the bottom to the top, combining the layers without agitating the drink into foam. The finished cocktail should look uniformly pale, matcha-green throughout." },
      { step: 5, text: "Serve immediately while the ice is still intact and the flavors are bright. Taste: you should get coconut water's natural sweetness first, followed by the rum's warmth, finishing with a long, grassy matcha bitterness. No sugar is needed — the coconut water provides sufficient sweetness to balance the matcha." }
    ],chefNotes:"Coconut water naturally sweetens the drink, so no syrup is needed.",pairing:"Fruit salad",mealSlots:["lunch"],healthy:true},
{slug:"tamarind-sparkling-limeade",title:"Tamarind Sparkling Limeade",subtitle:"Fizzy, sour, perfect.",story:"A simple upgrade to standard limeade. Tamarind concentrate adds a brown hue and a deep, sour complexity that shines with carbonation.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:1,origin:"Mexico",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"1",unit:"oz",item:"lime juice"},{qty:"1",unit:"tbsp",item:"tamarind concentrate"},{qty:"4",unit:"oz",item:"sparkling water"}],method:[
      { step: 1, text: "In a small bowl, stir the 1 oz fresh lime juice and 1 tbsp tamarind concentrate together for 20 seconds until the concentrate is completely dissolved and the mixture looks smooth, uniformly dark amber-brown with no streaks or lumps of undissolved tamarind. Taste this base — it should be intensely sour and complex. Adjust by adding a pinch of sugar if it's too tart, or a few more drops of lime if it needs brightness." },
      { step: 2, text: "Fill a tall 12-oz glass with large ice cubes. Pour the lime-tamarind mixture over the ice, scraping the bowl with a spoon so no tamarind concentrate is left behind — the concentrate has a dense, sticky consistency and clings to surfaces." },
      { step: 3, text: "Pour the 4 oz sparkling water very slowly down the inside wall of the tilted glass, pausing once to let the initial foam settle. Pouring too fast creates excessive foam that dissipates the carbonation rapidly, leaving a flat drink within 30 seconds." },
      { step: 4, text: "Stir the limeade with a bar spoon using a single slow, gentle rotation from bottom to top — just enough to combine the citrus base with the sparkling water without knocking out the bubbles. You should see fine, steady carbonation rising through the amber-colored drink." },
      { step: 5, text: "Serve immediately with a lime wedge and a straw. The drink should be simultaneously tart (from the lime), sour and complex (from the tamarind), and refreshingly light (from the carbonation). If it tastes too tart, a pinch of sugar stirred in before the sparkling water will balance it." }
    ],chefNotes:"Adjust the syrup based on how sour your tamarind concentrate is.",pairing:"Spicy wings",mealSlots:["snack"],healthy:true},
{slug:"mezcal-miso-old-fashioned",title:"Mezcal Miso Old Fashioned",subtitle:"Smoke, oak, and umami.",story:"Replacing whiskey with smoky mezcal and adding a dash of miso-infused agave nectar creates an aggressively flavorful, sipping cocktail.",category:"Drinks",tags:["Dairy-Free","Gluten-Free"],allergens:["soy"],difficulty:"Advanced",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:2,origin:"Oaxaca x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"mezcal"},{qty:"1/4",unit:"oz",item:"agave nectar"},{qty:"1/4",unit:"tsp",item:"white miso"},{qty:"2",unit:"dashes",item:"bitters"}],method:[
      { step: 1, text: "In a small bowl, whisk the 1/4 tsp white miso paste into the 1/4 oz agave nectar for 20–30 seconds until completely smooth with no lumps or beige streaks. Agave nectar is thin enough to dissolve the miso without additional liquid — the resulting savory-sweet syrup is the soul of this cocktail and must be completely lump-free before proceeding." },
      { step: 2, text: "Fill a mixing glass with ice cubes — the large, clear variety preferred by bartenders melts slowly and provides the precise dilution control needed for a stirred cocktail like an Old Fashioned. Add the 2 oz mezcal, 2 dashes bitters, and the miso-agave mixture." },
      { step: 3, text: "Stir the cocktail with a bar spoon for a full 30 seconds — count them out loud. Proper stirring chills, dilutes, and slightly aerates the drink without introducing the cloudiness that shaking creates. Use a circular motion that keeps the spoon in contact with the inside wall of the glass throughout." },
      { step: 4, text: "Strain the stirred cocktail through a hawthorne strainer over a single large ice cube in a chilled rocks glass. A single large cube chills the drink more slowly and more evenly than multiple small cubes, preserving the cocktail's balance for the entire drinking experience." },
      { step: 5, text: "Express an orange peel over the surface of the drink — hold a 2-inch piece of orange skin over the glass and twist it sharply to spray the aromatic oils onto the liquid's surface. You will see a fine mist if done correctly. Rub the peel along the glass rim, then drop it in or discard it. The cocktail should look clear, deep amber, and complex. Sip slowly — this is not a fast drink." }
    ],chefNotes:"Stirring for 30 seconds is crucial to properly chill and dilute the heavy spirits.",pairing:"Steak",mealSlots:["dinner"],healthy:true},
{slug:"jalapeno-cucumber-agua-fresca",title:"Jalapeño Cucumber Agua Fresca",subtitle:"Cooling with a spicy kick.",story:"The ultimate summer cooler. Cucumber water provides extreme hydration, while jalapeño slices offer a lingering, spicy finish.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"10 min",cookTime:"0 min",servings:4,spiceLevel:2,umamiLevel:1,origin:"Mexico",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"",item:"cucumbers"},{qty:"1",unit:"",item:"jalapeño"},{qty:"4",unit:"cups",item:"water"}],method:[
      { step: 1, text: "Peel and roughly chop the 2 cucumbers into blender-sized pieces. Combine with the 4 cups water in a blender and blend on high for 60 seconds until completely smooth. The water should look a uniform, very pale green and opaque." },
      { step: 2, text: "Strain the blended cucumber-water through a fine-mesh sieve lined with cheesecloth into a large pitcher, pressing the pulp firmly with the back of a spoon. The strained liquid should look clear and palest green — like water with a slight tint, not cloudy. Discard the fibrous cucumber pulp." },
      { step: 3, text: "Thinly slice the 1 jalapeño into uniform rounds — about 1/8 inch thick — using a sharp knife. Keep the seeds in for significant heat, or remove them for a milder result. Consistency of slice thickness ensures the heat infuses evenly throughout the agua fresca." },
      { step: 4, text: "Add the jalapeño slices to the strained cucumber water and stir gently to distribute them throughout the pitcher. The jalapeño rounds should be visible floating in the liquid and will begin releasing their heat immediately." },
      { step: 5, text: "Cover and refrigerate for at least 1 hour. The longer the jalapeño steeps, the spicier the drink becomes — taste every 30 minutes after the first hour to gauge the heat level. When it reaches your desired spiciness, remove the jalapeño slices with a spoon before serving. Pour over ice in tall glasses and garnish with fresh jalapeño rounds." }
    ],chefNotes:"The longer the jalapeño steeps, the spicier the drink becomes.",pairing:"Spicy ceviche",mealSlots:["lunch"],healthy:true}

];
