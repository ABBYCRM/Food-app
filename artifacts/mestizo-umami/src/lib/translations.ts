export type TranslationKey =
  // Nav
  | "nav.home" | "nav.recipes" | "nav.planner" | "nav.notebook" | "nav.stores" | "nav.search"
  | "nav.tagline"
  // Recipe detail
  | "recipe.story" | "recipe.ingredients" | "recipe.method"
  | "recipe.chefNotes" | "recipe.pairing" | "recipe.back"
  | "recipe.saveRecipe" | "recipe.saved" | "recipe.printList"
  | "recipe.shopInstacart" | "recipe.openingInstacart" | "recipe.instacartError"
  | "recipe.prepCook" | "recipe.difficulty" | "recipe.spice" | "recipe.umami"
  | "recipe.servings" | "recipe.serving" | "recipe.feedsPeople" | "recipe.feedsPerson"
  | "recipe.relatedTitle" | "recipe.notFound" | "recipe.returnCollection"
  | "recipe.origin" | "recipe.allergens"
  // Auth gate
  | "recipe.gate.label" | "recipe.gate.copy" | "recipe.gate.cta" | "recipe.gate.back"
  // Difficulty
  | "difficulty.easy" | "difficulty.medium" | "difficulty.advanced"
  // Tags
  | "tag.vegetarian" | "tag.vegan" | "tag.dairyfree" | "tag.glutenfree"
  | "tag.pescatarian" | "tag.healthy"
  // Planner
  | "planner.title" | "planner.subtitle" | "planner.autoPlan"
  | "planner.shoppingList" | "planner.downloadPdf" | "planner.noMeals"
  | "planner.fillSlots" | "planner.goBack" | "planner.weekPlanned"
  | "planner.weekPlannedDesc" | "planner.adjustServings"
  | "planner.breakfastLabel" | "planner.lunchLabel" | "planner.dinnerLabel" | "planner.snackLabel"
  // Stores
  | "stores.title" | "stores.subtitle" | "stores.search" | "stores.searching"
  | "stores.noStores" | "stores.tryOther" | "stores.openMaps"
  | "stores.comingSoon" | "stores.comingSoonDesc" | "stores.addIngredients" | "stores.joinWaitlist"
  | "stores.instacartTitle" | "stores.instacartDescription" | "stores.instacartAvailable"
  | "stores.signInInstacart" | "stores.chooseRecipe" | "stores.providerUnavailable"
  // Common
  | "common.serves" | "common.downloadPdf";

type LocaleTranslations = Record<TranslationKey, string>;

export const translations: Record<"en" | "es" | "pt", LocaleTranslations> = {
  en: {
    // Nav
    "nav.home": "Home",
    "nav.recipes": "Recipes",
    "nav.planner": "Planner",
    "nav.notebook": "Notebook",
    "nav.stores": "Stores",
    "nav.search": "Search",
    "nav.tagline": "A private dining room in your kitchen.",
    // Recipe detail
    "recipe.story": "The Story",
    "recipe.ingredients": "Ingredients",
    "recipe.method": "Method",
    "recipe.chefNotes": "Chef's Notes",
    "recipe.pairing": "Suggested Pairing",
    "recipe.back": "Back",
    "recipe.saveRecipe": "Save Recipe",
    "recipe.saved": "Saved",
    "recipe.printList": "Print List",
    "recipe.shopInstacart": "Shop on Instacart",
    "recipe.openingInstacart": "Opening Instacart",
    "recipe.instacartError": "Instacart couldn't create this shopping list. Please try again.",
    "recipe.prepCook": "Prep / Cook",
    "recipe.difficulty": "Difficulty",
    "recipe.spice": "Spice",
    "recipe.umami": "Umami",
    "recipe.servings": "servings",
    "recipe.serving": "serving",
    "recipe.feedsPeople": "feeds {n} people",
    "recipe.feedsPerson": "feeds 1 person",
    "recipe.relatedTitle": "You might also love",
    "recipe.notFound": "Recipe Not Found",
    "recipe.returnCollection": "Return to collection",
    "recipe.origin": "Origin",
    "recipe.allergens": "Allergens",
    // Auth gate
    "recipe.gate.label": "Recipe",
    "recipe.gate.copy": "Create a free account to unlock the full recipe — ingredients, method, chef notes, and more.",
    "recipe.gate.cta": "Sign up — it's free",
    "recipe.gate.back": "← Back to recipes",
    // Difficulty
    "difficulty.easy": "Easy",
    "difficulty.medium": "Medium",
    "difficulty.advanced": "Advanced",
    // Tags
    "tag.vegetarian": "Vegetarian",
    "tag.vegan": "Vegan",
    "tag.dairyfree": "Dairy-Free",
    "tag.glutenfree": "Gluten-Free",
    "tag.pescatarian": "Pescatarian",
    "tag.healthy": "Healthy",
    // Planner
    "planner.title": "The Weekly Canvas",
    "planner.subtitle": "Plan your week of extraordinary meals",
    "planner.autoPlan": "Auto Plan My Week",
    "planner.shoppingList": "Shopping List",
    "planner.downloadPdf": "Download PDF",
    "planner.noMeals": "No meals planned yet.",
    "planner.fillSlots": "Fill some slots on the calendar first.",
    "planner.goBack": "Go back",
    "planner.weekPlanned": "Week planned!",
    "planner.weekPlannedDesc": "{n} unique recipes chosen — none repeated from the past 3 months.",
    "planner.adjustServings": "Adjust servings per meal, then click Download PDF to open a print-ready page.",
    "planner.breakfastLabel": "Breakfast",
    "planner.lunchLabel": "Lunch",
    "planner.dinnerLabel": "Dinner",
    "planner.snackLabel": "Snack",
    // Stores
    "stores.title": "Find Ingredients Near You",
    "stores.subtitle": "Locate supermarkets and specialty food stores by ZIP code.",
    "stores.search": "Search",
    "stores.searching": "Searching",
    "stores.noStores": "No stores found",
    "stores.tryOther": "Try a different ZIP code or expanding your search area.",
    "stores.openMaps": "Open in Google Maps",
    "stores.comingSoon": "Instant Cart Integration Coming Soon",
    "stores.comingSoonDesc": "Add all ingredients from any recipe directly to your cart at your nearest store — with one tap.",
    "stores.addIngredients": "Add All Ingredients",
    "stores.joinWaitlist": "Join the Waitlist",
    "stores.instacartTitle": "Shop Recipes with Instacart",
    "stores.instacartDescription": "Choose a recipe and send its scaled ingredient list to a private Instacart shopping page.",
    "stores.instacartAvailable": "Available on Instacart near you",
    "stores.signInInstacart": "Sign in to use Instacart",
    "stores.chooseRecipe": "Choose a Recipe",
    "stores.providerUnavailable": "Instacart retailers are temporarily unavailable.",
    // Common
    "common.serves": "Serves",
    "common.downloadPdf": "Download PDF",
  },

  es: {
    // Nav
    "nav.home": "Inicio",
    "nav.recipes": "Recetas",
    "nav.planner": "Planificador",
    "nav.notebook": "Recetario",
    "nav.stores": "Tiendas",
    "nav.search": "Buscar",
    "nav.tagline": "Un comedor privado en tu cocina.",
    // Recipe detail
    "recipe.story": "La Historia",
    "recipe.ingredients": "Ingredientes",
    "recipe.method": "Método",
    "recipe.chefNotes": "Notas del Chef",
    "recipe.pairing": "Maridaje Sugerido",
    "recipe.back": "Atrás",
    "recipe.saveRecipe": "Guardar Receta",
    "recipe.saved": "Guardada",
    "recipe.printList": "Imprimir Lista",
    "recipe.shopInstacart": "Comprar en Instacart",
    "recipe.openingInstacart": "Abriendo Instacart",
    "recipe.instacartError": "Instacart no pudo crear esta lista. Inténtalo de nuevo.",
    "recipe.prepCook": "Prep / Cocción",
    "recipe.difficulty": "Dificultad",
    "recipe.spice": "Picante",
    "recipe.umami": "Umami",
    "recipe.servings": "porciones",
    "recipe.serving": "porción",
    "recipe.feedsPeople": "para {n} personas",
    "recipe.feedsPerson": "para 1 persona",
    "recipe.relatedTitle": "También te puede gustar",
    "recipe.notFound": "Receta No Encontrada",
    "recipe.returnCollection": "Volver a la colección",
    "recipe.origin": "Origen",
    "recipe.allergens": "Alérgenos",
    // Auth gate
    "recipe.gate.label": "Receta",
    "recipe.gate.copy": "Crea una cuenta gratuita para desbloquear la receta completa — ingredientes, método, notas del chef y más.",
    "recipe.gate.cta": "Regístrate — es gratis",
    "recipe.gate.back": "← Volver a las recetas",
    // Difficulty
    "difficulty.easy": "Fácil",
    "difficulty.medium": "Intermedio",
    "difficulty.advanced": "Avanzado",
    // Tags
    "tag.vegetarian": "Vegetariano",
    "tag.vegan": "Vegano",
    "tag.dairyfree": "Sin Lácteos",
    "tag.glutenfree": "Sin Gluten",
    "tag.pescatarian": "Pescetariano",
    "tag.healthy": "Saludable",
    // Planner
    "planner.title": "El Lienzo Semanal",
    "planner.subtitle": "Planifica tu semana de comidas extraordinarias",
    "planner.autoPlan": "Planificar mi Semana",
    "planner.shoppingList": "Lista de Compras",
    "planner.downloadPdf": "Descargar PDF",
    "planner.noMeals": "No hay comidas planificadas.",
    "planner.fillSlots": "Agrega comidas al calendario primero.",
    "planner.goBack": "Volver",
    "planner.weekPlanned": "¡Semana planificada!",
    "planner.weekPlannedDesc": "{n} recetas únicas seleccionadas — ninguna repetida en los últimos 3 meses.",
    "planner.adjustServings": "Ajusta las porciones por comida y luego haz clic en Descargar PDF.",
    "planner.breakfastLabel": "Desayuno",
    "planner.lunchLabel": "Almuerzo",
    "planner.dinnerLabel": "Cena",
    "planner.snackLabel": "Merienda",
    // Stores
    "stores.title": "Encuentra Ingredientes Cerca",
    "stores.subtitle": "Localiza supermercados y tiendas especializadas por código postal.",
    "stores.search": "Buscar",
    "stores.searching": "Buscando",
    "stores.noStores": "No se encontraron tiendas",
    "stores.tryOther": "Prueba con un código postal diferente.",
    "stores.openMaps": "Abrir en Google Maps",
    "stores.comingSoon": "Integración de Carrito — Próximamente",
    "stores.comingSoonDesc": "Agrega todos los ingredientes de cualquier receta directamente a tu carrito — con un solo toque.",
    "stores.addIngredients": "Agregar Ingredientes",
    "stores.joinWaitlist": "Unirse a la Lista",
    "stores.instacartTitle": "Compra Recetas con Instacart",
    "stores.instacartDescription": "Elige una receta y envía sus ingredientes ajustados a una página privada de compras de Instacart.",
    "stores.instacartAvailable": "Disponible en Instacart cerca de ti",
    "stores.signInInstacart": "Inicia sesión para usar Instacart",
    "stores.chooseRecipe": "Elegir una Receta",
    "stores.providerUnavailable": "Las tiendas de Instacart no están disponibles temporalmente.",
    // Common
    "common.serves": "Porciones",
    "common.downloadPdf": "Descargar PDF",
  },

  pt: {
    // Nav
    "nav.home": "Início",
    "nav.recipes": "Receitas",
    "nav.planner": "Planejador",
    "nav.notebook": "Caderno",
    "nav.stores": "Lojas",
    "nav.search": "Buscar",
    "nav.tagline": "Uma sala de jantar privada na sua cozinha.",
    // Recipe detail
    "recipe.story": "A História",
    "recipe.ingredients": "Ingredientes",
    "recipe.method": "Modo de Preparo",
    "recipe.chefNotes": "Notas do Chef",
    "recipe.pairing": "Harmonização Sugerida",
    "recipe.back": "Voltar",
    "recipe.saveRecipe": "Salvar Receita",
    "recipe.saved": "Salva",
    "recipe.printList": "Imprimir Lista",
    "recipe.shopInstacart": "Comprar no Instacart",
    "recipe.openingInstacart": "Abrindo o Instacart",
    "recipe.instacartError": "O Instacart não conseguiu criar esta lista. Tente novamente.",
    "recipe.prepCook": "Prep / Cozimento",
    "recipe.difficulty": "Dificuldade",
    "recipe.spice": "Picância",
    "recipe.umami": "Umami",
    "recipe.servings": "porções",
    "recipe.serving": "porção",
    "recipe.feedsPeople": "para {n} pessoas",
    "recipe.feedsPerson": "para 1 pessoa",
    "recipe.relatedTitle": "Você também pode gostar",
    "recipe.notFound": "Receita Não Encontrada",
    "recipe.returnCollection": "Voltar à coleção",
    "recipe.origin": "Origem",
    "recipe.allergens": "Alérgenos",
    // Auth gate
    "recipe.gate.label": "Receita",
    "recipe.gate.copy": "Crie uma conta gratuita para desbloquear a receita completa — ingredientes, modo de preparo, notas do chef e muito mais.",
    "recipe.gate.cta": "Cadastre-se — é grátis",
    "recipe.gate.back": "← Voltar às receitas",
    // Difficulty
    "difficulty.easy": "Fácil",
    "difficulty.medium": "Intermediário",
    "difficulty.advanced": "Avançado",
    // Tags
    "tag.vegetarian": "Vegetariano",
    "tag.vegan": "Vegano",
    "tag.dairyfree": "Sem Laticínios",
    "tag.glutenfree": "Sem Glúten",
    "tag.pescatarian": "Pescetariano",
    "tag.healthy": "Saudável",
    // Planner
    "planner.title": "O Canvas Semanal",
    "planner.subtitle": "Planeje sua semana de refeições extraordinárias",
    "planner.autoPlan": "Planejar Minha Semana",
    "planner.shoppingList": "Lista de Compras",
    "planner.downloadPdf": "Baixar PDF",
    "planner.noMeals": "Nenhuma refeição planejada.",
    "planner.fillSlots": "Adicione refeições ao calendário primeiro.",
    "planner.goBack": "Voltar",
    "planner.weekPlanned": "Semana planejada!",
    "planner.weekPlannedDesc": "{n} receitas únicas escolhidas — nenhuma repetida nos últimos 3 meses.",
    "planner.adjustServings": "Ajuste as porções por refeição e clique em Baixar PDF para abrir a página de impressão.",
    "planner.breakfastLabel": "Café da Manhã",
    "planner.lunchLabel": "Almoço",
    "planner.dinnerLabel": "Jantar",
    "planner.snackLabel": "Lanche",
    // Stores
    "stores.title": "Encontre Ingredientes Perto",
    "stores.subtitle": "Localize supermercados e lojas especializadas pelo CEP.",
    "stores.search": "Buscar",
    "stores.searching": "Buscando",
    "stores.noStores": "Nenhuma loja encontrada",
    "stores.tryOther": "Tente um CEP diferente ou expanda sua área de busca.",
    "stores.openMaps": "Abrir no Google Maps",
    "stores.comingSoon": "Integração de Carrinho — Em Breve",
    "stores.comingSoonDesc": "Adicione todos os ingredientes de qualquer receita diretamente ao seu carrinho — com um toque.",
    "stores.addIngredients": "Adicionar Ingredientes",
    "stores.joinWaitlist": "Entrar na Lista",
    "stores.instacartTitle": "Compre Receitas com Instacart",
    "stores.instacartDescription": "Escolha uma receita e envie os ingredientes ajustados para uma página privada de compras do Instacart.",
    "stores.instacartAvailable": "Disponível no Instacart perto de você",
    "stores.signInInstacart": "Entre para usar o Instacart",
    "stores.chooseRecipe": "Escolher uma Receita",
    "stores.providerUnavailable": "As lojas do Instacart estão temporariamente indisponíveis.",
    // Common
    "common.serves": "Porções",
    "common.downloadPdf": "Baixar PDF",
  },
};
