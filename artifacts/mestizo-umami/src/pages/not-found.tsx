import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center"
    >
      <div className="font-display text-[8rem] md:text-[12rem] leading-none text-white/5 select-none mb-4">
        404
      </div>
      <div className="uppercase tracking-[0.3em] text-primary text-xs font-medium mb-6 flex items-center gap-3">
        <span className="h-[1px] w-8 bg-primary" />
        Page Not Found
        <span className="h-[1px] w-8 bg-primary" />
      </div>
      <h1 className="font-display text-3xl md:text-5xl text-foreground mb-4">
        This dish isn't on the menu.
      </h1>
      <p className="text-muted-foreground max-w-sm mb-10 leading-relaxed">
        The page you're looking for may have moved, or never existed. Let's get you back to the kitchen.
      </p>
      <Link href="/">
        <Button
          size="lg"
          data-testid="button-notfound-home"
          className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest px-8 h-14 flex items-center gap-2 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to the Kitchen
        </Button>
      </Link>
    </motion.div>
  );
}
