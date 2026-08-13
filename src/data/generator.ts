import type { Recipe, Ingredient, Allergen, Dietary, Category, Difficulty, Meal, Season, Unit } from "./recipes";

type Tri = { en: string; es: string; pt: string };

type Format = {
  key: string;
  category: Category;
  /** Which meal slots this format naturally fits. */
  meals: Meal[];
  title: Tri;
  difficulty: Difficulty;
  prep: number;
  cook: number;
  serves: number;
  ingredients: Ingredient[];
  method: { en: string[]; es: string[]; pt: string[] };
  baseAllergens: Allergen[];
  baseDietary: Dietary[];
};

const formats: Format[] = [
  {
    key: "taco",
    category: "main",
    meals: ["lunch", "dinner"],
    title: { en: "Taco", es: "Taco", pt: "Taco" },
    difficulty: "medium", prep: 20, cook: 25, serves: 4,
    ingredients: [
      { amount: 12, unit: "piece", name: { en: "corn tortillas", es: "tortillas de maíz", pt: "tortilhas de milho" }, shopQuery: "corn tortillas" },
      { amount: 1, unit: "piece", name: { en: "lime, in wedges", es: "lima en gajos", pt: "lima em gomos" } },
      { amount: 1, unit: "piece", name: { en: "white onion, diced", es: "cebolla blanca picada", pt: "cebola branca em cubos" } },
      { qty: { en: "to finish", es: "para terminar", pt: "para finalizar" }, name: { en: "cilantro, flaky salt", es: "cilantro, sal en escamas", pt: "coentro, sal em flocos" } },
    ],
    method: {
      en: ["Marinate {protein} in {marinade} 30 minutes.", "Sear over high heat until edges char. Rest 5 minutes.", "Warm tortillas on a comal.", "Slice/shred {protein}. Build tacos with onion, cilantro, lime.", "Finish with {finish}."],
      es: ["Marina {protein} en {marinade} 30 minutos.", "Sella a fuego alto hasta carbonizar los bordes. Reposa 5 min.", "Calienta las tortillas en comal.", "Rebana o deshebra {protein}. Arma con cebolla, cilantro, lima.", "Termina con {finish}."],
      pt: ["Marine {protein} em {marinade} 30 minutos.", "Sele em fogo alto até as bordas tostarem. Descanse 5 min.", "Aqueça as tortilhas no comal.", "Fatie ou desfie {protein}. Monte com cebola, coentro, lima.", "Finalize com {finish}."],
    },
    baseAllergens: [], baseDietary: ["dairyFree"],
  },
  {
    key: "bao",
    category: "main",
    meals: ["lunch", "dinner"],
    title: { en: "Bao", es: "Bao", pt: "Bao" },
    difficulty: "medium", prep: 25, cook: 30, serves: 4,
    ingredients: [
      { amount: 8, unit: "piece", name: { en: "steamed bao buns", es: "panes bao al vapor", pt: "pães bao no vapor" }, allergens: ["gluten", "dairy"], shopQuery: "frozen bao buns" },
      { amount: 1, unit: "piece", name: { en: "cucumber, ribboned", es: "pepino en cintas", pt: "pepino em fitas" } },
      { qty: { en: "to garnish", es: "para decorar", pt: "para finalizar" }, name: { en: "scallion, cilantro, toasted sesame", es: "cebollín, cilantro, ajonjolí tostado", pt: "cebolinha, coentro, gergelim tostado" }, allergens: ["sesame"] },
    ],
    method: {
      en: ["Coat {protein} in {marinade}. Rest 1 hour.", "Cook hot and fast — pan or grill — until charred outside, juicy inside.", "Steam bao buns 7 minutes.", "Open each bao, brush with pan juices.", "Fill with {protein}, cucumber, scallion, cilantro, sesame. {finish}."],
      es: ["Cubre {protein} con {marinade}. Reposa 1 hora.", "Cocina rápido y caliente — sartén o parrilla — hasta dorar afuera, jugoso adentro.", "Cuece bao al vapor 7 minutos.", "Abre cada bao y pincela con los jugos.", "Rellena con {protein}, pepino, cebollín, cilantro, ajonjolí. {finish}."],
      pt: ["Cubra {protein} com {marinade}. Descanse 1 hora.", "Cozinhe rápido em fogo alto — frigideira ou grelha — até dourar fora, suculento dentro.", "Cozinhe o bao no vapor 7 minutos.", "Abra cada bao e pincele com os sucos.", "Recheie com {protein}, pepino, cebolinha, coentro, gergelim. {finish}."],
    },
    baseAllergens: ["gluten", "dairy", "sesame"], baseDietary: [],
  },
  {
    key: "tostada",
    category: "starter",
    meals: ["lunch"],
    title: { en: "Tostada", es: "Tostada", pt: "Tostada" },
    difficulty: "easy", prep: 15, cook: 10, serves: 4,
    ingredients: [
      { amount: 8, unit: "piece", name: { en: "crisp corn tostadas", es: "tostadas crujientes de maíz", pt: "tostadas crocantes de milho" }, shopQuery: "tostada shells" },
      { amount: 1, unit: "piece", name: { en: "avocado, sliced", es: "aguacate en rebanadas", pt: "abacate em fatias" } },
      { qty: { en: "to finish", es: "para terminar", pt: "para finalizar" }, name: { en: "radish, micro herbs, lime", es: "rábano, microhierbas, lima", pt: "rabanete, micro-ervas, lima" } },
    ],
    method: {
      en: ["Dress {protein} in {marinade} just before serving.", "Smear avocado across each tostada.", "Pile {protein} on top.", "Crown with radish, micro herbs. {finish}.", "Squeeze lime, eat immediately."],
      es: ["Aliña {protein} con {marinade} justo antes de servir.", "Unta aguacate sobre cada tostada.", "Apila {protein} encima.", "Corona con rábano, microhierbas. {finish}.", "Aprieta lima y come al momento."],
      pt: ["Tempere {protein} com {marinade} pouco antes de servir.", "Espalhe abacate sobre cada tostada.", "Disponha {protein} por cima.", "Coroe com rabanete, micro-ervas. {finish}.", "Aperte lima e coma na hora."],
    },
    baseAllergens: [], baseDietary: ["dairyFree", "glutenFree"],
  },
  {
    key: "bowl",
    category: "main",
    meals: ["breakfast", "lunch", "dinner"],
    title: { en: "Bowl", es: "Bowl", pt: "Bowl" },
    difficulty: "easy", prep: 10, cook: 20, serves: 2,
    ingredients: [
      { amount: 300, unit: "g", name: { en: "short-grain rice, cooked", es: "arroz grano corto cocido", pt: "arroz grão curto cozido" } },
      { amount: 1, unit: "piece", name: { en: "avocado, sliced", es: "aguacate en rebanadas", pt: "abacate em fatias" } },
      { amount: 100, unit: "g", name: { en: "pickled vegetables", es: "vegetales encurtidos", pt: "vegetais em conserva" } },
      { qty: { en: "to finish", es: "para terminar", pt: "para finalizar" }, name: { en: "scallion, sesame, nori", es: "cebollín, ajonjolí, nori", pt: "cebolinha, gergelim, nori" }, allergens: ["sesame"] },
    ],
    method: {
      en: ["Cook {protein} with {marinade} until tender.", "Spread warm rice in two wide bowls.", "Arrange {protein}, avocado, and pickles in stripes.", "Drizzle with {finish}.", "Top with scallion, sesame, and a few shards of nori."],
      es: ["Cocina {protein} con {marinade} hasta suave.", "Reparte arroz tibio en dos tazones amplios.", "Acomoda {protein}, aguacate y encurtidos en franjas.", "Hilo de {finish}.", "Cierra con cebollín, ajonjolí y nori en astillas."],
      pt: ["Cozinhe {protein} com {marinade} até macio.", "Distribua o arroz morno em duas tigelas grandes.", "Arrume {protein}, abacate e picles em faixas.", "Fio de {finish}.", "Finalize com cebolinha, gergelim e lascas de nori."],
    },
    baseAllergens: ["sesame"], baseDietary: ["dairyFree", "glutenFree"],
  },
  {
    key: "dumpling",
    category: "starter",
    meals: ["lunch", "dinner"],
    title: { en: "Dumpling", es: "Dumpling", pt: "Dumpling" },
    difficulty: "hard", prep: 45, cook: 15, serves: 4,
    ingredients: [
      { amount: 24, unit: "piece", name: { en: "round dumpling wrappers", es: "discos para dumpling", pt: "discos para dumpling" }, allergens: ["gluten"] },
      { qty: { en: "for dipping", es: "para dipear", pt: "para mergulhar" }, name: { en: "ponzu-chile dip", es: "salsa ponzu-chile", pt: "molho ponzu-pimenta" }, allergens: ["soy"] },
    ],
    method: {
      en: ["Mix {protein} with {marinade} into a filling. Chill 20 min.", "Spoon a tablespoon of filling into each wrapper. Seal with pleats.", "Pan-fry sealed-side down in oil until golden.", "Add a splash of water, lid on, steam 5 min.", "Lid off, crisp 1 min. Serve with ponzu dip. {finish}."],
      es: ["Mezcla {protein} con {marinade} en relleno. Refrigera 20 min.", "Cuchara de relleno en cada disco. Sella con pliegues.", "Fríe en aceite por el lado sellado hasta dorar.", "Chorro de agua, tapa, vapor 5 min.", "Destapa, crujiente 1 min. Sirve con ponzu. {finish}."],
      pt: ["Misture {protein} com {marinade} em recheio. Refrigere 20 min.", "Uma colher de recheio em cada disco. Feche em pregas.", "Frite no óleo pelo lado fechado até dourar.", "Fio de água, tampe, vapor 5 min.", "Destampe, crocante 1 min. Sirva com ponzu. {finish}."],
    },
    baseAllergens: ["gluten", "soy"], baseDietary: [],
  },
  {
    key: "broth",
    category: "main",
    meals: ["lunch", "dinner"],
    title: { en: "Broth", es: "Caldo", pt: "Caldo" },
    difficulty: "medium", prep: 15, cook: 60, serves: 4,
    ingredients: [
      { amount: 1.5, unit: "l", name: { en: "good stock", es: "caldo de calidad", pt: "caldo de qualidade" } },
      { amount: 1, unit: "piece", name: { en: "kombu (10 cm)", es: "kombu (10 cm)", pt: "kombu (10 cm)" } },
      { amount: 300, unit: "g", name: { en: "noodles or hominy", es: "fideos o maíz pozolero", pt: "macarrão ou milho pozole" } },
      { qty: { en: "to finish", es: "para terminar", pt: "para finalizar" }, name: { en: "cabbage, radish, lime, oregano", es: "col, rábano, lima, orégano", pt: "repolho, rabanete, lima, orégano" } },
    ],
    method: {
      en: ["Heat stock with kombu — never boil while kombu is in.", "Add {protein} and {marinade}. Simmer until tender.", "Cook noodles/hominy separately, drain.", "Build bowl: starch, hot broth, {protein}.", "Top with cabbage, radish, oregano. {finish}. Lime on the side."],
      es: ["Calienta caldo con kombu — sin hervir con kombu adentro.", "Suma {protein} y {marinade}. Hierve hasta suave.", "Cuece fideos o maíz aparte. Escurre.", "Tazón: almidón, caldo caliente, {protein}.", "Termina con col, rábano, orégano. {finish}. Lima aparte."],
      pt: ["Aqueça o caldo com kombu — nunca ferva com kombu dentro.", "Adicione {protein} e {marinade}. Ferva até macio.", "Cozinhe macarrão ou milho à parte. Escorra.", "Tigela: amido, caldo quente, {protein}.", "Finalize com repolho, rabanete, orégano. {finish}. Lima ao lado."],
    },
    baseAllergens: [], baseDietary: ["dairyFree"],
  },
  {
    key: "ceviche",
    category: "starter",
    meals: ["lunch"],
    title: { en: "Ceviche", es: "Ceviche", pt: "Ceviche" },
    difficulty: "easy", prep: 20, cook: 0, serves: 4,
    ingredients: [
      { amount: 4, unit: "tbsp", name: { en: "lime juice", es: "jugo de lima", pt: "suco de lima" } },
      { amount: 2, unit: "tbsp", name: { en: "yuzu or grapefruit juice", es: "jugo de yuzu o toronja", pt: "suco de yuzu ou toranja" } },
      { amount: 1, unit: "piece", name: { en: "serrano chile, minced", es: "chile serrano picado", pt: "pimenta serrano picada" } },
      { amount: 0.5, unit: "piece", name: { en: "cucumber, diced", es: "pepino en cubos", pt: "pepino em cubos" } },
      { qty: { en: "to finish", es: "para terminar", pt: "para finalizar" }, name: { en: "cilantro, micro herbs, sea salt", es: "cilantro, microhierbas, sal de mar", pt: "coentro, micro-ervas, sal marinho" } },
    ],
    method: {
      en: ["Dice {protein} into 8 mm cubes. Chill on a metal plate.", "Whisk lime, yuzu, {marinade}.", "Toss {protein} with cure 30 seconds before plating — barely.", "Add cucumber, chile. Plate on a cold dish.", "Crown with cilantro, herbs, salt. {finish}."],
      es: ["Corta {protein} en cubos 8 mm. Enfría en plato metálico.", "Mezcla lima, yuzu, {marinade}.", "Revuelve {protein} con el cura 30 segundos antes de servir — apenas.", "Suma pepino, chile. Sirve en plato frío.", "Corona con cilantro, hierbas, sal. {finish}."],
      pt: ["Corte {protein} em cubos de 8 mm. Refrigere num prato metálico.", "Misture lima, yuzu, {marinade}.", "Tempere {protein} com a cura 30 segundos antes de servir — apenas.", "Adicione pepino, pimenta. Sirva em prato frio.", "Coroe com coentro, ervas, sal. {finish}."],
    },
    baseAllergens: [], baseDietary: ["dairyFree", "glutenFree", "pescatarian"],
  },
  {
    key: "skewer",
    category: "main",
    meals: ["lunch", "dinner"],
    title: { en: "Skewer", es: "Brocheta", pt: "Espetinho" },
    difficulty: "easy", prep: 15, cook: 12, serves: 4,
    ingredients: [
      { amount: 8, unit: "piece", name: { en: "bamboo skewers, soaked", es: "palillos de bambú remojados", pt: "palitos de bambu hidratados" } },
      { amount: 2, unit: "tbsp", name: { en: "neutral oil for brushing", es: "aceite neutro para pintar", pt: "óleo neutro para pincelar" } },
      { qty: { en: "to finish", es: "para terminar", pt: "para finalizar" }, name: { en: "lime, salt, scallion", es: "lima, sal, cebollín", pt: "lima, sal, cebolinha" } },
    ],
    method: {
      en: ["Cube {protein}. Marinate in {marinade} 30 min.", "Thread tight onto skewers.", "Grill or broil 4 min per side until charred.", "Brush with reserved marinade in the final minute.", "Squeeze lime. {finish}."],
      es: ["Cubica {protein}. Marina en {marinade} 30 min.", "Ensarta apretado en los palillos.", "Asa o gratina 4 min por lado hasta carbonizar.", "Pinta con la marinada reservada en el último minuto.", "Aprieta lima. {finish}."],
      pt: ["Corte {protein} em cubos. Marine em {marinade} 30 min.", "Espete bem apertado.", "Grelhe 4 min de cada lado até carbonizar.", "Pincele com a marinada reservada no minuto final.", "Aperte lima. {finish}."],
    },
    baseAllergens: [], baseDietary: ["dairyFree", "glutenFree"],
  },
  {
    key: "stir-fry",
    category: "main",
    meals: ["lunch", "dinner"],
    title: { en: "Stir-Fry", es: "Salteado", pt: "Refogado" },
    difficulty: "easy", prep: 15, cook: 12, serves: 4,
    ingredients: [
      { amount: 2, unit: "tbsp", name: { en: "neutral oil", es: "aceite neutro", pt: "óleo neutro" } },
      { amount: 2, unit: "piece", name: { en: "garlic cloves, sliced", es: "dientes de ajo en láminas", pt: "dentes de alho fatiados" } },
      { amount: 200, unit: "g", name: { en: "seasonal greens", es: "verduras de temporada", pt: "vegetais da estação" } },
      { amount: 1, unit: "tbsp", name: { en: "shoyu", es: "shoyu", pt: "shoyu" }, allergens: ["soy", "gluten"] },
      { qty: { en: "to finish", es: "para terminar", pt: "para finalizar" }, name: { en: "lime, cilantro, sesame", es: "lima, cilantro, ajonjolí", pt: "lima, coentro, gergelim" }, allergens: ["sesame"] },
    ],
    method: {
      en: ["Heat wok to smoking. Oil in.", "Add garlic — 10 seconds. Add {protein}. Don't crowd.", "Toss with {marinade}. Add greens last — just to wilt.", "Splash shoyu around the edge of the wok for fond.", "Plate. {finish}."],
      es: ["Calienta wok hasta humear. Echa el aceite.", "Ajo — 10 segundos. Suma {protein}. Sin saturar.", "Revuelve con {marinade}. Verduras al final — sólo a marchitar.", "Salpica shoyu por el borde del wok.", "Sirve. {finish}."],
      pt: ["Aqueça a wok até fumegar. Coloque o óleo.", "Alho — 10 segundos. Adicione {protein}. Sem amontoar.", "Misture com {marinade}. Vegetais por último — só murchar.", "Salpique shoyu na borda da wok.", "Sirva. {finish}."],
    },
    baseAllergens: ["soy", "gluten", "sesame"], baseDietary: ["dairyFree"],
  },
  {
    key: "salad",
    category: "starter",
    meals: ["lunch"],
    title: { en: "Salad", es: "Ensalada", pt: "Salada" },
    difficulty: "easy", prep: 12, cook: 0, serves: 2,
    ingredients: [
      { amount: 120, unit: "g", name: { en: "leafy greens", es: "hojas verdes", pt: "folhas verdes" } },
      { amount: 1, unit: "piece", name: { en: "avocado, sliced", es: "aguacate en rebanadas", pt: "abacate em fatias" } },
      { amount: 2, unit: "tbsp", name: { en: "lime-soy vinaigrette", es: "vinagreta lima-soja", pt: "vinagrete lima-shoyu" }, allergens: ["soy"] },
      { qty: { en: "to finish", es: "para terminar", pt: "para finalizar" }, name: { en: "toasted sesame, micro herbs", es: "ajonjolí tostado, microhierbas", pt: "gergelim tostado, micro-ervas" }, allergens: ["sesame"] },
    ],
    method: {
      en: ["Toss greens with vinaigrette. Salt now, not later.", "Dress {protein} separately with {marinade}.", "Layer greens, {protein}, avocado on a wide plate.", "Add textural surprises (crisped seeds, fried garlic).", "Sesame and herbs to finish."],
      es: ["Aliña las hojas con la vinagreta. Sal ahora, no después.", "Aliña {protein} aparte con {marinade}.", "Capas: hojas, {protein}, aguacate en plato amplio.", "Suma sorpresas de textura (semillas, ajo frito).", "Termina con ajonjolí y hierbas."],
      pt: ["Tempere as folhas com o vinagrete. Sal agora, não depois.", "Tempere {protein} à parte com {marinade}.", "Camadas: folhas, {protein}, abacate em prato largo.", "Adicione surpresas de textura (sementes crocantes, alho frito).", "Finalize com gergelim e ervas."],
    },
    baseAllergens: ["soy", "sesame"], baseDietary: ["vegetarian", "dairyFree"],
  },
  {
    key: "rice-cake",
    category: "main",
    meals: ["lunch", "dinner"],
    title: { en: "Rice Cake", es: "Pastel de Arroz", pt: "Bolinho de Arroz" },
    difficulty: "medium", prep: 20, cook: 25, serves: 4,
    ingredients: [
      { amount: 300, unit: "g", name: { en: "Korean rice cakes (tteokbokki style)", es: "pasteles de arroz coreanos", pt: "bolinho de arroz coreano" }, allergens: ["gluten"] },
      { amount: 2, unit: "tbsp", name: { en: "gochujang", es: "gochujang", pt: "gochujang" }, allergens: ["soy"], shopQuery: "gochujang Korean chile paste" },
      { amount: 2, unit: "tbsp", name: { en: "tomato-chipotle paste", es: "pasta de tomate-chipotle", pt: "pasta de tomate-chipotle" } },
      { qty: { en: "to finish", es: "para terminar", pt: "para finalizar" }, name: { en: "scallion, cilantro, lime, sesame", es: "cebollín, cilantro, lima, ajonjolí", pt: "cebolinha, coentro, lima, gergelim" }, allergens: ["sesame"] },
    ],
    method: {
      en: ["Soak rice cakes 10 min if dry.", "Sear {protein} in {marinade}, set aside.", "Sauté gochujang + chipotle paste 30 seconds. Add 200 ml water.", "Add rice cakes, simmer 8 min until glossy and bouncy.", "Return {protein}. Plate. {finish}."],
      es: ["Remoja los pasteles 10 min si están secos.", "Sella {protein} en {marinade}, reserva.", "Saltea gochujang + pasta de chipotle 30 segundos. Suma 200 ml agua.", "Suma los pasteles, hierve 8 min hasta brillosos.", "Devuelve {protein}. Plato. {finish}."],
      pt: ["Hidrate os bolinhos 10 min se secos.", "Sele {protein} em {marinade}, reserve.", "Refogue gochujang + pasta de chipotle 30 segundos. Adicione 200 ml de água.", "Coloque os bolinhos, ferva 8 min até brilharem.", "Devolva {protein}. Prato. {finish}."],
    },
    baseAllergens: ["gluten", "soy", "sesame"], baseDietary: [],
  },
  {
    key: "tamale",
    category: "main",
    meals: ["breakfast", "lunch", "dinner"],
    title: { en: "Tamal", es: "Tamal", pt: "Tamale" },
    difficulty: "hard", prep: 60, cook: 90, serves: 6,
    ingredients: [
      { amount: 500, unit: "g", name: { en: "masa harina", es: "masa harina", pt: "masa harina" }, shopQuery: "masa harina corn flour" },
      { amount: 150, unit: "g", name: { en: "lard or coconut oil", es: "manteca o aceite de coco", pt: "banha ou óleo de coco" } },
      { amount: 20, unit: "piece", name: { en: "corn husks, soaked", es: "hojas de maíz hidratadas", pt: "palhas de milho hidratadas" } },
      { qty: { en: "to finish", es: "para terminar", pt: "para finalizar" }, name: { en: "salsa macha, lime", es: "salsa macha, lima", pt: "salsa macha, lima" } },
    ],
    method: {
      en: ["Whip lard until fluffy. Beat in masa, salt, and warm stock to a soft, spreadable paste.", "Cook {protein} with {marinade} until shreddable.", "Smear masa across each husk, fill with {protein}, fold.", "Steam upright 75–90 min until masa pulls cleanly from the husk.", "Open hot. {finish} on the side."],
      es: ["Bate la manteca hasta esponjar. Suma masa, sal y caldo tibio hasta pasta suave untable.", "Cocina {protein} con {marinade} hasta deshebrar.", "Unta masa sobre cada hoja, rellena con {protein}, dobla.", "Cuece de pie al vapor 75–90 min hasta que la masa se separe de la hoja.", "Abre caliente. {finish} aparte."],
      pt: ["Bata a banha até espumar. Adicione masa, sal e caldo morno até uma pasta macia.", "Cozinhe {protein} com {marinade} até desfiar.", "Espalhe a masa em cada palha, recheie com {protein}, dobre.", "Cozinhe em pé no vapor 75–90 min até a masa soltar da palha.", "Abra quente. {finish} ao lado."],
    },
    baseAllergens: [], baseDietary: ["dairyFree"],
  },
  {
    key: "noodle-cold",
    category: "starter",
    meals: ["lunch"],
    title: { en: "Cold Noodles", es: "Fideos Fríos", pt: "Macarrão Frio" },
    difficulty: "easy", prep: 15, cook: 8, serves: 4,
    ingredients: [
      { amount: 300, unit: "g", name: { en: "soba noodles", es: "fideos soba", pt: "macarrão soba" }, allergens: ["gluten"] },
      { amount: 4, unit: "tbsp", name: { en: "lime-shoyu dipping sauce", es: "salsa lima-shoyu", pt: "molho lima-shoyu" }, allergens: ["soy"] },
      { amount: 1, unit: "tbsp", name: { en: "toasted sesame oil", es: "aceite de ajonjolí tostado", pt: "óleo de gergelim tostado" }, allergens: ["sesame"] },
      { qty: { en: "to finish", es: "para terminar", pt: "para finalizar" }, name: { en: "scallion, nori, jalapeño rings", es: "cebollín, nori, aros de jalapeño", pt: "cebolinha, nori, rodelas de jalapeño" } },
    ],
    method: {
      en: ["Boil soba 4 min, shock in ice water until cold. Drain hard.", "Toss {protein} in {marinade}.", "Mix noodles with dipping sauce and sesame oil.", "Plate noodles in a wide bowl, top with {protein}.", "{finish}."],
      es: ["Hierve soba 4 min, choque en hielo hasta frío. Escurre fuerte.", "Aliña {protein} en {marinade}.", "Mezcla fideos con salsa y aceite de ajonjolí.", "Sirve en tazón ancho, {protein} encima.", "{finish}."],
      pt: ["Ferva o soba 4 min, choque no gelo até gelar. Escorra bem.", "Tempere {protein} no {marinade}.", "Misture o macarrão com o molho e o óleo de gergelim.", "Sirva em tigela larga, {protein} por cima.", "{finish}."],
    },
    baseAllergens: ["gluten", "soy", "sesame"], baseDietary: ["dairyFree"],
  },
  {
    key: "sope",
    category: "starter",
    meals: ["breakfast", "lunch"],
    title: { en: "Sope", es: "Sope", pt: "Sope" },
    difficulty: "medium", prep: 25, cook: 15, serves: 4,
    ingredients: [
      { amount: 300, unit: "g", name: { en: "masa harina", es: "masa harina", pt: "masa harina" } },
      { amount: 100, unit: "g", name: { en: "refried beans", es: "frijoles refritos", pt: "feijão refrito" } },
      { amount: 80, unit: "g", name: { en: "crumbled queso fresco", es: "queso fresco desmoronado", pt: "queijo fresco esfarelado" }, allergens: ["dairy"] },
      { qty: { en: "to finish", es: "para terminar", pt: "para finalizar" }, name: { en: "cilantro, lime, salsa", es: "cilantro, lima, salsa", pt: "coentro, lima, salsa" } },
    ],
    method: {
      en: ["Mix masa with warm water and salt to soft dough. Form 8 thick discs and cook on a comal 90 seconds per side.", "Pinch the edges up to form rims while still hot.", "Cook {protein} with {marinade}.", "Smear refried beans inside each sope. Top with {protein}, queso.", "{finish}, lime wedge on the side."],
      es: ["Mezcla masa con agua tibia y sal. Forma 8 discos gruesos y cuece en comal 90 seg por lado.", "Pellizca los bordes hacia arriba mientras están calientes.", "Cocina {protein} con {marinade}.", "Unta frijoles en cada sope. Arriba {protein} y queso.", "{finish}, gajo de lima aparte."],
      pt: ["Misture masa com água morna e sal. Forme 8 discos grossos e cozinhe no comal 90 seg por lado.", "Pince as bordas para cima ainda quentes.", "Cozinhe {protein} com {marinade}.", "Espalhe feijão em cada sope. Por cima {protein} e queijo.", "{finish}, gomo de lima ao lado."],
    },
    baseAllergens: ["dairy"], baseDietary: ["vegetarian"],
  },
  {
    key: "ice-cream",
    category: "dessert",
    meals: ["dinner"],
    title: { en: "Helado", es: "Helado", pt: "Sorvete" },
    difficulty: "easy", prep: 20, cook: 5, serves: 6,
    ingredients: [
      { amount: 500, unit: "ml", name: { en: "heavy cream", es: "crema espesa", pt: "creme de leite fresco" }, allergens: ["dairy"] },
      { amount: 200, unit: "ml", name: { en: "sweetened condensed milk", es: "leche condensada", pt: "leite condensado" }, allergens: ["dairy"] },
      { qty: { en: "to finish", es: "para terminar", pt: "para finalizar" }, name: { en: "flaky salt, sesame, lime zest", es: "sal en escamas, ajonjolí, ralladura de lima", pt: "sal em flocos, gergelim, raspas de lima" }, allergens: ["sesame"] },
    ],
    method: {
      en: ["Whip cream to soft peaks. Fold in condensed milk.", "Stir in {marinade} (paste, syrup, or purée).", "Pour into a loaf pan. Freeze 6 hours.", "Scoop. Top with crushed {protein} or crunch element.", "Finish with salt, sesame, lime zest."],
      es: ["Bate la crema a picos suaves. Envuelve la condensada.", "Integra {marinade} (pasta, jarabe o puré).", "Vacía en molde. Congela 6 horas.", "Sirve bolas. Cubre con {protein} triturado o elemento crocante.", "Termina con sal, ajonjolí, lima."],
      pt: ["Bata o creme em picos macios. Incorpore o condensado.", "Misture {marinade} (pasta, calda ou purê).", "Despeje em forma de bolo. Congele 6 horas.", "Sirva em bolas. Cubra com {protein} triturado ou elemento crocante.", "Finalize com sal, gergelim, raspas de lima."],
    },
    baseAllergens: ["dairy", "sesame"], baseDietary: ["vegetarian"],
  },
  {
    key: "chilaquiles",
    category: "main",
    meals: ["breakfast"],
    title: { en: "Chilaquiles Bowl", es: "Chilaquiles", pt: "Chilaquiles" },
    difficulty: "easy", prep: 10, cook: 15, serves: 2,
    ingredients: [
      { amount: 200, unit: "g", name: { en: "tortilla chips", es: "totopos", pt: "totopos" }, shopQuery: "tortilla chips" },
      { amount: 2, unit: "piece", name: { en: "eggs, sunny-side", es: "huevos estrellados", pt: "ovos estalados" }, allergens: ["egg"] },
      { amount: 60, unit: "g", name: { en: "crumbled queso fresco", es: "queso fresco desmoronado", pt: "queijo fresco esfarelado" }, allergens: ["dairy"] },
      { qty: { en: "to finish", es: "para terminar", pt: "para finalizar" }, name: { en: "crema, cilantro, lime", es: "crema, cilantro, lima", pt: "creme, coentro, lima" }, allergens: ["dairy"] },
    ],
    method: {
      en: ["Warm {marinade} in a wide pan until simmering.", "Toss tortilla chips through — they should stay barely crisp. 30 seconds.", "Slide onto plates. Crown with {protein} (cooked) and eggs.", "Add queso fresco, {finish}.", "Serve immediately, before chips soften."],
      es: ["Calienta {marinade} en sartén amplio hasta hervir.", "Suma los totopos — deben quedar apenas crocantes. 30 segundos.", "Pasa al plato. Corona con {protein} (cocido) y huevos.", "Suma queso fresco, {finish}.", "Sirve de inmediato, antes que los totopos ablanden."],
      pt: ["Aqueça o {marinade} numa frigideira larga até ferver.", "Junte os totopos — devem ficar apenas crocantes. 30 segundos.", "Passe para o prato. Coroe com {protein} (cozido) e ovos.", "Acrescente queijo fresco, {finish}.", "Sirva imediatamente, antes dos totopos amolecerem."],
    },
    baseAllergens: ["egg", "dairy"], baseDietary: ["vegetarian"],
  },
  {
    key: "congee",
    category: "main",
    meals: ["breakfast"],
    title: { en: "Mole Congee", es: "Congee de Mole", pt: "Congee de Mole" },
    difficulty: "easy", prep: 5, cook: 45, serves: 2,
    ingredients: [
      { amount: 80, unit: "g", name: { en: "short-grain rice", es: "arroz grano corto", pt: "arroz grão curto" } },
      { amount: 1, unit: "l", name: { en: "warm chicken stock", es: "caldo de pollo tibio", pt: "caldo de frango morno" } },
      { amount: 1, unit: "piece", name: { en: "soft-boiled egg per bowl", es: "huevo mollet por tazón", pt: "ovo mole por tigela" }, allergens: ["egg"] },
      { qty: { en: "to finish", es: "para terminar", pt: "para finalizar" }, name: { en: "scallion, chile crisp, cilantro", es: "cebollín, chile crisp, cilantro", pt: "cebolinha, chile crisp, coentro" } },
    ],
    method: {
      en: ["Rinse rice, then simmer in stock 35–40 min stirring occasionally — should be loose porridge.", "Stir in 1 tablespoon of {marinade} to lacquer the surface.", "Sear small slivers of {protein} and stir in.", "Ladle into bowls. Top with egg, scallion, chile crisp.", "{finish} on top. Slurp."],
      es: ["Enjuaga el arroz y hierve en caldo 35–40 min revolviendo — debe ser papilla suelta.", "Integra 1 cda de {marinade} para esmaltar la superficie.", "Sella tiras finas de {protein} y revuelve.", "Sirve en tazones. Suma huevo, cebollín, chile crisp.", "{finish} encima. A sorber."],
      pt: ["Lave o arroz e cozinhe no caldo 35–40 min mexendo — deve virar mingau leve.", "Misture 1 cs de {marinade} para esmaltar a superfície.", "Sele tiras finas de {protein} e misture.", "Sirva em tigelas. Adicione ovo, cebolinha, chile crisp.", "{finish} por cima. Saboreie."],
    },
    baseAllergens: ["egg"], baseDietary: ["dairyFree"],
  },
  {
    key: "breakfast-taco",
    category: "main",
    meals: ["breakfast"],
    title: { en: "Breakfast Taco", es: "Taco de Desayuno", pt: "Taco de Café" },
    difficulty: "easy", prep: 8, cook: 10, serves: 2,
    ingredients: [
      { amount: 6, unit: "piece", name: { en: "flour tortillas", es: "tortillas de harina", pt: "tortilhas de farinha" }, allergens: ["gluten"] },
      { amount: 4, unit: "piece", name: { en: "eggs, soft-scrambled", es: "huevos revueltos suaves", pt: "ovos mexidos macios" }, allergens: ["egg"] },
      { amount: 80, unit: "g", name: { en: "cotija or feta", es: "cotija o feta", pt: "cotija ou feta" }, allergens: ["dairy"] },
      { qty: { en: "to finish", es: "para terminar", pt: "para finalizar" }, name: { en: "cilantro, lime, salsa verde", es: "cilantro, lima, salsa verde", pt: "coentro, lima, salsa verde" } },
    ],
    method: {
      en: ["Soft-scramble eggs in butter, 2 minutes — pull while wet.", "Warm tortillas on a comal. Brush with {marinade}.", "Fold in {protein} (precooked, diced).", "Layer eggs + protein on each tortilla. Crumble cotija.", "{finish}. Eat standing up."],
      es: ["Bate los huevos en mantequilla, 2 min — retira aún húmedos.", "Calienta tortillas en comal. Pinta con {marinade}.", "Suma {protein} (precocido, en cubos).", "Capas: huevos + protein en cada tortilla. Espolvorea cotija.", "{finish}. Come de pie."],
      pt: ["Mexa os ovos na manteiga, 2 min — retire ainda úmidos.", "Aqueça as tortilhas no comal. Pincele com {marinade}.", "Junte {protein} (pré-cozido, em cubos).", "Camadas: ovos + protein em cada tortilha. Esfarele cotija.", "{finish}. Coma de pé."],
    },
    baseAllergens: ["egg", "dairy", "gluten"], baseDietary: ["vegetarian"],
  },
  {
    key: "oat-bowl",
    category: "main",
    meals: ["breakfast"],
    title: { en: "Savory Oat Bowl", es: "Bowl de Avena Salado", pt: "Bowl de Aveia Salgado" },
    difficulty: "easy", prep: 5, cook: 15, serves: 2,
    ingredients: [
      { amount: 120, unit: "g", name: { en: "rolled oats", es: "avena en hojuelas", pt: "aveia em flocos" }, allergens: ["gluten"] },
      { amount: 500, unit: "ml", name: { en: "stock or water", es: "caldo o agua", pt: "caldo ou água" } },
      { amount: 2, unit: "piece", name: { en: "soft-boiled eggs", es: "huevos mollet", pt: "ovos moles" }, allergens: ["egg"] },
      { qty: { en: "to finish", es: "para terminar", pt: "para finalizar" }, name: { en: "scallion, sesame, lime", es: "cebollín, ajonjolí, lima", pt: "cebolinha, gergelim, lima" }, allergens: ["sesame"] },
    ],
    method: {
      en: ["Toast oats dry 1 minute. Add stock, simmer 8–10 min until creamy.", "Stir 1 tbsp of {marinade} through.", "Sear {protein} in a tiny bit of oil; slice.", "Bowl: oats, {protein}, halved egg.", "{finish}. Eat hot."],
      es: ["Tuesta la avena 1 min en seco. Suma caldo, hierve 8–10 min hasta cremoso.", "Integra 1 cda de {marinade}.", "Sella {protein} en aceite mínimo; rebana.", "Tazón: avena, {protein}, mitad de huevo.", "{finish}. Come caliente."],
      pt: ["Toste a aveia 1 min sem nada. Adicione caldo, ferva 8–10 min até cremoso.", "Misture 1 cs de {marinade}.", "Sele {protein} em pouco óleo; fatie.", "Tigela: aveia, {protein}, metade de ovo.", "{finish}. Coma quente."],
    },
    baseAllergens: ["egg", "gluten", "sesame"], baseDietary: ["vegetarian"],
  },
  {
    key: "fruit-acai",
    category: "main",
    meals: ["breakfast"],
    title: { en: "Açaí-Hibiscus Bowl", es: "Bowl de Açaí y Jamaica", pt: "Bowl de Açaí e Hibisco" },
    difficulty: "easy", prep: 5, cook: 0, serves: 2,
    ingredients: [
      { amount: 200, unit: "g", name: { en: "frozen açaí pulp", es: "pulpa de açaí congelada", pt: "polpa de açaí congelada" }, shopQuery: "frozen acai pulp" },
      { amount: 4, unit: "tbsp", name: { en: "hibiscus syrup (agua de jamaica reduction)", es: "jarabe de jamaica reducido", pt: "calda de hibisco reduzida" } },
      { amount: 1, unit: "piece", name: { en: "banana, sliced", es: "plátano en rodajas", pt: "banana em rodelas" } },
      { qty: { en: "to finish", es: "para terminar", pt: "para finalizar" }, name: { en: "granola, toasted coconut, lime zest", es: "granola, coco tostado, ralladura de lima", pt: "granola, coco tostado, raspas de lima" }, allergens: ["gluten"] },
    ],
    method: {
      en: ["Blend açaí with hibiscus syrup and a splash of water to thick-smoothie consistency.", "Pour into wide bowls.", "Fan banana across top.", "Sprinkle {protein} if using (toasted nuts, chia, hemp).", "Drizzle {marinade}, crown with granola, coconut, lime zest. {finish}."],
      es: ["Licúa açaí con jarabe de jamaica y un chorro de agua hasta smoothie espeso.", "Sirve en tazones amplios.", "Abanica plátano encima.", "Espolvorea {protein} si usas (nueces tostadas, chía, cáñamo).", "Hilo de {marinade}, corona con granola, coco, lima. {finish}."],
      pt: ["Bata açaí com calda de hibisco e um fio de água até smoothie grosso.", "Sirva em tigelas largas.", "Abra a banana em leque por cima.", "Salpique {protein} se usar (castanhas tostadas, chia, cânhamo).", "Fio de {marinade}, finalize com granola, coco, raspas de lima. {finish}."],
    },
    baseAllergens: ["gluten"], baseDietary: ["vegetarian"],
  },
];

const proteins: Array<{
  key: string;
  name: Tri;
  allergens: Allergen[];
  dietary: Dietary[];
  shopQuery: string;
  amountG: number;
}> = [
  { key: "short-rib",   name: { en: "beef short rib", es: "costilla de res", pt: "costela bovina" }, allergens: [], dietary: ["dairyFree"], shopQuery: "beef short ribs bone-in", amountG: 600 },
  { key: "skirt-steak", name: { en: "skirt steak", es: "arrachera", pt: "fraldinha" }, allergens: [], dietary: ["dairyFree"], shopQuery: "skirt steak arrachera", amountG: 500 },
  { key: "pork-shoulder", name: { en: "pork shoulder", es: "lomo de cerdo", pt: "paleta suína" }, allergens: ["pork"], dietary: [], shopQuery: "pork shoulder", amountG: 600 },
  { key: "pork-belly", name: { en: "pork belly", es: "panceta de cerdo", pt: "barriga de porco" }, allergens: ["pork"], dietary: [], shopQuery: "pork belly slab", amountG: 500 },
  { key: "chicken-thigh", name: { en: "chicken thighs, boneless", es: "muslos de pollo sin hueso", pt: "coxas de frango sem osso" }, allergens: [], dietary: ["dairyFree"], shopQuery: "boneless skinless chicken thighs", amountG: 500 },
  { key: "chicken-wing", name: { en: "chicken wings", es: "alitas de pollo", pt: "asinhas de frango" }, allergens: [], dietary: ["dairyFree"], shopQuery: "chicken wings party pack", amountG: 700 },
  { key: "hamachi", name: { en: "hamachi (yellowtail), sashimi-grade", es: "hamachi grado sashimi", pt: "hamachi qualidade sashimi" }, allergens: ["fish"], dietary: ["pescatarian", "dairyFree"], shopQuery: "sashimi grade yellowtail", amountG: 250 },
  { key: "salmon", name: { en: "salmon fillet", es: "filete de salmón", pt: "filé de salmão" }, allergens: ["fish"], dietary: ["pescatarian", "dairyFree"], shopQuery: "fresh salmon fillet", amountG: 400 },
  { key: "shrimp", name: { en: "shrimp, peeled", es: "camarones pelados", pt: "camarão limpo" }, allergens: ["shellfish"], dietary: ["pescatarian", "dairyFree"], shopQuery: "fresh shrimp shell-off", amountG: 400 },
  { key: "scallop", name: { en: "diver scallops", es: "callos de hacha", pt: "vieiras frescas" }, allergens: ["shellfish"], dietary: ["pescatarian", "dairyFree"], shopQuery: "fresh sea scallops", amountG: 350 },
  { key: "tuna", name: { en: "tuna loin, sashimi-grade", es: "lomo de atún grado sashimi", pt: "lombo de atum sashimi" }, allergens: ["fish"], dietary: ["pescatarian", "dairyFree"], shopQuery: "sashimi grade tuna", amountG: 300 },
  { key: "tofu", name: { en: "extra-firm tofu, pressed", es: "tofu extrafirme prensado", pt: "tofu extra firme prensado" }, allergens: ["soy"], dietary: ["vegetarian", "vegan", "dairyFree"], shopQuery: "extra firm tofu", amountG: 400 },
  { key: "tempeh", name: { en: "tempeh", es: "tempeh", pt: "tempeh" }, allergens: ["soy"], dietary: ["vegetarian", "vegan", "dairyFree"], shopQuery: "tempeh block", amountG: 350 },
  { key: "mushroom", name: { en: "king oyster mushrooms", es: "setas eringi", pt: "cogumelos eryngui" }, allergens: [], dietary: ["vegetarian", "vegan", "dairyFree", "glutenFree"], shopQuery: "king oyster mushrooms", amountG: 400 },
  { key: "lamb", name: { en: "lamb shoulder", es: "espaldilla de cordero", pt: "paleta de cordeiro" }, allergens: [], dietary: ["dairyFree"], shopQuery: "lamb shoulder", amountG: 600 },
  { key: "duck", name: { en: "duck breast", es: "pechuga de pato", pt: "peito de pato" }, allergens: [], dietary: ["dairyFree"], shopQuery: "duck breast", amountG: 400 },
  { key: "octopus", name: { en: "pre-cooked octopus tentacle", es: "pulpo precocido", pt: "polvo pré-cozido" }, allergens: ["shellfish"], dietary: ["pescatarian", "dairyFree"], shopQuery: "cooked octopus tentacle", amountG: 350 },
  { key: "white-fish", name: { en: "white fish (halibut, snapper)", es: "pescado blanco", pt: "peixe branco" }, allergens: ["fish"], dietary: ["pescatarian", "dairyFree"], shopQuery: "halibut fillet", amountG: 400 },
];

const marinades: Array<{
  key: string;
  name: Tri;
  allergens: Allergen[];
}> = [
  { key: "adobo-shoyu", name: { en: "adobo-shoyu (guajillo + soy + lime)", es: "adobo-shoyu (guajillo + soja + lima)", pt: "adobo-shoyu (guajillo + shoyu + lima)" }, allergens: ["soy", "gluten"] },
  { key: "miso-chipotle", name: { en: "miso-chipotle (white miso + chipotle in adobo)", es: "miso-chipotle (miso blanco + chipotle en adobo)", pt: "missô-chipotle (missô branco + chipotle em adobo)" }, allergens: ["soy"] },
  { key: "tamarind-shoyu", name: { en: "tamarind-shoyu", es: "tamarindo-shoyu", pt: "tamarindo-shoyu" }, allergens: ["soy", "gluten"] },
  { key: "yuzu-kosho-lime", name: { en: "yuzu-kosho-lime butter", es: "mantequilla yuzu-kosho-lima", pt: "manteiga yuzu-kosho-lima" }, allergens: ["dairy"] },
  { key: "gochujang-tomatillo", name: { en: "gochujang-tomatillo salsa", es: "salsa gochujang-tomatillo", pt: "molho gochujang-tomatillo" }, allergens: ["soy"] },
  { key: "achiote-five-spice", name: { en: "achiote–five-spice rub", es: "rub de achiote–cinco especias", pt: "rub achiote–cinco especiarias" }, allergens: [] },
  { key: "habanero-honey-ginger", name: { en: "habanero-honey-ginger glaze", es: "glaseado de habanero-miel-jengibre", pt: "glace habanero-mel-gengibre" }, allergens: [] },
  { key: "mole-coloradito-mirin", name: { en: "mole coloradito with mirin", es: "mole coloradito con mirin", pt: "mole coloradito com mirin" }, allergens: ["nuts", "soy", "alcohol"] },
  { key: "ponzu-arbol", name: { en: "ponzu-árbol marinade", es: "marinada ponzu-árbol", pt: "marinada ponzu-árbol" }, allergens: ["soy", "gluten", "fish"] },
  { key: "mezcal-orange-arbol", name: { en: "mezcal-orange-árbol cure", es: "cura mezcal-naranja-árbol", pt: "cura mezcal-laranja-árbol" }, allergens: ["alcohol"] },
  { key: "salsa-macha-shoyu", name: { en: "salsa macha + shoyu drizzle", es: "salsa macha + hilo de shoyu", pt: "salsa macha + fio de shoyu" }, allergens: ["nuts", "sesame", "soy", "gluten"] },
  { key: "tepache-soy-chile", name: { en: "tepache–soy–chile reduction", es: "reducción tepache-soja-chile", pt: "redução tepache-shoyu-pimenta" }, allergens: ["soy", "gluten"] },
];

const finishes: Array<{ name: Tri; allergens: Allergen[] }> = [
  { name: { en: "a drizzle of salsa macha", es: "un hilo de salsa macha", pt: "um fio de salsa macha" }, allergens: ["nuts", "sesame"] },
  { name: { en: "a furikake shower", es: "una lluvia de furikake", pt: "uma chuva de furikake" }, allergens: ["sesame", "fish"] },
  { name: { en: "a yuzu-lime crema", es: "una crema yuzu-lima", pt: "um creme yuzu-lima" }, allergens: ["dairy"] },
  { name: { en: "a tatemado tomato salsa", es: "una salsa tatemada de tomate", pt: "uma salsa tatemada de tomate" }, allergens: [] },
  { name: { en: "a soy-pickled jalapeño relish", es: "relish de jalapeño encurtido en soja", pt: "relish de jalapeño em conserva de shoyu" }, allergens: ["soy", "gluten"] },
  { name: { en: "fried garlic and shichimi togarashi", es: "ajo frito y shichimi togarashi", pt: "alho frito e shichimi togarashi" }, allergens: ["sesame"] },
  { name: { en: "shaved bonito flakes (katsuobushi)", es: "katsuobushi en escamas", pt: "katsuobushi em lascas" }, allergens: ["fish"] },
  { name: { en: "crisped lardon and lime", es: "tocino crujiente y lima", pt: "torresmo crocante e lima" }, allergens: ["pork"] },
];

const heroImages = [
  "photo-1565299624946-b28f40a0ae38",
  "photo-1551782450-a2132b4ba21d",
  "photo-1559339352-11d035aa65de",
  "photo-1496116218417-1a781b1c416c",
  "photo-1569718212165-3a8278d5f624",
  "photo-1578849278619-e73505e9610f",
  "photo-1488477181946-6428a0291777",
  "photo-1527477396000-e27163b481c2",
  "photo-1551024601-bec78aea704b",
  "photo-1546069901-ba9599a7e63c",
  "photo-1565958011703-44f9829ba187",
  "photo-1432139509613-5c4255815697",
  "photo-1504674900247-0877df9cc836",
  "photo-1467003909585-2f8a72700288",
  "photo-1483918793747-5adbf82956c4",
  "photo-1540420773420-3366772f4999",
  "photo-1574484284002-952d92456975",
  "photo-1517248135467-4c7edcad34c4",
  "photo-1543353071-873f17a7a088",
  "photo-1601314167099-cb6ed9aef0e1",
  "photo-1432139509613-5c4255815697",
  "photo-1604908554007-2f7e7b2bf7a7",
  "photo-1576402187878-974f70c890a5",
  "photo-1606756790138-261d2b21cd75",
];

function tri(en: string, es: string, pt: string): Tri {
  return { en, es, pt };
}

/* Pollinations.ai — same engine as recipes.ts. */
function aiImage(prompt: string, seed: number, w = 1600, h = 1000): string {
  const p = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${p}?width=${w}&height=${h}&model=flux&nologo=true&seed=${seed}&enhance=true`;
}

function seedFromSlug(slug: string): number {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h | 0) || 1;
}

function buildPrompt(protein: string, formatTitle: string, marinade: string, finish: string): string {
  /* Strip parenthetical asides (e.g., "(white miso + chipotle)") so the prompt stays tight. */
  const clean = (s: string) => s.split(" (")[0];
  return `Editorial overhead photo of ${clean(protein)} ${clean(formatTitle).toLowerCase()} glazed with ${clean(marinade)}, finished with ${clean(finish)}, plated on dark ceramic, soft natural light, dark wood background, Michelin-star food magazine styling, photorealistic 4k, hyper-detailed, garnishes visible, cilantro, lime, sesame seeds`;
}

function img(id: string, w = 1600) {
  return aiImage(`Editorial food photography 4k ${id}`, seedFromSlug(id), w, Math.round(w * 0.625));
}


function dedupe<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/* Mulberry32 deterministic PRNG so the generated set is stable across loads */
function makeRng(seed: number) {
  return function rng() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateRecipe(index: number): Recipe {
  const rng = makeRng(index * 9301 + 49297);
  const fmt = formats[Math.floor(rng() * formats.length)];
  const prot = proteins[Math.floor(rng() * proteins.length)];
  const mar = marinades[Math.floor(rng() * marinades.length)];
  const fin = finishes[Math.floor(rng() * finishes.length)];
  const heroId = heroImages[Math.floor(rng() * heroImages.length)];
  const spice = (1 + Math.floor(rng() * 5)) as 1 | 2 | 3 | 4 | 5;
  const umami = (2 + Math.floor(rng() * 4)) as 2 | 3 | 4 | 5;

  /* Strip parenthetical asides and trim whitespace before titlecasing the first character. */
  const clean = (s: string) => s.split(" (")[0].trim();
  const cap = (s: string) => s ? s.charAt(0).toLocaleUpperCase() + s.slice(1) : s;
  /* Take only the descriptive head of the marinade (everything before the first comma or "with"). */
  const marHead = (s: string) => clean(s).split(/,| with /i)[0].trim();

  const title: Tri = tri(
    `${cap(clean(prot.name.en))} ${fmt.title.en}, ${marHead(mar.name.en)}`,
    `${cap(clean(prot.name.es))} ${fmt.title.es}, ${marHead(mar.name.es)}`,
    `${cap(clean(prot.name.pt))} ${fmt.title.pt}, ${marHead(mar.name.pt)}`,
  );

  const subtitle: Tri = tri(
    `${cap(marHead(mar.name.en))} meets ${fmt.title.en.toLowerCase()}, finished with ${fin.name.en}.`,
    `${cap(marHead(mar.name.es))} se une al ${fmt.title.es.toLowerCase()}, terminado con ${fin.name.es}.`,
    `${cap(marHead(mar.name.pt))} encontra o ${fmt.title.pt.toLowerCase()}, finalizado com ${fin.name.pt}.`,
  );

  const story: Tri = tri(
    `Day ${index + 1} of the trilingual calendar. ${fmt.title.en} carries the format; ${prot.name.en} carries the soul; ${mar.name.en} carries the conversation between continents. ${fin.name.en} writes the last word.`,
    `Día ${index + 1} del calendario trilingüe. ${fmt.title.es} aporta el formato; ${prot.name.es} aporta el alma; ${mar.name.es} aporta la conversación entre continentes. ${fin.name.es} escribe la última palabra.`,
    `Dia ${index + 1} do calendário trilíngue. ${fmt.title.pt} traz o formato; ${prot.name.pt} traz a alma; ${mar.name.pt} traz a conversa entre continentes. ${fin.name.pt} escreve a última palavra.`,
  );

  const proteinIngredient: Ingredient = {
    amount: prot.amountG,
    unit: "g" as Unit,
    name: prot.name,
    allergens: prot.allergens,
    shopQuery: prot.shopQuery,
  };

  const marinadeIngredient: Ingredient = {
    amount: 3,
    unit: "tbsp" as Unit,
    name: mar.name,
    allergens: mar.allergens,
  };

  const ingredients = [proteinIngredient, marinadeIngredient, ...fmt.ingredients];

  const sub = (s: string) =>
    s
      .replaceAll("{protein}", prot.name.en)
      .replaceAll("{marinade}", mar.name.en.split(" (")[0])
      .replaceAll("{finish}", fin.name.en);
  const subEs = (s: string) =>
    s
      .replaceAll("{protein}", prot.name.es)
      .replaceAll("{marinade}", mar.name.es.split(" (")[0])
      .replaceAll("{finish}", fin.name.es);
  const subPt = (s: string) =>
    s
      .replaceAll("{protein}", prot.name.pt)
      .replaceAll("{marinade}", mar.name.pt.split(" (")[0])
      .replaceAll("{finish}", fin.name.pt);

  const method = {
    en: fmt.method.en.map(sub),
    es: fmt.method.es.map(subEs),
    pt: fmt.method.pt.map(subPt),
  };

  const allergens = dedupe<Allergen>([
    ...fmt.baseAllergens,
    ...prot.allergens,
    ...mar.allergens,
    ...fin.allergens,
    ...ingredients.flatMap((i) => i.allergens ?? []),
  ]);

  // Dietary intersection
  const dietary: Dietary[] = [];
  if (!allergens.includes("dairy")) dietary.push("dairyFree");
  if (!allergens.includes("gluten")) dietary.push("glutenFree");
  if (prot.dietary.includes("vegetarian") && !allergens.includes("fish") && !allergens.includes("shellfish") && !allergens.includes("pork")) dietary.push("vegetarian");
  if (prot.dietary.includes("vegan") && !allergens.includes("dairy") && !allergens.includes("egg") && !allergens.includes("fish") && !allergens.includes("shellfish") && !allergens.includes("pork")) dietary.push("vegan");
  if (prot.dietary.includes("pescatarian") && !allergens.includes("pork")) dietary.push("pescatarian");
  if (!allergens.includes("pork")) dietary.push("pork");

  const slug = `day-${(index + 1).toString().padStart(3, "0")}-${fmt.key}-${prot.key}-${mar.key}`;
  const heroPrompt = buildPrompt(prot.name.en, fmt.title.en, mar.name.en, fin.name.en);
  const heroSeed = seedFromSlug(slug);
  return {
    slug,
    category: fmt.category,
    title,
    subtitle,
    origin: tri("Mexico × Asia", "México × Asia", "México × Ásia"),
    hero: aiImage(heroPrompt, heroSeed, 1800, 1100),
    thumb: aiImage(heroPrompt, heroSeed, 900, 700),
    prepMinutes: fmt.prep,
    cookMinutes: fmt.cook,
    serves: fmt.serves,
    difficulty: fmt.difficulty,
    spice,
    umami,
    story,
    ingredients,
    method,
    notes: tri(
      "Generated daily variant. Fork it in your notebook and make it your own.",
      "Variante diaria generada. Bifúrcala en tu cuaderno y hazla tuya.",
      "Variação diária gerada. Bifurque no seu caderno e torne-a sua.",
    ),
    pairing: tri(
      "Cold lager, sake, or a mezcal-tonic.",
      "Cerveza fría, sake o mezcal-tónica.",
      "Lager gelada, sake ou mezcal-tônica.",
    ),
    tags: {
      en: [fmt.key, prot.key, mar.key.split("-")[0]],
      es: [fmt.title.es.toLowerCase(), prot.name.es.split(" ")[0], mar.name.es.split(" ")[0]],
      pt: [fmt.title.pt.toLowerCase(), prot.name.pt.split(" ")[0], mar.name.pt.split(" ")[0]],
    },
    allergens,
    dietary: dedupe(dietary),
    meals: fmt.meals,
    healthy: computeHealthy(allergens, prot.key, fmt.key),
    season: seasonForIndex(index),
  };
}

/* A dish lands in the Super-Healthy menu when it has no dairy, no gluten, no alcohol,
   no pork, AND the protein is plant-based or lean (tofu, tempeh, mushroom, white fish,
   salmon, hamachi, chicken thigh, shrimp), AND the format is bowl/salad/ceviche/skewer/
   stir-fry/fruit-acai. */
function computeHealthy(allergens: Allergen[], proteinKey: string, formatKey: string): boolean {
  const leanProtein = new Set(["tofu", "tempeh", "mushroom", "white-fish", "salmon", "hamachi", "shrimp", "chicken-thigh"]);
  const leanFormat = new Set(["bowl", "salad", "ceviche", "skewer", "stir-fry", "fruit-acai", "oat-bowl"]);
  if (!leanProtein.has(proteinKey)) return false;
  if (!leanFormat.has(formatKey)) return false;
  if (allergens.includes("dairy")) return false;
  if (allergens.includes("alcohol")) return false;
  if (allergens.includes("pork")) return false;
  return true;
}

function seasonForIndex(index: number): Season {
  const dayOfYear = (((index % 365) + 365) % 365) + 1; // 1..365
  if (dayOfYear < 80) return "winter";   // ~Jan 1 — Mar 20
  if (dayOfYear < 172) return "spring";  // Mar 20 — Jun 21
  if (dayOfYear < 265) return "summer";  // Jun 21 — Sep 22
  if (dayOfYear < 355) return "fall";    // Sep 22 — Dec 21
  return "winter";
}
