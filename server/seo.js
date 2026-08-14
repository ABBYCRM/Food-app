import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const catalogPath = fileURLToPath(new URL("./generated/seo-catalog.json", import.meta.url));

const corePages = new Map([
  ["/", {
    title: "Mestizo Umami · Mexican-Asian Recipes in Three Languages",
    description: "Cook Mexican-Asian fusion recipes in English, Spanish, or Portuguese, with allergy filters, a weekly planner, shopping links, and 365 rotating dishes.",
  }],
  ["/recipes", {
    title: "365 Mexican-Asian Fusion Recipes · Mestizo Umami",
    description: "Explore a year of Mexican-Asian fusion recipes, from miso mole tacos and kimchi elote to ramen pozole and matcha tres leches.",
  }],
  ["/philosophy", {
    title: "Why Mexican and Asian Flavors Belong Together · Mestizo Umami",
    description: "Learn how chile, fermentation, smoke, acid, masa, miso, soy, and sesame build a shared language across Mexican and Asian kitchens.",
  }],
  ["/pantry", {
    title: "Mexican-Asian Fusion Pantry Guide · Mestizo Umami",
    description: "Build a practical fusion pantry with chiles, masa, miso, gochujang, soy sauce, sesame, citrus, and the staples behind Mestizo Umami recipes.",
  }],
  ["/allergy", {
    title: "Allergy-Aware Mexican-Asian Recipes · Mestizo Umami",
    description: "Filter Mexican-Asian recipes for gluten, soy, sesame, dairy, eggs, fish, shellfish, nuts, peanuts, pork, and alcohol.",
  }],
  ["/chefs", {
    title: "Find a Fusion Chef · Mestizo Umami",
    description: "Discover chefs for Mexican-Asian fusion dinners and culinary experiences near you.",
  }],
  ["/vendor", {
    title: "Find Mexican and Asian Ingredients Near You · Mestizo Umami",
    description: "Use your ZIP code to find specialty ingredients and move recipe shopping lists to supported retailers.",
  }],
  ["/search", {
    title: "Search Recipes · Mestizo Umami",
    description: "Search the Mestizo Umami recipe calendar by dish, ingredient, flavor, or cooking style.",
  }],
]);

const privatePaths = ["/planner", "/notebook", "/recipe-shared", "/billing", "/api"];
const applicationPaths = new Set([
  "/planner", "/notebook", "/recipe-shared", "/billing/success", "/billing/cancelled",
]);

function xml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function attribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function safeJson(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function normalizePath(pathname) {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

function recipeStructuredData(recipe, canonical) {
  const dietMap = {
    glutenFree: "https://schema.org/GlutenFreeDiet",
    vegetarian: "https://schema.org/VegetarianDiet",
    vegan: "https://schema.org/VeganDiet",
  };
  const suitableForDiet = recipe.dietary.map((diet) => dietMap[diet]).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    image: [recipe.image],
    url: canonical,
    author: { "@type": "Organization", name: "Mestizo Umami" },
    prepTime: `PT${recipe.prepMinutes}M`,
    cookTime: `PT${recipe.cookMinutes}M`,
    totalTime: `PT${recipe.prepMinutes + recipe.cookMinutes}M`,
    recipeYield: `${recipe.serves} servings`,
    recipeCategory: recipe.category,
    recipeCuisine: ["Mexican", "Asian", "Fusion"],
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.instructions.map((text, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text,
    })),
    ...(suitableForDiet.length ? { suitableForDiet } : {}),
  };
}

export async function createSeoService(config) {
  const parsed = JSON.parse(await readFile(catalogPath, "utf8"));
  const recipes = parsed.recipes;
  const recipesBySlug = new Map(recipes.map((recipe) => [recipe.slug, recipe]));
  const base = config.publicBaseUrl;

  function metadata(pathname) {
    const normalized = normalizePath(pathname);
    if (normalized.startsWith("/recipe/")) {
      let slug;
      try {
        slug = decodeURIComponent(normalized.slice("/recipe/".length));
      } catch {
        slug = null;
      }
      const recipe = recipesBySlug.get(slug);
      if (recipe) {
        return {
          title: `${recipe.title} Recipe · Mestizo Umami`,
          description: `${recipe.description} ${recipe.origin}.`,
          canonical: `${base}/recipe/${encodeURIComponent(recipe.slug)}`,
          image: recipe.image,
          robots: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
          structuredData: recipeStructuredData(recipe, `${base}/recipe/${encodeURIComponent(recipe.slug)}`),
        };
      }
    }
    const core = corePages.get(normalized);
    const isPrivate = privatePaths.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`));
    const canonical = `${base}${core ? normalized : "/"}`;
    return {
      title: core?.title ?? "Mestizo Umami · The Trilingual Kitchen",
      description: core?.description ?? corePages.get("/").description,
      canonical,
      image: `${base}/images/social-card.jpg`,
      robots: core && !isPrivate
        ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
        : "noindex,nofollow",
      structuredData: core ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${base}/#organization`,
            name: "Mestizo Umami",
            url: base,
            logo: `${base}/icons/icon-512.png`,
          },
          {
            "@type": "WebSite",
            "@id": `${base}/#website`,
            name: "Mestizo Umami",
            url: base,
            description: corePages.get("/").description,
            publisher: { "@id": `${base}/#organization` },
            inLanguage: ["en", "es", "pt"],
          },
        ],
      } : null,
    };
  }

  return Object.freeze({
    statusCode(pathname) {
      const normalized = normalizePath(pathname);
      if (corePages.has(normalized) || applicationPaths.has(normalized)) return 200;
      if (!normalized.startsWith("/recipe/")) return 404;
      try {
        return recipesBySlug.has(decodeURIComponent(normalized.slice("/recipe/".length))) ? 200 : 404;
      } catch {
        return 404;
      }
    },

    render(template, pathname, nonce) {
      const meta = metadata(pathname);
      let html = template
        .replace(/<title>[^<]*<\/title>/i, `<title>${attribute(meta.title)}</title>`)
        .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="description" content="${attribute(meta.description)}" />`);
      const tags = [
        `<link rel="canonical" href="${attribute(meta.canonical)}" />`,
        `<meta name="robots" content="${attribute(meta.robots)}" />`,
        `<meta property="og:type" content="${pathname.startsWith("/recipe/") ? "article" : "website"}" />`,
        `<meta property="og:site_name" content="Mestizo Umami" />`,
        `<meta property="og:title" content="${attribute(meta.title)}" />`,
        `<meta property="og:description" content="${attribute(meta.description)}" />`,
        `<meta property="og:url" content="${attribute(meta.canonical)}" />`,
        `<meta property="og:image" content="${attribute(meta.image)}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${attribute(meta.title)}" />`,
        `<meta name="twitter:description" content="${attribute(meta.description)}" />`,
        `<meta name="twitter:image" content="${attribute(meta.image)}" />`,
        meta.structuredData ? `<script type="application/ld+json"${nonce ? ` nonce="${attribute(nonce)}"` : ""}>${safeJson(meta.structuredData)}</script>` : "",
      ].filter(Boolean).join("\n    ");
      html = html.replace("</head>", `    ${tags}\n  </head>`);
      return html;
    },

    robots() {
      const agents = ["OAI-SearchBot", "ChatGPT-User", "GPTBot", "Googlebot", "Bingbot", "*"];
      return `${agents.map((agent) => [
        `User-agent: ${agent}`,
        "Allow: /",
        "Disallow: /api/",
        "Disallow: /planner",
        "Disallow: /notebook",
        "Disallow: /recipe-shared",
        "Disallow: /billing/",
      ].join("\n")).join("\n\n")}\n\nSitemap: ${base}/sitemap.xml\n`;
    },

    llms() {
      return `# Mestizo Umami\n\nMestizo Umami is a trilingual Mexican-Asian fusion cooking application with recipes in English, Spanish, and Portuguese.\n\n## Primary pages\n\n- ${base}/recipes — Browse the 365-recipe calendar\n- ${base}/pantry — Pantry ingredients and practical guidance\n- ${base}/philosophy — The cooking philosophy behind the cuisine\n- ${base}/allergy — Allergy-aware recipe filtering\n\n## Recipe pages\n\nRecipe URLs use ${base}/recipe/{slug}. Each recipe states its ingredients, method, servings, timing, dietary tags, and shopping options.\n\n## Access and attribution\n\nThe application offers a seven-day trial followed by a paid subscription. Retailer links may be affiliate links, and Instacart shopping pages are created through Instacart's supported developer platform.\n`;
    },

    sitemap() {
      const coreUrls = [...corePages.keys()]
        .filter((pathname) => !privatePaths.some((prefix) => pathname.startsWith(prefix)))
        .map((pathname) => `${base}${pathname}`);
      const recipeUrls = recipes.map((recipe) => `${base}/recipe/${encodeURIComponent(recipe.slug)}`);
      const body = [...coreUrls, ...recipeUrls]
        .map((url) => `  <url><loc>${xml(url)}</loc></url>`)
        .join("\n");
      return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
    },
  });
}
