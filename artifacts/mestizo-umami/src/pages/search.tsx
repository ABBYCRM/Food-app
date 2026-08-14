import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { recipes } from "../data/recipes";
import { Search, ArrowRight } from "lucide-react";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Slight delay to ensure page is rendered before focus
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []);

  const results = query.length > 1
    ? recipes.filter(r =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.category.toLowerCase().includes(query.toLowerCase()) ||
        r.tags.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
        r.origin.toLowerCase().includes(query.toLowerCase()) ||
        r.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-8 md:pt-16 pb-12 px-5 md:px-12 max-w-4xl mx-auto w-full flex flex-col"
    >
      {/* Search input */}
      <div className="relative mb-10 md:mb-16">
        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 text-primary" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search recipes, origins, or tags..."
          data-testid="input-search"
          aria-label="Search recipes"
          className="w-full bg-transparent border-b-2 border-white/10 py-4 md:py-6 pl-10 md:pl-14 pr-6 text-xl sm:text-2xl md:text-4xl font-display font-light text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="flex-1">
        {query.length > 1 && (
          <div className="mb-4 md:mb-6 text-xs tracking-widest uppercase text-muted-foreground">
            {results.length} {results.length === 1 ? 'result' : 'results'} found
          </div>
        )}

        <AnimatePresence>
          {query.length > 1 && results.map((recipe, i) => (
            <motion.div
              key={recipe.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link href={`/recipe/${recipe.slug}`} data-testid={`link-search-result-${recipe.slug}`}>
                <div className="group flex items-center gap-4 md:gap-6 py-4 md:py-6 border-b border-white/5 hover:bg-white/[0.02] -mx-5 px-5 md:-mx-6 md:px-6 transition-colors rounded-xl cursor-pointer">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 shrink-0 rounded-lg overflow-hidden border border-white/10">
                    <img
                      src={recipe.thumbImage}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] tracking-widest text-primary uppercase mb-1 md:mb-2">
                      {recipe.category} • {recipe.origin}
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-foreground group-hover:text-primary transition-colors mb-1 md:mb-2 leading-tight">
                      {recipe.title}
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-sm line-clamp-1 hidden sm:block">
                      {recipe.subtitle}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all shrink-0" />
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>

        {query.length > 1 && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center text-muted-foreground"
          >
            <p className="font-display text-2xl mb-3">Nothing found for "{query}".</p>
            <p className="text-sm tracking-widest uppercase">Try a different term, ingredient, or origin.</p>
          </motion.div>
        )}

        {/* Default state: popular categories */}
        {query.length <= 1 && (
          <div className="pt-6 md:pt-8 opacity-70">
            <h4 className="text-xs uppercase tracking-widest text-primary mb-5 md:mb-6">Popular Categories</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["Tacos", "Desserts", "Seafood", "Snacks", "Rice & Noodles", "Wings"].map(cat => (
                <Link
                  key={cat}
                  href={`/recipes?category=${encodeURIComponent(cat)}`}
                  data-testid={`link-search-category-${cat.toLowerCase().replace(/\s/g, '-')}`}
                  className="font-display text-lg md:text-xl hover:text-primary transition-colors py-3 px-4 rounded-xl border border-white/5 hover:border-primary/30 hover:bg-primary/5 block"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
