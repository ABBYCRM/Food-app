import type { Locale } from "@/i18n";

type LString = Record<Locale, string>;

export type Technique = {
  slug: string;
  title: LString;
  summary: LString;
  origin: LString;
  hero: string;
  steps: Record<Locale, string[]>;
};

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const techniques: Technique[] = [
  {
    slug: "chile-bloom",
    title: {
      en: "Blooming Dried Chiles",
      es: "Floración de Chiles Secos",
      pt: "Floração de Pimentas Secas",
    },
    summary: {
      en: "The 60 seconds that decide every Mexican-Asian sauce.",
      es: "Los 60 segundos que deciden toda salsa mexicana-asiática.",
      pt: "Os 60 segundos que decidem todo molho mexicano-asiático.",
    },
    origin: { en: "Universal", es: "Universal", pt: "Universal" },
    hero: img("photo-1518110925495-b37653ef6d72"),
    steps: {
      en: [
        "Wipe chiles with a dry cloth — never wash.",
        "Toast in a dry pan over medium heat, 20–30 seconds per side, until oil blisters.",
        "Pull immediately — over-toasted chile turns sauce bitter.",
        "Bloom in just-boiled water or warm broth 10 minutes, weighed down with a plate.",
      ],
      es: [
        "Limpia los chiles con paño seco — nunca los laves.",
        "Tuesta en sartén seco a fuego medio, 20–30 segundos por lado, hasta que el aceite se ampolle.",
        "Retira de inmediato — chile sobre-tostado amarga la salsa.",
        "Hidrata en agua recién hervida o caldo tibio 10 minutos, con un plato encima.",
      ],
      pt: [
        "Limpe as pimentas com pano seco — nunca lave.",
        "Toste em frigideira seca em fogo médio, 20–30 segundos por lado, até o óleo borbulhar.",
        "Retire imediatamente — pimenta tostada demais amarga o molho.",
        "Hidrate em água recém-fervida ou caldo morno por 10 minutos, com um prato por cima.",
      ],
    },
  },
  {
    slug: "dashi-meets-caldo",
    title: {
      en: "Dashi Meets Caldo",
      es: "El Encuentro de Dashi y Caldo",
      pt: "Onde Dashi Encontra Caldo",
    },
    summary: {
      en: "A 15-minute kombu-bone stock for cross-continental dishes.",
      es: "Caldo de kombu-hueso en 15 minutos para platos transcontinentales.",
      pt: "Caldo de kombu-osso em 15 minutos para pratos transcontinentais.",
    },
    origin: { en: "Tokyo × Tlaxcala", es: "Tokio × Tlaxcala", pt: "Tóquio × Tlaxcala" },
    hero: img("photo-1547592180-85f173990554"),
    steps: {
      en: [
        "Cover 500 g pork or chicken bones with cold water + a 10 cm strip of kombu.",
        "Bring slowly to a bare shimmer (NEVER boil with kombu in).",
        "After 12 minutes, remove kombu. Add a small handful of toasted dried chile.",
        "Simmer 20 minutes more, season with shoyu + salt. Strain.",
      ],
      es: [
        "Cubre 500 g de huesos de cerdo o pollo con agua fría + tira de kombu de 10 cm.",
        "Lleva lentamente apenas a un susurro (NUNCA hierve con el kombu adentro).",
        "Tras 12 minutos retira el kombu. Suma un puñado pequeño de chile seco tostado.",
        "Hierve 20 minutos más, sazona con shoyu + sal. Cuela.",
      ],
      pt: [
        "Cubra 500 g de ossos de porco ou frango com água fria + tira de kombu de 10 cm.",
        "Leve lentamente a um leve fervilhar (NUNCA ferva com o kombu dentro).",
        "Após 12 minutos retire o kombu. Acrescente um punhado pequeno de pimenta seca tostada.",
        "Cozinhe mais 20 minutos, tempere com shoyu + sal. Coe.",
      ],
    },
  },
  {
    slug: "tortilla-press",
    title: {
      en: "Press a Living Tortilla",
      es: "Prensa una Tortilla Viva",
      pt: "Prense uma Tortilha Viva",
    },
    summary: {
      en: "Fresh masa, two plastic sheets, thirty seconds on a hot comal.",
      es: "Masa fresca, dos láminas de plástico, treinta segundos en comal caliente.",
      pt: "Masa fresca, duas folhas plásticas, trinta segundos no comal quente.",
    },
    origin: { en: "Oaxaca", es: "Oaxaca", pt: "Oaxaca" },
    hero: img("photo-1599974579688-8dbdd335c77f"),
    steps: {
      en: [
        "Mix masa harina with warm water (1:1 by volume) until it feels like soft Play-Doh.",
        "Roll a 35 g ball. Press between two cut zip-bag panels in a tortilla press.",
        "Slap onto a 230°C / 450°F dry comal. 30 sec, flip; 45 sec, flip; 15 sec — it should puff.",
        "Stack inside a clean cloth in a basket. They keep each other warm.",
      ],
      es: [
        "Mezcla masa harina con agua tibia (1:1 en volumen) hasta una consistencia de plastilina suave.",
        "Forma bolita de 35 g. Prensa entre dos láminas de bolsa zip cortada en la prensa.",
        "Lanza al comal seco a 230°C / 450°F. 30 seg, voltea; 45 seg, voltea; 15 seg — debe inflarse.",
        "Apila en canasta envuelta en paño limpio. Se calientan entre sí.",
      ],
      pt: [
        "Misture masa harina com água morna (1:1 em volume) até consistência de massa de modelar macia.",
        "Faça uma bolinha de 35 g. Prense entre duas folhas de saco zip recortadas.",
        "Coloque no comal seco a 230°C / 450°F. 30 seg, vire; 45 seg, vire; 15 seg — deve inflar.",
        "Empilhe num cesto forrado de pano limpo. Elas se aquecem entre si.",
      ],
    },
  },
];
