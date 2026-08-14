import { motion } from "framer-motion";
import { Link } from "wouter";
import { recipes } from "../data/recipes";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Home() {
  const featured = recipes[0];
  const carousel = recipes.slice(1, 6);

  const categories = ["All", "Tacos", "Seafood", "Rice & Noodles", "Snacks", "Desserts", "Wings"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col"
    >
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] md:h-[90vh] min-h-[500px] flex items-end pb-12 md:pb-24 px-6 md:px-12">
        <div className="absolute inset-0 z-0">
          <img
            src={featured.heroImage}
            alt={featured.title}
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="uppercase tracking-[0.3em] text-primary text-sm font-medium mb-4 flex items-center gap-3">
              <span className="h-[1px] w-12 bg-primary" />
              Today's Featured
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-tight mb-4 text-white">
              {featured.title}
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-white/80 font-light mb-8 max-w-2xl">
              {featured.subtitle}
            </p>
            <Link href={`/recipe/${featured.slug}`} data-testid="link-hero-start-cooking">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm tracking-wider uppercase h-12 md:h-14 px-6 md:px-8 group">
                Start Cooking
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* The Philosophy */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="font-display text-xl sm:text-2xl md:text-4xl leading-relaxed text-muted-foreground"
        >
          <span className="text-primary">Mestizo Umami</span> is born from a single belief: that the warmth of a Mexican kitchen and the precise depth of Japanese technique are just two dialects of the same language.
          Opulent, alive, and meant to be shared.
        </motion.p>
      </section>

      {/* Categories */}
      <section className="px-6 md:px-12 py-8 border-t border-white/5">
        <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {categories.map((cat, i) => (
            <Link
              key={cat}
              href={`/recipes${cat !== 'All' ? `?category=${encodeURIComponent(cat)}` : ''}`}
              data-testid={`link-category-${cat.toLowerCase().replace(/\s/g, '-')}`}
            >
              <div
                className={`flex-shrink-0 px-5 py-2 rounded-full border text-xs tracking-widest uppercase transition-colors hover:bg-primary/10 hover:border-primary/50 cursor-pointer ${
                  i === 0 ? 'bg-primary text-primary-foreground border-primary' : 'text-muted-foreground border-white/10'
                }`}
              >
                {cat}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Today's Kitchen Carousel */}
      <section className="py-12 md:py-16 pl-6 md:pl-12 overflow-hidden">
        <div className="flex items-center justify-between pr-6 md:pr-12 mb-8 md:mb-10">
          <h2 className="font-display text-3xl md:text-4xl text-foreground">Today's Kitchen</h2>
          <Link
            href="/recipes"
            data-testid="link-view-all-recipes"
            className="flex items-center gap-1 text-xs tracking-wider text-primary hover:text-primary/80 uppercase"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex overflow-x-auto gap-4 md:gap-6 pb-10 pr-6 md:pr-12 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
          {carousel.map((recipe, index) => (
            <motion.div
              key={recipe.slug}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="snap-start snap-always shrink-0 w-[240px] sm:w-[280px] md:w-[320px] group cursor-pointer"
            >
              <Link href={`/recipe/${recipe.slug}`} data-testid={`link-carousel-${recipe.slug}`}>
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4 border border-white/5">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img
                    src={recipe.thumbImage}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-display text-xl md:text-2xl text-white mb-2 leading-tight">{recipe.title}</h3>
                    <div className="flex items-center gap-3 text-xs tracking-widest text-primary uppercase">
                      <span>{recipe.prepTime} Prep</span>
                      <span>•</span>
                      <span>{recipe.difficulty}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
