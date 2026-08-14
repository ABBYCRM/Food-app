import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { recipes } from "../data/recipes";
import { Search, ArrowRight } from "lucide-react";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = query.length > 2 
    ? recipes.filter(r => 
        r.title.toLowerCase().includes(query.toLowerCase()) || 
        r.category.toLowerCase().includes(query.toLowerCase()) ||
        r.tags.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
        r.origin.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-24 pb-12 px-6 md:px-12 max-w-4xl mx-auto w-full flex flex-col"
    >
      <div className="relative mb-16">
        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-primary" />
        <input 
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search recipes, ingredients, or origins..."
          className="w-full bg-transparent border-b-2 border-white/10 py-6 pl-16 pr-6 text-2xl md:text-4xl font-display font-light text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="flex-1">
        {query.length > 2 && (
          <div className="mb-6 text-sm tracking-widest uppercase text-muted-foreground">
            {results.length} results found
          </div>
        )}

        <AnimatePresence>
          {query.length > 2 && results.map((recipe, i) => (
            <motion.div
              key={recipe.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/recipe/${recipe.slug}`}>
                <div className="group flex items-center gap-6 py-6 border-b border-white/5 hover:bg-white/[0.02] -mx-6 px-6 transition-colors rounded-xl cursor-pointer">
                  <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-lg overflow-hidden border border-white/10">
                    <img src={recipe.thumbImage} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] tracking-widest text-primary uppercase mb-2">
                      {recipe.category} • {recipe.origin}
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl text-foreground group-hover:text-primary transition-colors mb-2">
                      {recipe.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-1 hidden md:block">
                      {recipe.subtitle}
                    </p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all shrink-0 hidden sm:block" />
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {query.length > 2 && results.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="py-12 text-center text-muted-foreground"
          >
            <p className="font-display text-2xl">Nothing found for "{query}".</p>
            <p className="mt-4 text-sm tracking-widest uppercase">Try a different term or ingredient.</p>
          </motion.div>
        )}

        {query.length <= 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-t border-white/5 mt-12 opacity-50">
            <div>
              <h4 className="text-xs uppercase tracking-widest text-primary mb-4">Popular Categories</h4>
              <div className="flex flex-col gap-3">
                {["Tacos", "Desserts", "Seafood", "Snacks"].map(cat => (
                  <Link key={cat} href={`/recipes?category=${cat}`} className="font-display text-xl hover:text-primary transition-colors">
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
