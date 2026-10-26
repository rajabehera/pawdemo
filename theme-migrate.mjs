import fs from "fs";

const file = process.argv[2];
let src = fs.readFileSync(file, "utf8");

// hex group -> CSS variable
const groups = {
  "--pp-brand": ["123b2d","183b2d","1b4631","173c2c","1d412f","254634","264639","274b38","24583b","264d35","315540","445749","48644e","3e644b","315d46","512f64"],
  "--pp-hover": ["20543d"],
  "--pp-mid": ["23563c","315f42","32694b","3f6a4c","2f6b3f","65816a","659174","567c6c","789680"],
  "--pp-muted": ["53665d","506356","52675a","55655a","728175"],
  "--pp-tint": ["e3eee0","edf5e8","eff5ec","e4eee0","e6eee3","e9f0e5","eff3e9","d9e8d6","e4ede2"],
  "--pp-border": ["dce5dc","d3e3cf","cbdccc","cbdccf","d9e4d8","b5c7b4","a4b7a4","e0e8de","e1e9db","d7dedd","e8eee6","e8eee6","e8dde9","e8dde9"],
  "--pp-section": ["f2eaf4","f2eee3","eaf2ed"],
  "--pp-bg-alt": ["f1f4ec","f7f9f4","f7f1eb"],
  "--pp-bg": ["f8f7f1","fbf7f0"],
};

const utilities = "bg|text|border|ring|divide|from|to|via|fill|stroke|outline|decoration";

for (const [cssVar, hexes] of Object.entries(groups)) {
  for (const hex of new Set(hexes)) {
    const re = new RegExp(`\\b(${utilities})-\\[#${hex}\\](?:\\/\\d+)?`, "gi");
    src = src.replace(re, (_, util) =>
      util === "bg" ? `bg-[var(${cssVar})]` : `${util}-[color:var(${cssVar})]`
    );
  }
}

fs.writeFileSync(file, src);
console.log("Done. Review the diff.");