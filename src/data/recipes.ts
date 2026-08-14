import type { Locale } from "@/i18n";

export type Difficulty = "easy" | "medium" | "hard";
export type Category = "starter" | "main" | "dessert";

export type Allergen =
  | "nuts"
  | "shellfish"
  | "fish"
  | "dairy"
  | "egg"
  | "gluten"
  | "soy"
  | "sesame"
  | "pork"
  | "alcohol";

export type Dietary =
  | "vegetarian"
  | "vegan"
  | "glutenFree"
  | "dairyFree"
  | "pescatarian"
  | "pork";

export type Meal = "breakfast" | "lunch" | "dinner";
export type Season = "winter" | "spring" | "summer" | "fall";

export type Unit =
  | "g" | "kg" | "ml" | "l"
  | "tsp" | "tbsp" | "cup"
  | "piece" | "pinch";

export type LocalizedString = Record<Locale, string>;
export type LocalizedList = Record<Locale, string[]>;

export type Ingredient = {
  /** Numeric amount for scaling. Omit for "to taste" / "for garnish". */
  amount?: number;
  unit?: Unit;
  /** Localized fallback for non-scalable quantities. */
  qty?: LocalizedString;
  name: LocalizedString;
  allergens?: Allergen[];
  /** Optional shopping query override (defaults to English name). */
  shopQuery?: string;
};

export type Recipe = {
  slug: string;
  category: Category;
  title: LocalizedString;
  subtitle: LocalizedString;
  origin: LocalizedString;
  hero: string;
  thumb: string;
  prepMinutes: number;
  cookMinutes: number;
  /** Base serving size that the listed ingredient amounts produce. */
  serves: number;
  difficulty: Difficulty;
  spice: 1 | 2 | 3 | 4 | 5;
  umami: 1 | 2 | 3 | 4 | 5;
  story: LocalizedString;
  ingredients: Ingredient[];
  method: LocalizedList;
  notes: LocalizedString;
  pairing: LocalizedString;
  tags: LocalizedList;
  allergens: Allergen[];
  dietary: Dietary[];
  /** One or more meal slots a dish fits — breakfast / lunch / dinner. */
  meals: Meal[];
  /** True if this dish is in the curated Super-Healthy menu. */
  healthy: boolean;
  /** Season the dish leans into (used for seasonal rotation). */
  season: Season;
};

/**
 * Recipe photography is art-directed ahead of time and vendored into
 * public/img/. The checked-in images are deterministic, service-worker
 * cacheable, and available offline. Run `npm run validate:images` after any
 * photography change.
 */
const IMG_BASE = `${import.meta.env.BASE_URL}img`;

/**
 * Resolves a signature dish's vendored photograph.
 *
 * `hero` is the 1600x1000 full-bleed variant used on detail pages and the home
 * feature slot; `thumb` is the lighter 800x600 crop used by card grids, where
 * a page can mount two dozen images at once.
 */
export function recipeHero(slug: string, variant: "hero" | "thumb" = "hero"): string {
  return `${IMG_BASE}/recipes/${slug}-${variant}.jpg`;
}

export const recipes: Recipe[] = [
  {
    slug: "miso-mole-short-rib-tacos",
    category: "main",
    title: { en: "Miso-Mole Short Rib Tacos", es: "Tacos de Costilla con Mole-Miso", pt: "Tacos de Costela com Mole-Missô" },
    subtitle: {
      en: "12-hour braise. White corn tortillas. Yuzu-pickled red onion.",
      es: "Braseado de 12 horas. Tortillas de maíz blanco. Cebolla morada en yuzu.",
      pt: "Cocção lenta de 12h. Tortilhas de milho branco. Cebola roxa ao yuzu.",
    },
    origin: { en: "Oaxaca × Kyoto", es: "Oaxaca × Kioto", pt: "Oaxaca × Quioto" },
    hero: recipeHero("miso-mole-short-rib-tacos"),
    thumb: recipeHero("miso-mole-short-rib-tacos", "thumb"),
    prepMinutes: 30,
    cookMinutes: 720,
    serves: 4,
    difficulty: "hard",
    spice: 3,
    umami: 5,
    story: {
      en: "Mole negro and red miso both depend on slow alchemy — toasted chiles, charred fruit, fermented soy. Married into one paste, they coat short rib in a glaze so dark it looks lacquered.",
      es: "El mole negro y el miso rojo dependen de una alquimia lenta — chiles tostados, fruta carbonizada, soja fermentada. Casados en una sola pasta, cubren la costilla con un esmalte tan oscuro que parece laca.",
      pt: "Mole negro e missô vermelho dependem de uma alquimia lenta — pimentas tostadas, frutas carbonizadas, soja fermentada. Unidos numa pasta só, cobrem a costela com um esmalte tão escuro que parece laca.",
    },
    ingredients: [
      { amount: 1.5, unit: "kg", name: { en: "beef short rib, bone-in", es: "costilla de res con hueso", pt: "costela bovina com osso" } },
      { amount: 4, unit: "tbsp", name: { en: "red miso paste", es: "pasta de miso rojo", pt: "pasta de missô vermelho" }, allergens: ["soy"], shopQuery: "red miso paste" },
      { amount: 3, unit: "tbsp", name: { en: "prepared mole negro", es: "mole negro preparado", pt: "mole negro preparado" }, shopQuery: "mole negro paste" },
      { amount: 2, unit: "piece", name: { en: "dried guajillo chiles", es: "chiles guajillo secos", pt: "pimentas guajillo secas" }, shopQuery: "dried guajillo chiles" },
      { amount: 1, unit: "piece", name: { en: "piece kombu (10 cm)", es: "tira de kombu (10 cm)", pt: "tira de kombu (10 cm)" }, shopQuery: "kombu dried kelp" },
      { amount: 500, unit: "ml", name: { en: "dark beef stock", es: "caldo oscuro de res", pt: "caldo escuro de carne" } },
      { amount: 2, unit: "tbsp", name: { en: "agave nectar", es: "néctar de agave", pt: "néctar de agave" } },
      { amount: 12, unit: "piece", name: { en: "small white corn tortillas", es: "tortillas pequeñas de maíz blanco", pt: "tortilhas pequenas de milho branco" }, shopQuery: "white corn tortillas" },
      { amount: 1, unit: "piece", name: { en: "red onion, thinly sliced", es: "cebolla morada en juliana fina", pt: "cebola roxa em fatias finas" } },
      { amount: 3, unit: "tbsp", name: { en: "yuzu juice", es: "jugo de yuzu", pt: "suco de yuzu" }, shopQuery: "yuzu juice bottle" },
      { qty: { en: "to taste", es: "al gusto", pt: "a gosto" }, name: { en: "cilantro, sesame seeds, flaky salt", es: "cilantro, ajonjolí, sal en escamas", pt: "coentro, gergelim, sal em flocos" }, allergens: ["sesame"] },
    ],
    method: {
      en: [
        "Toast guajillos in a dry pan 20 sec per side; soak in hot water 10 min, blend with kombu soaking liquid.",
        "Sear short ribs hard on all sides in a heavy pot. Remove. Pour off all but 1 tbsp fat.",
        "Whisk miso, mole, agave and chile purée into the pot. Return ribs, add stock and kombu.",
        "Cover and braise at 130°C / 270°F for 8–12 hours, until meat shears with a spoon.",
        "Quick-pickle red onion in yuzu juice + a pinch of salt for 30 min.",
        "Warm tortillas on a comal. Shred meat, glaze with reduced braising liquid.",
        "Build tacos: tortilla, meat, onion, cilantro, sesame, flaky salt. A drop more agave on top.",
      ],
      es: [
        "Tuesta los guajillos en sartén seco 20 seg por lado; remoja en agua caliente 10 min, licúa con el agua del kombu.",
        "Sella las costillas a fuego fuerte por todos lados en olla pesada. Retira. Deja sólo 1 cda de grasa.",
        "Integra miso, mole, agave y el puré de chile en la olla. Devuelve las costillas, añade caldo y kombu.",
        "Tapa y brasea a 130°C / 270°F durante 8–12 horas, hasta que la carne se deshebre con cuchara.",
        "Encurte la cebolla morada en jugo de yuzu + pizca de sal por 30 min.",
        "Calienta las tortillas en comal. Deshebra la carne y esmalta con el jugo de cocción reducido.",
        "Arma los tacos: tortilla, carne, cebolla, cilantro, ajonjolí, sal. Una gota más de agave encima.",
      ],
      pt: [
        "Toste os guajillos em frigideira seca 20 seg de cada lado; deixe de molho em água quente 10 min e bata com a água do kombu.",
        "Sele as costelas em fogo alto por todos os lados em panela pesada. Retire. Mantenha apenas 1 cs de gordura.",
        "Misture missô, mole, agave e o purê de pimenta na panela. Volte as costelas, adicione o caldo e o kombu.",
        "Tampe e cozinhe a 130°C / 270°F por 8–12 horas, até a carne se desfiar com colher.",
        "Faça pickle rápido da cebola roxa no suco de yuzu + pitada de sal por 30 min.",
        "Aqueça as tortilhas no comal. Desfie a carne e regue com o líquido reduzido da cocção.",
        "Monte os tacos: tortilha, carne, cebola, coentro, gergelim, sal. Uma gota a mais de agave por cima.",
      ],
    },
    notes: {
      en: "Make ahead. The meat improves overnight in its sauce. Save the rendered fat for re-frying tortillas — once you try it, no other taco compares.",
      es: "Prepara con antelación. La carne mejora durante la noche en su salsa. Guarda la grasa para freír tortillas — una vez que pruebes, ya no hay vuelta atrás.",
      pt: "Faça com antecedência. A carne fica melhor de um dia para o outro no próprio molho. Guarde a gordura para refritar as tortilhas — depois disso, nenhum outro taco compara.",
    },
    pairing: { en: "Mezcal Negroni or a chilled junmai sake.", es: "Negroni de mezcal o un sake junmai bien frío.", pt: "Negroni de mezcal ou um sake junmai bem gelado." },
    tags: {
      en: ["braise", "umami", "fusion-classic", "make-ahead"],
      es: ["braseado", "umami", "fusión-clásica", "anticipado"],
      pt: ["cocção lenta", "umami", "fusão-clássica", "antecipado"],
    },
    allergens: ["soy", "sesame"],
    dietary: ["dairyFree"],
  meals: ["dinner"],
  healthy: false,
  season: "winter",
  },
  {
    slug: "kimchi-elote",
    category: "starter",
    title: { en: "Kimchi Elote", es: "Elote con Kimchi", pt: "Elote com Kimchi" },
    subtitle: {
      en: "Charred sweet corn, kimchi crema, queso fresco, gochugaru.",
      es: "Elote carbonizado, crema de kimchi, queso fresco, gochugaru.",
      pt: "Milho carbonizado, creme de kimchi, queijo fresco, gochugaru.",
    },
    origin: { en: "Mexico City × Seoul", es: "Ciudad de México × Seúl", pt: "Cidade do México × Seul" },
    hero: recipeHero("kimchi-elote"),
    thumb: recipeHero("kimchi-elote", "thumb"),
    prepMinutes: 10,
    cookMinutes: 12,
    serves: 4,
    difficulty: "easy",
    spice: 3,
    umami: 4,
    story: {
      en: "Street elote already carries umami in its DNA — cotija, mayo, lime. Add fermented cabbage and the corn starts singing in two languages at once.",
      es: "El elote callejero ya lleva umami en su ADN — cotija, mayonesa, lima. Suma col fermentada y el maíz canta en dos idiomas a la vez.",
      pt: "O elote de rua já carrega umami no DNA — cotija, maionese, lima. Adicione repolho fermentado e o milho passa a cantar em duas línguas ao mesmo tempo.",
    },
    ingredients: [
      { amount: 4, unit: "piece", name: { en: "ears sweet corn, husks on", es: "elotes con hojas", pt: "espigas de milho com palha" } },
      { amount: 80, unit: "g", name: { en: "napa kimchi, finely chopped", es: "kimchi de col napa, picado fino", pt: "kimchi de acelga, picado fino" }, allergens: ["soy"], shopQuery: "napa cabbage kimchi" },
      { amount: 4, unit: "tbsp", name: { en: "Mexican crema or sour cream", es: "crema mexicana o ácida", pt: "crema mexicana ou creme azedo" }, allergens: ["dairy"] },
      { amount: 2, unit: "tbsp", name: { en: "Kewpie or quality mayo", es: "mayonesa Kewpie o de calidad", pt: "maionese Kewpie ou de qualidade" }, allergens: ["egg"], shopQuery: "Kewpie mayonnaise" },
      { amount: 1, unit: "tsp", name: { en: "gochugaru", es: "gochugaru", pt: "gochugaru" }, shopQuery: "gochugaru Korean chile flakes" },
      { amount: 50, unit: "g", name: { en: "queso fresco, crumbled", es: "queso fresco desmoronado", pt: "queijo fresco esfarelado" }, allergens: ["dairy"] },
      { amount: 1, unit: "piece", name: { en: "lime, in wedges", es: "lima en gajos", pt: "lima em gomos" } },
      { qty: { en: "to garnish", es: "para decorar", pt: "para finalizar" }, name: { en: "cilantro, toasted sesame, nori shreds", es: "cilantro, ajonjolí tostado, hebras de nori", pt: "coentro, gergelim tostado, fios de nori" }, allergens: ["sesame"] },
    ],
    method: {
      en: [
        "Soak corn in cold water 10 min. Grill over high heat 8–10 min, turning, until husks char and kernels mark.",
        "Whisk crema, mayo, chopped kimchi and 2 tsp of its juice. Taste — tangy, salty, faintly funky.",
        "Peel husks back as handles. Brush each cob generously with kimchi crema.",
        "Crust with queso fresco, dust with gochugaru. Top with cilantro, sesame, a wisp of nori.",
        "Serve immediately with lime wedges.",
      ],
      es: [
        "Remoja los elotes en agua fría 10 min. Asa a fuego alto 8–10 min, girando, hasta que las hojas se carbonicen y los granos se marquen.",
        "Mezcla crema, mayonesa, kimchi picado y 2 cditas de su jugo. Prueba — ácido, salado, levemente funky.",
        "Pela las hojas hacia atrás para usarlas como mango. Pinta cada elote con generosidad.",
        "Cubre con queso fresco, espolvorea gochugaru. Remata con cilantro, ajonjolí, una pizca de nori.",
        "Sirve de inmediato con gajos de lima.",
      ],
      pt: [
        "Deixe as espigas de molho em água fria 10 min. Grelhe em fogo alto 8–10 min, virando, até a palha tostar e os grãos marcarem.",
        "Misture crema, maionese, kimchi picado e 2 cc do seu líquido. Prove — ácido, salgado, levemente funky.",
        "Puxe as palhas para trás como cabo. Pincele cada espiga generosamente.",
        "Cubra com queijo fresco, polvilhe gochugaru. Finalize com coentro, gergelim e fios de nori.",
        "Sirva imediatamente com gomos de lima.",
      ],
    },
    notes: {
      en: "No grill? Char the corn over a gas burner with tongs. Embrace the smoke alarm.",
      es: "¿Sin parrilla? Carboniza los elotes directo sobre la flama con pinzas. Acepta la alarma de humo.",
      pt: "Sem grelha? Toste o milho direto na boca do fogão com pegador. Aceite o alarme de fumaça.",
    },
    pairing: { en: "A crisp Mexican lager with shoyu-lime rim, or a dry Riesling.", es: "Cerveza mexicana clara con escarchado de shoyu-lima, o un Riesling seco.", pt: "Lager mexicana com borda de shoyu-lima, ou um Riesling seco." },
    tags: { en: ["grill", "summer", "crowd-pleaser", "vegetarian"], es: ["parrilla", "verano", "complaciente", "vegetariana"], pt: ["grelha", "verão", "agrada-geral", "vegetariana"] },
    allergens: ["dairy", "egg", "sesame", "soy"],
    dietary: ["vegetarian"],
  meals: ["lunch", "dinner"],
  healthy: true,
  season: "summer",
  },
  {
    slug: "yuzu-aguachile-hamachi",
    category: "starter",
    title: { en: "Yuzu Aguachile, Hamachi", es: "Aguachile de Yuzu con Hamachi", pt: "Aguachile de Yuzu com Hamachi" },
    subtitle: {
      en: "Diamond-cut hamachi, serrano-yuzu broth, cucumber, shiso.",
      es: "Hamachi en cortes de diamante, caldo de serrano-yuzu, pepino, shiso.",
      pt: "Hamachi em cortes diamante, caldo de serrano-yuzu, pepino, shiso.",
    },
    origin: { en: "Sinaloa × Hokkaido", es: "Sinaloa × Hokkaido", pt: "Sinaloa × Hokkaido" },
    hero: recipeHero("yuzu-aguachile-hamachi"),
    thumb: recipeHero("yuzu-aguachile-hamachi", "thumb"),
    prepMinutes: 25,
    cookMinutes: 0,
    serves: 2,
    difficulty: "medium",
    spice: 4,
    umami: 4,
    story: {
      en: "Sinaloa's aguachile is sashimi's mestizo cousin: raw, electric, defined by acid. Swap lime for yuzu and the dish gains a floral hum without losing its slap.",
      es: "El aguachile sinaloense es el primo mestizo del sashimi: crudo, eléctrico, definido por la acidez. Cambia la lima por yuzu y el plato gana un zumbido floral sin perder el golpe.",
      pt: "O aguachile sinaloense é o primo mestizo do sashimi: cru, elétrico, definido pela acidez. Troque a lima por yuzu e o prato ganha um zumbido floral sem perder o impacto.",
    },
    ingredients: [
      { amount: 200, unit: "g", name: { en: "sashimi-grade hamachi", es: "hamachi grado sashimi", pt: "hamachi qualidade sashimi" }, allergens: ["fish"], shopQuery: "sashimi grade yellowtail hamachi" },
      { amount: 4, unit: "tbsp", name: { en: "yuzu juice", es: "jugo de yuzu", pt: "suco de yuzu" }, shopQuery: "yuzu juice" },
      { amount: 2, unit: "tbsp", name: { en: "lime juice", es: "jugo de lima", pt: "suco de lima" } },
      { amount: 1, unit: "piece", name: { en: "serrano chile", es: "chile serrano", pt: "pimenta serrano" } },
      { amount: 1, unit: "tsp", name: { en: "light soy or shoyu", es: "soja ligera o shoyu", pt: "shoyu leve" }, allergens: ["soy", "gluten"] },
      { amount: 0.5, unit: "piece", name: { en: "Persian cucumber, thinly sliced", es: "pepino persa en rodajas finas", pt: "pepino japonês em fatias finas" } },
      { amount: 1, unit: "tbsp", name: { en: "extra-virgin olive oil", es: "aceite de oliva extra virgen", pt: "azeite extravirgem" } },
      { qty: { en: "to finish", es: "para terminar", pt: "para finalizar" }, name: { en: "shiso leaves, sea salt, micro cilantro, sesame", es: "hojas de shiso, sal de mar, micro cilantro, ajonjolí", pt: "folhas de shiso, sal marinho, micro coentro, gergelim" }, allergens: ["sesame"] },
    ],
    method: {
      en: [
        "Slice hamachi against the grain into 5 mm sashimi pieces. Refrigerate on a chilled plate.",
        "Blend yuzu, lime, serrano (deseeded for less heat), soy, and olive oil until smooth. Pass through a fine sieve.",
        "Salt the fish lightly 2 minutes before serving.",
        "Pool sauce on a chilled shallow bowl. Lay fish, then overlap cucumber petals.",
        "Crown with shiso, micro cilantro, sesame, a final flake of sea salt.",
      ],
      es: [
        "Corta el hamachi contra la fibra en piezas de sashimi de 5 mm. Refrigera en un plato frío.",
        "Licúa yuzu, lima, serrano (sin semillas para menos picante), soja y aceite hasta homogéneo. Pasa por colador fino.",
        "Sazona el pescado con sal 2 minutos antes de servir.",
        "Forma un espejo de salsa en un plato hondo y frío. Acomoda el pescado y superpón pétalos de pepino.",
        "Corona con shiso, micro cilantro, ajonjolí y una escama final de sal de mar.",
      ],
      pt: [
        "Fatie o hamachi contra a fibra em peças de sashimi de 5 mm. Refrigere num prato gelado.",
        "Bata yuzu, lima, serrano (sem sementes para menos picância), shoyu e azeite até homogêneo. Passe na peneira fina.",
        "Salgue o peixe levemente 2 minutos antes de servir.",
        "Faça um espelho do molho num prato fundo gelado. Disponha o peixe e sobreponha pétalas de pepino.",
        "Coroe com shiso, micro coentro, gergelim e um floco final de sal marinho.",
      ],
    },
    notes: { en: "Buy the best fish your city sells, and only what you'll eat that day. The dish has nowhere to hide.", es: "Compra el mejor pescado disponible y sólo lo que comerás hoy. El plato no tiene dónde esconderse.", pt: "Compre o melhor peixe disponível e só o que vai consumir no dia. O prato não tem onde se esconder." },
    pairing: { en: "Bone-dry sparkling sake or a clear blanco tequila.", es: "Sake espumoso seco o tequila blanco cristalino.", pt: "Sake espumante bem seco ou tequila blanco cristalina." },
    tags: { en: ["raw", "fresh", "dinner-party", "fast"], es: ["crudo", "fresco", "cena", "rápido"], pt: ["cru", "fresco", "jantar", "rápido"] },
    allergens: ["fish", "soy", "gluten", "sesame"],
    dietary: ["pescatarian", "dairyFree"],
  meals: ["lunch", "dinner"],
  healthy: true,
  season: "summer",
  },
  {
    slug: "al-pastor-bao",
    category: "main",
    title: { en: "Al Pastor Bao", es: "Bao al Pastor", pt: "Bao al Pastor" },
    subtitle: {
      en: "Trompo-spiced pork, milk bao, charred pineapple, cilantro.",
      es: "Cerdo especiado al trompo, bao de leche, piña carbonizada, cilantro.",
      pt: "Porco com tempero de trompo, bao de leite, abacaxi tostado, coentro.",
    },
    origin: { en: "CDMX × Taipei", es: "CDMX × Taipéi", pt: "CDMX × Taipé" },
    hero: recipeHero("al-pastor-bao"),
    thumb: recipeHero("al-pastor-bao", "thumb"),
    prepMinutes: 40,
    cookMinutes: 30,
    serves: 6,
    difficulty: "medium",
    spice: 3,
    umami: 3,
    story: {
      en: "Two diaspora dishes, both built around marinated pork wrapped in soft dough. The al pastor marinade — chile, achiote, pineapple — was itself a Lebanese-Mexican fusion. We're just adding another chapter.",
      es: "Dos platos de la diáspora, ambos construidos sobre cerdo marinado envuelto en masa suave. La marinada al pastor — chile, achiote, piña — ya era fusión libanesa-mexicana. Sólo añadimos un capítulo más.",
      pt: "Dois pratos da diáspora, ambos construídos em torno de porco marinado envolto em massa macia. A marinada al pastor — pimenta, achiote, abacaxi — já era uma fusão libanesa-mexicana. Estamos só somando mais um capítulo.",
    },
    ingredients: [
      { amount: 700, unit: "g", name: { en: "pork shoulder, thinly sliced", es: "lomo de cerdo en filetes finos", pt: "paleta suína em fatias finas" }, allergens: ["pork"] },
      { amount: 3, unit: "piece", name: { en: "guajillo + 2 ancho chiles", es: "guajillo + 2 anchos", pt: "guajillo + 2 anchos" }, shopQuery: "dried guajillo ancho chiles" },
      { amount: 1, unit: "tbsp", name: { en: "achiote paste", es: "pasta de achiote", pt: "pasta de achiote" }, shopQuery: "achiote paste" },
      { amount: 2, unit: "tbsp", name: { en: "white vinegar", es: "vinagre blanco", pt: "vinagre branco" } },
      { amount: 200, unit: "g", name: { en: "fresh pineapple", es: "piña fresca", pt: "abacaxi fresco" } },
      { amount: 1, unit: "tsp", name: { en: "five-spice powder", es: "polvo cinco especias", pt: "pó de cinco especiarias" } },
      { amount: 1, unit: "tbsp", name: { en: "soy sauce", es: "salsa de soja", pt: "molho shoyu" }, allergens: ["soy", "gluten"] },
      { amount: 12, unit: "piece", name: { en: "steamed milk bao buns", es: "panes bao al vapor", pt: "pães bao no vapor" }, allergens: ["gluten", "dairy"], shopQuery: "frozen bao buns" },
      { qty: { en: "to finish", es: "para terminar", pt: "para finalizar" }, name: { en: "white onion, cilantro, lime, salsa macha", es: "cebolla blanca, cilantro, lima, salsa macha", pt: "cebola branca, coentro, lima, salsa macha" } },
    ],
    method: {
      en: [
        "Soak chiles in hot water 15 min. Blend with achiote, vinegar, pineapple purée, five-spice and soy until smooth.",
        "Marinate sliced pork in the paste 6 hours, ideally overnight.",
        "Sear pork hard on a screaming hot pan or plancha in batches. Don't crowd — you want lacquered edges.",
        "In the same pan, char the diced pineapple 1 min. Toss with the pork.",
        "Steam bao 7 min. Open, brush with the pan juices.",
        "Fill bao with pork, pineapple, onion, cilantro. Drizzle salsa macha. Squeeze lime.",
      ],
      es: [
        "Remoja los chiles en agua caliente 15 min. Licúa con achiote, vinagre, puré de piña, cinco especias y soja hasta homogéneo.",
        "Marina el cerdo en la pasta 6 horas, idealmente toda la noche.",
        "Sella el cerdo en sartén o plancha bien caliente por tandas. No saturar — queremos bordes laqueados.",
        "En la misma sartén carboniza los cubos de piña 1 min. Revuelve con el cerdo.",
        "Cuece los bao al vapor 7 min. Ábrelos y pincela con los jugos del sartén.",
        "Rellena: cerdo, piña, cebolla, cilantro. Hilo de salsa macha. Apretón de lima.",
      ],
      pt: [
        "Hidrate as pimentas em água quente 15 min. Bata com achiote, vinagre, purê de abacaxi, cinco especiarias e shoyu até homogêneo.",
        "Marine o porco na pasta por 6 horas, idealmente de um dia para o outro.",
        "Sele o porco em frigideira ou chapa bem quente em pequenas porções. Não amontoe — queremos bordas laqueadas.",
        "Na mesma frigideira, toste os cubos de abacaxi 1 min. Misture com o porco.",
        "Cozinhe os baos no vapor 7 min. Abra e pincele com os sucos da panela.",
        "Recheie: porco, abacaxi, cebola, coentro. Fio de salsa macha. Aperto de lima.",
      ],
    },
    notes: { en: "Score pork slices lightly so the marinade penetrates. Store leftover paste in oil — brilliant fish marinade.", es: "Marca los filetes para que la marinada entre. Guarda la pasta sobrante en aceite — excelente para pescado.", pt: "Faça cortes leves no porco para a marinada penetrar. Guarde a pasta que sobrar em azeite — ótima para peixe." },
    pairing: { en: "Pineapple tepache or a smoky highball with mezcal and umeshu.", es: "Tepache de piña o highball ahumado de mezcal y umeshu.", pt: "Tepache de abacaxi ou highball defumado de mezcal e umeshu." },
    tags: { en: ["pork", "party", "make-ahead", "iconic"], es: ["cerdo", "fiesta", "anticipado", "icónica"], pt: ["porco", "festa", "antecipado", "icônica"] },
    allergens: ["pork", "soy", "gluten", "dairy"],
    dietary: [],
  meals: ["lunch", "dinner"],
  healthy: false,
  season: "fall",
  },
  {
    slug: "ramen-pozole-rojo",
    category: "main",
    title: { en: "Ramen-Pozole Rojo", es: "Pozole Rojo Ramen", pt: "Pozole Vermelho Ramen" },
    subtitle: { en: "Tonkotsu base, guajillo-arbol oil, hominy, soft egg.", es: "Base tonkotsu, aceite guajillo-árbol, maíz pozolero, huevo blando.", pt: "Base tonkotsu, óleo guajillo-árbol, milho pozole, ovo mole." },
    origin: { en: "Jalisco × Fukuoka", es: "Jalisco × Fukuoka", pt: "Jalisco × Fukuoka" },
    hero: recipeHero("ramen-pozole-rojo"),
    thumb: recipeHero("ramen-pozole-rojo", "thumb"),
    prepMinutes: 20,
    cookMinutes: 90,
    serves: 4,
    difficulty: "medium",
    spice: 4,
    umami: 5,
    story: {
      en: "Pozole and tonkotsu ramen both demand a long bone broth — collagen, salt, depth. We split the difference: pork bones cooked Japanese-cloudy, then bombed with a Mexican chile oil that turns the surface ruby.",
      es: "Tanto el pozole como el tonkotsu exigen un caldo largo de huesos. Dividimos la diferencia: huesos de cerdo nublados a la japonesa, luego bombardeados con aceite mexicano de chile que vuelve la superficie rubí.",
      pt: "Tanto o pozole quanto o tonkotsu exigem um caldo longo de ossos. Dividimos a diferença: ossos suínos turvos ao estilo japonês, depois bombardeados com um óleo mexicano de pimenta que deixa a superfície rubi.",
    },
    ingredients: [
      { amount: 1.5, unit: "kg", name: { en: "pork neck bones + trotters", es: "huesos de cuello y patitas de cerdo", pt: "ossos de pescoço e mocotó suíno" }, allergens: ["pork"] },
      { amount: 1, unit: "piece", name: { en: "onion, garlic head halved", es: "cebolla, cabeza de ajo partida", pt: "cebola, cabeça de alho partida" } },
      { amount: 1, unit: "piece", name: { en: "kombu (15 cm)", es: "kombu (15 cm)", pt: "kombu (15 cm)" } },
      { amount: 3, unit: "piece", name: { en: "guajillo + 2 árbol chiles", es: "guajillos + 2 árboles", pt: "guajillos + 2 árbol" } },
      { amount: 60, unit: "ml", name: { en: "neutral oil", es: "aceite neutro", pt: "óleo neutro" } },
      { amount: 400, unit: "g", name: { en: "cooked hominy", es: "maíz pozolero cocido", pt: "milho pozole cozido" }, shopQuery: "canned white hominy" },
      { amount: 320, unit: "g", name: { en: "fresh ramen noodles", es: "fideos ramen frescos", pt: "macarrão ramen fresco" }, allergens: ["gluten", "egg"] },
      { amount: 4, unit: "piece", name: { en: "soft-boiled eggs, marinated in soy", es: "huevos mollet marinados en soja", pt: "ovos moles marinados em shoyu" }, allergens: ["egg", "soy"] },
      { qty: { en: "to garnish", es: "para decorar", pt: "para finalizar" }, name: { en: "shredded cabbage, radish, scallion, oregano, lime", es: "col rallada, rábano, cebollín, orégano, lima", pt: "repolho fatiado, rabanete, cebolinha, orégano, lima" } },
    ],
    method: {
      en: [
        "Blanch bones 5 min, rinse. Cover with cold water + onion + garlic + kombu. Simmer 90 min — the goal is cloudy white.",
        "Toast chiles in dry pan. Pour hot oil over to bloom. Blend with a ladle of broth into a chile oil.",
        "Strain stock. Season with salt and a splash of soy. Add hominy, simmer 5 min.",
        "Cook ramen noodles 2 min. Drain.",
        "Build bowl: noodles, hot broth, hominy, halved egg.",
        "Spoon chile oil ribbon across surface. Top with cabbage, radish, scallion, oregano. Lime on the side.",
      ],
      es: [
        "Blanquea los huesos 5 min, enjuaga. Cubre con agua fría + cebolla + ajo + kombu. Hierve 90 min — el objetivo es blanco nublado.",
        "Tuesta los chiles en sartén seco. Vierte el aceite caliente para abrirlos. Licúa con un cucharón de caldo.",
        "Cuela el caldo. Sazona con sal y un chorro de soja. Añade el maíz y hierve 5 min.",
        "Cuece los fideos ramen 2 min. Escurre.",
        "Arma el tazón: fideos, caldo, maíz pozolero, mitad de huevo.",
        "Lleva el aceite de chile en cinta sobre la superficie. Termina con col, rábano, cebollín, orégano. Lima aparte.",
      ],
      pt: [
        "Branqueie os ossos 5 min, enxágue. Cubra com água fria + cebola + alho + kombu. Ferva 90 min — o objetivo é branco turvo.",
        "Toste as pimentas em panela seca. Despeje o óleo quente para abri-las. Bata com uma concha de caldo.",
        "Coe o caldo. Tempere com sal e um fio de shoyu. Adicione o milho e ferva 5 min.",
        "Cozinhe o macarrão 2 min. Escorra.",
        "Monte a tigela: macarrão, caldo, milho pozole, metade de ovo.",
        "Faça uma fita de óleo de pimenta na superfície. Finalize com repolho, rabanete, cebolinha, orégano. Lima à parte.",
      ],
    },
    notes: { en: "The broth freezes beautifully. Make a double batch.", es: "El caldo se congela perfecto. Haz doble.", pt: "O caldo congela muito bem. Faça em dobro." },
    pairing: { en: "Ice-cold Mexican lager + a shot of chilled mezcal.", es: "Cerveza mexicana fría + caballito de mezcal.", pt: "Lager mexicana gelada + dose de mezcal gelado." },
    tags: { en: ["broth", "comfort", "winter"], es: ["caldo", "reconfortante", "invierno"], pt: ["caldo", "conforto", "inverno"] },
    allergens: ["pork", "gluten", "egg", "soy"],
    dietary: [],
  meals: ["lunch", "dinner"],
  healthy: false,
  season: "winter",
  },
  {
    slug: "chamoy-furikake-popcorn",
    category: "starter",
    title: { en: "Chamoy-Furikake Popcorn", es: "Palomitas de Chamoy y Furikake", pt: "Pipoca de Chamoy e Furikake" },
    subtitle: { en: "Salty-sweet-sour-spicy. Three-minute snack, ten-second decision.", es: "Salado-dulce-ácido-picante. Botana de tres minutos.", pt: "Salgado-doce-ácido-picante. Petisco de três minutos." },
    origin: { en: "Tijuana × Osaka", es: "Tijuana × Osaka", pt: "Tijuana × Osaka" },
    hero: recipeHero("chamoy-furikake-popcorn"),
    thumb: recipeHero("chamoy-furikake-popcorn", "thumb"),
    prepMinutes: 3,
    cookMinutes: 5,
    serves: 4,
    difficulty: "easy",
    spice: 2,
    umami: 4,
    story: {
      en: "Mexican chamoy candy and Japanese furikake both season rice, popcorn, fruit — anything porous. Together they hit five tastes in a handful.",
      es: "Tanto el chamoy como el furikake sazonan arroz, palomitas, fruta — todo lo poroso. Juntos golpean los cinco sabores en un puñado.",
      pt: "Chamoy mexicano e furikake japonês temperam arroz, pipoca, frutas — tudo o que é poroso. Juntos atingem os cinco sabores em um punhado.",
    },
    ingredients: [
      { amount: 100, unit: "g", name: { en: "popcorn kernels", es: "granos de palomitas", pt: "milho de pipoca" } },
      { amount: 2, unit: "tbsp", name: { en: "neutral oil", es: "aceite neutro", pt: "óleo neutro" } },
      { amount: 3, unit: "tbsp", name: { en: "melted butter", es: "mantequilla derretida", pt: "manteiga derretida" }, allergens: ["dairy"] },
      { amount: 2, unit: "tbsp", name: { en: "chamoy syrup", es: "jarabe de chamoy", pt: "calda de chamoy" }, shopQuery: "chamoy syrup Mexican" },
      { amount: 2, unit: "tbsp", name: { en: "furikake", es: "furikake", pt: "furikake" }, allergens: ["sesame", "fish"], shopQuery: "furikake seasoning" },
      { amount: 1, unit: "tsp", name: { en: "Tajín or lime salt", es: "Tajín o sal de lima", pt: "Tajín ou sal de lima" }, shopQuery: "Tajin classic seasoning" },
    ],
    method: {
      en: [
        "Pop kernels with oil in a heavy pot, lid on, shaking until pops slow to one per second.",
        "Whisk butter with chamoy.",
        "Drizzle butter-chamoy over hot popcorn, tossing in two directions.",
        "Rain furikake and Tajín over the top. Toss again. Eat immediately.",
      ],
      es: [
        "Revienta los granos con el aceite en olla pesada tapada, sacudiendo hasta uno por segundo.",
        "Mezcla la mantequilla con el chamoy.",
        "Hilo de mantequilla-chamoy sobre las palomitas calientes, revolviendo en dos direcciones.",
        "Llueve furikake y Tajín. Revuelve. Come al momento.",
      ],
      pt: [
        "Estoure os grãos com o óleo em panela pesada tampada, sacudindo até uma por segundo.",
        "Misture a manteiga com o chamoy.",
        "Regue a pipoca quente com manteiga-chamoy em duas direções.",
        "Polvilhe furikake e Tajín. Misture. Coma na hora.",
      ],
    },
    notes: { en: "Movie-night cheat code. Doubles as a gift in a glass jar.", es: "Truco para noche de cine. Sirve también de regalo en frasco.", pt: "Truque para sessão de cinema. Vira presente em pote de vidro." },
    pairing: { en: "Sparkling sake or a margarita on the rocks.", es: "Sake espumoso o margarita en las rocas.", pt: "Sake espumante ou margarita on the rocks." },
    tags: { en: ["snack", "fast", "party", "vegetarian"], es: ["botana", "rápido", "fiesta", "vegetariana"], pt: ["petisco", "rápido", "festa", "vegetariana"] },
    allergens: ["dairy", "sesame", "fish"],
    dietary: ["vegetarian"],
  meals: ["lunch"],
  healthy: false,
  season: "summer",
  },
  {
    slug: "miso-mezcal-flan",
    category: "dessert",
    title: { en: "Miso-Mezcal Flan", es: "Flan de Miso y Mezcal", pt: "Pudim de Missô e Mezcal" },
    subtitle: { en: "Silken egg custard, white miso, smoke caramel, sesame brittle.", es: "Flan sedoso, miso blanco, caramelo ahumado, crocante de ajonjolí.", pt: "Pudim sedoso, missô branco, caramelo defumado, crocante de gergelim." },
    origin: { en: "Veracruz × Tokyo", es: "Veracruz × Tokio", pt: "Veracruz × Tóquio" },
    hero: recipeHero("miso-mezcal-flan"),
    thumb: recipeHero("miso-mezcal-flan", "thumb"),
    prepMinutes: 20,
    cookMinutes: 50,
    serves: 6,
    difficulty: "medium",
    spice: 1,
    umami: 4,
    story: {
      en: "Flan is dairy nostalgia. White miso brings background salt that makes the caramel taste deeper, and a teaspoon of mezcal adds smoke without booze.",
      es: "El flan es nostalgia láctea. El miso blanco aporta sal de fondo que profundiza el caramelo, y una cucharadita de mezcal añade humo sin alcohol notable.",
      pt: "Pudim é nostalgia láctea. O missô branco traz salinidade de fundo que aprofunda o caramelo, e uma colher de mezcal acrescenta defumado sem álcool perceptível.",
    },
    ingredients: [
      { amount: 180, unit: "g", name: { en: "sugar", es: "azúcar", pt: "açúcar" } },
      { amount: 1, unit: "tsp", name: { en: "mezcal joven", es: "mezcal joven", pt: "mezcal joven" }, allergens: ["alcohol"] },
      { amount: 500, unit: "ml", name: { en: "whole milk", es: "leche entera", pt: "leite integral" }, allergens: ["dairy"] },
      { amount: 200, unit: "ml", name: { en: "sweetened condensed milk", es: "leche condensada", pt: "leite condensado" }, allergens: ["dairy"] },
      { amount: 2, unit: "tbsp", name: { en: "white (shiro) miso", es: "miso blanco (shiro)", pt: "missô branco (shiro)" }, allergens: ["soy"] },
      { amount: 5, unit: "piece", name: { en: "whole eggs + 2 yolks", es: "huevos enteros + 2 yemas", pt: "ovos inteiros + 2 gemas" }, allergens: ["egg"] },
      { amount: 1, unit: "piece", name: { en: "vanilla bean", es: "vaina de vainilla", pt: "fava de baunilha" } },
      { qty: { en: "to finish", es: "para terminar", pt: "para finalizar" }, name: { en: "toasted sesame brittle", es: "crocante de ajonjolí tostado", pt: "crocante de gergelim tostado" }, allergens: ["sesame"] },
    ],
    method: {
      en: [
        "Cook sugar dry over medium heat to amber caramel. Off heat, swirl in mezcal. Pour into 6 ramekins.",
        "Warm milk + condensed milk + miso, whisking until miso dissolves. Don't boil.",
        "Whisk eggs and yolks. Temper slowly. Strain. Add vanilla.",
        "Pour over caramel. Bake in a water bath at 160°C / 320°F for 45–50 min until just set.",
        "Chill at least 4 hours. Invert. Shower with sesame brittle.",
      ],
      es: [
        "Cocina el azúcar seco a fuego medio hasta caramelo ámbar. Fuera del fuego, incorpora el mezcal. Vacía en 6 ramequines.",
        "Calienta leche + condensada + miso, batiendo hasta disolver el miso. Sin hervir.",
        "Bate huevos y yemas. Tempera con la leche tibia. Cuela. Suma vainilla.",
        "Vierte sobre el caramelo. Hornea baño maría a 160°C / 320°F 45–50 min hasta apenas cuajado.",
        "Refrigera mínimo 4 horas. Desmolda. Cubre con crocante de ajonjolí.",
      ],
      pt: [
        "Faça o caramelo seco em fogo médio até cor âmbar. Fora do fogo, incorpore o mezcal. Despeje em 6 ramequins.",
        "Aqueça leite + condensado + missô, batendo até dissolver o missô. Não ferva.",
        "Bata ovos e gemas. Tempere com leite morno. Coe. Adicione baunilha.",
        "Despeje sobre o caramelo. Asse em banho-maria a 160°C / 320°F por 45–50 min até apenas firme.",
        "Refrigere por no mínimo 4 horas. Desenforme. Cubra com crocante de gergelim.",
      ],
    },
    notes: { en: "Pass custard through a fine sieve twice for hotel-buffet gloss.", es: "Pasa la mezcla por colador fino dos veces para acabado pulido.", pt: "Passe a mistura na peneira fina duas vezes para acabamento polido." },
    pairing: { en: "Espresso with a salted rim, or a small Madeira.", es: "Espresso con escarchado de sal, o un Madeira.", pt: "Espresso com borda salgada, ou um Madeira pequeno." },
    tags: { en: ["dessert", "make-ahead", "iconic"], es: ["postre", "anticipado", "icónica"], pt: ["sobremesa", "antecipado", "icônica"] },
    allergens: ["dairy", "egg", "soy", "sesame", "alcohol"],
    dietary: ["vegetarian"],
  meals: ["dinner"],
  healthy: false,
  season: "winter",
  },
  {
    slug: "tamarindo-shoyu-glazed-wings",
    category: "starter",
    title: { en: "Tamarind-Shoyu Glazed Wings", es: "Alitas Glaseadas Tamarindo-Shoyu", pt: "Asinhas Glaceadas Tamarindo-Shoyu" },
    subtitle: { en: "Crackling skin, sticky glaze, scallion, lime ash.", es: "Piel crujiente, glaseado pegajoso, cebollín, ceniza de lima.", pt: "Pele crocante, glace pegajoso, cebolinha, cinza de lima." },
    origin: { en: "Yucatán × Bangkok-meets-Kyoto", es: "Yucatán × Bangkok-Kioto", pt: "Yucatán × Bangkok-Quioto" },
    hero: recipeHero("tamarindo-shoyu-glazed-wings"),
    thumb: recipeHero("tamarindo-shoyu-glazed-wings", "thumb"),
    prepMinutes: 15,
    cookMinutes: 45,
    serves: 4,
    difficulty: "easy",
    spice: 3,
    umami: 4,
    story: {
      en: "Tamarind is a global pantry hero — Yucatán dulces, Thai pad thai, Indian chutneys. Add shoyu and palm sugar and you get a glaze that fights teriyaki for the title.",
      es: "El tamarindo es un héroe global de despensa. Suma shoyu y azúcar de palma y obtienes un glaseado que le disputa el título al teriyaki.",
      pt: "O tamarindo é um herói global da despensa. Acrescente shoyu e açúcar de palma e você tem um glace que disputa o título com o teriyaki.",
    },
    ingredients: [
      { amount: 1, unit: "kg", name: { en: "chicken wings, split", es: "alitas de pollo, separadas", pt: "asinhas de frango separadas" } },
      { amount: 1, unit: "tsp", name: { en: "baking powder + salt", es: "polvo para hornear + sal", pt: "fermento químico + sal" } },
      { amount: 3, unit: "tbsp", name: { en: "tamarind concentrate", es: "concentrado de tamarindo", pt: "concentrado de tamarindo" }, shopQuery: "tamarind concentrate paste" },
      { amount: 3, unit: "tbsp", name: { en: "shoyu", es: "shoyu", pt: "shoyu" }, allergens: ["soy", "gluten"] },
      { amount: 3, unit: "tbsp", name: { en: "palm or brown sugar", es: "azúcar de palma o moreno", pt: "açúcar de palma ou mascavo" } },
      { amount: 1, unit: "piece", name: { en: "Fresno chile, sliced", es: "chile fresno en rodajas", pt: "pimenta Fresno em rodelas" } },
      { amount: 2, unit: "piece", name: { en: "garlic cloves, microplaned", es: "dientes de ajo rallados", pt: "dentes de alho ralados" } },
      { qty: { en: "to finish", es: "para terminar", pt: "para finalizar" }, name: { en: "scallion, lime, toasted sesame", es: "cebollín, lima, ajonjolí tostado", pt: "cebolinha, lima, gergelim tostado" }, allergens: ["sesame"] },
    ],
    method: {
      en: [
        "Pat wings bone-dry. Toss with baking powder + salt. Rest on a rack 1 hour in the fridge.",
        "Bake at 220°C / 425°F on the rack, 35–40 min, flipping once, until skin shatters.",
        "Simmer tamarind, shoyu, sugar, chile, garlic until glossy and coating-thick, 4 min.",
        "Toss hot wings in glaze. Plate, scallion, sesame, big squeeze of lime.",
      ],
      es: [
        "Seca las alitas. Mezcla con polvo para hornear + sal. Refrigera en rejilla 1 hora destapadas.",
        "Hornea a 220°C / 425°F en la rejilla, 35–40 min, volteando una vez, hasta que la piel reviente.",
        "Reduce tamarindo, shoyu, azúcar, chile y ajo hasta brillar, 4 min.",
        "Revuelve las alitas en el glaseado. Sirve con cebollín, ajonjolí, lima.",
      ],
      pt: [
        "Seque bem as asinhas. Misture com fermento + sal. Refrigere sobre uma grade 1 hora.",
        "Asse a 220°C / 425°F sobre a grade, 35–40 min, virando uma vez, até estourar a pele.",
        "Reduza tamarindo, shoyu, açúcar, pimenta e alho até brilhar, 4 min.",
        "Misture as asinhas quentes no glace. Sirva com cebolinha, gergelim, lima.",
      ],
    },
    notes: { en: "The baking-powder dry brine is the secret.", es: "El secado con polvo para hornear es el secreto.", pt: "A salmoura seca com fermento é o segredo." },
    pairing: { en: "Cold lager, cold sake, or both in alternation.", es: "Cerveza fría, sake frío, o alternados.", pt: "Lager gelada, sake gelado, ou alternados." },
    tags: { en: ["chicken", "crowd-pleaser", "easy-win", "weeknight"], es: ["pollo", "complaciente", "victoria-fácil", "entresemana"], pt: ["frango", "agrada-geral", "vitória-fácil", "dia-de-semana"] },
    allergens: ["soy", "gluten", "sesame"],
    dietary: ["dairyFree"],
  meals: ["lunch", "dinner"],
  healthy: false,
  season: "fall",
  },
  {
    slug: "horchata-tres-leches-matcha",
    category: "dessert",
    title: { en: "Horchata–Tres Leches with Matcha", es: "Tres Leches de Horchata con Matcha", pt: "Tres Leches de Horchata com Matcha" },
    subtitle: { en: "Cinnamon-rice sponge soaked in three milks, dusted ceremonial green.", es: "Bizcocho de arroz-canela bañado en tres leches, espolvoreado de verde ceremonial.", pt: "Pão-de-ló de arroz-canela embebido em três leites, polvilhado de verde cerimonial." },
    origin: { en: "Guadalajara × Uji", es: "Guadalajara × Uji", pt: "Guadalajara × Uji" },
    hero: recipeHero("horchata-tres-leches-matcha"),
    thumb: recipeHero("horchata-tres-leches-matcha", "thumb"),
    prepMinutes: 25,
    cookMinutes: 30,
    serves: 8,
    difficulty: "medium",
    spice: 1,
    umami: 2,
    story: {
      en: "Tres leches is a sponge in disguise — designed to drink. Sub the soak for horchata and crown with matcha and you get a dessert that is white on white on green.",
      es: "El tres leches es un bizcocho disfrazado. Cambia el remojo por horchata y corona con matcha — postre blanco sobre blanco sobre verde.",
      pt: "Tres leches é um bolo disfarçado. Troque a calda por horchata e finalize com matcha — sobremesa branco-sobre-branco-sobre-verde.",
    },
    ingredients: [
      { amount: 5, unit: "piece", name: { en: "eggs, separated", es: "huevos, separados", pt: "ovos, separados" }, allergens: ["egg"] },
      { amount: 200, unit: "g", name: { en: "sugar", es: "azúcar", pt: "açúcar" } },
      { amount: 180, unit: "g", name: { en: "cake flour", es: "harina para repostería", pt: "farinha de bolo" }, allergens: ["gluten"] },
      { amount: 1, unit: "tsp", name: { en: "ground cinnamon", es: "canela molida", pt: "canela em pó" } },
      { amount: 300, unit: "ml", name: { en: "horchata (sweetened)", es: "horchata endulzada", pt: "horchata adoçada" }, shopQuery: "Mexican horchata mix" },
      { amount: 200, unit: "ml", name: { en: "evaporated milk", es: "leche evaporada", pt: "leite evaporado" }, allergens: ["dairy"] },
      { amount: 200, unit: "ml", name: { en: "sweetened condensed milk", es: "leche condensada", pt: "leite condensado" }, allergens: ["dairy"] },
      { amount: 300, unit: "ml", name: { en: "cream, whipped", es: "crema batida", pt: "creme de leite batido" }, allergens: ["dairy"] },
      { amount: 2, unit: "tsp", name: { en: "ceremonial matcha", es: "matcha ceremonial", pt: "matcha cerimonial" }, shopQuery: "ceremonial grade matcha powder" },
    ],
    method: {
      en: [
        "Whip whites to soft peaks. Whip yolks with sugar to ribbon. Fold yolks into whites. Sift in flour + cinnamon, fold gently.",
        "Bake in a 23 cm square pan at 170°C / 340°F for 25–28 min. Cool 10 min, then pierce all over.",
        "Whisk horchata + evaporated + condensed. Pour slowly over cake. Refrigerate 4 hours, ideally overnight.",
        "Top with whipped cream in a smooth layer.",
        "Dust matcha through a fine sieve in a thick stripe just before serving.",
      ],
      es: [
        "Bate claras a picos suaves. Bate yemas con azúcar a cinta. Integra yemas a claras. Tamiza harina + canela y envuelve.",
        "Hornea en molde cuadrado 23 cm a 170°C / 340°F durante 25–28 min. Enfría 10 min y pincha.",
        "Mezcla horchata + evaporada + condensada. Vierte lentamente sobre el bizcocho. Refrigera 4 h.",
        "Cubre con crema batida en capa pareja.",
        "Espolvorea matcha por colador fino justo antes de servir.",
      ],
      pt: [
        "Bata claras em picos macios. Bata gemas com açúcar até virar fita. Incorpore gemas às claras. Peneire farinha + canela e envolva.",
        "Asse em forma quadrada 23 cm a 170°C / 340°F por 25–28 min. Esfrie 10 min e fure.",
        "Misture horchata + evaporado + condensado. Despeje lentamente sobre o bolo. Refrigere 4 h.",
        "Cubra com chantilly em camada lisa.",
        "Polvilhe matcha pela peneira fina na hora de servir.",
      ],
    },
    notes: { en: "Use the best matcha you can afford.", es: "Usa el mejor matcha posible.", pt: "Use o melhor matcha que puder." },
    pairing: { en: "Sencha tea, or a single shot of black coffee.", es: "Té sencha o un café negro corto.", pt: "Chá sencha ou um café preto curto." },
    tags: { en: ["dessert", "make-ahead", "iconic"], es: ["postre", "anticipado", "icónica"], pt: ["sobremesa", "antecipado", "icônica"] },
    allergens: ["egg", "gluten", "dairy"],
    dietary: ["vegetarian"],
  meals: ["dinner"],
  healthy: false,
  season: "spring",
  },
];

export function recipeBySlug(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}

export function relatedRecipes(slug: string, limit = 3): Recipe[] {
  const current = recipeBySlug(slug);
  if (!current) return recipes.slice(0, limit);
  return recipes
    .filter((r) => r.slug !== slug)
    .map((r) => ({
      r,
      score:
        (r.category === current.category ? 2 : 0) +
        Math.abs(r.spice - current.spice) * -0.5 +
        Math.abs(r.umami - current.umami) * -0.5,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ r }) => r);
}
