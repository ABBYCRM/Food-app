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
      { step: 1, text: "Place the 3 large ripe hass avocados, finely diced, in a large bowl and mash lightly with a fork for a chunky texture." },
      { step: 2, text: "Add the 2 tbsp fresh lime juice to the 3 large ripe hass avocados and stir for 30 seconds until evenly coated." },
      { step: 3, text: "Fold the 1 minced serrano chile into the 3 large ripe hass avocados, mixing for 20 seconds until evenly distributed." },
      { step: 4, text: "Fold the 1/4 cup chopped fresh cilantro into the avocado mixture for 20 seconds, keeping the guacamole visibly chunky." },
      { step: 5, text: "Serve the 3 large ripe hass avocados within 10 minutes, while the guacamole remains bright green and visibly fresh." }
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
      { step: 1, text: "Preheat the oven to 400°F (200°C) while measuring the 2 cups Oaxaca cheese and 1 cup Monterey Jack cheese." },
      { step: 2, text: "Combine the 2 cups Oaxaca cheese and 1 cup Monterey Jack cheese in an 8-inch ovenproof skillet." },
      { step: 3, text: "Distribute the 2 tsp prepared wasabi paste in small dots over the 2 cups Oaxaca cheese and 1 cup Monterey Jack cheese." },
      { step: 4, text: "Bake the 2 cups Oaxaca cheese and 1 cup Monterey Jack cheese at 400°F for 12–15 minutes until bubbling." },
      { step: 5, text: "Remove the 2 cups Oaxaca cheese and 1 cup Monterey Jack cheese when the surface is lightly golden, then serve immediately." }
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
      { step: 1, text: "Bring a saucepan of water to a full boil over high heat, then cook the 2 cups frozen shelled edamame for 5 minutes." },
      { step: 2, text: "Drain the 2 cups cooked shelled edamame and cool for 2 minutes, until the beans are tender and bright green." },
      { step: 3, text: "Add the 2 cups shelled edamame and 2 smashed garlic cloves to a food processor, then pulse for 30 seconds." },
      { step: 4, text: "Add the 3 tbsp fresh lime juice and process the 2 cups shelled edamame for 1 minute until finely blended." },
      { step: 5, text: "With the processor running, slowly add the 1/4 cup olive oil and process for 2 minutes until smooth and creamy." }
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
      { step: 1, text: "Place the 2 cans pinto beans (rinsed and drained) in a 10-inch skillet and heat over medium for 3 minutes, until steaming." },
      { step: 2, text: "Stir the 1 tsp ground cumin into the 2 cans pinto beans and cook for 1 minute, until the cumin smells fragrant." },
      { step: 3, text: "Whisk the 2 tbsp red miso paste with the 1/4 cup water in a small bowl for 1 minute, until completely smooth." },
      { step: 4, text: "Pour the mixture of 2 tbsp red miso paste and 1/4 cup water into the skillet, then stir it through the 2 cans pinto beans." },
      { step: 5, text: "Mash the 2 cans pinto beans with a potato masher or spoon until mostly smooth, leaving a few small pieces for texture." },
      { step: 6, text: "Cook the 2 cans pinto beans for 3–5 minutes over medium heat, stirring constantly, until the dip is thick and steaming." }
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
      { step: 1, text: "Let the 1 block cream cheese (8 oz, softened) stand at room temperature for 30 minutes, until easily spreadable." },
      { step: 2, text: "Beat the 1 block cream cheese (8 oz, softened) in a medium bowl for 1 minute, until smooth and free of lumps." },
      { step: 3, text: "Add the 1 tbsp white miso paste to the 1 block cream cheese (8 oz) and beat for 1 minute, until evenly blended." },
      { step: 4, text: "Mix the 1 tbsp fresh lime juice into the cream cheese and miso for 30 seconds, until glossy and uniformly smooth." },
      { step: 5, text: "Transfer the dip made with 1 block cream cheese, 1 tbsp white miso paste, and 1 tbsp fresh lime juice to a bowl." },
      { step: 6, text: "Chill the dip made with 1 block cream cheese, 1 tbsp white miso paste, and 1 tbsp fresh lime juice for 30 minutes, until firm." }
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
      { step: 1, text: "Place the 2 cups plain whole milk Greek yogurt in a medium bowl and stir for 30 seconds, until smooth and creamy." },
      { step: 2, text: "Add the 2 cloves garlic (grated) to the 2 cups plain whole milk Greek yogurt and stir for 30 seconds, until evenly distributed." },
      { step: 3, text: "Stir the 1 tbsp lemon juice into the 2 cups plain whole milk Greek yogurt for 30 seconds, until the mixture looks slightly loosened." },
      { step: 4, text: "Fold the 1 tbsp fresh mint (chopped) into the yogurt mixture for 30 seconds, until green flecks are evenly spread throughout." },
      { step: 5, text: "Cover and refrigerate the mixture of 2 cups yogurt, 2 cloves garlic, 1 tbsp mint, and 1 tbsp lemon juice for at least 1 hour." },
      { step: 6, text: "Stir the chilled mixture of 2 cups yogurt, 2 cloves garlic, 1 tbsp mint, and 1 tbsp lemon juice until smooth before serving." }
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
      { step: 1, text: "Halve the 2 ripe avocados (drained), remove the pits, and scoop the flesh into a food processor." },
      { step: 2, text: "Add the 1.5 tbsp white miso paste, 1 tbsp rice vinegar, and 1 tsp sesame oil to the processor." },
      { step: 3, text: "Process the 2 ripe avocados and seasonings on high for 1–2 minutes, scraping the bowl until completely smooth." },
      { step: 4, text: "Transfer the mousse to a chilled serving bowl and refrigerate it for 20 minutes until cool and softly set." },
      { step: 5, text: "Stir the chilled mousse made with 2 ripe avocados once, then serve when its surface looks glossy and evenly airy." }
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
      { step: 1, text: "Press the 1 block firm tofu (14 oz, drained and pressed) for 15 minutes until it feels firm and releases little moisture." },
      { step: 2, text: "Crumble the pressed 1 block firm tofu (14 oz) into a food processor, keeping the pieces small for even blending." },
      { step: 3, text: "Add the 1 cup cotija cheese (crumbled), 2 tbsp olive oil, and 1 tbsp lime juice to the processor bowl." },
      { step: 4, text: "Process the tofu mixture for 1–2 minutes, stopping to scrape the sides, until whipped with a slightly grainy texture." },
      { step: 5, text: "Add the 1/2 tsp Tajín chile-lime seasoning and pulse for 10 seconds until evenly distributed without making the dip runny." },
      { step: 6, text: "Transfer the dip to a wide bowl and serve immediately, checking that the 1 cup cotija cheese remains visibly flecked throughout." }
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
      { step: 1, text: "Arrange the 4 Roma tomatoes, 1/2 white onion, 2 jalapeños, and 2 cloves garlic on a 13×18-inch baking sheet." },
      { step: 2, text: "Broil the 4 Roma tomatoes, 1/2 white onion, 2 jalapeños, and 2 cloves garlic on high for 10–15 minutes." },
      { step: 3, text: "Turn the vegetables halfway through broiling, then remove them when the tomato skins blister and the edges are deeply charred." },
      { step: 4, text: "Cool the 4 Roma tomatoes, 1/2 white onion, 2 jalapeños, and 2 cloves garlic for 5 minutes, then peel the garlic." },
      { step: 5, text: "Transfer the roasted vegetables and their juices to a blender, then add the 1.5 tbsp red miso paste." },
      { step: 6, text: "Add the 1/4 cup fresh cilantro and pulse for 15–20 seconds until chunky and spoonable, not completely smooth." },
      { step: 7, text: "Pour the salsa into a serving bowl and cool for 10 minutes until slightly thickened, with small vegetable pieces visible." }
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
      { step: 1, text: "Heat the oven to 450°F (230°C), then prick the 2 medium eggplants all over with a fork to prevent bursting." },
      { step: 2, text: "Place the 2 medium eggplants on a rimmed half-sheet baking sheet and roast for 40 minutes, turning once, until collapsed and charred." },
      { step: 3, text: "Cool the 2 medium eggplants until safe to handle, then split them and scoop the tender flesh into a mesh strainer." },
      { step: 4, text: "Drain the flesh from the 2 medium eggplants in the mesh strainer for 10 minutes, allowing excess liquid to escape." },
      { step: 5, text: "Whisk the 2 tbsp white miso paste, 1 tbsp mirin, 1 tbsp sesame oil, and 1 tbsp lemon juice together in a bowl." },
      { step: 6, text: "Fold the drained flesh from the 2 medium eggplants into the dressing, then mash gently with a fork until combined." },
      { step: 7, text: "Garnish the spread made from the 2 medium eggplants with the 1 tsp toasted sesame seeds, then serve warm or at room temperature." }
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
      { step: 1, text: "Rinse the 1 can cannellini beans (15 oz, rinsed and drained) under cold water, then drain thoroughly until the water runs clear." },
      { step: 2, text: "Add the 1 can cannellini beans (15 oz, rinsed and drained) and 2 tsp prepared wasabi paste (smashed) to a food processor." },
      { step: 3, text: "Add the 1 tbsp rice vinegar and 1/4 tsp sea salt, then pulse the beans briefly until they are roughly chopped." },
      { step: 4, text: "With the food processor running, slowly drizzle in the 3 tbsp extra virgin olive oil until the dip looks glossy and smooth." },
      { step: 5, text: "Process the dip made with 1 can cannellini beans (15 oz, rinsed and drained) until no large bean pieces remain." },
      { step: 6, text: "Taste the dip containing 2 tsp prepared wasabi paste (smashed), then serve immediately once it is creamy and smooth." }
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
      { step: 1, text: "Preheat the broiler to high, about 500°F (260°C), and arrange the 1 lb tomatillos, 1 jalapeño, and 1/4 white onion on a foil-lined baking sheet." },
      { step: 2, text: "Broil the 1 lb tomatillos, 1 jalapeño, and 1/4 white onion for 10–12 minutes until blistered, blackened in spots, and softened." },
      { step: 3, text: "Transfer the roasted 1 lb tomatillos, 1 jalapeño, and 1/4 white onion with their juices to a blender." },
      { step: 4, text: "Blend the 1 lb tomatillos, 1 jalapeño, and 1/4 white onion until mostly smooth while retaining a little texture." },
      { step: 5, text: "Cool the salsa made from 1 lb tomatillos, 1 jalapeño, and 1/4 white onion to room temperature before serving." }
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
      { step: 1, text: "Combine the 1/2 cup Japanese mayonnaise and 1 tbsp chipotle in adobo in a small mixing bowl until evenly blended." },
      { step: 2, text: "Whisk the 1 tsp white miso paste and 1 tsp lime juice in a small bowl until completely smooth and lump-free." },
      { step: 3, text: "Add the smooth 1 tsp white miso paste and 1 tsp lime juice mixture to the mayonnaise mixture, then stir thoroughly." },
      { step: 4, text: "Add the 1/2 tsp garlic powder and stir until the aioli is uniformly colored with no visible streaks." },
      { step: 5, text: "Cover and refrigerate the aioli for at least 15 minutes, until chilled and slightly thickened as the flavors meld." }
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
      { step: 1, text: "Measure the 1/2 cup sour cream into a medium bowl, ensuring it is evenly portioned before mixing." },
      { step: 2, text: "Add the 1 tsp onion powder to the 1/2 cup sour cream and stir slowly until the powder is evenly dispersed." },
      { step: 3, text: "Whisk the 1/2 cup sour cream and 1 tsp onion powder vigorously until smooth, creamy, and free of visible powder." },
      { step: 4, text: "Cover the bowl containing the 1/2 cup sour cream and 1 tsp onion powder tightly with plastic wrap." },
      { step: 5, text: "Refrigerate the covered 1/2 cup sour cream and 1 tsp onion powder mixture for at least 2 hours, until chilled and thick." }
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
      { step: 1, text: "Heat a large heavy-bottomed pot over medium-high heat, then add the 1/2 cup popcorn kernels in an even layer." },
      { step: 2, text: "Cover the pot containing the 1/2 cup popcorn kernels and remove it from the heat for 30 seconds to equalize heating." },
      { step: 3, text: "Return the covered pot to medium-high heat and shake it constantly until the 1/2 cup popcorn kernels pop once every 3 seconds." },
      { step: 4, text: "Transfer the popped 1/2 cup popcorn kernels to a very large bowl, discarding any kernels that remain visibly unpopped." },
      { step: 5, text: "Whisk the 3 tbsp melted unsalted butter and 2 tbsp chamoy sauce until blended, then drizzle evenly over the hot popcorn." },
      { step: 6, text: "Toss the popcorn with the 3 tbsp melted unsalted butter and 2 tbsp chamoy sauce until the kernels look evenly glossy." },
      { step: 7, text: "Sprinkle the 2 tbsp furikake seasoning and 1 tsp Tajín chile-lime seasoning over the popcorn in stages, tossing after each addition." }
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
      { step: 1, text: "Preheat the oven to 250°F (120°C) and line two large baking sheets with parchment; keep the 1/2 cup popcorn kernels (popped) ready." },
      { step: 2, text: "Combine the 1 cup brown sugar, 1/2 cup unsalted butter, and 1/4 cup corn syrup in a medium saucepan over medium heat." },
      { step: 3, text: "Boil the 1 cup brown sugar, 1/2 cup unsalted butter, and 1/4 cup corn syrup for exactly 5 minutes without stirring." },
      { step: 4, text: "Remove the saucepan from the heat, then whisk in the 2 tbsp white miso paste and 1/2 tsp baking soda until foamy." },
      { step: 5, text: "Pour the hot caramel over the 1/2 cup popcorn kernels (popped), toss evenly, and bake 45 minutes, stirring at 15-minute intervals." },
      { step: 6, text: "Spread the coated 1/2 cup popcorn kernels (popped) across the baking sheets and cool completely until crisp and crunchy." }
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
      { step: 1, text: "Place the 1/2 cup popcorn kernels (finely crushed) in a large heavy-bottomed pot over medium-high heat and cover tightly." },
      { step: 2, text: "Cook the 1/2 cup popcorn kernels (finely crushed) for 3 to 5 minutes, shaking every 30 seconds until pops are 2 seconds apart." },
      { step: 3, text: "Turn off the heat, leave the 1/2 cup popcorn kernels (finely crushed) covered for 30 seconds, then transfer them to a bowl." },
      { step: 4, text: "Sprinkle the 1 tbsp Tajín chile-lime seasoning evenly over the hot 1/2 cup popcorn kernels (finely crushed)." },
      { step: 5, text: "Toss the 1/2 cup popcorn kernels (finely crushed) with the 1 tbsp Tajín chile-lime seasoning until evenly coated, then serve." }
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
      { step: 1, text: "Place the 1/2 cup popcorn kernels (popped) in a large covered pot over medium-high heat and cook until popping subsides." },
      { step: 2, text: "Transfer the hot 1/2 cup popcorn kernels (popped) to a large mixing bowl, removing any unpopped kernels you can see." },
      { step: 3, text: "Melt the 4 tbsp unsalted butter (Cholula or Valentina) in a small saucepan over low heat for 2 to 3 minutes until fully liquid." },
      { step: 4, text: "Pour the melted 4 tbsp unsalted butter (Cholula or Valentina) over the 1/2 cup popcorn kernels (popped) while tossing continuously." },
      { step: 5, text: "Sprinkle the 1 tsp nutritional yeast (optional, for extra depth) over the buttered 1/2 cup popcorn kernels (popped) and toss well." },
      { step: 6, text: "Serve the seasoned 1/2 cup popcorn kernels (popped) immediately, while the 4 tbsp unsalted butter (Cholula or Valentina) remains warm." }
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
      { step: 1, text: "Heat a large 6-quart pot over medium heat, then add the 3 tbsp neutral oil, 1/2 cup popcorn kernels, and 1/4 cup white sugar." },
      { step: 2, text: "Cover the 6-quart pot and shake it constantly as the 1/2 cup popcorn kernels pop, keeping the 1/4 cup white sugar moving to prevent scorching." },
      { step: 3, text: "When the 1/2 cup popcorn kernels pop only every 2–3 seconds, remove the 6-quart pot from the heat immediately." },
      { step: 4, text: "Quickly spread the popped 1/2 cup popcorn kernels from the 6-quart pot on a parchment-lined baking sheet in a single layer." },
      { step: 5, text: "While the sugar coating remains sticky, sprinkle the 3 tbsp furikake seasoning and 1/2 tsp fine sea salt over the kettle corn; cool 10 minutes until crisp." }
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
      { step: 1, text: "Place the 1/2 cup popcorn kernels (popped) in a large mixing bowl, remove any unpopped kernels, and keep the popcorn warm." },
      { step: 2, text: "Stir the 1/4 cup nutritional yeast, 1 tsp chipotle powder, 1/2 tsp garlic powder, and 1 tsp kosher salt for 30 seconds until uniform." },
      { step: 3, text: "Drizzle the 3 tbsp olive oil (or melted vegan butter) evenly over the warm 1/2 cup popcorn kernels (popped)." },
      { step: 4, text: "Toss the 1/2 cup popcorn kernels (popped) with the 3 tbsp olive oil (or melted vegan butter) for 1 minute until glossy." },
      { step: 5, text: "Sprinkle the 1/4 cup nutritional yeast, 1 tsp chipotle powder, 1/2 tsp garlic powder, and 1 tsp kosher salt over the popcorn, then toss until evenly coated." }
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
      { step: 1, text: "Preheat the oven to 375°F (190°C) and line two baking sheets with parchment, then set out the 8 corn tortillas." },
      { step: 2, text: "Stack the 8 corn tortillas and cut each into six triangles, then place all 48 triangles in a large bowl." },
      { step: 3, text: "Whisk the 2 tbsp neutral oil with the 1 tbsp toasted sesame oil, drizzle over the tortilla triangles, and toss until lightly coated." },
      { step: 4, text: "Arrange the triangles cut from the 8 corn tortillas in a single layer on two baking sheets, then sprinkle with the 1 tbsp Tajín chile-lime seasoning and 1 tbsp white sesame seeds." },
      { step: 5, text: "Bake the 8 corn tortillas' seasoned triangles for 12–15 minutes, flipping once halfway, until golden and crisp; cool completely before serving." }
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
      { step: 1, text: "Preheat the oven to 400°F (200°C), then separate the 4 pita breads into horizontal halves." },
      { step: 2, text: "Whisk the 3 tbsp melted unsalted butter with the 1 tbsp white miso paste, 1 tsp garlic powder, and 1 tsp dried oregano." },
      { step: 3, text: "Brush the seasoned 3 tbsp butter evenly over the rough inside surfaces of all 4 pita breads." },
      { step: 4, text: "Cut the 4 pita breads into wedges and arrange them in a single layer on a baking sheet without overlapping." },
      { step: 5, text: "Bake the wedges from the 4 pita breads for 10–12 minutes until deeply golden and crisp, then cool on a wire rack." }
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
      { step: 1, text: "Preheat the oven to 300°F (150°C) and place the 3 cups plain Japanese rice crackers in a large bowl." },
      { step: 2, text: "Stir the 1 tbsp neutral oil (ancho or guajillo) with the 1/2 tsp fine sea salt until evenly combined." },
      { step: 3, text: "Pour the seasoned 1 tbsp oil over the 3 cups rice crackers and toss gently until every cracker is lightly coated." },
      { step: 4, text: "Spread the coated 3 cups rice crackers in a single layer on a large baking sheet for even toasting." },
      { step: 5, text: "Bake the 3 cups rice crackers for 10 minutes until dry and lightly toasted, then cool completely until crisp." }
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
      { step: 1, text: "Preheat the oven to 250°F (120°C) and line a large baking sheet with parchment before measuring the 4 cups mini twist pretzels." },
      { step: 2, text: "Whisk the 1 tbsp soy sauce and 1 tbsp honey in a small bowl until the honey is fully incorporated." },
      { step: 3, text: "Pour the soy-honey mixture over the 4 cups mini twist pretzels and toss gently until the pretzels are evenly coated." },
      { step: 4, text: "Add the 3 tbsp furikake seasoning to the coated 4 cups mini twist pretzels and toss until distributed." },
      { step: 5, text: "Spread the seasoned 4 cups mini twist pretzels evenly on the parchment-lined baking sheet without overlapping." },
      { step: 6, text: "Bake the 4 cups mini twist pretzels for 45 minutes, stirring every 15 minutes, until dry and lightly toasted, then cool." }
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
      { step: 1, text: "Preheat the oven to 325°F (165°C) and line a baking sheet with parchment, keeping the 3 cups mixed raw nuts ready." },
      { step: 2, text: "Whisk the 2 tbsp soy sauce, 2 tbsp maple syrup, and 1 tbsp sesame oil in a mixing bowl until completely combined." },
      { step: 3, text: "Add the 3 cups mixed raw nuts to the bowl and toss until every nut is evenly coated with the glossy glaze." },
      { step: 4, text: "Spread the 3 cups glazed nuts in one layer on the baking sheet and roast for 15–20 minutes, stirring halfway." },
      { step: 5, text: "Remove the fragrant, sticky nuts from the oven, sprinkle with the 1 tbsp Tajín while hot, and cool completely." }
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
      { step: 1, text: "Preheat the oven to 350°F (175°C) and line a baking sheet, keeping the 2 cups whole raw almonds ready." },
      { step: 2, text: "Spread the 2 cups whole raw almonds in one layer on the baking sheet and roast for 12–15 minutes until aromatic." },
      { step: 3, text: "Remove the hot 2 cups whole raw almonds from the oven and immediately sprinkle them with the 1 tsp flaky sea salt." },
      { step: 4, text: "Scatter the 1 tbsp white sesame seeds over the 2 cups seasoned almonds and toss on the baking sheet to distribute evenly." },
      { step: 5, text: "Cool the 2 cups almonds completely on the baking sheet; they should feel crisp and firm before serving." }
    ],
    chefNotes: "To test if an almond is properly roasted, cut one in half. The interior should be a uniform pale brown, not white.",
    pairing: "Mezcal neat",
    mealSlots: ["snack"],
    healthy: true
  }
,
{slug:"spicy-tuna-tostaditas",title:"Spicy Tuna Tostaditas",subtitle:"Bite-sized oceanic crunch.",story:"Tiny tostadas act as the vehicle for spicy tuna. This merges sushi staples with Mexican street food for an unstoppable bite.",category:"Bites",tags:["Pescatarian"],allergens:["fish","soy","egg"],difficulty:"Easy",prepTime:"15 min",cookTime:"0 min",servings:4,spiceLevel:2,umamiLevel:3,origin:"Baja x Tokyo",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"8",unit:"oz",item:"tuna",note:"minced"},{qty:"2",unit:"tbsp",item:"sriracha"},{qty:"1",unit:"tbsp",item:"Kewpie mayo"},{qty:"1",unit:"bag",item:"mini tostadas"}],method:[
      { step: 1, text: "Combine the 8 oz minced tuna, 2 tbsp sriracha, and 1 tbsp Kewpie mayo in a bowl until evenly blended." },
      { step: 2, text: "Stir the 8 oz tuna mixture until it looks creamy and glossy, with the 2 tbsp sriracha fully incorporated." },
      { step: 3, text: "Arrange the 1 bag mini tostadas on a chilled platter, keeping them flat and crisp for topping." },
      { step: 4, text: "Spoon the mixture of 8 oz tuna, 2 tbsp sriracha, and 1 tbsp Kewpie mayo onto the 1 bag mini tostadas." },
      { step: 5, text: "Serve the 1 bag topped mini tostadas immediately, while the 8 oz tuna mixture is creamy and the tostadas remain crisp." }
    ],chefNotes:"Keep tuna ice cold until assembly to maintain texture.",pairing:"Cold dry sake",mealSlots:["snack"],healthy:true},
{slug:"chile-lime-edamame",title:"Chile Lime Edamame",subtitle:"Fiery twist on a bar snack.",story:"Steamed edamame is a perfect canvas. Tossing them in Tajín and lime transforms them into a messy, lick-your-fingers appetizer.",category:"Bites",tags:["Vegan"],allergens:["soy"],difficulty:"Easy",prepTime:"2 min",cookTime:"5 min",servings:2,spiceLevel:2,umamiLevel:2,origin:"Mexico x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"lb",item:"frozen edamame in pods"},{qty:"1",unit:"tbsp",item:"Tajín"},{qty:"1",unit:"tbsp",item:"lime juice"}],method:[
      { step: 1, text: "Bring a large pot of water to a rolling boil, then add the 1 lb frozen edamame in pods." },
      { step: 2, text: "Boil the 1 lb frozen edamame in pods for 5 minutes, until the pods are hot and the beans are tender." },
      { step: 3, text: "Drain the 1 lb frozen edamame in pods thoroughly in a colander, then transfer it to a serving bowl while hot." },
      { step: 4, text: "Add the 1 tbsp lime juice and the 1 tbsp Tajín to the hot 1 lb frozen edamame in pods." },
      { step: 5, text: "Toss the 1 lb frozen edamame in pods vigorously until evenly coated, then serve immediately while hot." }
    ],chefNotes:"Blister edamame in a dry skillet first for a charred flavor.",pairing:"Cold beer",mealSlots:["snack"],healthy:true},
{slug:"miso-corn-ribs",title:"Miso Corn Ribs",subtitle:"Curling strips of sweet corn.",story:"Cutting corn into strips makes them curl like ribs when fried. Brushing them with miso butter adds a deep, savory glaze.",category:"Bites",tags:["Vegetarian"],allergens:["dairy","soy"],difficulty:"Medium",prepTime:"10 min",cookTime:"15 min",servings:4,spiceLevel:1,umamiLevel:3,origin:"Oaxaca x Kyoto",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"2",unit:"",item:"corn cobs"},{qty:"2",unit:"tbsp",item:"white miso"},{qty:"2",unit:"tbsp",item:"butter"}],method:[
      { step: 1, text: "Cut the 2 corn cobs lengthwise into quarters with a sturdy knife to create eight evenly sized ribs." },
      { step: 2, text: "Melt the 2 tbsp butter in a small saucepan over low heat, then whisk in the 2 tbsp white miso until smooth." },
      { step: 3, text: "Brush the 2 corn cobs, cut into ribs, generously with the warm glaze made from the 2 tbsp butter and 2 tbsp white miso." },
      { step: 4, text: "Arrange the glazed corn ribs in the air-fryer basket and cook at 400°F for 15 minutes, turning halfway." },
      { step: 5, text: "Remove the 2 corn cobs when the kernels are browned, the edges are charred, and the ribs have visibly curled." }
    ],chefNotes:"Use a heavy cleaver to safely cut through the hard corn core.",pairing:"Margarita",mealSlots:["snack"],healthy:false},
{slug:"japanese-sliders-miso",title:"Mini Japanese Sliders",subtitle:"Bite-sized umami bombs.",story:"Small beef patties glazed with miso and soy offer incredible depth. Served on sweet Hawaiian rolls, they bridge two continents.",category:"Bites",tags:[],allergens:["gluten","soy","dairy"],difficulty:"Medium",prepTime:"15 min",cookTime:"10 min",servings:4,spiceLevel:0,umamiLevel:3,origin:"Tokyo x LA",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"lb",item:"ground beef"},{qty:"2",unit:"tbsp",item:"red miso"},{qty:"4",unit:"",item:"Hawaiian rolls"}],method:[
      { step: 1, text: "Divide the 1 lb ground beef into four equal portions and shape each portion into a compact slider patty." },
      { step: 2, text: "Heat a 10-inch skillet over medium-high heat for 2 minutes, until the pan is hot enough to sear the 1 lb ground beef." },
      { step: 3, text: "Place the four patties from the 1 lb ground beef in the skillet and sear for 4 minutes per side, until browned and cooked through." },
      { step: 4, text: "Brush the 2 tbsp red miso over the patties during the final 1 minute, until the miso darkens slightly and clings to the meat." },
      { step: 5, text: "Toast the 4 Hawaiian rolls cut-side down in the skillet for 1 to 2 minutes, until lightly golden, then add one patty to each roll." }
    ],chefNotes:"Do not glaze too early, as the miso sugars will burn rapidly.",pairing:"Sapporo beer",mealSlots:["lunch","snack"],healthy:false},
{slug:"nori-wrapped-chicken-skewers",title:"Nori Wrapped Chicken",subtitle:"Savory oceanic skewers.",story:"Wrapping chicken in nori before grilling protects the meat and imparts a sea-salt brine. A simple but profound technique.",category:"Bites",tags:["Dairy-Free"],allergens:["soy"],difficulty:"Medium",prepTime:"15 min",cookTime:"12 min",servings:4,spiceLevel:0,umamiLevel:2,origin:"Osaka x Sonora",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"lb",item:"chicken thighs",note:"cubed"},{qty:"2",unit:"sheets",item:"nori"},{qty:"2",unit:"tbsp",item:"soy sauce"}],method:[
      { step: 1, text: "Place the 1 lb chicken thighs (cubed) in a bowl, pour over the 2 tbsp soy sauce, and marinate for 15 minutes." },
      { step: 2, text: "Cut the 2 sheets nori into strips wide enough to wrap around each piece of the marinated 1 lb chicken thighs." },
      { step: 3, text: "Wrap each piece of the 1 lb chicken thighs with the strips from the 2 sheets nori, covering the meat securely." },
      { step: 4, text: "Heat a grill to medium, about 400°F (200°C), and grill the wrapped 1 lb chicken thighs for 4–5 minutes per side." },
      { step: 5, text: "Cook until the 1 lb chicken thighs reach 165°F internally, their juices run clear, and the 2 sheets nori look crisp." },
      { step: 6, text: "Rest the grilled 1 lb chicken thighs for 5 minutes, then serve immediately with the 2 tbsp soy sauce already used for marinating." }
    ],chefNotes:"Soak wooden skewers for 30 minutes to prevent them from catching fire.",pairing:"Sake",mealSlots:["snack","dinner"],healthy:true},
{slug:"chipotle-gyoza",title:"Chipotle Pork Gyoza",subtitle:"Smoky heat meets a crisp dumpling.",story:"Traditional pork gyoza filling gets an injection of smoky chipotle in adobo. The result is a dumpling that bites back.",category:"Bites",tags:["Dairy-Free"],allergens:["gluten","soy","pork"],difficulty:"Advanced",prepTime:"30 min",cookTime:"10 min",servings:4,spiceLevel:2,umamiLevel:2,origin:"Puebla x Tokyo",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"lb",item:"ground pork"},{qty:"2",unit:"tbsp",item:"chipotle in adobo"},{qty:"1",unit:"pack",item:"gyoza wrappers"}],method:[
      { step: 1, text: "Combine the 1 lb ground pork and 2 tbsp chipotle in adobo in a bowl, mixing until the filling looks evenly seasoned." },
      { step: 2, text: "Divide the mixture made from the 1 lb ground pork evenly among the wrappers in 1 pack gyoza wrappers." },
      { step: 3, text: "Pleat and firmly seal 1 pack gyoza wrappers around the 1 lb ground pork filling, pressing out excess air." },
      { step: 4, text: "Heat a 10-inch nonstick skillet over medium heat, arrange 1 pack gyoza wrappers in one layer, and cook 4 minutes." },
      { step: 5, text: "Cover the 10-inch skillet, reduce heat to medium-low, and cook the 1 lb ground pork gyoza for 8–10 minutes." },
      { step: 6, text: "Uncover and cook until the bottoms of 1 pack gyoza wrappers are golden and the 1 lb ground pork reaches 160°F." }
    ],chefNotes:"Keep wrappers covered with a damp towel while folding so they do not dry out.",pairing:"Cerveza",mealSlots:["snack","dinner"],healthy:false},
{slug:"miso-crab-tostada",title:"Miso Crab Tostada",subtitle:"Sweet crab on a crispy shell.",story:"Lump crab meat tossed in miso mayo provides a rich, sweet topping. Served on a crisp tostada, the texture contrast is perfect.",category:"Bites",tags:["Pescatarian"],allergens:["shellfish","soy","egg"],difficulty:"Easy",prepTime:"10 min",cookTime:"0 min",servings:4,spiceLevel:1,umamiLevel:2,origin:"Baja x Hokkaido",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"8",unit:"oz",item:"lump crab meat"},{qty:"2",unit:"tbsp",item:"Kewpie mayo"},{qty:"1",unit:"tsp",item:"white miso"},{qty:"4",unit:"",item:"tostadas"}],method:[
      { step: 1, text: "Stir the 2 tbsp Kewpie mayo and 1 tsp white miso in a bowl for 1 minute until completely smooth and glossy." },
      { step: 2, text: "Gently fold the 8 oz lump crab meat into the 2 tbsp Kewpie mayo and 1 tsp white miso mixture." },
      { step: 3, text: "Refrigerate the mixture of 8 oz lump crab meat, 2 tbsp Kewpie mayo, and 1 tsp white miso for 10 minutes." },
      { step: 4, text: "Check that the 4 tostadas are crisp, rigid, and dry before topping them so their shells will not soften immediately." },
      { step: 5, text: "Divide the mixture of 8 oz lump crab meat, 2 tbsp Kewpie mayo, and 1 tsp white miso among the 4 tostadas." },
      { step: 6, text: "Serve the 4 tostadas immediately, while their shells remain visibly crisp and the 8 oz lump crab topping stays chilled." }
    ],chefNotes:"Pick through the crab meat for hidden shells before mixing.",pairing:"White wine",mealSlots:["snack"],healthy:true},
{slug:"yakitori-skewers",title:"Chicken Yakitori with Salsa Verde",subtitle:"Charcoal grilled with bright acid.",story:"Classic Japanese yakitori relies on sweet soy tare. Swapping the tare for a bright, acidic salsa verde creates a wildly refreshing skewer.",category:"Bites",tags:["Dairy-Free"],allergens:[],difficulty:"Medium",prepTime:"15 min",cookTime:"10 min",servings:4,spiceLevel:1,umamiLevel:2,origin:"Mexico City x Tokyo",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"lb",item:"chicken thighs"},{qty:"1/2",unit:"cup",item:"salsa verde"},{qty:"1",unit:"tbsp",item:"oil"}],method:[
      { step: 1, text: "Cut the 1 lb chicken thighs into uniform 1-inch pieces so they cook evenly on the grill." },
      { step: 2, text: "Thread the 1 lb chicken thigh pieces tightly onto skewers, leaving small gaps so heat reaches all sides." },
      { step: 3, text: "Heat a grill to high heat and brush the skewers with the 1 tbsp oil before placing on the grill." },
      { step: 4, text: "Grill the 1 lb chicken for 10–12 minutes, turning every 2–3 minutes, until browned and charred in spots." },
      { step: 5, text: "Brush the 1/2 cup salsa verde over the 1 lb chicken during the final 1 minute, turning once to glaze." },
      { step: 6, text: "Serve the grilled 1 lb chicken immediately, with the salsa verde coating glossy and the centers fully opaque." }
    ],chefNotes:"Chicken thighs are far superior to breasts for grilling as they will not dry out.",pairing:"Mezcal",mealSlots:["snack","dinner"],healthy:true},
{slug:"elote-cups",title:"Street Elote Cups",subtitle:"Esquites elevated with miso mayo.",story:"Serving Mexican street corn in cups makes it easier to eat. Adding miso to the mayonnaise dressing brings a massive umami upgrade.",category:"Bites",tags:["Vegetarian"],allergens:["dairy","egg","soy"],difficulty:"Easy",prepTime:"10 min",cookTime:"10 min",servings:4,spiceLevel:2,umamiLevel:2,origin:"Mexico x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"3",unit:"cups",item:"corn kernels"},{qty:"2",unit:"tbsp",item:"Kewpie mayo"},{qty:"1",unit:"tsp",item:"white miso"},{qty:"1/4",unit:"cup",item:"cotija cheese"}],method:[
      { step: 1, text: "Heat a 10-inch dry skillet over medium-high heat, then add the 3 cups corn kernels in an even layer." },
      { step: 2, text: "Cook the 3 cups corn kernels for 6–8 minutes, stirring occasionally, until hot and blackened in spots." },
      { step: 3, text: "Stir the 2 tbsp Kewpie mayo and 1 tsp white miso in a serving bowl until smooth and fully combined." },
      { step: 4, text: "Add the hot 3 cups corn kernels to the bowl and toss with the 2 tbsp Kewpie mayo and 1 tsp white miso." },
      { step: 5, text: "Divide the dressed 3 cups corn kernels among four small serving cups while they remain hot and glossy." },
      { step: 6, text: "Top the warm servings of the 3 cups corn kernels with the 1/4 cup cotija cheese and serve immediately." }
    ],chefNotes:"Frozen corn works perfectly if you thaw and dry it thoroughly before charring.",pairing:"Horchata",mealSlots:["snack"],healthy:false},
{slug:"japanese-nachos",title:"Japanese Nachos",subtitle:"Wonton chips and spicy tuna.",story:"Swapping tortilla chips for fried wonton wrappers creates a lighter, shatteringly crisp nacho base. Topped with spicy tuna and avocado.",category:"Bites",tags:["Pescatarian"],allergens:["gluten","soy","fish"],difficulty:"Medium",prepTime:"15 min",cookTime:"5 min",servings:4,spiceLevel:2,umamiLevel:2,origin:"LA x Tokyo",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"pack",item:"wonton wrappers"},{qty:"8",unit:"oz",item:"spicy tuna"},{qty:"1",unit:"",item:"avocado"}],method:[
      { step: 1, text: "Cut the 1 pack wonton wrappers in half diagonally to create evenly sized triangular chips." },
      { step: 2, text: "Arrange the 1 pack wonton wrapper triangles in a single layer on a large baking sheet without overlapping." },
      { step: 3, text: "Bake the 1 pack wonton wrapper triangles at 400°F (200°C) for 5–7 minutes until golden and crisp." },
      { step: 4, text: "Cool the crisp triangles from the 1 pack wonton wrappers for 2 minutes, until firm enough to layer." },
      { step: 5, text: "Arrange the 1 pack wonton wrapper chips on a platter and distribute the 8 oz spicy tuna over them." },
      { step: 6, text: "Dice the 1 avocado, scatter it over the 8 oz spicy tuna, and serve the nachos immediately." }
    ],chefNotes:"Watch the wontons closely while frying; they go from golden to burnt in seconds.",pairing:"Sapporo",mealSlots:["snack"],healthy:false},
{slug:"tempura-jalapeno-poppers",title:"Tempura Jalapeño Poppers",subtitle:"Cream cheese stuffed, shatteringly crisp.",story:"Traditional breaded poppers can be heavy. A lacy, ice-cold tempura batter provides a delicate crunch that highlights the spicy pepper.",category:"Bites",tags:["Vegetarian"],allergens:["dairy","gluten"],difficulty:"Medium",prepTime:"15 min",cookTime:"10 min",servings:4,spiceLevel:3,umamiLevel:1,origin:"Texas x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"6",unit:"",item:"jalapeños"},{qty:"4",unit:"oz",item:"cream cheese"},{qty:"1",unit:"cup",item:"tempura batter mix"}],method:[
      { step: 1, text: "Halve the 6 jalapeños lengthwise and scrape out all seeds and membranes to reduce their heat." },
      { step: 2, text: "Fill the 12 jalapeño halves evenly with the 4 oz cream cheese, keeping the filling level with the cut edges." },
      { step: 3, text: "Prepare the 1 cup tempura batter mix according to its package directions until smooth but still slightly lumpy." },
      { step: 4, text: "Heat a deep 10-inch skillet to 350°F, dip the 12 stuffed jalapeño halves in the 1 cup batter, and fry for about 3 minutes." },
      { step: 5, text: "Fry the 6 jalapeños until their coating is light golden and crisp, then transfer them to a wire rack to drain." }
    ],chefNotes:"Ice water in the batter stops gluten development, ensuring the crust is crisp, not chewy.",pairing:"Cold IPA",mealSlots:["snack"],healthy:false},
{slug:"miso-glazed-chicken-wings",title:"Miso Glazed Chicken Wings",subtitle:"Sticky, savory, and roasted.",story:"Baking wings with a miso glaze caramelizes the sugars, creating a sticky, savory coating that rivals any deep-fried wing.",category:"Bites",tags:["Dairy-Free"],allergens:["soy"],difficulty:"Easy",prepTime:"10 min",cookTime:"40 min",servings:4,spiceLevel:1,umamiLevel:3,origin:"Kyoto x USA",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"lb",item:"chicken wings"},{qty:"2",unit:"tbsp",item:"red miso"},{qty:"1",unit:"tbsp",item:"honey"}],method:[
      { step: 1, text: "Preheat the oven to 400°F and arrange the 1 lb chicken wings in a single layer on a large rimmed baking sheet." },
      { step: 2, text: "Whisk the 2 tbsp red miso and 1 tbsp honey in a small bowl for 1 minute until the glaze is smooth." },
      { step: 3, text: "Bake the 1 lb chicken wings at 400°F for 30 minutes, until the skin is browned and rendered fat has collected." },
      { step: 4, text: "Toss the baked 1 lb chicken wings with the glaze made from 2 tbsp red miso and 1 tbsp honey until fully coated." },
      { step: 5, text: "Return the glazed 1 lb chicken wings to the 400°F oven for 10 minutes, until sticky, bubbling, and lightly charred." }
    ],chefNotes:"Line your baking sheet with foil, as the honey-miso glaze will burn onto the pan.",pairing:"Whiskey Highball",mealSlots:["snack","dinner"],healthy:false},
{slug:"salmon-nori-cups",title:"Salmon Nori Cups",subtitle:"Baked salmon in crispy seaweed.",story:"Pressing nori into a muffin tin creates an edible cup. Filled with baked salmon and spicy mayo, it is a one-bite sushi roll.",category:"Bites",tags:["Pescatarian"],allergens:["fish","soy","egg"],difficulty:"Medium",prepTime:"15 min",cookTime:"12 min",servings:4,spiceLevel:1,umamiLevel:2,origin:"Tokyo x California",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"4",unit:"sheets",item:"nori"},{qty:"8",unit:"oz",item:"salmon"},{qty:"2",unit:"tbsp",item:"spicy mayo"}],method:[
      { step: 1, text: "Cut the 4 sheets nori into 12 squares sized to fit the cups of a standard 12-cup muffin tin." },
      { step: 2, text: "Press the 12 squares from the 4 sheets nori into the muffin cups, overlapping corners to form small bowls." },
      { step: 3, text: "Dice the 8 oz salmon into small pieces and stir it with the 2 tbsp spicy mayo until evenly coated." },
      { step: 4, text: "Divide the mixture of 8 oz salmon and 2 tbsp spicy mayo evenly among the 12 nori cups." },
      { step: 5, text: "Bake the 4 sheets nori cups at 375°F for 10 to 12 minutes, until the salmon is opaque and flakes easily." }
    ],chefNotes:"Do not overfill the cups, or the salmon will boil over and make the nori soggy.",pairing:"Green Tea",mealSlots:["snack"],healthy:true},
{slug:"edamame-guac-crostini",title:"Edamame Guacamole Crostini",subtitle:"Bright green protein spread.",story:"Blending edamame with avocado stretches the dip and adds protein. Served on toasted bread, it is a hearty, satisfying bite.",category:"Bites",tags:["Vegan"],allergens:["soy","gluten"],difficulty:"Easy",prepTime:"10 min",cookTime:"5 min",servings:4,spiceLevel:1,umamiLevel:1,origin:"Mexico x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"cup",item:"edamame"},{qty:"1",unit:"",item:"avocado"},{qty:"1",unit:"baguette",item:"sliced bread"}],method:[
      { step: 1, text: "Place the 1 cup edamame in a food processor and pulse 8–10 times until broken down but still visibly textured." },
      { step: 2, text: "Add the 1 avocado to the 1 cup edamame and process 20–30 seconds until creamy with a few small pieces remaining." },
      { step: 3, text: "Arrange slices from the 1 baguette sliced bread on a baking sheet and toast at 400°F for 8–10 minutes until golden." },
      { step: 4, text: "Spread the mixture made from 1 cup edamame and 1 avocado thickly over each toasted slice from the 1 baguette sliced bread." },
      { step: 5, text: "Serve the crostini immediately, using the spread from 1 cup edamame, 1 avocado, and the 1 baguette sliced bread." }
    ],chefNotes:"The edamame prevents the avocado from browning as quickly as standard guacamole.",pairing:"Sparkling Water",mealSlots:["snack","lunch"],healthy:true},
{slug:"tamarind-glazed-pork-skewers",title:"Tamarind Pork Skewers",subtitle:"Sour, sweet, and heavily charred.",story:"Tamarind provides a sour tang that cuts through fatty pork shoulder. Skewered and grilled, they are street food perfection.",category:"Bites",tags:["Dairy-Free"],allergens:["soy","pork"],difficulty:"Medium",prepTime:"20 min",cookTime:"15 min",servings:4,spiceLevel:1,umamiLevel:2,origin:"Mexico x Asia",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"lb",item:"pork shoulder"},{qty:"2",unit:"tbsp",item:"tamarind paste"},{qty:"1",unit:"tbsp",item:"soy sauce"}],method:[
      { step: 1, text: "Cut the 1 lb pork shoulder into uniform 1-inch cubes so the pieces cook evenly on the skewers." },
      { step: 2, text: "Whisk the 2 tbsp tamarind paste with the 1 tbsp soy sauce in a small bowl until completely smooth." },
      { step: 3, text: "Coat the 1 lb pork shoulder cubes with the mixture of 2 tbsp tamarind paste and 1 tbsp soy sauce, then rest 15 minutes." },
      { step: 4, text: "Thread the 1 lb pork shoulder onto skewers and grill at 450°F over high heat for 3–4 minutes per side until browned." },
      { step: 5, text: "Continue grilling the 1 lb pork shoulder for 2–4 minutes until opaque throughout and at least 145°F internally." },
      { step: 6, text: "Serve the hot skewers made from 1 lb pork shoulder with the glaze of 2 tbsp tamarind paste and 1 tbsp soy sauce." }
    ],chefNotes:"Pork shoulder needs high heat to render the fat and become tender quickly.",pairing:"Michelada",mealSlots:["snack","dinner"],healthy:false},
{slug:"miso-ceviche-chips",title:"Miso Ceviche with Chips",subtitle:"Raw fish cured in lime and umami.",story:"Standard ceviche relies purely on acid. Adding a dash of white miso brings a savory baseline that grounds the bright citrus.",category:"Bites",tags:["Pescatarian"],allergens:["fish","soy"],difficulty:"Easy",prepTime:"20 min",cookTime:"0 min",servings:4,spiceLevel:2,umamiLevel:2,origin:"Peru x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"8",unit:"oz",item:"white fish"},{qty:"1/4",unit:"cup",item:"lime juice"},{qty:"1",unit:"tsp",item:"white miso"}],method:[
      { step: 1, text: "Cut the 8 oz white fish into uniform ½-inch cubes and place them in a chilled glass or ceramic bowl." },
      { step: 2, text: "Whisk the 1 tsp white miso into the 1/4 cup lime juice until smooth and no miso lumps remain." },
      { step: 3, text: "Pour the mixture of 1/4 cup lime juice and 1 tsp white miso over the 8 oz white fish and stir to coat." },
      { step: 4, text: "Cover the bowl containing the 8 oz white fish, 1/4 cup lime juice, and 1 tsp white miso, then refrigerate at 40°F for 15 minutes." },
      { step: 5, text: "Check that the 8 oz white fish is opaque on the outside while slightly translucent in the centers before serving immediately." }
    ],chefNotes:"Do not over-cure the fish, or it will become tough and chalky.",pairing:"Pisco Sour",mealSlots:["snack"],healthy:true},
{slug:"sesame-chicken-tacos",title:"Sesame Chicken Mini Tacos",subtitle:"Sweet soy chicken in a warm tortilla.",story:"Taking the flavors of classic sesame chicken and serving them inside a charred corn tortilla proves that a taco can hold anything.",category:"Bites",tags:["Dairy-Free"],allergens:["soy","sesame","gluten"],difficulty:"Medium",prepTime:"15 min",cookTime:"10 min",servings:4,spiceLevel:1,umamiLevel:2,origin:"USA x Mexico",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"lb",item:"chicken breast"},{qty:"2",unit:"tbsp",item:"sesame sauce"},{qty:"8",unit:"",item:"mini tortillas"}],method:[
      { step: 1, text: "Cut the 1 lb chicken breast into small pieces, then sauté in a 10-inch skillet over medium-high heat for 6–8 minutes until opaque throughout." },
      { step: 2, text: "Add the 2 tbsp sesame sauce to the cooked 1 lb chicken breast and stir over medium heat for 1–2 minutes until thick and glossy." },
      { step: 3, text: "Warm the 8 mini tortillas one at a time over a gas flame for 5–10 seconds per side until lightly charred and pliable." },
      { step: 4, text: "Divide the sauced 1 lb chicken breast evenly among the 8 mini tortillas, using about one-eighth of the filling in each." },
      { step: 5, text: "Serve the 8 mini tortillas immediately, ensuring the 2 tbsp sesame sauce coats the chicken and looks glossy rather than runny." }
    ],chefNotes:"Warm tortillas are essential; cold corn tortillas will crack and ruin the taco.",pairing:"Lager",mealSlots:["snack","dinner"],healthy:true},
{slug:"panko-jalapeno-bites",title:"Panko Jalapeño Bites",subtitle:"Crispy, cheesy, fiery morsels.",story:"Coating cream-cheese filled jalapeños in Japanese panko rather than standard breadcrumbs yields a dramatically crunchier exterior.",category:"Bites",tags:["Vegetarian"],allergens:["dairy","gluten","egg"],difficulty:"Medium",prepTime:"20 min",cookTime:"15 min",servings:4,spiceLevel:2,umamiLevel:1,origin:"Texas x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"6",unit:"",item:"jalapeños"},{qty:"4",unit:"oz",item:"cream cheese"},{qty:"1",unit:"cup",item:"panko breadcrumbs"}],method:[
      { step: 1, text: "Cut the 6 jalapeños into thick rings and remove their seeds and membranes, keeping the rings intact for filling." },
      { step: 2, text: "Press the 4 oz cream cheese into the center of each jalapeño ring, filling the cavities without letting cheese protrude." },
      { step: 3, text: "Press the filled 6 jalapeño rings into the 1 cup panko breadcrumbs, turning them until the crumbs cover the cream cheese." },
      { step: 4, text: "Arrange the 6 coated jalapeño rings on a baking sheet and bake at 400°F for 15 minutes until the panko is golden." },
      { step: 5, text: "Cool the 6 jalapeño bites for 5 minutes until the 4 oz cream cheese is slightly set but still warm and soft." }
    ],chefNotes:"Panko browns best if you spray it lightly with cooking oil before baking.",pairing:"Agua Fresca",mealSlots:["snack"],healthy:false}
,
{slug:"churro-mochi-bites",title:"Churro Mochi Bites",subtitle:"Chewy, cinnamon-sugar perfection.",story:"Mochi's incredible chew combined with a fresh churro coating. A hybrid dessert that delivers texturally on every level.",category:"Desserts",tags:["Vegetarian","Gluten-Free"],allergens:["dairy"],difficulty:"Easy",prepTime:"10 min",cookTime:"45 min",servings:6,spiceLevel:0,umamiLevel:1,origin:"Mexico x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"lb",item:"sweet rice flour"},{qty:"2",unit:"cups",item:"whole milk"},{qty:"1/2",unit:"cup",item:"butter"},{qty:"1.5",unit:"cups",item:"sugar"},{qty:"1/4",unit:"cup",item:"cinnamon-sugar"}],method:[
      { step: 1, text: "Melt the 1/2 cup butter in a saucepan over low heat, then whisk in the 2 cups whole milk and 1.5 cups sugar." },
      { step: 2, text: "Whisk the 1 lb sweet rice flour into the warm milk mixture until the batter is smooth and no dry pockets remain." },
      { step: 3, text: "Pour the batter made with 1 lb sweet rice flour into a parchment-lined 8-inch square baking pan and smooth the surface." },
      { step: 4, text: "Bake the batter at 350°F for 45 minutes, until the center is fully set and the top is lightly golden." },
      { step: 5, text: "Cool the baked mochi completely, cut it into bite-sized squares, and toss them with the 1/4 cup cinnamon-sugar until coated." }
    ],chefNotes:"Use a wet plastic knife to cut the mochi cleanly.",pairing:"Horchata",mealSlots:["dessert"],healthy:false},
{slug:"matcha-tres-leches",title:"Matcha Tres Leches",subtitle:"A sponge soaked in earthy milks.",story:"Infusing the tres leches soak with matcha balances the intense sweetness. The grassy notes ground the rich dairy perfectly.",category:"Desserts",tags:["Vegetarian"],allergens:["dairy","gluten","egg"],difficulty:"Medium",prepTime:"20 min",cookTime:"30 min",servings:8,spiceLevel:0,umamiLevel:1,origin:"Mexico x Kyoto",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"",item:"sponge cake"},{qty:"1",unit:"can",item:"evaporated milk"},{qty:"1",unit:"can",item:"condensed milk"},{qty:"1.5",unit:"tbsp",item:"matcha"}],method:[
      { step: 1, text: "Place the 1 sponge cake on a serving plate and poke deep holes across its cooled surface with a fork." },
      { step: 2, text: "Sift the 1.5 tbsp matcha through a fine sieve into a bowl to remove lumps and ensure a smooth soak." },
      { step: 3, text: "Whisk the 1.5 tbsp matcha with the 1 can evaporated milk and 1 can condensed milk until evenly green." },
      { step: 4, text: "Pour the matcha mixture slowly over the 1 sponge cake, covering the surface so the liquid enters every hole." },
      { step: 5, text: "Cover and refrigerate the soaked 1 sponge cake for 4 hours, until the cake is tender and the liquid is absorbed." }
    ],chefNotes:"Sifting the matcha is mandatory to prevent chalky green spots.",pairing:"Coffee",mealSlots:["dessert"],healthy:false},
{slug:"miso-mezcal-flan-v2",title:"Miso Caramel Flan",subtitle:"Classic flan with fermented depth.",story:"Adding white miso to the caramel brings a savory edge. A splash of mezcal transforms it into a complex, adult dessert.",category:"Desserts",tags:["Vegetarian","Gluten-Free"],allergens:["dairy","egg"],difficulty:"Medium",prepTime:"20 min",cookTime:"50 min",servings:6,spiceLevel:0,umamiLevel:2,origin:"Mexico x Kyoto",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"cup",item:"sugar"},{qty:"2",unit:"tbsp",item:"white miso"},{qty:"1",unit:"tsp",item:"mezcal"},{qty:"5",unit:"",item:"eggs"}],method:[
      { step: 1, text: "Heat the 1 cup sugar in a 10-inch skillet over medium heat for 6–8 minutes until fully melted and amber." },
      { step: 2, text: "Remove the skillet from the heat, carefully stir in the 1 tsp mezcal, and mix until the caramel is smooth." },
      { step: 3, text: "Pour the hot caramel made from the 1 cup sugar into six 6-ounce ramekins, tilting each to coat its base." },
      { step: 4, text: "Whisk the 5 eggs and 2 tbsp white miso in a bowl until completely smooth and no streaks of miso remain." },
      { step: 5, text: "Strain the mixture of 5 eggs and 2 tbsp white miso into the ramekins, dividing it evenly over the caramel." },
      { step: 6, text: "Set the ramekins in a deep baking dish, add hot water halfway up their sides, and bake at 325°F for 35–45 minutes." },
      { step: 7, text: "Remove the ramekins when the custards look set around the edges but still jiggle slightly in the centers." }
    ],chefNotes:"The water bath is non-negotiable for achieving a silky, bubble-free texture.",pairing:"Mezcal neat",mealSlots:["dessert"],healthy:false},
{slug:"horchata-matcha-panna-cotta",title:"Horchata Matcha Panna Cotta",subtitle:"Layered creamy elegance.",story:"A brilliant layered dessert featuring sweet cinnamon horchata topped with a bitter matcha cream. Visually striking and deeply flavorful.",category:"Desserts",tags:["Vegetarian","Gluten-Free"],allergens:["dairy"],difficulty:"Advanced",prepTime:"30 min",cookTime:"10 min",servings:4,spiceLevel:0,umamiLevel:1,origin:"Oaxaca x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"2",unit:"cups",item:"heavy cream"},{qty:"1",unit:"cup",item:"horchata"},{qty:"1",unit:"tbsp",item:"matcha"},{qty:"2",unit:"tsp",item:"gelatin"}],method:[
      { step: 1, text: "Sprinkle the 2 tsp gelatin over the 1 cup horchata in a saucepan and let it stand for 5 minutes to soften." },
      { step: 2, text: "Add the 2 cups heavy cream to the saucepan and heat over medium-low for 5 minutes, until steaming but not boiling." },
      { step: 3, text: "Stir the softened 2 tsp gelatin into the warm mixture for 1–2 minutes, until completely dissolved and clear." },
      { step: 4, text: "Divide the mixture made with 2 cups heavy cream and 1 cup horchata into two equal 1½-cup portions." },
      { step: 5, text: "Whisk the 1 tbsp matcha into one 1½-cup portion until smooth, then pour the plain portion into angled glasses." },
      { step: 6, text: "Chill the glasses at an angle for 1–2 hours, until the horchata layer is firm and does not flow when tilted." },
      { step: 7, text: "Pour the matcha portion over the set layer, then refrigerate for 4 hours until both layers are fully chilled and softly set." }
    ],chefNotes:"Ensure the first layer is completely firm before pouring the second.",pairing:"Hot tea",mealSlots:["dessert"],healthy:false},
{slug:"churro-ice-cream-sandwich",title:"Churro Ice Cream Sandwich",subtitle:"Crispy spirals and cold vanilla.",story:"Piping churro dough into flat spirals creates the ultimate ice cream sandwich cookie. Crispy, warm, and heavily spiced.",category:"Desserts",tags:["Vegetarian"],allergens:["dairy","gluten","egg"],difficulty:"Advanced",prepTime:"20 min",cookTime:"15 min",servings:4,spiceLevel:0,umamiLevel:1,origin:"Mexico x USA",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"batch",item:"churro dough"},{qty:"1",unit:"pint",item:"vanilla ice cream"},{qty:"1/2",unit:"cup",item:"cinnamon sugar"}],method:[
      { step: 1, text: "Pipe the 1 batch churro dough onto parchment in tight, even spirals about 3 inches wide, keeping each disc uniform." },
      { step: 2, text: "Freeze the piped 1 batch churro dough spirals at 0°F for 20 minutes, until firm enough to lift without losing their shape." },
      { step: 3, text: "Fry the frozen spirals from the 1 batch churro dough in a 10-inch deep saucepan at 350°F for 3–4 minutes, turning once, until deeply golden and crisp." },
      { step: 4, text: "Toss the hot churro discs from the 1 batch churro dough in the 1/2 cup cinnamon sugar until evenly coated." },
      { step: 5, text: "Place a thick scoop of the 1 pint vanilla ice cream between two coated churro discs, then serve before the ice cream melts." }
    ],chefNotes:"Freezing the dough spirals prevents them from unraveling in the oil.",pairing:"Cold milk",mealSlots:["dessert"],healthy:false},
{slug:"matcha-churros",title:"Matcha Churros",subtitle:"Green tea spiked dough.",story:"Folding matcha powder directly into the choux pastry gives these churros an earthy flavor and a stunning green interior.",category:"Desserts",tags:["Vegetarian"],allergens:["dairy","gluten","egg"],difficulty:"Medium",prepTime:"15 min",cookTime:"15 min",servings:6,spiceLevel:0,umamiLevel:1,origin:"Mexico x Tokyo",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"cup",item:"flour"},{qty:"2",unit:"tbsp",item:"matcha"},{qty:"1",unit:"cup",item:"water"},{qty:"1/2",unit:"cup",item:"butter"}],method:[
      { step: 1, text: "Sift the 1 cup flour and 2 tbsp matcha into a bowl, breaking up lumps so the dough will have an even green color." },
      { step: 2, text: "Bring the 1 cup water and 1/2 cup butter to a full boil in a 2-quart saucepan over medium heat." },
      { step: 3, text: "Add the sifted 1 cup flour and 2 tbsp matcha to the boiling mixture, stirring over medium-low heat for 2 minutes until a smooth paste forms." },
      { step: 4, text: "Cool the paste for 10 minutes, then pipe the dough made from the 1 cup flour and 2 tbsp matcha into 4-inch lengths." },
      { step: 5, text: "Fry the dough made from the 1 cup flour, 2 tbsp matcha, 1 cup water, and 1/2 cup butter at 350°F for 3–4 minutes, turning once, until crisp." }
    ],chefNotes:"The dough must pull away from the sides of the pot before adding eggs.",pairing:"White chocolate sauce",mealSlots:["dessert"],healthy:false},
{slug:"mochi-churro-donuts",title:"Mochi Churro Donuts",subtitle:"Chewy baked rings.",story:"Using sweet rice flour in a donut pan creates a chewy, mochi-like interior with a crisp, cinnamon-dusted exterior.",category:"Desserts",tags:["Vegetarian","Gluten-Free"],allergens:["dairy","egg"],difficulty:"Easy",prepTime:"15 min",cookTime:"20 min",servings:6,spiceLevel:0,umamiLevel:1,origin:"USA x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"cup",item:"mochiko flour"},{qty:"1/2",unit:"cup",item:"sugar"},{qty:"1",unit:"tsp",item:"baking powder"},{qty:"1/2",unit:"cup",item:"milk"}],method:[
      { step: 1, text: "Whisk the 1 cup mochiko flour, 1/2 cup sugar, and 1 tsp baking powder in a bowl until evenly combined and lump-free." },
      { step: 2, text: "Stir the 1/2 cup milk into the dry mixture until a smooth, thick batter forms, with no dry pockets remaining." },
      { step: 3, text: "Pipe the batter made from the 1 cup mochiko flour and 1/2 cup milk into the cavities of a standard 6-cavity donut pan." },
      { step: 4, text: "Bake the 1 cup mochiko flour batter at 350°F for 20 minutes, until the donuts are lightly browned and spring back when pressed." },
      { step: 5, text: "Cool the donuts made with the 1/2 cup milk for 5 minutes in the pan, then remove them when firm enough to hold their shape." }
    ],chefNotes:"Do not over-bake, or the mochi will lose its signature chewiness.",pairing:"Cold brew coffee",mealSlots:["dessert"],healthy:false},
{slug:"cajeta-mochi-ice-cream",title:"Cajeta Mochi Ice Cream",subtitle:"Goat milk caramel hidden inside.",story:"Wrapping a scoop of cajeta-swirled ice cream in a thin layer of sweet mochi dough. A handheld explosion of caramel.",category:"Desserts",tags:["Vegetarian","Gluten-Free"],allergens:["dairy"],difficulty:"Advanced",prepTime:"45 min",cookTime:"5 min",servings:6,spiceLevel:0,umamiLevel:1,origin:"Celaya x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"pint",item:"vanilla ice cream"},{qty:"1/4",unit:"cup",item:"cajeta"},{qty:"1",unit:"cup",item:"sweet rice flour"}],method:[
      { step: 1, text: "Stir the 1/4 cup cajeta through the 1 pint vanilla ice cream, then freeze 2 hours until firm enough to scoop." },
      { step: 2, text: "Scoop the 1 pint vanilla ice cream into small rounds and freeze them on a lined plate for 1 hour until solid." },
      { step: 3, text: "Microwave the 1 cup sweet rice flour in a microwave-safe bowl for 1 minute, stirring halfway, until hot and dry." },
      { step: 4, text: "Spread the warmed 1 cup sweet rice flour over your work surface, then roll it thin and cut wide circles while warm." },
      { step: 5, text: "Wrap each frozen scoop of the 1 pint vanilla ice cream and 1/4 cup cajeta mixture in a circle, then freeze 2 hours." }
    ],chefNotes:"The ice cream scoops must be rock hard before you attempt to wrap them.",pairing:"Black tea",mealSlots:["dessert"],healthy:false},
{slug:"miso-chocolate-chip-cookies",title:"Miso Chocolate Chip Cookies",subtitle:"Salty, sweet, and deeply savory.",story:"Replacing the salt in a chocolate chip cookie with white miso creates an umami-rich dough that elevates the dark chocolate.",category:"Desserts",tags:["Vegetarian"],allergens:["dairy","gluten","egg","soy"],difficulty:"Easy",prepTime:"15 min",cookTime:"12 min",servings:12,spiceLevel:0,umamiLevel:2,origin:"USA x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"2",unit:"cups",item:"flour"},{qty:"1",unit:"cup",item:"brown sugar"},{qty:"3",unit:"tbsp",item:"white miso"},{qty:"1",unit:"cup",item:"chocolate chips"}],method:[
      { step: 1, text: "Preheat the oven to 350°F and line a 10-by-15-inch baking sheet while combining the 2 cups flour and 1 cup brown sugar." },
      { step: 2, text: "Stir the 3 tbsp white miso into the 2 cups flour and 1 cup brown sugar until the mixture is evenly moistened." },
      { step: 3, text: "Fold the 1 cup chocolate chips into the mixture of 2 cups flour, 1 cup brown sugar, and 3 tbsp white miso." },
      { step: 4, text: "Scoop the mixture containing the 2 cups flour and 1 cup chocolate chips onto the baking sheet, spacing portions apart." },
      { step: 5, text: "Bake at 350°F for 12 minutes, until the portions made with 2 cups flour have set and their edges look golden." },
      { step: 6, text: "Cool the cookies on the 10-by-15-inch baking sheet for 10 minutes, until firm enough to lift without breaking." }
    ],chefNotes:"Let the dough rest in the fridge for an hour to deepen the miso flavor.",pairing:"Cold milk",mealSlots:["dessert","snack"],healthy:false},
{slug:"matcha-flan",title:"Matcha Flan",subtitle:"Earthy green custard.",story:"Infusing the custard base of a Mexican flan with ceremonial matcha cuts the richness of the condensed milk beautifully.",category:"Desserts",tags:["Vegetarian","Gluten-Free"],allergens:["dairy","egg"],difficulty:"Medium",prepTime:"20 min",cookTime:"45 min",servings:6,spiceLevel:0,umamiLevel:1,origin:"Mexico x Kyoto",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"can",item:"condensed milk"},{qty:"1",unit:"tbsp",item:"matcha"},{qty:"1",unit:"cup",item:"sugar"},{qty:"4",unit:"",item:"eggs"}],method:[
      { step: 1, text: "Heat the 1 cup sugar in a saucepan over medium heat for 5 to 8 minutes, until fully melted and dark amber." },
      { step: 2, text: "Pour the hot 1 cup sugar caramel into ramekins and let it stand for 10 minutes, until hardened and glassy." },
      { step: 3, text: "Blend the 4 eggs, 1 can condensed milk, and 1 tbsp matcha for 1 minute, until smooth and uniformly green." },
      { step: 4, text: "Pour the blended 4 eggs, 1 can condensed milk, and 1 tbsp matcha over the hardened 1 cup sugar caramel." },
      { step: 5, text: "Bake the ramekins in a water bath at 325°F for 45 to 55 minutes, until the centers wobble slightly when shaken." },
      { step: 6, text: "Chill the flans made with 4 eggs, 1 can condensed milk, and 1 tbsp matcha overnight, until completely cold and firm." }
    ],chefNotes:"Blend the matcha with a tiny splash of hot water first to prevent clumps.",pairing:"Green tea",mealSlots:["dessert"],healthy:false},
{slug:"churro-bread-pudding",title:"Churro Bread Pudding",subtitle:"Crispy tops, soft interior.",story:"Using stale croissants tossed in cinnamon sugar as the base for a bread pudding creates a churro-like texture with custard underneath.",category:"Desserts",tags:["Vegetarian"],allergens:["dairy","gluten","egg"],difficulty:"Medium",prepTime:"15 min",cookTime:"45 min",servings:8,spiceLevel:0,umamiLevel:1,origin:"Mexico x Europe",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"4",unit:"cups",item:"stale bread cubes"},{qty:"2",unit:"cups",item:"milk"},{qty:"3",unit:"",item:"eggs"},{qty:"1",unit:"tbsp",item:"cinnamon"}],method:[
      { step: 1, text: "Heat the oven to 350°F, allowing it to fully preheat before baking the pudding." },
      { step: 2, text: "Place 4 cups stale bread cubes in an 8-inch square baking dish and sprinkle evenly with 1 tbsp cinnamon." },
      { step: 3, text: "Whisk 3 eggs with 2 cups milk in a bowl until the custard is smooth and evenly combined." },
      { step: 4, text: "Pour the custard over 4 cups stale bread cubes and let them soak for 20 minutes." },
      { step: 5, text: "Bake the pudding at 350°F for 45 minutes, until puffed, golden brown, and set in the center." },
      { step: 6, text: "Serve the baked pudding warm from the 8-inch dish once the edges are firm and the center has stopped jiggling." }
    ],chefNotes:"The bread must be truly stale to absorb the custard without becoming mush.",pairing:"Coffee",mealSlots:["dessert"],healthy:false},
{slug:"horchata-ice-cream",title:"Horchata Ice Cream",subtitle:"Cinnamon rice milk frozen solid.",story:"Churning a concentrated horchata base in an ice cream maker yields a refreshing, spiced dessert that melts beautifully on the tongue.",category:"Desserts",tags:["Vegetarian","Gluten-Free"],allergens:["dairy"],difficulty:"Medium",prepTime:"20 min",cookTime:"0 min",servings:6,spiceLevel:0,umamiLevel:1,origin:"Oaxaca x USA",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"2",unit:"cups",item:"heavy cream"},{qty:"1",unit:"cup",item:"horchata concentrate"},{qty:"1",unit:"tsp",item:"cinnamon"}],method:[
      { step: 1, text: "Whisk 2 cups heavy cream with 1 cup horchata concentrate in a medium bowl until fully combined." },
      { step: 2, text: "Stir 1 tsp cinnamon into the cream mixture until it is evenly distributed without visible clumps." },
      { step: 3, text: "Chill the 2 cups heavy cream mixture in the refrigerator for at least 2 hours until thoroughly cold." },
      { step: 4, text: "Pour the chilled mixture into an ice cream maker and churn for 20–30 minutes, until thick and softly holding swirls." },
      { step: 5, text: "Transfer the churned ice cream to a 1-quart freezer-safe container and freeze for at least 4 hours until scoopable." },
      { step: 6, text: "Scoop the frozen horchata ice cream after it firms, letting it stand for 5 minutes if it feels too hard to serve." }
    ],chefNotes:"Using a concentrate prevents the ice cream from becoming icy and hard.",pairing:"Churro bites",mealSlots:["dessert"],healthy:false},
{slug:"mexican-chocolate-mochi",title:"Mexican Chocolate Mochi",subtitle:"Spiced cocoa in a chewy shell.",story:"A rich ganache spiked with cinnamon and cayenne, wrapped in a soft mochi dough. An intense, warming bite.",category:"Desserts",tags:["Vegetarian","Gluten-Free"],allergens:["dairy"],difficulty:"Advanced",prepTime:"40 min",cookTime:"5 min",servings:6,spiceLevel:1,umamiLevel:1,origin:"Mexico x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"cup",item:"mochiko"},{qty:"4",unit:"oz",item:"Mexican chocolate"},{qty:"1/4",unit:"cup",item:"cream"}],method:[
      { step: 1, text: "Melt 4 oz Mexican chocolate with half the 1/4 cup cream in a microwave-safe bowl at 50% power, stirring every 30 seconds until smooth." },
      { step: 2, text: "Transfer the 4 oz chocolate mixture to a shallow 8-inch dish; chill for 45 minutes, then scoop and roll it into 8 firm balls." },
      { step: 3, text: "Microwave 1 cup mochiko with the reserved half of the 1/4 cup cream for 60 seconds; stir, then heat in 30-second bursts until tacky." },
      { step: 4, text: "Cool the 1 cup mochiko dough for 10 minutes, then roll it into a 1/8-inch sheet and cut 8 circles with a 3-inch cutter." },
      { step: 5, text: "Place one chilled chocolate ball on each mochiko circle; pinch the edges closed, then roll gently until each mochi is smooth and sealed." }
    ],chefNotes:"Keep your hands dusted with cornstarch; mochi dough is incredibly sticky.",pairing:"Espresso",mealSlots:["dessert"],healthy:false},
{slug:"piloncillo-matcha-creme-brulee",title:"Piloncillo Matcha Crème Brûlée",subtitle:"Earthy custard, raw sugar shell.",story:"The molasses notes of raw piloncillo sugar provide the perfect bruleed crust over a bitter, grassy matcha custard.",category:"Desserts",tags:["Vegetarian","Gluten-Free"],allergens:["dairy","egg"],difficulty:"Medium",prepTime:"15 min",cookTime:"35 min",servings:4,spiceLevel:0,umamiLevel:1,origin:"Mexico x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"2",unit:"cups",item:"heavy cream"},{qty:"1",unit:"tbsp",item:"matcha"},{qty:"4",unit:"",item:"egg yolks"},{qty:"1/4",unit:"cup",item:"grated piloncillo"}],method:[
      { step: 1, text: "Reserve 2 tablespoons of the 1/4 cup grated piloncillo for topping; whisk the remaining piloncillo with 4 egg yolks in a bowl." },
      { step: 2, text: "Heat 2 cups heavy cream in a medium saucepan over medium-low heat to 170°F, then whisk in 1 tbsp matcha until smooth." },
      { step: 3, text: "Slowly whisk the hot 2 cups heavy cream into the 4 egg yolks and piloncillo, keeping the custard fluid and free of curds." },
      { step: 4, text: "Pour the custard made with 2 cups heavy cream into four 6-ounce ramekins; bake on a 9-by-13-inch pan at 300°F for 35 minutes." },
      { step: 5, text: "Refrigerate the 2 cups heavy cream custards for at least 2 hours, until completely cold and firmly set in the centers." },
      { step: 6, text: "Sprinkle the reserved 2 tablespoons grated piloncillo over the cold custards, then torch until the tops bubble and turn glassy." }
    ],chefNotes:"Piloncillo burns faster than white sugar, so keep the torch moving constantly.",pairing:"Black tea",mealSlots:["dessert"],healthy:false},
{slug:"tamarind-mango-paleta",title:"Tamarind Mango Paleta",subtitle:"Sweet, sour, and frozen.",story:"A classic Mexican ice pop combining the tropical sweetness of mango with the tart, acidic punch of tamarind.",category:"Desserts",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"15 min",cookTime:"0 min",servings:6,spiceLevel:1,umamiLevel:1,origin:"Michoacán",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"2",unit:"cups",item:"mango chunks"},{qty:"1/4",unit:"cup",item:"tamarind paste"},{qty:"1",unit:"tbsp",item:"Tajín"}],method:[
      { step: 1, text: "Blend 2 cups mango chunks in a blender until completely smooth, scraping the sides once; the puree should look thick and uniform." },
      { step: 2, text: "Stir 1/4 cup tamarind paste into the smooth mango puree until evenly combined and no dark streaks remain." },
      { step: 3, text: "Divide the mango-tamarind mixture among popsicle molds, leaving space at the top, and insert sticks while level." },
      { step: 4, text: "Freeze the filled molds at 0°F for at least 6 hours, until the paletas are completely firm and no centers wobble." },
      { step: 5, text: "Unmold the frozen paletas under brief warm water, then sprinkle all 1 tbsp Tajín evenly over their surfaces." }
    ],chefNotes:"Do not fully blend the tamarind; the distinct swirls provide flavor contrast.",pairing:"Sparkling water",mealSlots:["snack","dessert"],healthy:true},
{slug:"miso-caramel-apple",title:"Miso Caramel Apple",subtitle:"A fall classic with umami.",story:"Dipping crisp tart apples into a miso-spiked caramel elevates the traditional fairground treat into a sophisticated dessert.",category:"Desserts",tags:["Vegetarian","Gluten-Free"],allergens:["dairy","soy"],difficulty:"Medium",prepTime:"15 min",cookTime:"15 min",servings:4,spiceLevel:0,umamiLevel:2,origin:"USA x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"4",unit:"",item:"Granny Smith apples"},{qty:"1",unit:"cup",item:"caramel candies"},{qty:"1",unit:"tbsp",item:"white miso"}],method:[
      { step: 1, text: "Wash 4 Granny Smith apples and dry them thoroughly; the skins must feel clean and completely free of surface moisture." },
      { step: 2, text: "Insert a skewer into the stem end of each of the 4 apples, pushing it firmly toward the core without splitting the fruit." },
      { step: 3, text: "Heat 1 cup caramel candies and 1 tbsp white miso in a small saucepan over low heat for 4 minutes, stirring until glossy." },
      { step: 4, text: "Dip each of the 4 apples into the warm caramel, turning slowly until fully coated and no green skin shows." },
      { step: 5, text: "Set the coated apples on parchment at room temperature for 30 minutes, until the caramel feels firm and no longer shines." }
    ],chefNotes:"If the apples are waxy, the caramel will slide off. Scrub them in hot water first.",pairing:"Hot cider",mealSlots:["dessert","snack"],healthy:false},
{slug:"chamoy-lime-cheesecake",title:"Chamoy Lime Cheesecake",subtitle:"Tart, creamy, and violently red.",story:"A no-bake lime cheesecake base gets a vibrant, spicy-sweet topping of chamoy reduction. A stunning visual and flavor contrast.",category:"Desserts",tags:["Vegetarian"],allergens:["dairy","gluten"],difficulty:"Easy",prepTime:"20 min",cookTime:"0 min",servings:8,spiceLevel:1,umamiLevel:1,origin:"Mexico x USA",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"2",unit:"blocks",item:"cream cheese"},{qty:"1/4",unit:"cup",item:"lime juice"},{qty:"1",unit:"cup",item:"graham cracker crumbs"},{qty:"1/4",unit:"cup",item:"chamoy"}],method:[
      { step: 1, text: "Press the 1 cup graham cracker crumbs firmly into the bottom of a 9-inch pie pan to create an even crust." },
      { step: 2, text: "Beat the 2 blocks cream cheese with the 1/4 cup lime juice until smooth, airy, and free of visible lumps." },
      { step: 3, text: "Pour the cream cheese mixture over the 1 cup graham cracker crumbs and chill the 9-inch pie pan for 4 hours until firm." },
      { step: 4, text: "Simmer the 1/4 cup chamoy in a small saucepan over medium-low heat for 5–8 minutes until glossy and thick enough to coat a spoon." },
      { step: 5, text: "Drizzle the cooled 1/4 cup chamoy syrup over the chilled cheesecake, then slice when the filling holds clean, defined edges." }
    ],chefNotes:"Ensure the cream cheese is at room temperature before beating to avoid lumps.",pairing:"Margarita",mealSlots:["dessert"],healthy:false},
{slug:"horchata-matcha-cake",title:"Horchata Matcha Layer Cake",subtitle:"Alternating sponges of flavor.",story:"Layers of cinnamon horchata sponge cake alternate with layers of vibrant green matcha sponge, bound by cream cheese frosting.",category:"Desserts",tags:["Vegetarian"],allergens:["dairy","gluten","egg"],difficulty:"Advanced",prepTime:"30 min",cookTime:"35 min",servings:8,spiceLevel:0,umamiLevel:1,origin:"Mexico x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"batch",item:"vanilla cake batter"},{qty:"1",unit:"tbsp",item:"matcha"},{qty:"2",unit:"tsp",item:"cinnamon"},{qty:"2",unit:"cups",item:"frosting"}],method:[
      { step: 1, text: "Divide the 1 batch vanilla cake batter evenly between two bowls, keeping the portions as equal as possible." },
      { step: 2, text: "Fold the 1 tbsp matcha into one bowl and the 2 tsp cinnamon into the other until each batter is evenly colored." },
      { step: 3, text: "Pour the two batters into separate 8-inch round cake pans and bake at 350°F for 25–30 minutes, until a toothpick comes out clean." },
      { step: 4, text: "Cool the two cakes made from the 1 batch vanilla cake batter completely, then slice off their domed tops with a serrated knife." },
      { step: 5, text: "Stack the leveled cakes with the 2 cups frosting between them, spreading it evenly until the layers sit straight and secure." }
    ],chefNotes:"Use gel food coloring if you want the green layer to be neon, though natural matcha is preferred.",pairing:"Cold milk",mealSlots:["dessert"],healthy:false},
{slug:"matcha-alfajores",title:"Matcha Alfajores",subtitle:"Crumbly cookies, dulce de leche.",story:"Traditional South American cornstarch cookies infused with matcha, sandwiching a thick layer of dulce de leche.",category:"Desserts",tags:["Vegetarian"],allergens:["dairy","gluten","egg"],difficulty:"Medium",prepTime:"20 min",cookTime:"12 min",servings:12,spiceLevel:0,umamiLevel:1,origin:"Argentina x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"cup",item:"cornstarch"},{qty:"1",unit:"cup",item:"flour"},{qty:"1",unit:"tbsp",item:"matcha"},{qty:"1/2",unit:"cup",item:"dulce de leche"}],method:[
      { step: 1, text: "Whisk the 1 cup cornstarch, 1 cup flour, and 1 tbsp matcha in a bowl until the dry mixture is evenly green." },
      { step: 2, text: "Gather the mixture of 1 cup cornstarch, 1 cup flour, and 1 tbsp matcha into a cohesive dough without leaving dry pockets." },
      { step: 3, text: "Roll the dough evenly on a lightly prepared surface and cut uniform circles, rerolling scraps until all dough is used." },
      { step: 4, text: "Arrange the dough circles on a baking sheet and bake at 350°F for 10–12 minutes, removing them while pale and set." },
      { step: 5, text: "Cool the cookies completely, then sandwich pairs with the 1/2 cup dulce de leche until the filling reaches each edge." }
    ],chefNotes:"The high cornstarch content makes the dough fragile. Handle gently.",pairing:"Coffee",mealSlots:["dessert","snack"],healthy:false},
{slug:"miso-brownies",title:"Miso Brownies",subtitle:"Fudgy, salty dark chocolate.",story:"White miso replaces salt in this dense, fudgy brownie recipe, heightening the dark chocolate and providing a chewy, satisfying edge.",category:"Desserts",tags:["Vegetarian"],allergens:["dairy","gluten","egg","soy"],difficulty:"Easy",prepTime:"15 min",cookTime:"25 min",servings:9,spiceLevel:0,umamiLevel:2,origin:"USA x Japan",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"cup",item:"dark chocolate"},{qty:"1/2",unit:"cup",item:"butter"},{qty:"2",unit:"tbsp",item:"white miso"},{qty:"3",unit:"",item:"eggs"}],method:[
      { step: 1, text: "Preheat the oven to 350°F (175°C) and line an 8-inch square pan before mixing the 1 cup dark chocolate, 1/2 cup butter, 2 tbsp white miso, and 3 eggs." },
      { step: 2, text: "Melt the 1 cup dark chocolate and 1/2 cup butter together in a heatproof bowl over a double boiler until smooth, then remove from heat." },
      { step: 3, text: "Whisk the 2 tbsp white miso into the melted 1 cup dark chocolate and 1/2 cup butter until completely smooth and glossy." },
      { step: 4, text: "Beat the 3 eggs into the chocolate mixture, adding them one at a time, until the batter looks uniform and glossy." },
      { step: 5, text: "Bake the batter in the prepared 8-inch square pan at 350°F (175°C) for 25 minutes, until the edges set and the center remains fudgy." }
    ],chefNotes:"Underbake these slightly; they will set as they cool in the pan.",pairing:"Red wine",mealSlots:["dessert"],healthy:false},
{slug:"tamarind-gummy-candy",title:"Tamarind Gummy Candy",subtitle:"Chewy, sour, chili-dusted.",story:"Making homemade gummies with concentrated tamarind paste yields an incredibly sour, chewy candy heavily coated in chili powder.",category:"Desserts",tags:["Dairy-Free","Gluten-Free"],allergens:[],difficulty:"Medium",prepTime:"15 min",cookTime:"10 min",servings:8,spiceLevel:1,umamiLevel:1,origin:"Mexico",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1/2",unit:"cup",item:"tamarind paste"},{qty:"3",unit:"tbsp",item:"gelatin"},{qty:"1",unit:"cup",item:"sugar"},{qty:"1",unit:"tbsp",item:"Tajín"}],method:[
      { step: 1, text: "Place the 1/2 cup tamarind paste in a small saucepan and sprinkle over the 3 tbsp gelatin; let it stand for 5 minutes to hydrate." },
      { step: 2, text: "Add the 1 cup sugar to the saucepan and heat over medium heat, stirring constantly, until the tamarind mixture reaches a gentle boil." },
      { step: 3, text: "Continue heating the 1/2 cup tamarind paste, 1 cup sugar, and 3 tbsp gelatin for 2 minutes, stirring until the gelatin dissolves completely." },
      { step: 4, text: "Pour the hot mixture into silicone molds and refrigerate for at least 2 hours, until the gummies are completely firm and springy." },
      { step: 5, text: "Unmold the chilled gummies and toss them with the 1 tbsp Tajín until each piece is lightly and evenly coated before serving." }
    ],chefNotes:"These gummies will melt in extreme heat, so keep them refrigerated.",pairing:"Agua fresca",mealSlots:["snack"],healthy:true},
{slug:"coconut-matcha-rice-pudding",title:"Coconut Matcha Rice Pudding",subtitle:"Creamy, green, comforting.",story:"Cooking short-grain rice in coconut milk creates a luscious pudding. Whisking in matcha adds a vibrant color and earthy finish.",category:"Desserts",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"5 min",cookTime:"30 min",servings:4,spiceLevel:0,umamiLevel:1,origin:"Asia",heroImage:snackBitesHero,thumbImage:snackBitesHero,ingredients:[{qty:"1",unit:"cup",item:"sushi rice"},{qty:"2",unit:"cans",item:"coconut milk"},{qty:"1",unit:"tbsp",item:"matcha"},{qty:"1/2",unit:"cup",item:"sugar"}],method:[
      { step: 1, text: "Rinse the 1 cup sushi rice under cold water until the water runs mostly clear, then drain it thoroughly before cooking." },
      { step: 2, text: "Combine the rinsed 1 cup sushi rice and 2 cans coconut milk in a 3-quart saucepan, stirring to prevent sticking." },
      { step: 3, text: "Bring the 1 cup sushi rice and 2 cans coconut milk to a gentle simmer over medium heat, then cook for 25 minutes." },
      { step: 4, text: "Stir the simmering rice and 2 cans coconut milk frequently during cooking, keeping the heat low until the rice is tender and creamy." },
      { step: 5, text: "Stir in the 1/2 cup sugar during the final 5 minutes of cooking, until it dissolves and the pudding thickens noticeably." },
      { step: 6, text: "Whisk the 1 tbsp matcha into the hot pudding until evenly green and smooth, then serve the pudding warm or chilled." }
    ],chefNotes:"Stir frequently while simmering to prevent the rice from scorching on the bottom.",pairing:"Hot tea",mealSlots:["dessert"],healthy:true}
,
{slug:"horchata-matcha-latte",title:"Horchata Matcha Latte",subtitle:"Earthy, creamy, spiced iced drink.",story:"The rich, cinnamon-laced sweetness of horchata forms the base, while a potent shot of whisked matcha floats on top.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:1,origin:"Oaxaca x Kyoto",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"1",unit:"cup",item:"horchata"},{qty:"1",unit:"tsp",item:"matcha"},{qty:"1",unit:"cup",item:"ice"}],method:[
      { step: 1, text: "Set out a tall glass and measure the 1 cup horchata, 1 tsp matcha, and 1 cup ice before mixing." },
      { step: 2, text: "Fill the tall glass with the 1 cup ice, leaving about 1 inch of space below the rim." },
      { step: 3, text: "Whisk the 1 tsp matcha into the 1 cup chilled horchata for 30 seconds until smooth and lightly frothy." },
      { step: 4, text: "Pour the matcha-horchata mixture over the 1 cup ice in a slow, steady stream until the glass is nearly full." },
      { step: 5, text: "Serve the 1 cup horchata and 1 tsp matcha immediately over the 1 cup ice, stirring until evenly green." }
    ],chefNotes:"Pouring the matcha directly over an ice cube helps maintain the visual layers.",pairing:"Churros",mealSlots:["snack","breakfast"],healthy:true},
{slug:"jalapeno-margarita-yuzu",title:"Jalapeño Margarita",subtitle:"Spicy citrus refreshment.",story:"Replacing hard-to-find yuzu with a mix of lime and grapefruit zest mimics its floral aroma perfectly. Jalapeño adds a sharp bite.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:2,umamiLevel:1,origin:"Mexico x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"tequila"},{qty:"1",unit:"oz",item:"lime juice"},{qty:"3",unit:"slices",item:"jalapeño"},{qty:"1",unit:"pinch",item:"grapefruit zest"}],method:[
      { step: 1, text: "Chill a rocks glass and cocktail shaker for 10 minutes, then measure the 2 oz tequila, 1 oz lime juice, 3 slices jalapeño, and 1 pinch grapefruit zest." },
      { step: 2, text: "Muddle the 3 slices jalapeño in the chilled shaker for 20 seconds until they release juice and look slightly crushed." },
      { step: 3, text: "Add the 2 oz tequila, 1 oz lime juice, and 1 pinch grapefruit zest to the shaker with the muddled 3 slices jalapeño." },
      { step: 4, text: "Seal the shaker and shake the 2 oz tequila mixture vigorously for 15 seconds until cold, cloudy, and lightly frothy." },
      { step: 5, text: "Strain the 2 oz tequila, 1 oz lime juice, 3 slices jalapeño, and 1 pinch grapefruit zest into the chilled rocks glass and serve immediately." }
    ],chefNotes:"Remove jalapeño seeds before muddling if you prefer a milder drink.",pairing:"Chips and salsa",mealSlots:["snack","dinner"],healthy:true},
{slug:"tamarind-agua-fresca",title:"Tamarind Agua Fresca",subtitle:"Tart, deeply refreshing.",story:"Boiling raw tamarind pods extracts their intense, sour flavor. Diluted with water and sweetened, it is the ultimate thirst quencher.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Medium",prepTime:"10 min",cookTime:"20 min",servings:4,spiceLevel:0,umamiLevel:1,origin:"Mexico",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"10",unit:"",item:"tamarind pods"},{qty:"4",unit:"cups",item:"water"},{qty:"1/4",unit:"cup",item:"sugar"}],method:[
      { step: 1, text: "Peel the hard shells from the 10 tamarind pods, removing loose shell fragments while keeping the sticky pulp intact." },
      { step: 2, text: "Place the 10 tamarind pods and 4 cups water in a saucepan, then boil at 212°F for 15 minutes until the pulp softens." },
      { step: 3, text: "Cool the boiled 10 tamarind pods and 4 cups water for 10 minutes, then mash the pulp through a fine strainer until only seeds and fibers remain." },
      { step: 4, text: "Stir the 1/4 cup sugar into the strained liquid from the 10 tamarind pods and 4 cups water until fully dissolved." },
      { step: 5, text: "Chill the tamarind drink for at least 1 hour, then serve the 10-pod mixture with 1/4 cup sugar when cold and evenly blended." }
    ],chefNotes:"Using whole pods provides a brighter flavor than pre-made concentrate.",pairing:"Tacos",mealSlots:["lunch","dinner"],healthy:true},
{slug:"matcha-arnold-palmer",title:"Matcha Arnold Palmer",subtitle:"Green tea and lemonade.",story:"Replacing traditional black tea with iced matcha brings a grassy, vibrant green contrast to the tart, sweet lemonade.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:1,origin:"USA x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"1/2",unit:"cup",item:"lemonade"},{qty:"1/2",unit:"cup",item:"iced matcha"},{qty:"1",unit:"cup",item:"ice"}],method:[
      { step: 1, text: "Measure the 1/2 cup lemonade and 1/2 cup iced matcha, keeping both chilled so the finished drink stays cold." },
      { step: 2, text: "Fill a tall glass with the 1 cup ice, leaving room for the 1/2 cup lemonade and 1/2 cup iced matcha." },
      { step: 3, text: "Pour the 1/2 cup lemonade over the 1 cup ice, filling the glass halfway and keeping the ice mostly submerged." },
      { step: 4, text: "Slowly pour the 1/2 cup iced matcha over the lemonade so two distinct layers remain visible." },
      { step: 5, text: "Stir the 1/2 cup lemonade, 1/2 cup iced matcha, and 1 cup ice until the drink looks evenly green and yellow." }
    ],chefNotes:"Freshly squeezed lemonade makes a massive difference here.",pairing:"Sandwich",mealSlots:["lunch"],healthy:true},
{slug:"chamoy-michelada",title:"Chamoy Michelada",subtitle:"Salty, spicy beer cocktail.",story:"Coating the rim of a cold glass in chamoy and Tajín before pouring in a lime-spiked Mexican lager creates a savory, thirst-quenching masterpiece.",category:"Drinks",tags:["Dairy-Free"],allergens:["gluten","soy"],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:1,umamiLevel:2,origin:"Mexico",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"1",unit:"bottle",item:"Mexican lager"},{qty:"1",unit:"oz",item:"lime juice"},{qty:"2",unit:"tbsp",item:"chamoy"},{qty:"1",unit:"tbsp",item:"Tajín"}],method:[
      { step: 1, text: "Chill the 1 bottle Mexican lager for at least 30 minutes, until ice-cold and ready to pour with minimal foam." },
      { step: 2, text: "Pour the 2 tbsp chamoy onto a small plate, then dip the rim of a pint glass into it for an even coating." },
      { step: 3, text: "Press the chamoy-coated rim into the 1 tbsp Tajín until the seasoning forms a complete, visibly even crust." },
      { step: 4, text: "Pour the 1 oz lime juice into the prepared pint glass, keeping it below the seasoned rim." },
      { step: 5, text: "Slowly pour the 1 bottle Mexican lager down the inside of the glass, pausing if the foam rises." },
      { step: 6, text: "Serve the 1 bottle Mexican lager mixture immediately while cold, with the 1 oz lime juice and seasoned rim intact." }
    ],chefNotes:"Do not add ice; simply use the coldest beer possible.",pairing:"Ceviche",mealSlots:["lunch","dinner"],healthy:false},
{slug:"mezcal-hibiscus-tonic",title:"Mezcal Hibiscus Tonic",subtitle:"Smoky and floral.",story:"The deep smoke of artisanal mezcal pairs beautifully with the tart, floral notes of brewed hibiscus tea. Tonic water adds bubbles and bitter quinine.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:1,origin:"Oaxaca",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"mezcal"},{qty:"1",unit:"oz",item:"hibiscus tea"},{qty:"3",unit:"oz",item:"tonic water"}],method:[
      { step: 1, text: "Chill the 1 oz hibiscus tea for at least 30 minutes, until completely cold and deep red before mixing the drink." },
      { step: 2, text: "Pour the 2 oz mezcal into a chilled highball glass, keeping the pour steady and the glass upright." },
      { step: 3, text: "Add the 1 oz chilled hibiscus tea to the 2 oz mezcal, then stir until the color looks evenly ruby-red." },
      { step: 4, text: "Slowly add the 3 oz tonic water to the 2 oz mezcal and 1 oz hibiscus tea, stopping when the bubbles rise." },
      { step: 5, text: "Stir the 2 oz mezcal, 1 oz hibiscus tea, and 3 oz tonic water gently once, then serve while visibly sparkling." }
    ],chefNotes:"A high-quality tonic water is essential, as cheap ones are too sweet.",pairing:"Guacamole",mealSlots:["dinner"],healthy:true},
{slug:"agua-fresca-watermelon-shiso",title:"Watermelon Shiso Agua Fresca",subtitle:"Sweet melon with herbal mint notes.",story:"Watermelon agua fresca is ubiquitous. Blending in fresh shiso leaves adds a complex, minty-basil aroma that elevates the drink.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"10 min",cookTime:"0 min",servings:4,spiceLevel:0,umamiLevel:1,origin:"Mexico x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"4",unit:"cups",item:"watermelon chunks"},{qty:"4",unit:"leaves",item:"shiso"},{qty:"1",unit:"tbsp",item:"lime juice"}],method:[
      { step: 1, text: "Pick through the 4 cups watermelon chunks and remove every seed, leaving the flesh visibly seed-free." },
      { step: 2, text: "Place the seed-free 4 cups watermelon chunks, 4 shiso leaves, and 1 tbsp lime juice in a blender." },
      { step: 3, text: "Blend the 4 cups watermelon chunks, 4 shiso leaves, and 1 tbsp lime juice on high for 30 seconds until fully liquid." },
      { step: 4, text: "Pour the blended 4 cups watermelon mixture through a fine-mesh sieve until the strained drink looks smooth." },
      { step: 5, text: "Serve the strained drink made with 4 cups watermelon chunks, 4 shiso leaves, and 1 tbsp lime juice immediately." }
    ],chefNotes:"If you cannot find shiso, a mix of fresh mint and basil mimics it well.",pairing:"Spicy tacos",mealSlots:["lunch"],healthy:true},
{slug:"miso-whiskey-sour",title:"Miso Whiskey Sour",subtitle:"A classic cocktail with savory depth.",story:"Dissolving a tiny amount of white miso into simple syrup creates a savory backbone that perfectly complements the oak of bourbon.",category:"Drinks",tags:["Dairy-Free","Gluten-Free"],allergens:["soy"],difficulty:"Medium",prepTime:"10 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:2,origin:"USA x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"bourbon"},{qty:"1",unit:"oz",item:"lemon juice"},{qty:"1/2",unit:"oz",item:"miso simple syrup"},{qty:"1",unit:"",item:"egg white"}],method:[
      { step: 1, text: "Measure the 2 oz bourbon, 1 oz lemon juice, 1/2 oz miso simple syrup, and 1 egg white into a cocktail shaker." },
      { step: 2, text: "Shake the 2 oz bourbon, 1 oz lemon juice, 1/2 oz miso simple syrup, and 1 egg white without ice for 15 seconds." },
      { step: 3, text: "Shake the mixture containing the 2 oz bourbon, 1 oz lemon juice, 1/2 oz syrup, and 1 egg white for 15 seconds until foamy." },
      { step: 4, text: "Strain the drink made with the 2 oz bourbon, 1 oz lemon juice, 1/2 oz syrup, and 1 egg white into a coupe glass." },
      { step: 5, text: "Serve the strained 2 oz bourbon cocktail when the 1 egg white forms a smooth, pale foam across the surface." }
    ],chefNotes:"The dry shake is mandatory for a thick, luxurious foam.",pairing:"Pork skewers",mealSlots:["dinner"],healthy:false},
{slug:"tajin-bloody-mary-miso",title:"Tajín Bloody Mary",subtitle:"Spicy tomato with umami punch.",story:"Upgrading a bloody mary by using Tajín on the rim and a dash of miso in the tomato juice creates the ultimate savory brunch cocktail.",category:"Drinks",tags:["Dairy-Free"],allergens:["soy"],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:2,umamiLevel:3,origin:"Mexico x USA",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"vodka"},{qty:"4",unit:"oz",item:"tomato juice"},{qty:"1",unit:"tsp",item:"white miso"},{qty:"1",unit:"tbsp",item:"Tajín"}],method:[
      { step: 1, text: "Measure the 2 oz vodka, 4 oz tomato juice, 1 tsp white miso, and 1 tbsp Tajín before mixing the drink." },
      { step: 2, text: "Whisk the 1 tsp white miso into the 4 oz tomato juice for 30 seconds until no pale streaks remain." },
      { step: 3, text: "Pour the 2 oz vodka into the miso-tomato mixture and stir for 10 seconds until the color looks evenly blended." },
      { step: 4, text: "Stir the 1 tbsp Tajín into the mixture of 2 oz vodka and 4 oz tomato juice until the seasoning is evenly dispersed." },
      { step: 5, text: "Pour the finished drink containing 2 oz vodka, 4 oz tomato juice, 1 tsp miso, and 1 tbsp Tajín into a tall glass." }
    ],chefNotes:"The miso replaces the traditional Worcestershire sauce, offering a cleaner umami.",pairing:"Eggs benedict",mealSlots:["breakfast","lunch"],healthy:true},
{slug:"horchata-cold-brew-float",title:"Horchata Cold Brew Float",subtitle:"Caffeine and cinnamon.",story:"Pouring intense, bitter cold brew coffee over a scoop of horchata ice cream creates a creamy, melting morning treat.",category:"Drinks",tags:["Vegetarian","Gluten-Free"],allergens:["dairy"],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:1,origin:"Mexico x USA",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"1",unit:"cup",item:"cold brew coffee"},{qty:"1",unit:"scoop",item:"horchata ice cream"}],method:[
      { step: 1, text: "Chill the 1 cup cold brew coffee in the refrigerator for at least 30 minutes, until the liquid feels cold." },
      { step: 2, text: "Set a 10-ounce serving glass on a stable surface, then place the 1 scoop horchata ice cream into its center." },
      { step: 3, text: "Slowly pour the chilled 1 cup cold brew coffee over the 1 scoop horchata ice cream for 15 seconds." },
      { step: 4, text: "Wait 1 minute, watching the 1 scoop horchata ice cream soften and form pale swirls through the 1 cup cold brew coffee." },
      { step: 5, text: "Serve the 1 cup cold brew coffee and 1 scoop horchata ice cream immediately, when the scoop is partly melted but still visible." }
    ],chefNotes:"Do not add ice, as it will dilute the melting cream.",pairing:"Pan dulce",mealSlots:["breakfast","snack"],healthy:false},
{slug:"matcha-mojito",title:"Matcha Mojito",subtitle:"Mint, lime, rum, and green tea.",story:"The grassy notes of matcha pair brilliantly with fresh mint and white rum, creating a vivid green, highly refreshing cocktail.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:1,origin:"Cuba x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"white rum"},{qty:"1",unit:"tsp",item:"matcha"},{qty:"1",unit:"oz",item:"lime juice"},{qty:"6",unit:"leaves",item:"mint"},{qty:"2",unit:"oz",item:"club soda"}],method:[
      { step: 1, text: "Place the 6 mint leaves and 1 oz lime juice in a chilled 10-ounce glass, then muddle gently for 10 seconds." },
      { step: 2, text: "Whisk the 1 tsp matcha into the 2 oz white rum for 20 seconds, until the mixture looks smooth and evenly green." },
      { step: 3, text: "Pour the 2 oz white rum and 1 tsp matcha mixture over the 6 mint leaves and 1 oz lime juice." },
      { step: 4, text: "Stir the combined 2 oz white rum, 1 tsp matcha, 1 oz lime juice, and 6 mint leaves for 5 seconds." },
      { step: 5, text: "Top the mixture with the 2 oz club soda over 10 seconds, then stir once until bubbles rise and the drink looks evenly mixed." }
    ],chefNotes:"Do not shred the mint when muddling; just press it to release the oils.",pairing:"Fish tacos",mealSlots:["dinner"],healthy:true},
{slug:"cucumber-jalapeno-seltzer",title:"Cucumber Jalapeño Seltzer",subtitle:"Crisp, cooling, with a bite.",story:"A mocktail that relies on the intense cooling power of cucumber water, punctuated by the sharp heat of fresh jalapeño.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"10 min",cookTime:"0 min",servings:1,spiceLevel:2,umamiLevel:1,origin:"Mexico",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"cucumber juice"},{qty:"2",unit:"slices",item:"jalapeño"},{qty:"4",unit:"oz",item:"sparkling water"}],method:[
      { step: 1, text: "Chill a 10-ounce glass for 15 minutes, then measure the 2 oz cucumber juice until it is visibly cold." },
      { step: 2, text: "Place the 2 slices jalapeño in the chilled glass and muddle them gently for 10 seconds until fragrant." },
      { step: 3, text: "Pour the 2 oz cucumber juice over the muddled 2 slices jalapeño and wait 15 seconds for the color to settle." },
      { step: 4, text: "Add the 4 oz sparkling water slowly over 10 seconds, watching a steady stream of bubbles rise through the 2 oz cucumber juice." },
      { step: 5, text: "Stir the 2 oz cucumber juice, 2 slices jalapeño, and 4 oz sparkling water once for 5 seconds until evenly blended." }
    ],chefNotes:"Leave the jalapeño seeds in for a much spicier drink.",pairing:"Chips and guacamole",mealSlots:["lunch","snack"],healthy:true},
{slug:"hibiscus-iced-tea-miso",title:"Hibiscus Iced Tea",subtitle:"Floral tea sweetened with miso honey.",story:"Agua de jamaica is famously tart. Sweetening it with honey that has been blended with white miso adds an addictive savory finish.",category:"Drinks",tags:["Vegetarian","Gluten-Free"],allergens:["soy"],difficulty:"Easy",prepTime:"5 min",cookTime:"15 min",servings:4,spiceLevel:0,umamiLevel:2,origin:"Mexico x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"1/2",unit:"cup",item:"dried hibiscus flowers"},{qty:"4",unit:"cups",item:"water"},{qty:"2",unit:"tbsp",item:"honey"},{qty:"1",unit:"tsp",item:"white miso"}],method:[
      { step: 1, text: "Combine the 1/2 cup dried hibiscus flowers and 4 cups water in a 2-quart saucepan; boil at 212°F for 15 minutes." },
      { step: 2, text: "Strain the 1/2 cup dried hibiscus flowers from the 4 cups water, then cool the deep-red tea until it stops steaming." },
      { step: 3, text: "Whisk the 2 tbsp honey and 1 tsp white miso in a small bowl for 1 minute until completely smooth and glossy." },
      { step: 4, text: "Stir the 2 tbsp honey and 1 tsp white miso into the warm tea for 1 minute until fully dissolved and evenly blended." },
      { step: 5, text: "Cool the tea made with the 4 cups water, 2 tbsp honey, and 1 tsp white miso for about 20 minutes until no longer warm." }
    ],chefNotes:"The miso must be dissolved while the tea is still warm to prevent clumping.",pairing:"Chicken tinga",mealSlots:["lunch"],healthy:true},
{slug:"tamarind-paloma",title:"Tamarind Paloma",subtitle:"Grapefruit soda and sour tamarind.",story:"The classic Paloma uses grapefruit soda. Adding a spoonful of tamarind concentrate deepens the color and amps up the tartness dramatically.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:1,origin:"Mexico",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"tequila blanco"},{qty:"1",unit:"tbsp",item:"tamarind concentrate"},{qty:"4",unit:"oz",item:"grapefruit soda"},{qty:"1",unit:"pinch",item:"salt"}],method:[
      { step: 1, text: "Stir the 2 oz tequila blanco and 1 tbsp tamarind concentrate in a glass for 30 seconds until the mixture looks uniform." },
      { step: 2, text: "Add the 1 pinch salt to the 2 oz tequila blanco and 1 tbsp tamarind concentrate, then stir for 15 seconds." },
      { step: 3, text: "Pour the tequila mixture containing the 2 oz tequila blanco and 1 tbsp tamarind concentrate into a tall glass." },
      { step: 4, text: "Slowly add the 4 oz grapefruit soda to the 2 oz tequila blanco mixture, preserving visible bubbles on the surface." },
      { step: 5, text: "Stir the drink containing 2 oz tequila blanco, 1 tbsp tamarind concentrate, 4 oz grapefruit soda, and 1 pinch salt once." }
    ],chefNotes:"Use a Mexican grapefruit soda like Squirt for the most authentic flavor.",pairing:"Pork carnitas",mealSlots:["dinner"],healthy:true},
{slug:"matcha-lemonade",title:"Sparkling Matcha Lemonade",subtitle:"Bubbly, tart, and grassy.",story:"Combining fresh lemonade with sparkling water and a float of ceremonial matcha creates a visually stunning, highly refreshing afternoon drink.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:1,origin:"USA x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"lemon juice"},{qty:"1",unit:"oz",item:"simple syrup"},{qty:"1",unit:"tsp",item:"matcha"},{qty:"3",unit:"oz",item:"sparkling water"}],method:[
      { step: 1, text: "Stir the 2 oz lemon juice and 1 oz simple syrup in a glass for 30 seconds until the base looks evenly combined." },
      { step: 2, text: "Whisk the 1 tsp matcha into the lemon-and-syrup base for 45 seconds until smooth, bright green, and free of dry flecks." },
      { step: 3, text: "Pour the mixture made from the 2 oz lemon juice, 1 oz simple syrup, and 1 tsp matcha into a serving glass." },
      { step: 4, text: "Slowly top the matcha mixture with the 3 oz sparkling water, stopping when fine bubbles visibly cover the surface." },
      { step: 5, text: "Stir the 2 oz lemon juice, 1 oz simple syrup, 1 tsp matcha, and 3 oz sparkling water for 10 seconds before serving." }
    ],chefNotes:"Using warm water to whisk the matcha ensures it doesn't clump.",pairing:"Salad",mealSlots:["lunch"],healthy:true},
{slug:"agua-fresca-cucumber-lime-shiso",title:"Cucumber Lime Shiso",subtitle:"The ultimate cooler.",story:"Blending cucumber and lime into a classic agua fresca, elevated by the aromatic mint-basil notes of fresh shiso leaves.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"10 min",cookTime:"0 min",servings:4,spiceLevel:0,umamiLevel:1,origin:"Mexico x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"",item:"cucumbers"},{qty:"1/4",unit:"cup",item:"lime juice"},{qty:"6",unit:"leaves",item:"shiso"}],method:[
      { step: 1, text: "Wash the 2 cucumbers under cool running water, checking that their skins are clean and firm before preparation." },
      { step: 2, text: "Peel and roughly chop the 2 cucumbers into blender-sized pieces, removing any visibly bitter or damaged skin." },
      { step: 3, text: "Add the chopped 2 cucumbers, 1/4 cup lime juice, and 6 shiso leaves to a blender, with no added liquid." },
      { step: 4, text: "Blend the 2 cucumbers, 1/4 cup lime juice, and 6 shiso leaves for 60 seconds, until the mixture looks smooth and bright green." },
      { step: 5, text: "Pour the blended 2 cucumbers, 1/4 cup lime juice, and 6 shiso leaves through a fine-mesh sieve for 2 minutes." },
      { step: 6, text: "Serve the strained drink immediately, checking that the liquid made from 2 cucumbers, 1/4 cup lime juice, and 6 shiso leaves is clear and green." }
    ],chefNotes:"English cucumbers are best as they have fewer bitter seeds.",pairing:"Spicy tuna bites",mealSlots:["lunch"],healthy:true},
{slug:"ponzu-spritz",title:"Ponzu Citrus Spritz",subtitle:"A savory, tart mocktail.",story:"A daring mocktail that uses a few drops of citrus-soy ponzu to add a deeply savory, complex backbone to a standard citrus spritz.",category:"Drinks",tags:["Dairy-Free"],allergens:["soy","gluten"],difficulty:"Medium",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:2,origin:"Osaka",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"1",unit:"oz",item:"orange juice"},{qty:"1/2",unit:"tsp",item:"ponzu sauce"},{qty:"4",unit:"oz",item:"tonic water"}],method:[
      { step: 1, text: "Place a 10-ounce glass on a stable surface and measure 1 oz orange juice and 1/2 tsp ponzu sauce into it." },
      { step: 2, text: "Stir the 1 oz orange juice and 1/2 tsp ponzu sauce for 10 seconds, until the mixture looks evenly combined." },
      { step: 3, text: "Pour 4 oz tonic water slowly into the glass containing the 1 oz orange juice and 1/2 tsp ponzu sauce." },
      { step: 4, text: "Stir the 1 oz orange juice, 1/2 tsp ponzu sauce, and 4 oz tonic water gently for 5 seconds to preserve bubbles." },
      { step: 5, text: "Serve the drink immediately, when the 4 oz tonic water still looks visibly effervescent and the 1/2 tsp ponzu is dispersed." }
    ],chefNotes:"Use a high-quality ponzu; cheap ones are too heavily salted.",pairing:"Edamame",mealSlots:["snack"],healthy:true},
{slug:"chamoy-tajin-mangonada",title:"Chamoy Tajín Mangonada",subtitle:"Frozen mango and chili sorbet.",story:"A classic Mexican street treat. Frozen mango blended into a thick slush, layered heavily with sour chamoy and spicy Tajín.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"10 min",cookTime:"0 min",servings:2,spiceLevel:2,umamiLevel:1,origin:"Mexico",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"cups",item:"frozen mango"},{qty:"1/4",unit:"cup",item:"chamoy"},{qty:"1",unit:"tbsp",item:"Tajín"}],method:[
      { step: 1, text: "Place the 2 cups frozen mango in a blender and blend for 60 seconds, until smooth, thick, and spoonable." },
      { step: 2, text: "Pour the 1/4 cup chamoy into a serving glass, tilting it to coat the inside walls and bottom evenly." },
      { step: 3, text: "Spoon half of the blended mixture from the 2 cups frozen mango into the chamoy-coated glass, forming an even layer." },
      { step: 4, text: "Sprinkle the 1 tbsp Tajín over the mango layer, covering it evenly so the red seasoning is visibly distributed." },
      { step: 5, text: "Add the remaining blended mixture from the 2 cups frozen mango and serve immediately, while the slush remains thick and cold." }
    ],chefNotes:"You must use frozen mango to achieve the thick, sorbet-like texture.",pairing:"Tortilla chips",mealSlots:["snack"],healthy:true},
{slug:"miso-hot-toddy",title:"Miso Honey Hot Toddy",subtitle:"Warming, savory winter drink.",story:"A hot toddy cures everything. Adding a dash of white miso to the honey provides a soothing, brothy quality that warms the soul.",category:"Drinks",tags:["Dairy-Free","Gluten-Free"],allergens:["soy"],difficulty:"Easy",prepTime:"5 min",cookTime:"5 min",servings:1,spiceLevel:0,umamiLevel:2,origin:"USA x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"whiskey"},{qty:"1",unit:"tbsp",item:"honey"},{qty:"1/2",unit:"tsp",item:"white miso"},{qty:"1",unit:"oz",item:"lemon juice"}],method:[
      { step: 1, text: "Combine the 1 tbsp honey and 1/2 tsp white miso in a small saucepan, whisking until the mixture is smooth." },
      { step: 2, text: "Whisk the 1 oz lemon juice and 2 oz whiskey into the honey-miso mixture until evenly combined." },
      { step: 3, text: "Heat the saucepan over low heat for 2 minutes, stirring constantly until steaming and fully dissolved without boiling." },
      { step: 4, text: "Pour the hot mixture into a heatproof mug and check that the surface looks smooth with no visible miso streaks." },
      { step: 5, text: "Serve the 2 oz whiskey toddy immediately while hot, and sip slowly once the drink is warm but comfortable to drink." }
    ],chefNotes:"Ensure the water is boiling hot so the miso dissolves entirely.",pairing:"Shortbread",mealSlots:["snack"],healthy:true},
{slug:"green-tea-horchata",title:"Green Tea Horchata",subtitle:"Toasted rice and matcha.",story:"Traditional horchata relies on toasted rice. Blending it with roasted green tea (hojicha) or matcha bridges the two rice cultures seamlessly.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Medium",prepTime:"10 min",cookTime:"0 min",servings:4,spiceLevel:0,umamiLevel:1,origin:"Mexico x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"1",unit:"cup",item:"white rice"},{qty:"1",unit:"tbsp",item:"matcha"},{qty:"4",unit:"cups",item:"water"},{qty:"1",unit:"stick",item:"cinnamon"}],method:[
      { step: 1, text: "Combine the 1 cup white rice, 1 stick cinnamon, and 4 cups water in a covered bowl, then soak overnight." },
      { step: 2, text: "Blend the soaked 1 cup white rice, 1 stick cinnamon, and 4 cups water for 2 minutes until completely liquefied." },
      { step: 3, text: "Strain the blended rice mixture through cheesecloth into a pitcher, pressing gently until the liquid looks smooth." },
      { step: 4, text: "Whisk the 1 tbsp matcha into the strained rice liquid for 1 minute until no green clumps remain." },
      { step: 5, text: "Cover and chill the horchata for at least 30 minutes, then stir until evenly green before serving cold." }
    ],chefNotes:"Do not skip the overnight soak, or the rice will not blend smoothly.",pairing:"Almond cookies",mealSlots:["breakfast","snack"],healthy:true},
{slug:"spicy-mango-margarita",title:"Spicy Mango Margarita",subtitle:"Sweet fruit, fiery finish.",story:"Blending fresh mango puree with tequila and habanero creates a viscous, intensely flavorful cocktail that balances fire and ice.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:3,umamiLevel:1,origin:"Mexico",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"tequila"},{qty:"2",unit:"oz",item:"mango puree"},{qty:"1",unit:"slice",item:"habanero"}],method:[
      { step: 1, text: "Measure the 2 oz tequila and 2 oz mango puree into a cocktail shaker, ensuring both quantities are ready." },
      { step: 2, text: "Add the 1 slice habanero to the shaker and muddle for 15 seconds until its juices scent the mixture." },
      { step: 3, text: "Pour the 2 oz tequila and 2 oz mango puree over the muddled 1 slice habanero and stir briefly." },
      { step: 4, text: "Seal the shaker and shake the 2 oz tequila, 2 oz mango puree, and 1 slice habanero vigorously for 20 seconds." },
      { step: 5, text: "Strain the drink into a serving glass, checking that the 1 slice habanero is removed and the surface looks lightly frothy." }
    ],chefNotes:"Wash your hands immediately after muddling the habanero.",pairing:"Pork belly",mealSlots:["dinner"],healthy:true},
{slug:"matcha-rum-cocktail",title:"Matcha Rum Cocktail",subtitle:"Tropical green tea.",story:"White rum and coconut water provide a tropical base that perfectly supports the earthy bitterness of ceremonial matcha.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:1,origin:"Caribbean x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"white rum"},{qty:"3",unit:"oz",item:"coconut water"},{qty:"1",unit:"tsp",item:"matcha"}],method:[
      { step: 1, text: "Whisk the 1 tsp matcha into the 2 oz white rum for 30 seconds until the mixture looks smooth and bright green." },
      { step: 2, text: "Pour the matcha mixture containing the 2 oz white rum into a chilled glass, checking that no dry matcha remains." },
      { step: 3, text: "Add the 3 oz coconut water to the 2 oz white rum and 1 tsp matcha, pouring slowly to preserve the green color." },
      { step: 4, text: "Stir the 2 oz white rum, 3 oz coconut water, and 1 tsp matcha for 10 seconds until evenly blended." },
      { step: 5, text: "Serve the drink immediately when the 2 oz white rum, 3 oz coconut water, and 1 tsp matcha look uniformly green." }
    ],chefNotes:"Coconut water naturally sweetens the drink, so no syrup is needed.",pairing:"Fruit salad",mealSlots:["lunch"],healthy:true},
{slug:"tamarind-sparkling-limeade",title:"Tamarind Sparkling Limeade",subtitle:"Fizzy, sour, perfect.",story:"A simple upgrade to standard limeade. Tamarind concentrate adds a brown hue and a deep, sour complexity that shines with carbonation.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:1,origin:"Mexico",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"1",unit:"oz",item:"lime juice"},{qty:"1",unit:"tbsp",item:"tamarind concentrate"},{qty:"4",unit:"oz",item:"sparkling water"}],method:[
      { step: 1, text: "Stir the 1 oz lime juice and 1 tbsp tamarind concentrate for 20 seconds until the mixture looks smooth and evenly combined." },
      { step: 2, text: "Pour the 1 oz lime juice and 1 tbsp tamarind concentrate into a tall glass, scraping in any thick tamarind residue." },
      { step: 3, text: "Add the 4 oz sparkling water slowly to the 1 oz lime juice and 1 tbsp tamarind concentrate to keep the bubbles intact." },
      { step: 4, text: "Stir the 1 oz lime juice, 1 tbsp tamarind concentrate, and 4 oz sparkling water gently for 5 seconds until evenly colored." },
      { step: 5, text: "Serve the limeade immediately when the 4 oz sparkling water still shows visible bubbles and the 1 oz lime juice is blended." }
    ],chefNotes:"Adjust the syrup based on how sour your tamarind concentrate is.",pairing:"Spicy wings",mealSlots:["snack"],healthy:true},
{slug:"mezcal-miso-old-fashioned",title:"Mezcal Miso Old Fashioned",subtitle:"Smoke, oak, and umami.",story:"Replacing whiskey with smoky mezcal and adding a dash of miso-infused agave nectar creates an aggressively flavorful, sipping cocktail.",category:"Drinks",tags:["Dairy-Free","Gluten-Free"],allergens:["soy"],difficulty:"Advanced",prepTime:"5 min",cookTime:"0 min",servings:1,spiceLevel:0,umamiLevel:2,origin:"Oaxaca x Japan",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"oz",item:"mezcal"},{qty:"1/4",unit:"oz",item:"agave nectar"},{qty:"1/4",unit:"tsp",item:"white miso"},{qty:"2",unit:"dashes",item:"bitters"}],method:[
      { step: 1, text: "Whisk the 1/4 tsp white miso into the 1/4 oz agave nectar for 20 seconds until the mixture looks smooth and lump-free." },
      { step: 2, text: "Pour the 2 oz mezcal and 2 dashes bitters into the mixing glass with the 1/4 oz agave nectar mixture." },
      { step: 3, text: "Stir the 2 oz mezcal, 1/4 oz agave nectar, 1/4 tsp white miso, and 2 dashes bitters for 30 seconds." },
      { step: 4, text: "Strain the mixture containing 2 oz mezcal, 1/4 oz agave nectar, 1/4 tsp white miso, and 2 dashes bitters into a rocks glass." },
      { step: 5, text: "Serve immediately when the 2 oz mezcal mixture appears glossy, fully blended, and free of visible miso streaks." }
    ],chefNotes:"Stirring for 30 seconds is crucial to properly chill and dilute the heavy spirits.",pairing:"Steak",mealSlots:["dinner"],healthy:true},
{slug:"jalapeno-cucumber-agua-fresca",title:"Jalapeño Cucumber Agua Fresca",subtitle:"Cooling with a spicy kick.",story:"The ultimate summer cooler. Cucumber water provides extreme hydration, while jalapeño slices offer a lingering, spicy finish.",category:"Drinks",tags:["Vegan","Gluten-Free"],allergens:[],difficulty:"Easy",prepTime:"10 min",cookTime:"0 min",servings:4,spiceLevel:2,umamiLevel:1,origin:"Mexico",heroImage:snackDipsHero,thumbImage:snackDipsHero,ingredients:[{qty:"2",unit:"",item:"cucumbers"},{qty:"1",unit:"",item:"jalapeño"},{qty:"4",unit:"cups",item:"water"}],method:[
      { step: 1, text: "Peel and roughly chop 2 cucumbers, then blend them with 4 cups water until completely smooth." },
      { step: 2, text: "Strain the blended 2 cucumbers and 4 cups water through a fine-mesh strainer into a pitcher." },
      { step: 3, text: "Thinly slice 1 jalapeño, keeping the pieces uniform so the heat infuses evenly." },
      { step: 4, text: "Add the sliced 1 jalapeño to the strained 2-cucumber mixture and stir gently to combine." },
      { step: 5, text: "Cover and refrigerate the 2-cucumber, 1-jalapeño, and 4-cup-water mixture for 1 hour, until chilled and lightly infused." }
    ],chefNotes:"The longer the jalapeño steeps, the spicier the drink becomes.",pairing:"Spicy ceviche",mealSlots:["lunch"],healthy:true}

];
