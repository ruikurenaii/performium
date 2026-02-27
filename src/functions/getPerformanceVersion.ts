const date = new Date();

const performanceVersions: Record<string, string> = {
  "040625": "v20250406 (v1.0.0)",
  "041325": "v20250413 (v1.1.0)",
  "042925": "v20250429 (v1.2.0)",
	"050725": "v20250507 (v1.3.0)",
  "051425": "v20250514 (v1.4.0)",
  "060925": "v20250609 (v1.5.0)",
	"080325": "v20250803 (v1.6.0)",
  "011726": "v20260117 (v1.6.1)",
  "020426": "v20260204 (v1.6.2)",
  "021426": "v20260214 (v1.7.0)",
  "test": `v${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")} (v1.8.0b)`
};

export async function getPerformanceVersion(version: string): Promise<string> {
  return performanceVersions[version] ?? "Unknown version";
}