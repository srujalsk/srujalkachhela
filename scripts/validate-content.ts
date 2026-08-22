import { validateAllContent } from "../lib/content";

try {
  const validated = validateAllContent();
  console.log(`Content validation OK — ${validated.length} files:`);
  for (const entry of validated) {
    console.log(`  ✓ ${entry}`);
  }
} catch (error) {
  console.error("Content validation FAILED");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
