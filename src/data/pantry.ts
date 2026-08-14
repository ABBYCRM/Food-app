import type { Locale } from "@/i18n";

type LString = Record<Locale, string>;

export type PantryItem = {
  slug: string;
  name: LString;
  category: LString;
  short: LString;
  hero: string;
  bridges: LString;
};

/* Curated photography lives in public/img/ — see the note in data/recipes.ts. */
const img = (slug: string) => `${import.meta.env.BASE_URL}img/pantry/${slug}.jpg`;

export const pantry: PantryItem[] = [
  {
    slug: "soy-sauce",
    name: { en: "Soy Sauce", es: "Salsa de Soja", pt: "Shoyu" },
    category: { en: "Aged ferment", es: "Fermento añejado", pt: "Fermentado curtido" },
    short: {
      en: "Backbone of Asian umami. Choose dark for color, light for salt.",
      es: "Columna vertebral del umami asiático. Oscura para color, ligera para sal.",
      pt: "Espinha dorsal do umami asiático. Escura para cor, leve para sal.",
    },
    hero: img("soy-sauce"),
    bridges: {
      en: "Splash into mole verde for instant depth.",
      es: "Un chorrito en mole verde da profundidad inmediata.",
      pt: "Um fio no mole verde dá profundidade imediata.",
    },
  },
  {
    slug: "dried-chiles",
    name: { en: "Dried Chiles", es: "Chiles Secos", pt: "Pimentas Secas" },
    category: { en: "Sun-cured fire", es: "Fuego curado al sol", pt: "Fogo curado ao sol" },
    short: {
      en: "Guajillo for brightness, ancho for raisin, árbol for slap.",
      es: "Guajillo para brillo, ancho para pasa, árbol para golpe.",
      pt: "Guajillo para brilho, ancho para passa, árbol para impacto.",
    },
    hero: img("dried-chiles"),
    bridges: {
      en: "Toast and grind into furikake for chile-laced rice.",
      es: "Tuesta y muele dentro de furikake para arroz con chile.",
      pt: "Toste e moa dentro do furikake para um arroz com pimenta.",
    },
  },
  {
    slug: "ginger",
    name: { en: "Ginger", es: "Jengibre", pt: "Gengibre" },
    category: { en: "Living root", es: "Raíz viva", pt: "Raiz viva" },
    short: {
      en: "Heat without spice. The rhythm section of every Asian aromatic chord.",
      es: "Calor sin picante. La sección rítmica de toda armonía aromática asiática.",
      pt: "Calor sem picância. A seção rítmica de toda harmonia aromática asiática.",
    },
    hero: img("ginger"),
    bridges: {
      en: "Microplane raw into salsa verde — surprise lift.",
      es: "Ralla crudo a la salsa verde — sorpresa que eleva.",
      pt: "Rale cru no molho verde — surpresa que eleva.",
    },
  },
  {
    slug: "corn-masa",
    name: { en: "Corn Masa", es: "Masa de Maíz", pt: "Masa de Milho" },
    category: { en: "Nixtamalized grain", es: "Grano nixtamalizado", pt: "Grão nixtamalizado" },
    short: {
      en: "Foundation of Mexico's daily bread. Alkali transforms corn into flavor and nutrition.",
      es: "Cimiento del pan diario de México. El álcali transforma el maíz en sabor y nutrición.",
      pt: "Base do pão diário do México. O álcali transforma o milho em sabor e nutrição.",
    },
    hero: img("corn-masa"),
    bridges: {
      en: "Use as the wrapper for any dumpling-style filling.",
      es: "Úsala como envoltura para cualquier relleno tipo dumpling.",
      pt: "Use como invólucro para qualquer recheio tipo dumpling.",
    },
  },
  {
    slug: "miso",
    name: { en: "Miso", es: "Miso", pt: "Missô" },
    category: { en: "Soybean ferment", es: "Fermento de soja", pt: "Fermento de soja" },
    short: {
      en: "Salt, funk, sweet. White for delicate, red for bold, black for sinister.",
      es: "Sal, funk, dulce. Blanco delicado, rojo audaz, negro siniestro.",
      pt: "Sal, funk, doce. Branco delicado, vermelho ousado, preto sinistro.",
    },
    hero: img("miso"),
    bridges: {
      en: "Stir 1 tbsp into mole and refuse to explain yourself.",
      es: "Integra 1 cda al mole y rehúsate a explicar por qué.",
      pt: "Misture 1 cs no mole e recuse-se a explicar.",
    },
  },
  {
    slug: "lime-yuzu",
    name: { en: "Lime & Yuzu", es: "Lima y Yuzu", pt: "Lima e Yuzu" },
    category: { en: "Citrus duet", es: "Dúo cítrico", pt: "Duo cítrico" },
    short: {
      en: "Lime grounds, yuzu sings. Use them in tandem for high-low brightness.",
      es: "La lima aterriza, el yuzu canta. Úsalos en tándem para brillo alto-bajo.",
      pt: "A lima aterra, o yuzu canta. Use em tandem para brilho alto-baixo.",
    },
    hero: img("lime-yuzu"),
    bridges: {
      en: "50/50 yuzu-lime is the perfect aguachile cure.",
      es: "Yuzu-lima 50/50 es el cura perfecto para aguachile.",
      pt: "Yuzu-lima 50/50 é a cura perfeita do aguachile.",
    },
  },
  {
    slug: "kombu",
    name: { en: "Kombu", es: "Kombu", pt: "Kombu" },
    category: { en: "Glutamate kelp", es: "Alga de glutamato", pt: "Alga de glutamato" },
    short: {
      en: "Dried kelp, naturally MSG-rich. One sheet upgrades any broth.",
      es: "Alga seca, naturalmente rica en MSG. Una hoja eleva cualquier caldo.",
      pt: "Alga seca, naturalmente rica em MSG. Uma folha eleva qualquer caldo.",
    },
    hero: img("kombu"),
    bridges: {
      en: "Steep in pozole stock for 20 minutes — invisible but transformative.",
      es: "Reposa en caldo de pozole 20 minutos — invisible pero transformador.",
      pt: "Infunda no caldo do pozole por 20 minutos — invisível mas transformador.",
    },
  },
  {
    slug: "agave",
    name: { en: "Agave", es: "Agave", pt: "Agave" },
    category: { en: "Slow sweetness", es: "Dulzor lento", pt: "Doçura lenta" },
    short: {
      en: "Lower glycemic than sugar, with vegetal honey notes. The Mexican mirin.",
      es: "Glicémicamente más bajo que el azúcar, con notas de miel vegetal. El mirin mexicano.",
      pt: "Glicemicamente menor que o açúcar, com notas de mel vegetal. O mirin mexicano.",
    },
    hero: img("agave"),
    bridges: {
      en: "Substitute 1:1 for mirin in teriyaki and you'll never go back.",
      es: "Sustituye 1:1 el mirin en teriyaki y no querrás volver.",
      pt: "Substitua 1:1 o mirin no teriyaki e não vai querer voltar.",
    },
  },
];
