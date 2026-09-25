import RecipeListing from "@/components/recipes/recipeListing";
import { sections } from "@/lib/recipes";

export default function Page() {
  return <RecipeListing {...sections.popular} />;
}
