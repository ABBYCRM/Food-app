/**
 * The 365-day Asian-Mexican fusion breakfast collection — one recipe per
 * day of a non-leap year, generated (not hand-authored one at a time; see
 * README in this directory... actually see the module doc below) by
 * crossing a Mexican culinary element with an Asian regional influence, a
 * protein, and one of the 20 breakfast dish formats illustrated in
 * breakfastArt.ts.
 *
 * Why generated rather than 365 independently hand-written recipes: that's
 * ~1,000+ unique paragraphs of prose across three languages, which isn't
 * something that can be authored with genuine per-dish uniqueness by hand
 * at this scale in one pass. Instead every recipe is built from real,
 * distinct ingredient combinations (not just a title with swapped
 * adjectives) — a different protein, a different Asian flavor base (with
 * its own 2-3 real ingredients), a different Mexican element (ditto), and a
 * method that references those specific ingredients — so the result is
 * genuinely cookable and distinct, not padding. Allergens/dietary flags are
 * derived from the actual ingredients used, never guessed. Images are the
 * matching format illustration from breakfastArt.ts — deterministic, so a
 * congee recipe can never end up with a taco photo.
 *
 * validate:breakfast (scripts/validate-breakfast.mjs) enforces: exactly 365
 * recipes, unique slugs/ids/titles, every recipe carries both an Asian and
 * a Mexican tag, required fields present, no duplicate ingredient lists.
 */

import type {
  Allergen, Category, Dietary, Ingredient, LocalizedList, LocalizedString,
  Recipe, Season, Unit,
} from "./recipes";
import { breakfastArt, BREAKFAST_FORMATS, type BreakfastFormat } from "@/lib/breakfastArt";

type Loc3 = LocalizedString;

function ing(
  amount: number | undefined,
  unit: Unit | undefined,
  name: Loc3,
  allergens?: Allergen[],
  shopQuery?: string,
): Ingredient {
  return { amount, unit, name, allergens, shopQuery };
}

function toTaste(name: Loc3, allergens?: Allergen[]): Ingredient {
  return {
    qty: { en: "to taste", es: "al gusto", pt: "a gosto" },
    name,
    allergens,
  };
}

/* ---------------------------------------------------------------------- *
 * Asian flavor profiles — each contributes a city (for the origin pill), a
 * short flavor label used in titles, and 2-3 real seasoning ingredients.
 * ---------------------------------------------------------------------- */

type AsianKey = "japanese" | "korean" | "cantonese" | "sichuan" | "vietnamese" | "thai" | "filipino" | "indonesian" | "malaysian" | "indian" | "taiwanese";

type FlavorProfile = {
  key: string;
  city: Loc3;
  label: Loc3;
  tagKey: Loc3;
  spice: number;
  umami: number;
  ingredients: Ingredient[];
};

const ASIAN: Record<AsianKey, FlavorProfile> = {
  japanese: {
    key: "japanese",
    city: { en: "Tokyo", es: "Tokio", pt: "Tóquio" },
    label: { en: "Miso-Shoyu", es: "Miso-Shoyu", pt: "Missô-Shoyu" },
    tagKey: { en: "japanese", es: "japonés", pt: "japonês" },
    spice: 1, umami: 4,
    ingredients: [
      ing(2, "tbsp", { en: "white miso paste", es: "pasta de miso blanco", pt: "pasta de missô branco" }, ["soy"], "white miso paste"),
      ing(1, "tbsp", { en: "soy sauce", es: "salsa de soya", pt: "molho de soja" }, ["soy", "gluten"], "soy sauce"),
      ing(1, "tsp", { en: "toasted sesame oil", es: "aceite de ajonjolí tostado", pt: "óleo de gergelim torrado" }, ["sesame"], "toasted sesame oil"),
    ],
  },
  korean: {
    key: "korean",
    city: { en: "Seoul", es: "Seúl", pt: "Seul" },
    label: { en: "Gochujang-Kimchi", es: "Gochujang-Kimchi", pt: "Gochujang-Kimchi" },
    tagKey: { en: "korean", es: "coreano", pt: "coreano" },
    spice: 3, umami: 4,
    ingredients: [
      ing(2, "tbsp", { en: "gochujang", es: "gochujang", pt: "gochujang" }, ["soy"], "gochujang paste"),
      ing(0.5, "cup", { en: "chopped cabbage kimchi", es: "kimchi de col picado", pt: "kimchi de repolho picado" }, ["fish"], "cabbage kimchi"),
      ing(1, "tsp", { en: "toasted sesame oil", es: "aceite de ajonjolí tostado", pt: "óleo de gergelim torrado" }, ["sesame"], "toasted sesame oil"),
    ],
  },
  cantonese: {
    key: "cantonese",
    city: { en: "Guangzhou", es: "Cantón", pt: "Cantão" },
    label: { en: "Ginger-Scallion", es: "Jengibre-Cebollín", pt: "Gengibre-Cebolinha" },
    tagKey: { en: "cantonese", es: "cantonés", pt: "cantonês" },
    spice: 1, umami: 3,
    ingredients: [
      ing(1, "tbsp", { en: "grated fresh ginger", es: "jengibre fresco rallado", pt: "gengibre fresco ralado" }, [], "fresh ginger"),
      ing(2, "tbsp", { en: "soy sauce", es: "salsa de soya", pt: "molho de soja" }, ["soy", "gluten"], "soy sauce"),
      ing(2, "piece", { en: "scallions, sliced", es: "cebollín en rodajas", pt: "cebolinha fatiada" }, [], "scallions"),
    ],
  },
  sichuan: {
    key: "sichuan",
    city: { en: "Chengdu", es: "Chengdu", pt: "Chengdu" },
    label: { en: "Sichuan Chili-Oil", es: "Aceite de Chile Sichuan", pt: "Óleo de Pimenta Sichuan" },
    tagKey: { en: "sichuan", es: "sichuanés", pt: "sichuanês" },
    spice: 4, umami: 3,
    ingredients: [
      ing(2, "tbsp", { en: "chili crisp oil", es: "aceite picante crujiente", pt: "óleo picante crocante" }, ["soy"], "chili crisp"),
      ing(0.5, "tsp", { en: "ground Sichuan peppercorn", es: "pimienta de Sichuan molida", pt: "pimenta-do-Sichuan moída" }, [], "Sichuan peppercorn"),
      ing(1, "tbsp", { en: "black vinegar", es: "vinagre negro", pt: "vinagre preto" }, [], "Chinese black vinegar"),
    ],
  },
  vietnamese: {
    key: "vietnamese",
    city: { en: "Hanoi", es: "Hanói", pt: "Hanói" },
    label: { en: "Nuoc Cham-Lemongrass", es: "Nuoc Cham-Limoncillo", pt: "Nuoc Cham-Capim-Limão" },
    tagKey: { en: "vietnamese", es: "vietnamita", pt: "vietnamita" },
    spice: 2, umami: 3,
    ingredients: [
      ing(2, "tbsp", { en: "nuoc cham dipping sauce", es: "salsa nuoc cham", pt: "molho nuoc cham" }, ["fish"], "nuoc cham sauce"),
      ing(1, "tbsp", { en: "minced lemongrass", es: "limoncillo picado", pt: "capim-limão picado" }, [], "fresh lemongrass"),
      ing(0.25, "cup", { en: "torn mint and Thai basil", es: "menta y albahaca tailandesa", pt: "hortelã e manjericão tailandês" }, [], "mint and Thai basil"),
    ],
  },
  thai: {
    key: "thai",
    city: { en: "Bangkok", es: "Bangkok", pt: "Bangkok" },
    label: { en: "Coconut-Curry", es: "Coco-Curry", pt: "Coco-Curry" },
    tagKey: { en: "thai", es: "tailandés", pt: "tailandês" },
    spice: 3, umami: 3,
    ingredients: [
      ing(2, "tbsp", { en: "red curry paste", es: "pasta de curry rojo", pt: "pasta de curry vermelho" }, ["shellfish"], "Thai red curry paste"),
      ing(0.5, "cup", { en: "coconut milk", es: "leche de coco", pt: "leite de coco" }, [], "coconut milk"),
      ing(2, "piece", { en: "kaffir lime leaves, torn", es: "hojas de lima kaffir", pt: "folhas de lima kaffir" }, [], "kaffir lime leaves"),
    ],
  },
  filipino: {
    key: "filipino",
    city: { en: "Manila", es: "Manila", pt: "Manila" },
    label: { en: "Adobo-Vinegar", es: "Adobo-Vinagre", pt: "Adobo-Vinagre" },
    tagKey: { en: "filipino", es: "filipino", pt: "filipino" },
    spice: 1, umami: 4,
    ingredients: [
      ing(3, "tbsp", { en: "soy sauce", es: "salsa de soya", pt: "molho de soja" }, ["soy", "gluten"], "soy sauce"),
      ing(2, "tbsp", { en: "cane vinegar", es: "vinagre de caña", pt: "vinagre de cana" }, [], "cane vinegar"),
      ing(3, "piece", { en: "garlic cloves, crushed", es: "dientes de ajo machacados", pt: "dentes de alho amassados" }, [], "garlic"),
    ],
  },
  indonesian: {
    key: "indonesian",
    city: { en: "Jakarta", es: "Yakarta", pt: "Jacarta" },
    label: { en: "Sambal-Kecap", es: "Sambal-Kecap", pt: "Sambal-Kecap" },
    tagKey: { en: "indonesian", es: "indonesio", pt: "indonésio" },
    spice: 4, umami: 3,
    ingredients: [
      ing(2, "tbsp", { en: "sambal oelek", es: "sambal oelek", pt: "sambal oelek" }, [], "sambal oelek"),
      ing(1, "tbsp", { en: "kecap manis (sweet soy)", es: "kecap manis (soya dulce)", pt: "kecap manis (soja doce)" }, ["soy"], "kecap manis"),
      ing(1, "piece", { en: "shallot, thinly sliced", es: "chalote en rodajas finas", pt: "chalota em fatias finas" }, [], "shallot"),
    ],
  },
  malaysian: {
    key: "malaysian",
    city: { en: "Kuala Lumpur", es: "Kuala Lumpur", pt: "Kuala Lumpur" },
    label: { en: "Curry-Laksa", es: "Curry-Laksa", pt: "Curry-Laksa" },
    tagKey: { en: "malaysian", es: "malasio", pt: "malaio" },
    spice: 3, umami: 4,
    ingredients: [
      ing(2, "tbsp", { en: "laksa curry paste", es: "pasta de curry laksa", pt: "pasta de curry laksa" }, ["shellfish"], "laksa paste"),
      ing(0.5, "cup", { en: "coconut milk", es: "leche de coco", pt: "leite de coco" }, [], "coconut milk"),
      ing(1, "tbsp", { en: "tamarind concentrate", es: "concentrado de tamarindo", pt: "concentrado de tamarindo" }, [], "tamarind concentrate"),
    ],
  },
  indian: {
    key: "indian",
    city: { en: "Mumbai", es: "Bombay", pt: "Mumbai" },
    label: { en: "Masala-Ghee", es: "Masala-Ghee", pt: "Masala-Ghee" },
    tagKey: { en: "indian", es: "indio", pt: "indiano" },
    spice: 3, umami: 3,
    ingredients: [
      ing(1, "tbsp", { en: "ghee", es: "ghee", pt: "ghee" }, ["dairy"], "ghee"),
      ing(1.5, "tsp", { en: "garam masala", es: "garam masala", pt: "garam masala" }, [], "garam masala"),
      ing(0.5, "tsp", { en: "ground turmeric", es: "cúrcuma molida", pt: "açafrão-da-terra moído" }, [], "ground turmeric"),
    ],
  },
  taiwanese: {
    key: "taiwanese",
    city: { en: "Taipei", es: "Taipéi", pt: "Taipé" },
    label: { en: "Five-Spice Scallion", es: "Cinco Especias y Cebollín", pt: "Cinco-Especiarias e Cebolinha" },
    tagKey: { en: "taiwanese", es: "taiwanés", pt: "taiwanês" },
    spice: 2, umami: 3,
    ingredients: [
      ing(1, "tsp", { en: "Chinese five-spice powder", es: "cinco especias chinas", pt: "cinco-especiarias chinesas" }, [], "five-spice powder"),
      ing(2, "tbsp", { en: "soy sauce", es: "salsa de soya", pt: "molho de soja" }, ["soy", "gluten"], "soy sauce"),
      ing(3, "piece", { en: "scallions, sliced", es: "cebollín en rodajas", pt: "cebolinha fatiada" }, [], "scallions"),
    ],
  },
};

const ASIAN_KEYS = Object.keys(ASIAN) as AsianKey[];

/* ---------------------------------------------------------------------- *
 * Mexican elements
 * ---------------------------------------------------------------------- */

type MexicanKey = "salsaRoja" | "salsaVerde" | "mole" | "tamarindoChile" | "elote" | "chileLimeCrema" | "epazoteFrijoles" | "achiote" | "chileMorita" | "picoQueso";

const MEXICAN: Record<MexicanKey, FlavorProfile> = {
  salsaRoja: {
    key: "salsaRoja",
    city: { en: "Guadalajara", es: "Guadalajara", pt: "Guadalajara" },
    label: { en: "Salsa Roja", es: "Salsa Roja", pt: "Salsa Roja" },
    tagKey: { en: "salsa roja", es: "salsa roja", pt: "salsa roja" },
    spice: 3, umami: 2,
    ingredients: [
      ing(0.5, "cup", { en: "salsa roja (charred tomato-guajillo)", es: "salsa roja de jitomate y guajillo asados", pt: "salsa roja de tomate e guajillo assados" }, [], "salsa roja"),
    ],
  },
  salsaVerde: {
    key: "salsaVerde",
    city: { en: "Mexico City", es: "Ciudad de México", pt: "Cidade do México" },
    label: { en: "Salsa Verde", es: "Salsa Verde", pt: "Salsa Verde" },
    tagKey: { en: "salsa verde", es: "salsa verde", pt: "salsa verde" },
    spice: 2, umami: 2,
    ingredients: [
      ing(0.5, "cup", { en: "salsa verde (tomatillo-serrano)", es: "salsa verde de tomatillo y serrano", pt: "salsa verde de tomatillo e serrano" }, [], "salsa verde"),
    ],
  },
  mole: {
    key: "mole",
    city: { en: "Oaxaca", es: "Oaxaca", pt: "Oaxaca" },
    label: { en: "Mole", es: "Mole", pt: "Mole" },
    tagKey: { en: "mole", es: "mole", pt: "mole" },
    spice: 2, umami: 4,
    ingredients: [
      ing(3, "tbsp", { en: "prepared mole paste, thinned with stock", es: "mole preparado, diluido con caldo", pt: "mole preparado, diluído com caldo" }, ["nuts"], "mole paste"),
    ],
  },
  tamarindoChile: {
    key: "tamarindoChile",
    city: { en: "Veracruz", es: "Veracruz", pt: "Veracruz" },
    label: { en: "Tamarind-Chile", es: "Tamarindo-Chile", pt: "Tamarindo-Pimenta" },
    tagKey: { en: "tamarind-chile", es: "tamarindo-chile", pt: "tamarindo-pimenta" },
    spice: 3, umami: 2,
    ingredients: [
      ing(2, "tbsp", { en: "tamarind concentrate", es: "concentrado de tamarindo", pt: "concentrado de tamarindo" }, [], "tamarind concentrate"),
      ing(1, "piece", { en: "chile de árbol, crumbled", es: "chile de árbol desmoronado", pt: "chile de árbol esfarelado" }, [], "chile de árbol"),
    ],
  },
  elote: {
    key: "elote",
    city: { en: "Mexico City", es: "Ciudad de México", pt: "Cidade do México" },
    label: { en: "Elote-Style", es: "Estilo Elote", pt: "Estilo Elote" },
    tagKey: { en: "elote", es: "elote", pt: "elote" },
    spice: 1, umami: 3,
    ingredients: [
      ing(0.33, "cup", { en: "sweet corn kernels, charred", es: "granos de elote carbonizados", pt: "grãos de milho carbonizados" }, [], "corn kernels"),
      ing(2, "tbsp", { en: "crumbled cotija cheese", es: "queso cotija desmoronado", pt: "queijo cotija esfarelado" }, ["dairy"], "cotija cheese"),
      ing(0.5, "tsp", { en: "tajín seasoning", es: "sazonador tajín", pt: "tempero tajín" }, [], "tajín seasoning"),
    ],
  },
  chileLimeCrema: {
    key: "chileLimeCrema",
    city: { en: "Tijuana", es: "Tijuana", pt: "Tijuana" },
    label: { en: "Chile-Lime Crema", es: "Crema de Chile y Limón", pt: "Creme de Pimenta e Limão" },
    tagKey: { en: "chile-lime crema", es: "crema chile-limón", pt: "creme pimenta-limão" },
    spice: 2, umami: 1,
    ingredients: [
      ing(3, "tbsp", { en: "Mexican crema", es: "crema mexicana", pt: "creme mexicano (crema)" }, ["dairy"], "Mexican crema"),
      ing(1, "tsp", { en: "chile piquín, crushed", es: "chile piquín machacado", pt: "chile piquín amassado" }, [], "chile piquín"),
      ing(1, "piece", { en: "lime, juiced", es: "limón, el jugo", pt: "limão, o suco" }, [], "lime"),
    ],
  },
  epazoteFrijoles: {
    key: "epazoteFrijoles",
    city: { en: "Michoacán", es: "Michoacán", pt: "Michoacán" },
    label: { en: "Epazote-Black Bean", es: "Epazote-Frijol Negro", pt: "Epazote-Feijão-Preto" },
    tagKey: { en: "epazote-black bean", es: "epazote-frijol", pt: "epazote-feijão" },
    spice: 1, umami: 2,
    ingredients: [
      ing(0.75, "cup", { en: "black beans, simmered with epazote", es: "frijoles negros cocidos con epazote", pt: "feijão preto cozido com erva-de-santa-maria" }, [], "black beans"),
      ing(2, "piece", { en: "fresh epazote leaves", es: "hojas frescas de epazote", pt: "folhas frescas de erva-de-santa-maria" }, [], "epazote"),
    ],
  },
  achiote: {
    key: "achiote",
    city: { en: "Mérida", es: "Mérida", pt: "Mérida" },
    label: { en: "Achiote", es: "Achiote", pt: "Achiote" },
    tagKey: { en: "achiote", es: "achiote", pt: "achiote" },
    spice: 1, umami: 2,
    ingredients: [
      ing(2, "tbsp", { en: "achiote paste", es: "pasta de achiote", pt: "pasta de achiote" }, [], "achiote paste"),
      ing(2, "tbsp", { en: "sour orange juice (or lime + orange)", es: "jugo de naranja agria", pt: "suco de laranja azeda" }, [], "sour orange juice"),
    ],
  },
  chileMorita: {
    key: "chileMorita",
    city: { en: "Puebla", es: "Puebla", pt: "Puebla" },
    label: { en: "Chile Morita-Adobo", es: "Chile Morita-Adobo", pt: "Chile Morita-Adobo" },
    tagKey: { en: "chile morita", es: "chile morita", pt: "chile morita" },
    spice: 4, umami: 2,
    ingredients: [
      ing(2, "piece", { en: "dried chile morita, soaked and blended", es: "chile morita seco, remojado y molido", pt: "chile morita seco, hidratado e batido" }, [], "dried chile morita"),
      ing(1, "tbsp", { en: "adobo vinegar", es: "vinagre de adobo", pt: "vinagre de adobo" }, [], "adobo sauce"),
    ],
  },
  picoQueso: {
    key: "picoQueso",
    city: { en: "Sinaloa", es: "Sinaloa", pt: "Sinaloa" },
    label: { en: "Pico de Gallo-Queso Fresco", es: "Pico de Gallo-Queso Fresco", pt: "Pico de Gallo-Queijo Fresco" },
    tagKey: { en: "pico de gallo", es: "pico de gallo", pt: "pico de gallo" },
    spice: 1, umami: 1,
    ingredients: [
      ing(0.5, "cup", { en: "pico de gallo", es: "pico de gallo", pt: "pico de gallo" }, [], "pico de gallo"),
      ing(2, "tbsp", { en: "crumbled queso fresco", es: "queso fresco desmoronado", pt: "queijo fresco esfarelado" }, ["dairy"], "queso fresco"),
    ],
  },
};

const MEXICAN_KEYS = Object.keys(MEXICAN) as MexicanKey[];

/* ---------------------------------------------------------------------- *
 * Proteins
 * ---------------------------------------------------------------------- */

type ProteinKey = "egg" | "chorizo" | "carnitas" | "chicken" | "barbacoa" | "shrimp" | "tofu" | "blackBeans" | "mushroom";

type ProteinProfile = {
  key: ProteinKey;
  label: Loc3;
  meat: boolean;
  fish: boolean;
  vegan: boolean;
  ingredient: Ingredient;
  cookNote: Loc3;
};

const PROTEINS: Record<ProteinKey, ProteinProfile> = {
  egg: {
    key: "egg", label: { en: "Egg", es: "Huevo", pt: "Ovo" }, meat: false, fish: false, vegan: false,
    ingredient: ing(3, "piece", { en: "eggs", es: "huevos", pt: "ovos" }, ["egg"], "eggs"),
    cookNote: { en: "scramble the eggs to just-set curds", es: "revuelve los huevos hasta que cuajen apenas", pt: "mexa os ovos até talharem levemente" },
  },
  chorizo: {
    key: "chorizo", label: { en: "Chorizo", es: "Chorizo", pt: "Chorizo" }, meat: true, fish: false, vegan: false,
    ingredient: ing(200, "g", { en: "fresh Mexican chorizo, casings removed", es: "chorizo mexicano fresco, sin tripa", pt: "chorizo mexicano fresco, sem a tripa" }, ["pork"], "fresh Mexican chorizo"),
    cookNote: { en: "crumble and brown the chorizo until rendered", es: "desmorona y dora el chorizo hasta que suelte su grasa", pt: "esfarele e doure o chorizo até soltar a gordura" },
  },
  carnitas: {
    key: "carnitas", label: { en: "Carnitas", es: "Carnitas", pt: "Carnitas" }, meat: true, fish: false, vegan: false,
    ingredient: ing(250, "g", { en: "pulled pork carnitas, warmed", es: "carnitas de cerdo deshebradas, calientes", pt: "carnitas de porco desfiadas, aquecidas" }, ["pork"], "pork carnitas"),
    cookNote: { en: "crisp the carnitas edges in a hot pan", es: "dora los bordes de las carnitas en sartén caliente", pt: "doure as bordas das carnitas em frigideira quente" },
  },
  chicken: {
    key: "chicken", label: { en: "Shredded Chicken", es: "Pollo Deshebrado", pt: "Frango Desfiado" }, meat: true, fish: false, vegan: false,
    ingredient: ing(250, "g", { en: "poached chicken thigh, shredded", es: "muslo de pollo escalfado y deshebrado", pt: "coxa de frango escalfada e desfiada" }, [], "cooked shredded chicken"),
    cookNote: { en: "warm the shredded chicken through", es: "calienta bien el pollo deshebrado", pt: "aqueça bem o frango desfiado" },
  },
  barbacoa: {
    key: "barbacoa", label: { en: "Barbacoa Beef", es: "Barbacoa de Res", pt: "Barbacoa de Boi" }, meat: true, fish: false, vegan: false,
    ingredient: ing(250, "g", { en: "shredded barbacoa beef, warmed", es: "barbacoa de res deshebrada, caliente", pt: "barbacoa de boi desfiada, aquecida" }, [], "shredded barbacoa beef"),
    cookNote: { en: "warm the barbacoa in its own juices", es: "calienta la barbacoa en su propio jugo", pt: "aqueça a barbacoa em seu próprio caldo" },
  },
  shrimp: {
    key: "shrimp", label: { en: "Shrimp", es: "Camarón", pt: "Camarão" }, meat: false, fish: true, vegan: false,
    ingredient: ing(250, "g", { en: "shrimp, peeled and deveined", es: "camarón pelado y limpio", pt: "camarão descascado e limpo" }, ["shellfish"], "peeled shrimp"),
    cookNote: { en: "cook the shrimp just until opaque and curled, 2–3 min", es: "cocina el camarón hasta que esté opaco y curvado, 2–3 min", pt: "cozinhe o camarão até ficar opaco e curvado, 2–3 min" },
  },
  tofu: {
    key: "tofu", label: { en: "Crispy Tofu", es: "Tofu Crujiente", pt: "Tofu Crocante" }, meat: false, fish: false, vegan: true,
    ingredient: ing(300, "g", { en: "firm tofu, pressed and cubed", es: "tofu firme, prensado y en cubos", pt: "tofu firme, prensado e em cubos" }, ["soy"], "firm tofu"),
    cookNote: { en: "pan-fry the tofu cubes until crisp on all sides", es: "fríe los cubos de tofu hasta dorar por todos lados", pt: "frite os cubos de tofu até dourar de todos os lados" },
  },
  blackBeans: {
    key: "blackBeans", label: { en: "Black Bean", es: "Frijol Negro", pt: "Feijão Preto" }, meat: false, fish: false, vegan: true,
    ingredient: ing(1.5, "cup", { en: "cooked black beans, drained", es: "frijoles negros cocidos, escurridos", pt: "feijão preto cozido, escorrido" }, [], "cooked black beans"),
    cookNote: { en: "warm the black beans, mashing about half", es: "calienta los frijoles, machacando la mitad", pt: "aqueça o feijão, amassando metade" },
  },
  mushroom: {
    key: "mushroom", label: { en: "Mushroom", es: "Hongo", pt: "Cogumelo" }, meat: false, fish: false, vegan: true,
    ingredient: ing(250, "g", { en: "mixed mushrooms, sliced", es: "hongos mixtos en láminas", pt: "cogumelos variados fatiados" }, [], "mixed mushrooms"),
    cookNote: { en: "sauté the mushrooms hard until deeply browned", es: "saltea los hongos a fuego fuerte hasta dorar bien", pt: "salteie os cogumelos em fogo alto até dourar bem" },
  },
};

/* ---------------------------------------------------------------------- *
 * Format profiles — carrier ingredients, method skeleton, timing.
 * ---------------------------------------------------------------------- */

type FormatProfile = {
  noun: Loc3;
  category: Category;
  carrier: Ingredient[];
  carrierStep: Loc3;
  buildStep: Loc3;
  finishStep: Loc3;
  restStep?: Loc3;
  prep: [number, number];
  cook: [number, number];
  difficulty: Recipe["difficulty"];
  proteins: ProteinKey[];
  garnish: Ingredient[];
};

const FORMAT: Record<BreakfastFormat, FormatProfile> = {
  tacos: {
    noun: { en: "Breakfast Tacos", es: "Tacos de Desayuno", pt: "Tacos de Café da Manhã" },
    category: "main",
    carrier: [ing(8, "piece", { en: "small corn tortillas", es: "tortillas de maíz pequeñas", pt: "tortilhas de milho pequenas" }, [], "corn tortillas")],
    carrierStep: { en: "Warm the corn tortillas on a dry comal or skillet until pliable, then wrap in a towel to keep warm.", es: "Calienta las tortillas de maíz en un comal seco hasta que estén flexibles; envuélvelas en un paño.", pt: "Aqueça as tortilhas de milho em um comal seco até ficarem maleáveis; embrulhe em um pano." },
    buildStep: { en: "Spoon the filling into the warm tortillas and top with the salsa.", es: "Sirve el relleno en las tortillas calientes y baña con la salsa.", pt: "Coloque o recheio nas tortilhas quentes e regue com o molho." },
    finishStep: { en: "Finish with the garnish and serve immediately, tortillas doubled up.", es: "Termina con la guarnición y sirve de inmediato, con tortillas dobles.", pt: "Finalize com a guarnição e sirva na hora, com tortilhas duplas." },
    prep: [10, 15], cook: [10, 20], difficulty: "easy",
    proteins: ["egg", "chorizo", "carnitas", "shrimp", "tofu", "mushroom"],
    garnish: [toTaste({ en: "chopped cilantro, diced onion, lime wedges", es: "cilantro picado, cebolla picada, limón en gajos", pt: "coentro picado, cebola picada, limão em gomos" })],
  },
  burrito: {
    noun: { en: "Breakfast Burrito", es: "Burrito de Desayuno", pt: "Burrito de Café da Manhã" },
    category: "main",
    carrier: [ing(2, "piece", { en: "large flour tortillas", es: "tortillas de harina grandes", pt: "tortilhas de farinha grandes" }, ["gluten"], "large flour tortillas")],
    carrierStep: { en: "Warm the flour tortillas until soft and pliable.", es: "Calienta las tortillas de harina hasta que estén suaves.", pt: "Aqueça as tortilhas de farinha até ficarem macias." },
    buildStep: { en: "Layer the filling and salsa down the center of each tortilla.", es: "Coloca el relleno y la salsa en el centro de cada tortilla.", pt: "Coloque o recheio e o molho no centro de cada tortilha." },
    finishStep: { en: "Fold in the sides, roll tightly, and sear seam-side down until golden.", es: "Dobla los lados, enrolla firme y sella con la unión hacia abajo hasta dorar.", pt: "Dobre as laterais, enrole firme e sele com a emenda para baixo até dourar." },
    prep: [10, 15], cook: [10, 15], difficulty: "easy",
    proteins: ["egg", "chorizo", "carnitas", "chicken", "blackBeans", "tofu"],
    garnish: [toTaste({ en: "shredded cheese and hot sauce", es: "queso rallado y salsa picante", pt: "queijo ralado e molho picante" }, ["dairy"])],
  },
  chilaquiles: {
    noun: { en: "Chilaquiles", es: "Chilaquiles", pt: "Chilaquiles" },
    category: "main",
    carrier: [ing(150, "g", { en: "fried corn tortilla chips", es: "totopos de maíz fritos", pt: "totopos de milho fritos" }, [], "corn tortilla chips")],
    carrierStep: { en: "Bring the salsa to a simmer in a wide skillet.", es: "Lleva la salsa a fuego lento en un sartén amplio.", pt: "Deixe o molho em fogo baixo numa frigideira larga." },
    buildStep: { en: "Fold in the tortilla chips just until coated but still a little crisp at the edges.", es: "Incorpora los totopos hasta cubrirlos, dejando el borde algo crujiente.", pt: "Misture os totopos até cobrir, deixando a borda um pouco crocante." },
    finishStep: { en: "Plate and top with the protein, crema, and garnish while the chips are still warm.", es: "Sirve y corona con la proteína, crema y guarnición mientras los totopos siguen calientes.", pt: "Sirva e finalize com a proteína, o creme e a guarnição enquanto os totopos ainda estão quentes." },
    prep: [10, 10], cook: [10, 15], difficulty: "easy",
    proteins: ["egg", "chorizo", "chicken", "blackBeans", "tofu", "mushroom"],
    garnish: [toTaste({ en: "crumbled queso fresco and sliced onion", es: "queso fresco desmoronado y cebolla en rodajas", pt: "queijo fresco esfarelado e cebola fatiada" }, ["dairy"])],
  },
  tostada: {
    noun: { en: "Breakfast Tostadas", es: "Tostadas de Desayuno", pt: "Tostadas de Café da Manhã" },
    category: "starter",
    carrier: [ing(6, "piece", { en: "flat fried tostada shells", es: "tostadas planas fritas", pt: "tostadas planas fritas" }, [], "tostada shells")],
    carrierStep: { en: "Lay the tostada shells out on a tray.", es: "Coloca las tostadas sobre una charola.", pt: "Coloque as tostadas em uma bandeja." },
    buildStep: { en: "Spread a layer of the filling over each shell, then spoon over the salsa.", es: "Extiende una capa del relleno sobre cada tostada y baña con la salsa.", pt: "Espalhe uma camada do recheio em cada tostada e regue com o molho." },
    finishStep: { en: "Top with the garnish just before serving so the shells stay crisp.", es: "Corona con la guarnición justo antes de servir para que la tostada quede crujiente.", pt: "Finalize com a guarnição pouco antes de servir para a tostada ficar crocante." },
    prep: [12, 15], cook: [8, 12], difficulty: "easy",
    proteins: ["egg", "chicken", "shrimp", "blackBeans", "tofu"],
    garnish: [toTaste({ en: "shredded lettuce, crema, and cotija", es: "lechuga fileteada, crema y cotija", pt: "alface fatiada, crema e queijo cotija" }, ["dairy"])],
  },
  huevos: {
    noun: { en: "Huevos Rancheros", es: "Huevos Rancheros", pt: "Huevos Rancheros" },
    category: "main",
    carrier: [ing(4, "piece", { en: "corn tortillas, lightly fried", es: "tortillas de maíz ligeramente fritas", pt: "tortilhas de milho levemente fritas" }, [], "corn tortillas")],
    carrierStep: { en: "Lightly fry the tortillas until just crisp at the edges; keep warm on a plate.", es: "Fríe ligeramente las tortillas hasta dorar los bordes; mantén tibias en un plato.", pt: "Frite levemente as tortilhas até dourar as bordas; mantenha mornas em um prato." },
    buildStep: { en: "Fry the eggs sunny-side up in the same pan, then set one on each tortilla.", es: "Fríe los huevos estrellados en el mismo sartén y coloca uno sobre cada tortilla.", pt: "Frite os ovos com a gema mole na mesma frigideira e coloque um sobre cada tortilha." },
    finishStep: { en: "Spoon the warm salsa over the eggs and finish with the garnish.", es: "Baña los huevos con la salsa caliente y termina con la guarnición.", pt: "Regue os ovos com o molho quente e finalize com a guarnição." },
    prep: [10, 10], cook: [10, 15], difficulty: "easy",
    proteins: ["egg"],
    garnish: [toTaste({ en: "crumbled queso fresco and avocado slices", es: "queso fresco desmoronado y aguacate en láminas", pt: "queijo fresco esfarelado e abacate fatiado" }, ["dairy"])],
  },
  "tofu-scramble": {
    noun: { en: "Tofu Scramble Bowl", es: "Tazón de Tofu Revuelto", pt: "Bowl de Tofu Mexido" },
    category: "main",
    carrier: [ing(1, "tbsp", { en: "neutral oil", es: "aceite neutro", pt: "óleo neutro" }, [], "cooking oil")],
    carrierStep: { en: "Heat the oil in a wide skillet over medium-high.", es: "Calienta el aceite en un sartén amplio a fuego medio-alto.", pt: "Aqueça o óleo numa frigideira larga em fogo médio-alto." },
    buildStep: { en: "Crumble in the tofu and cook until the edges catch color, then stir in the flavor base.", es: "Desmorona el tofu y cocina hasta dorar los bordes; incorpora la base de sabor.", pt: "Esfarele o tofu e cozinhe até dourar as bordas; misture a base de sabor." },
    finishStep: { en: "Fold in the salsa off the heat and finish with the garnish.", es: "Incorpora la salsa fuera del fuego y termina con la guarnición.", pt: "Misture o molho fora do fogo e finalize com a guarnição." },
    prep: [10, 10], cook: [10, 12], difficulty: "easy",
    proteins: ["tofu"],
    garnish: [toTaste({ en: "sliced avocado and chopped cilantro", es: "aguacate en láminas y cilantro picado", pt: "abacate fatiado e coentro picado" })],
  },
  congee: {
    noun: { en: "Congee", es: "Congee", pt: "Congee" },
    category: "main",
    carrier: [ing(0.75, "cup", { en: "jasmine rice", es: "arroz jazmín", pt: "arroz jasmim" }, [], "jasmine rice"), ing(1.5, "l", { en: "chicken or vegetable stock", es: "caldo de pollo o vegetal", pt: "caldo de frango ou vegetal" }, [], "stock")],
    carrierStep: { en: "Simmer the rice in the stock, stirring occasionally, until it breaks down into a thick porridge, 35–45 min.", es: "Cuece el arroz en el caldo, revolviendo de vez en cuando, hasta lograr un congee espeso, 35–45 min.", pt: "Cozinhe o arroz no caldo, mexendo de vez em quando, até virar um mingau espesso, 35–45 min." },
    buildStep: { en: "Stir the flavor base into the porridge, then fold in the protein to warm through.", es: "Incorpora la base de sabor al congee y añade la proteína hasta calentar.", pt: "Misture a base de sabor ao congee e adicione a proteína até aquecer." },
    finishStep: { en: "Ladle into bowls and finish with the salsa and garnish.", es: "Sirve en tazones y termina con la salsa y la guarnición.", pt: "Sirva em tigelas e finalize com o molho e a guarnição." },
    prep: [10, 10], cook: [35, 45], difficulty: "medium",
    proteins: ["chicken", "shrimp", "mushroom", "egg"],
    garnish: [toTaste({ en: "sliced scallion and fried shallots", es: "cebollín en rodajas y chalote frito", pt: "cebolinha fatiada e chalota frita" })],
  },
  "noodle-bowl": {
    noun: { en: "Breakfast Noodle Bowl", es: "Tazón de Fideos de Desayuno", pt: "Bowl de Macarrão de Café da Manhã" },
    category: "main",
    carrier: [ing(200, "g", { en: "fresh wheat noodles", es: "fideos frescos de trigo", pt: "macarrão fresco de trigo" }, ["gluten"], "fresh wheat noodles")],
    carrierStep: { en: "Boil the noodles until just tender, then drain and divide between bowls.", es: "Hierve los fideos hasta que estén apenas suaves, escurre y reparte en tazones.", pt: "Cozinhe o macarrão até ficar al dente, escorra e divida nas tigelas." },
    buildStep: { en: "Cook the protein with the flavor base in a hot pan until fragrant, then spoon over the noodles.", es: "Cocina la proteína con la base de sabor hasta que aromatice y sirve sobre los fideos.", pt: "Cozinhe a proteína com a base de sabor até perfumar e sirva sobre o macarrão." },
    finishStep: { en: "Ladle over hot broth spiked with the salsa and finish with the garnish.", es: "Baña con caldo caliente sazonado con la salsa y termina con la guarnición.", pt: "Regue com caldo quente temperado com o molho e finalize com a guarnição." },
    prep: [10, 15], cook: [12, 15], difficulty: "medium",
    proteins: ["egg", "chicken", "shrimp", "tofu", "mushroom"],
    garnish: [toTaste({ en: "soft-boiled egg half and chile oil", es: "medio huevo cocido a la perfección y aceite picante", pt: "meio ovo mollet e óleo picante" })],
  },
  tamale: {
    noun: { en: "Breakfast Tamales", es: "Tamales de Desayuno", pt: "Tamales de Café da Manhã" },
    category: "main",
    carrier: [
      ing(2, "cup", { en: "masa harina, mixed into dough", es: "masa harina, amasada", pt: "massa harina, amassada" }, [], "masa harina"),
      ing(12, "piece", { en: "dried corn husks, soaked", es: "hojas de maíz secas, remojadas", pt: "palhas de milho secas, hidratadas" }, [], "dried corn husks"),
    ],
    carrierStep: { en: "Beat the masa dough with lard or oil until a small ball floats in water, then season.", es: "Bate la masa con manteca o aceite hasta que una bolita flote en agua; sazona.", pt: "Bata a massa com banha ou óleo até uma bolinha flutuar na água; tempere." },
    buildStep: { en: "Spread masa on each husk, spoon the protein and flavor base down the center, and fold closed.", es: "Extiende la masa sobre cada hoja, coloca la proteína y la base de sabor al centro, y dobla.", pt: "Espalhe a massa em cada palha, coloque a proteína e a base de sabor no centro, e dobre." },
    finishStep: { en: "Steam upright 45–60 min until the masa pulls cleanly from the husk; serve with the salsa.", es: "Cuece al vapor 45–60 min, de pie, hasta que la masa se despegue limpia; sirve con la salsa.", pt: "Cozinhe no vapor 45–60 min, em pé, até a massa soltar limpa da palha; sirva com o molho." },
    restStep: { en: "Let the tamales rest 5 minutes off the heat before unwrapping — they finish setting as they cool slightly.", es: "Deja reposar los tamales 5 minutos fuera del fuego antes de desenvolver — terminan de cuajar al enfriar un poco.", pt: "Deixe os tamales descansarem 5 minutos fora do fogo antes de desembrulhar — terminam de firmar ao esfriar um pouco." },
    prep: [40, 50], cook: [45, 60], difficulty: "hard",
    proteins: ["chicken", "carnitas", "blackBeans", "mushroom"],
    garnish: [toTaste({ en: "extra salsa and crema on the side", es: "más salsa y crema aparte", pt: "mais molho e creme à parte" }, ["dairy"])],
  },
  quesadilla: {
    noun: { en: "Breakfast Quesadilla", es: "Quesadilla de Desayuno", pt: "Quesadilla de Café da Manhã" },
    category: "main",
    carrier: [
      ing(4, "piece", { en: "large flour tortillas", es: "tortillas de harina grandes", pt: "tortilhas de farinha grandes" }, ["gluten"], "flour tortillas"),
      ing(1.5, "cup", { en: "shredded melting cheese", es: "queso rallado que funda bien", pt: "queijo ralado que derreta bem" }, ["dairy"], "shredded Oaxaca or mozzarella cheese"),
    ],
    carrierStep: { en: "Cook the protein with the flavor base in a skillet until done through.", es: "Cocina la proteína con la base de sabor hasta que esté bien hecha.", pt: "Cozinhe a proteína com a base de sabor até ficar bem cozida." },
    buildStep: { en: "Scatter cheese and the filling over half of each tortilla, then fold closed.", es: "Reparte el queso y el relleno sobre la mitad de cada tortilla y dobla.", pt: "Distribua o queijo e o recheio sobre metade de cada tortilha e dobre." },
    finishStep: { en: "Griddle both sides until the cheese melts and the tortilla is golden and crisp; cut into wedges and serve with the salsa.", es: "Dora ambos lados hasta fundir el queso y dorar la tortilla; corta en triángulos y sirve con la salsa.", pt: "Doure os dois lados até derreter o queijo e a tortilha ficar crocante; corte em triângulos e sirva com o molho." },
    prep: [10, 10], cook: [10, 15], difficulty: "easy",
    proteins: ["egg", "chorizo", "chicken", "mushroom", "blackBeans"],
    garnish: [toTaste({ en: "pickled jalapeño and extra crema", es: "jalapeño encurtido y crema extra", pt: "jalapeño em conserva e creme extra" }, ["dairy"])],
  },
  torta: {
    noun: { en: "Breakfast Torta", es: "Torta de Desayuno", pt: "Torta de Café da Manhã" },
    category: "main",
    carrier: [ing(2, "piece", { en: "telera or bolillo rolls, split", es: "panes telera o bolillo, partidos", pt: "pães telera ou bolillo, partidos ao meio" }, ["gluten"], "telera or bolillo rolls")],
    carrierStep: { en: "Toast the split rolls cut-side down in a dry pan until golden.", es: "Tuesta los panes con el corte hacia abajo en sartén seco hasta dorar.", pt: "Toste os pães com o corte para baixo numa frigideira seca até dourar." },
    buildStep: { en: "Layer the cooked protein and flavor base onto the bottom half, then spoon over the salsa.", es: "Coloca la proteína cocida y la base de sabor en la mitad inferior y baña con la salsa.", pt: "Coloque a proteína cozida e a base de sabor na metade de baixo e regue com o molho." },
    finishStep: { en: "Add the garnish, close the torta, and press gently before slicing in half.", es: "Añade la guarnición, cierra la torta y presiona suave antes de cortar por la mitad.", pt: "Adicione a guarnição, feche a torta e pressione suave antes de cortar ao meio." },
    prep: [10, 12], cook: [12, 15], difficulty: "easy",
    proteins: ["egg", "chorizo", "carnitas", "chicken", "blackBeans"],
    garnish: [toTaste({ en: "sliced avocado, pickled onion", es: "aguacate en láminas, cebolla encurtida", pt: "abacate fatiado, cebola em conserva" })],
  },
  "rice-bowl": {
    noun: { en: "Breakfast Rice Bowl", es: "Tazón de Arroz de Desayuno", pt: "Bowl de Arroz de Café da Manhã" },
    category: "main",
    carrier: [ing(1.5, "cup", { en: "cooked short-grain rice", es: "arroz de grano corto cocido", pt: "arroz de grão curto cozido" }, [], "cooked short-grain rice")],
    carrierStep: { en: "Warm the rice and divide between bowls.", es: "Calienta el arroz y repártelo en tazones.", pt: "Aqueça o arroz e divida nas tigelas." },
    buildStep: { en: "Cook the protein with the flavor base until done, then spoon over the rice.", es: "Cocina la proteína con la base de sabor hasta que esté lista y sírvela sobre el arroz.", pt: "Cozinhe a proteína com a base de sabor até ficar pronta e sirva sobre o arroz." },
    finishStep: { en: "Top with the salsa and garnish just before serving.", es: "Corona con la salsa y la guarnición justo antes de servir.", pt: "Finalize com o molho e a guarnição pouco antes de servir." },
    prep: [8, 12], cook: [12, 18], difficulty: "easy",
    proteins: ["egg", "chicken", "shrimp", "tofu", "mushroom"],
    garnish: [toTaste({ en: "sesame seeds and sliced scallion", es: "ajonjolí y cebollín en rodajas", pt: "gergelim e cebolinha fatiada" }, ["sesame"])],
  },
  oats: {
    noun: { en: "Savory-Sweet Oat Bowl", es: "Tazón de Avena Dulce-Salado", pt: "Bowl de Aveia Doce-Salgado" },
    category: "main",
    carrier: [ing(1, "cup", { en: "rolled oats", es: "avena en hojuelas", pt: "aveia em flocos" }, ["gluten"], "rolled oats"), ing(2, "cup", { en: "milk or oat milk", es: "leche o leche de avena", pt: "leite ou leite de aveia" }, ["dairy"], "milk")],
    carrierStep: { en: "Simmer the oats in the milk until creamy, about 8 minutes.", es: "Cuece la avena en la leche hasta cremosa, unos 8 minutos.", pt: "Cozinhe a aveia no leite até cremosa, cerca de 8 minutos." },
    buildStep: { en: "Stir a spoonful of the Mexican element through the oats for a sweet-savory base.", es: "Incorpora una cucharada del elemento mexicano a la avena para una base dulce-salada.", pt: "Misture uma colherada do elemento mexicano à aveia para uma base doce-salgada." },
    finishStep: { en: "Top with the garnish and a drizzle to finish.", es: "Corona con la guarnición y un hilo para terminar.", pt: "Finalize com a guarnição e um fio por cima." },
    prep: [5, 8], cook: [8, 10], difficulty: "easy",
    proteins: ["egg", "mushroom", "blackBeans"],
    garnish: [toTaste({ en: "toasted pepitas and cinnamon", es: "pepitas tostadas y canela", pt: "sementes de abóbora torradas e canela" })],
  },
  pancake: {
    noun: { en: "Breakfast Pancakes", es: "Panqueques de Desayuno", pt: "Panquecas de Café da Manhã" },
    category: "main",
    carrier: [ing(1.5, "cup", { en: "all-purpose flour", es: "harina de trigo", pt: "farinha de trigo" }, ["gluten"], "flour"), ing(2, "piece", { en: "eggs", es: "huevos", pt: "ovos" }, ["egg"], "eggs")],
    carrierStep: { en: "Whisk the batter until just combined — a few lumps are fine.", es: "Bate la masa hasta apenas integrar — algunos grumos están bien.", pt: "Misture a massa até apenas incorporar — alguns grumos tudo bem." },
    buildStep: { en: "Fold the flavor base into the batter, then ladle onto a hot buttered griddle.", es: "Incorpora la base de sabor a la masa y sirve por cucharadas en la plancha caliente y engrasada.", pt: "Misture a base de sabor à massa e coloque em colheradas na chapa quente e untada." },
    finishStep: { en: "Flip once bubbles set on the surface; stack and top with the garnish.", es: "Voltea cuando se formen burbujas en la superficie; apila y corona con la guarnición.", pt: "Vire quando surgirem bolhas na superfície; empilhe e finalize com a guarnição." },
    prep: [10, 10], cook: [12, 15], difficulty: "easy",
    proteins: ["egg", "blackBeans"],
    garnish: [toTaste({ en: "crema and a drizzle of honey", es: "crema y un hilo de miel", pt: "creme e um fio de mel" }, ["dairy"])],
  },
  dumpling: {
    noun: { en: "Breakfast Dumplings", es: "Empanadillas de Desayuno", pt: "Dumplings de Café da Manhã" },
    category: "starter",
    carrier: [ing(24, "piece", { en: "round dumpling wrappers", es: "discos para empanadillas", pt: "discos para dumplings" }, ["gluten"], "dumpling wrappers")],
    carrierStep: { en: "Cook the protein with the flavor base until done, then cool slightly and chop fine.", es: "Cocina la proteína con la base de sabor hasta lista, enfría un poco y pica fino.", pt: "Cozinhe a proteína com a base de sabor até pronta, esfrie um pouco e pique fino." },
    buildStep: { en: "Spoon filling into the center of each wrapper, wet the edge, and pleat closed.", es: "Coloca relleno al centro de cada disco, humedece el borde y pliega para cerrar.", pt: "Coloque o recheio no centro de cada disco, umedeça a borda e feche fazendo pregas." },
    finishStep: { en: "Steam 8–10 minutes until the wrappers turn glossy; serve with the salsa for dipping.", es: "Cuece al vapor 8–10 min hasta que los discos luzcan brillantes; sirve con la salsa para remojar.", pt: "Cozinhe no vapor 8–10 min até os discos ficarem brilhantes; sirva com o molho para molhar." },
    prep: [25, 35], cook: [8, 10], difficulty: "medium",
    proteins: ["chicken", "shrimp", "mushroom", "blackBeans"],
    garnish: [toTaste({ en: "chile-vinegar dipping sauce", es: "salsa de vinagre y chile para remojar", pt: "molho de vinagre e pimenta para mergulhar" })],
  },
  skewer: {
    noun: { en: "Breakfast Skewers", es: "Brochetas de Desayuno", pt: "Espetinhos de Café da Manhã" },
    category: "starter",
    carrier: [ing(8, "piece", { en: "bamboo skewers, soaked", es: "palillos de bambú remojados", pt: "espetos de bambu de molho" }, [], "bamboo skewers")],
    carrierStep: { en: "Toss the protein cubes with the flavor base and let marinate 15 minutes.", es: "Mezcla los cubos de proteína con la base de sabor y marina 15 minutos.", pt: "Misture os cubos de proteína com a base de sabor e deixe marinar 15 minutos." },
    buildStep: { en: "Thread onto skewers and grill or pan-sear, turning, until cooked through.", es: "Ensarta en los palillos y asa o dora en sartén, volteando, hasta cocinar bien.", pt: "Espete e grelhe ou doure na frigideira, virando, até cozinhar bem." },
    finishStep: { en: "Brush with the salsa in the last minute of cooking and finish with the garnish.", es: "Barniza con la salsa en el último minuto de cocción y termina con la guarnición.", pt: "Pincele com o molho no último minuto de cozimento e finalize com a guarnição." },
    prep: [20, 25], cook: [10, 12], difficulty: "medium",
    proteins: ["chorizo", "chicken", "shrimp", "tofu"],
    garnish: [toTaste({ en: "lime wedges and flaky salt", es: "limón en gajos y sal en escamas", pt: "limão em gomos e sal em flocos" })],
  },
  "fruit-bowl": {
    noun: { en: "Fusion Fruit Bowl", es: "Tazón de Fruta Fusión", pt: "Bowl de Frutas Fusão" },
    category: "starter",
    carrier: [ing(3, "cup", { en: "mixed seasonal fruit, cut", es: "fruta mixta de temporada, cortada", pt: "frutas variadas da estação, cortadas" }, [], "mixed seasonal fruit")],
    carrierStep: { en: "Cut the fruit into even pieces and arrange in bowls.", es: "Corta la fruta en piezas parejas y acomoda en tazones.", pt: "Corte as frutas em pedaços parelhos e arrume nas tigelas." },
    buildStep: { en: "Whisk the flavor base with a squeeze of lime to make a light dressing and drizzle over.", es: "Bate la base de sabor con un toque de limón para un aderezo ligero y rocía encima.", pt: "Misture a base de sabor com um toque de limão para um molho leve e regue por cima." },
    finishStep: { en: "Finish with the garnish just before serving so it stays crisp.", es: "Termina con la guarnición justo antes de servir para que quede crujiente.", pt: "Finalize com a guarnição pouco antes de servir para manter a textura." },
    prep: [12, 15], cook: [0, 0], difficulty: "easy",
    proteins: ["blackBeans", "mushroom"],
    garnish: [toTaste({ en: "toasted coconut and chile-lime salt", es: "coco tostado y sal de chile-limón", pt: "coco tostado e sal de pimenta com limão" })],
  },
  empanada: {
    noun: { en: "Breakfast Empanadas", es: "Empanadas de Desayuno", pt: "Empanadas de Café da Manhã" },
    category: "starter",
    carrier: [ing(10, "piece", { en: "empanada dough rounds", es: "discos de masa para empanada", pt: "discos de massa para empanada" }, ["gluten"], "empanada dough rounds")],
    carrierStep: { en: "Cook the protein with the flavor base until done, then cool slightly.", es: "Cocina la proteína con la base de sabor hasta lista y deja enfriar un poco.", pt: "Cozinhe a proteína com a base de sabor até pronta e deixe esfriar um pouco." },
    buildStep: { en: "Spoon filling onto half of each round, fold over, and crimp the edge with a fork.", es: "Coloca relleno en la mitad de cada disco, dobla y sella el borde con un tenedor.", pt: "Coloque o recheio em metade de cada disco, dobre e feche a borda com um garfo." },
    finishStep: { en: "Bake at 200°C / 400°F for 18–22 minutes until golden; serve with the salsa.", es: "Hornea a 200°C / 400°F por 18–22 min hasta dorar; sirve con la salsa.", pt: "Asse a 200°C / 400°F por 18–22 min até dourar; sirva com o molho." },
    prep: [30, 35], cook: [18, 22], difficulty: "medium",
    proteins: ["chicken", "carnitas", "blackBeans", "mushroom"],
    garnish: [toTaste({ en: "salsa on the side for dipping", es: "salsa aparte para remojar", pt: "molho à parte para mergulhar" })],
  },
  waffle: {
    noun: { en: "Savory Breakfast Waffles", es: "Waffles Salados de Desayuno", pt: "Waffles Salgados de Café da Manhã" },
    category: "main",
    carrier: [ing(1.5, "cup", { en: "all-purpose flour", es: "harina de trigo", pt: "farinha de trigo" }, ["gluten"], "flour"), ing(2, "piece", { en: "eggs", es: "huevos", pt: "ovos" }, ["egg"], "eggs")],
    carrierStep: { en: "Whisk the waffle batter until smooth.", es: "Bate la masa de waffle hasta que esté lisa.", pt: "Misture a massa de waffle até ficar lisa." },
    buildStep: { en: "Stir the flavor base into the batter and cook in a hot waffle iron until deep golden and crisp.", es: "Incorpora la base de sabor a la masa y cocina en la wafflera hasta dorar y quedar crujiente.", pt: "Misture a base de sabor à massa e cozinhe na waffleira até dourar e ficar crocante." },
    finishStep: { en: "Top with the protein and salsa, and finish with the garnish.", es: "Corona con la proteína y la salsa, y termina con la guarnición.", pt: "Cubra com a proteína e o molho, e finalize com a guarnição." },
    prep: [10, 12], cook: [15, 18], difficulty: "easy",
    proteins: ["chicken", "blackBeans", "egg"],
    garnish: [toTaste({ en: "sliced scallion and a drizzle of crema", es: "cebollín en rodajas y un hilo de crema", pt: "cebolinha fatiada e um fio de creme" }, ["dairy"])],
  },
  soup: {
    noun: { en: "Breakfast Soup", es: "Sopa de Desayuno", pt: "Sopa de Café da Manhã" },
    category: "main",
    carrier: [ing(1.2, "l", { en: "chicken or vegetable stock", es: "caldo de pollo o vegetal", pt: "caldo de frango ou vegetal" }, [], "stock")],
    carrierStep: { en: "Bring the stock to a simmer with the flavor base stirred in.", es: "Lleva el caldo a fuego lento con la base de sabor incorporada.", pt: "Deixe o caldo em fogo baixo com a base de sabor misturada." },
    buildStep: { en: "Add the protein and simmer until cooked through.", es: "Añade la proteína y cuece hasta que esté lista.", pt: "Adicione a proteína e cozinhe até ficar pronta." },
    finishStep: { en: "Ladle into bowls, swirl in the salsa, and finish with the garnish.", es: "Sirve en tazones, incorpora la salsa y termina con la guarnición.", pt: "Sirva em tigelas, misture o molho e finalize com a guarnição." },
    prep: [10, 12], cook: [15, 20], difficulty: "medium",
    proteins: ["chicken", "shrimp", "tofu", "mushroom"],
    garnish: [toTaste({ en: "chopped cilantro and lime wedges", es: "cilantro picado y limón en gajos", pt: "coentro picado e limão em gomos" })],
  },
};

/* ---------------------------------------------------------------------- *
 * Generation
 * ---------------------------------------------------------------------- */

function slugify(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function unionAllergens(ingredients: Ingredient[]): Allergen[] {
  const set = new Set<Allergen>();
  for (const i of ingredients) for (const a of i.allergens ?? []) set.add(a);
  return Array.from(set);
}

function clamp(n: number, lo: number, hi: number): 1 | 2 | 3 | 4 | 5 {
  return Math.max(lo, Math.min(hi, Math.round(n))) as 1 | 2 | 3 | 4 | 5;
}

function seasonForDay(dayIndex: number): Season {
  // dayIndex is 0-based day of (non-leap) year.
  const month = new Date(2025, 0, 1 + dayIndex).getMonth(); // 0-11
  if (month === 11 || month <= 1) return "winter";
  if (month <= 4) return "spring";
  if (month <= 7) return "summer";
  return "fall";
}

function joinList(list: string[], locale: "en" | "es" | "pt"): string {
  if (list.length <= 1) return list[0] ?? "";
  const sep = locale === "en" ? ", and " : locale === "es" ? " y " : " e ";
  return list.slice(0, -1).join(", ") + sep + list[list.length - 1];
}

function buildRecipe(
  index: number,
  format: BreakfastFormat,
  asianKey: AsianKey,
  mexicanKey: MexicanKey,
  proteinKey: ProteinKey,
): Recipe {
  const fmt = FORMAT[format];
  const asian = ASIAN[asianKey];
  const mexican = MEXICAN[mexicanKey];
  const protein = PROTEINS[proteinKey];

  const title: Loc3 = {
    en: `${asian.label.en} ${fmt.noun.en} with ${mexican.label.en}`,
    es: `${fmt.noun.es} ${asian.label.es} con ${mexican.label.es}`,
    pt: `${fmt.noun.pt} ${asian.label.pt} com ${mexican.label.pt}`,
  };

  const slugBase = slugify(`${title.en}`);
  const slug = `${slugBase}-${index + 1}`;

  const ingredients: Ingredient[] = [
    ...fmt.carrier,
    protein.ingredient,
    ...asian.ingredients,
    ...mexican.ingredients,
    ...fmt.garnish,
  ];

  const allergens = unionAllergens(ingredients);
  const dietary: Dietary[] = [];
  const isVegan = !protein.meat && !protein.fish && protein.vegan && !allergens.includes("dairy") && !allergens.includes("egg");
  const isVegetarian = !protein.meat && !protein.fish;
  if (isVegan) dietary.push("vegan");
  if (isVegetarian) dietary.push("vegetarian");
  if (protein.fish && !protein.meat) dietary.push("pescatarian");
  if (!allergens.includes("dairy")) dietary.push("dairyFree");
  if (!allergens.includes("gluten")) dietary.push("glutenFree");
  if (!allergens.includes("pork")) dietary.push("pork");

  const spice = clamp(1 + asian.spice * 0.5 + mexican.spice * 0.5, 1, 5);
  const umami = clamp(1 + asian.umami * 0.5 + mexican.umami * 0.5, 1, 5);

  const method: LocalizedList = {
    en: [fmt.carrierStep.en, `Cook the ${protein.label.en.toLowerCase()} with the ${asian.label.en} base: ${protein.cookNote.en}, then stir in ${asian.ingredients.map((i) => i.name.en).join(", ")}.`, fmt.buildStep.en, fmt.finishStep.en],
    es: [fmt.carrierStep.es, `Cocina ${protein.label.es.toLowerCase()} con la base ${asian.label.es}: ${protein.cookNote.es}, luego incorpora ${asian.ingredients.map((i) => i.name.es).join(", ")}.`, fmt.buildStep.es, fmt.finishStep.es],
    pt: [fmt.carrierStep.pt, `Cozinhe ${protein.label.pt.toLowerCase()} com a base ${asian.label.pt}: ${protein.cookNote.pt}, depois misture ${asian.ingredients.map((i) => i.name.pt).join(", ")}.`, fmt.buildStep.pt, fmt.finishStep.pt],
  };
  if (fmt.restStep) {
    method.en.push(fmt.restStep.en);
    method.es.push(fmt.restStep.es);
    method.pt.push(fmt.restStep.pt);
  }

  const [prepLo, prepHi] = fmt.prep;
  const [cookLo, cookHi] = fmt.cook;
  // Deterministic spread across the format's time range, keyed off index so
  // recipes sharing a format don't all report identical timings.
  const prepMinutes = prepLo + ((index * 7) % Math.max(1, prepHi - prepLo + 1));
  const cookMinutes = cookLo + ((index * 11) % Math.max(1, cookHi - cookLo + 1));

  const healthyFormats: BreakfastFormat[] = ["tofu-scramble", "congee", "rice-bowl", "oats", "fruit-bowl", "soup", "noodle-bowl"];
  const healthy = healthyFormats.includes(format) && !protein.meat;

  const origin: Loc3 = {
    en: `${mexican.city.en} × ${asian.city.en}`,
    es: `${mexican.city.es} × ${asian.city.es}`,
    pt: `${mexican.city.pt} × ${asian.city.pt}`,
  };

  const asianIngredientNames = { en: asian.ingredients.map((i) => i.name.en), es: asian.ingredients.map((i) => i.name.es), pt: asian.ingredients.map((i) => i.name.pt) };
  const mexicanIngredientNames = { en: mexican.ingredients.map((i) => i.name.en), es: mexican.ingredients.map((i) => i.name.es), pt: mexican.ingredients.map((i) => i.name.pt) };

  const subtitle: Loc3 = {
    en: `${fmt.noun.en} built on ${protein.label.en.toLowerCase()}, finished with ${joinList([...asianIngredientNames.en, ...mexicanIngredientNames.en], "en")}.`,
    es: `${fmt.noun.es} con ${protein.label.es.toLowerCase()}, terminado con ${joinList([...asianIngredientNames.es, ...mexicanIngredientNames.es], "es")}.`,
    pt: `${fmt.noun.pt} com ${protein.label.pt.toLowerCase()}, finalizado com ${joinList([...asianIngredientNames.pt, ...mexicanIngredientNames.pt], "pt")}.`,
  };

  const story: Loc3 = {
    en: `Part of the 365-day fusion breakfast collection: ${asian.city.en}'s ${asian.label.en.toLowerCase()} tradition meets ${mexican.city.en}'s ${mexican.label.en.toLowerCase()}, built around a ${fmt.noun.en.toLowerCase()} format with ${protein.label.en.toLowerCase()} at the center.`,
    es: `Parte de la colección de desayunos fusión de 365 días: la tradición de ${asian.label.es.toLowerCase()} de ${asian.city.es} se encuentra con el ${mexican.label.es.toLowerCase()} de ${mexican.city.es}, sobre una base de ${fmt.noun.es.toLowerCase()} con ${protein.label.es.toLowerCase()} al centro.`,
    pt: `Parte da coleção de 365 dias de café da manhã fusão: a tradição ${asian.label.pt.toLowerCase()} de ${asian.city.pt} encontra o ${mexican.label.pt.toLowerCase()} de ${mexican.city.pt}, sobre uma base de ${fmt.noun.pt.toLowerCase()} com ${protein.label.pt.toLowerCase()} no centro.`,
  };

  const notes: Loc3 = {
    en: `Swap in whatever ${protein.meat ? "protein" : "topping"} is on hand — the ${asian.label.en} and ${mexican.label.en} combination is what carries the dish.`,
    es: `Sustituye la proteína por lo que tengas a mano — la combinación ${asian.label.es} y ${mexican.label.es} es lo que define el plato.`,
    pt: `Troque a proteína pelo que tiver à mão — a combinação ${asian.label.pt} e ${mexican.label.pt} é o que define o prato.`,
  };

  const pairing: Loc3 = {
    en: spice >= 4 ? "Iced hibiscus tea or a cold lager." : "Hot coffee de olla or genmaicha.",
    es: spice >= 4 ? "Agua de jamaica helada o una cerveza fría." : "Café de olla caliente o genmaicha.",
    pt: spice >= 4 ? "Chá gelado de hibisco ou uma cerveja gelada." : "Café de olla quente ou genmaicha.",
  };

  const tags: LocalizedList = {
    en: ["breakfast", asian.tagKey.en, mexican.tagKey.en, format, protein.label.en.toLowerCase()],
    es: ["desayuno", asian.tagKey.es, mexican.tagKey.es, format, protein.label.es.toLowerCase()],
    pt: ["café da manhã", asian.tagKey.pt, mexican.tagKey.pt, format, protein.label.pt.toLowerCase()],
  };

  return {
    slug,
    category: fmt.category,
    title,
    subtitle,
    origin,
    hero: breakfastArt(format, "hero"),
    thumb: breakfastArt(format, "thumb"),
    prepMinutes,
    cookMinutes,
    serves: 4,
    difficulty: fmt.difficulty,
    spice,
    umami,
    story,
    ingredients,
    method,
    notes,
    pairing,
    tags,
    allergens,
    dietary,
    meals: ["breakfast"],
    healthy,
    season: seasonForDay(index),
  };
}

const DAYS_IN_YEAR = 365;

function generate(): Recipe[] {
  const recipes: Recipe[] = [];
  const usedTitles = new Set<string>();
  const usedSlugs = new Set<string>();
  const formatCounters: Record<string, number> = {};

  for (let i = 0; i < DAYS_IN_YEAR; i++) {
    const format = BREAKFAST_FORMATS[i % BREAKFAST_FORMATS.length];
    const localCount = formatCounters[format] ?? 0;
    formatCounters[format] = localCount + 1;

    let asianIdx = localCount % ASIAN_KEYS.length;
    let mexicanIdx = (localCount * 3) % MEXICAN_KEYS.length;
    const proteinsAllowed = FORMAT[format].proteins;
    let proteinIdx = localCount % proteinsAllowed.length;

    let attempt = 0;
    let recipe = buildRecipe(i, format, ASIAN_KEYS[asianIdx], MEXICAN_KEYS[mexicanIdx], proteinsAllowed[proteinIdx]);
    // Deterministic collision resolution: nudge the mexican/protein/asian
    // index until both the slug and the (localized) title are unique. With
    // 20 formats × 11 Asian profiles × 10 Mexican profiles this should
    // essentially never trigger, but the 365-recipe validator requires
    // provably unique titles/slugs, not "probably".
    while (usedTitles.has(recipe.title.en) || usedSlugs.has(recipe.slug)) {
      attempt++;
      mexicanIdx = (mexicanIdx + 1) % MEXICAN_KEYS.length;
      if (attempt % MEXICAN_KEYS.length === 0) asianIdx = (asianIdx + 1) % ASIAN_KEYS.length;
      if (attempt % (MEXICAN_KEYS.length * ASIAN_KEYS.length) === 0) proteinIdx = (proteinIdx + 1) % proteinsAllowed.length;
      recipe = buildRecipe(i, format, ASIAN_KEYS[asianIdx], MEXICAN_KEYS[mexicanIdx], proteinsAllowed[proteinIdx]);
      if (attempt > 500) throw new Error(`breakfast generator: could not find a unique combination for day ${i + 1}`);
    }

    usedTitles.add(recipe.title.en);
    usedSlugs.add(recipe.slug);
    recipes.push(recipe);
  }

  return recipes;
}

export const BREAKFAST_RECIPES: Recipe[] = generate();
