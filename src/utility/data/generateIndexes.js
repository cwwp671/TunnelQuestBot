const cheerio = require("cheerio");
const fetch = require("node-fetch");
const fs = require("fs");

const BASE_URL = "http://wiki.project1999.com";
const CATEGORY_URL = "/index.php?title=Category:";
const httpsAgent = require("../wikiHandler");

async function get_items_in_category(category) {
  const item_map = new Map();
  let next_page = BASE_URL + CATEGORY_URL + category;
  while (next_page) {
    const page = await fetch(next_page, { agent: httpsAgent })
      .then((response) => response.text())
      .then((text) => {
        return text;
      });
    const $ = cheerio.load(page);
    const next_page_tag = $('a:contains("next 200")');
    if (next_page_tag[0] !== undefined) {
      next_page = BASE_URL + next_page_tag[0].attribs.href;
    } else {
      next_page = null;
    }

    const found_items = $("div #mw-pages li a");
    found_items.map((i, item) => {
      item_map[item.attribs.title.toUpperCase()] = item.attribs.href;
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return item_map;
}

get_items_in_category("Items").then((item_map) => {
  fs.writeFileSync("items.json", JSON.stringify(item_map));
});

get_items_in_category("Spells").then((spells_map) => {
  fs.writeFileSync("spells.json", JSON.stringify(spells_map));
});
