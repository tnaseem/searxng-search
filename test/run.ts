import { buildSearchUrl, getSettings, normaliseBaseUrl } from "../src/utils/settings";
import { getAutoSearchResults, normaliseSuggestions } from "../src/utils/handleResults";

async function main() {
  const settings = getSettings();
  console.log("baseUrl:", settings.baseUrl);
  console.log("searchUrl:", buildSearchUrl("hello world & co"));
  console.log("imagesUrl:", buildSearchUrl("cats", "images"));
  console.log("normalise:", [normaliseBaseUrl("search.naseem.uk/"), normaliseBaseUrl("https://x.test/search"), normaliseBaseUrl("")]);

  const response = await fetch(`${settings.baseUrl}/autocompleter?q=${encodeURIComponent("ray")}`, {
    headers: { Accept: "application/json", "User-Agent": "searxng-search-raycast/1.0" },
  });
  const json = await response.json();
  console.log("raw shape:", Array.isArray(json) ? `array(${json.length})` : typeof json);
  console.log("normalised:", JSON.stringify(normaliseSuggestions(json).slice(0, 4), null, 1));

  console.log("synthetic flat array:", JSON.stringify(normaliseSuggestions(["one", "two", { text: "three", description: "d" }])));
  console.log("synthetic phrase objects:", JSON.stringify(normaliseSuggestions([{ phrase: "alpha" }, { phrase: "beta" }])));
  console.log("synthetic object:", JSON.stringify(normaliseSuggestions({ suggestions: ["x", { text: "y" }] })));

  const results = await getAutoSearchResults("ray");
  console.log("live results:", results.length);
  console.log(JSON.stringify(results.slice(0, 3), null, 1));
}

main().catch((error) => {
  console.error("FAILED", error);
  process.exit(1);
});
