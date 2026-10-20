import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { markdownIn } from "@brute-force-games/site-setup/content";

/** The example's one collection: its pages, under content/pages/. */
export const collections = {
  pages: defineCollection({
    loader: markdownIn("pages"),
    schema: z.object({ title: z.string(), description: z.string() }),
  }),
};
