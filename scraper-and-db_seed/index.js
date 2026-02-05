import puppeteer from "puppeteer";
import fs from "fs";

const CONFIG = {
  targetURL: "https://www.bershka.com/ae/men/clothes/view-all-c1010834564.html",
  targetProductsCount: 1000,
  scrollDelay: 2000,
  outputFile: "products.json",
};

const CLOTHING_KEYWORDS = [
  "t-shirt",
  "shirt",
  "polo",
  "blouse",
  "top",
  "jeans",
  "trousers",
  "pants",
  "shorts",
  "joggers",
  "jacket",
  "coat",
  "blazer",
  "puffer",
  "bomber",
  "hoodie",
  "sweatshirt",
  "sweater",
  "jumper",
  "cardigan",
  "dress",
  "skirt",
  "suit",
  "vest",
  "gilet",
  "waistcoat",
  "overshirt",
  "shacket",
  "baggy",
  "cargo",
  "denim",
  "chino",
];

const extractProductData = (card) => {
  const img = card.querySelector("img");
  const title = img?.alt?.trim().replace(/\s+/g, " ") || "";

  let price = null;
  const discountedEl = card.querySelector(".current-price-elem--discounted");
  if (discountedEl) {
    const rawPrice = (discountedEl.innerText || discountedEl.textContent || "")
      .trim()
      .replace(/\u00A0/g, " ");
    const match = rawPrice.match(/(\d+(?:\.\d+)?)/);
    price = match ? match[1] : null;
  }

  if (!price) {
    const regularPriceEl = card.querySelector(
      ".price-elem .current-price-elem",
    );
    if (regularPriceEl && !regularPriceEl.closest("s")) {
      const rawPrice = (
        regularPriceEl.innerText ||
        regularPriceEl.textContent ||
        ""
      )
        .trim()
        .replace(/\u00A0/g, " ");
      const match = rawPrice.match(/(\d+(?:\.\d+)?)/);
      price = match ? match[1] : null;
    }
  }

  if (!price) {
    const allPriceSpans = card.querySelectorAll("span[class*='current-price']");
    for (const span of allPriceSpans) {
      if (!span.closest("s") && !span.classList.contains("old-price-elem")) {
        const rawPrice = (span.innerText || span.textContent || "")
          .trim()
          .replace(/\u00A0/g, " ");
        const match = rawPrice.match(/(\d+(?:\.\d+)?)/);
        if (match) {
          price = match[1];
          break;
        }
      }
    }
  }

  const imgUrl = img?.getAttribute("data-original");
  const imageUrl = imgUrl ? imgUrl.split("?")[0] + "?w=1920" : "";

  const link = card.querySelector("a.grid-card-link");
  const productUrl = link?.href || "";

  const cardText = card.textContent.toLowerCase();
  const stockStatus = ["out of stock", "sold out"].some((k) =>
    cardText.includes(k),
  )
    ? "Out of Stock"
    : "Available";

  return { title, price, imageUrl, productUrl, stockStatus };
};

const scrapeClothes = async () => {
  console.log(`Scraping: ${CONFIG.targetURL}`);

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(CONFIG.targetURL, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });
    await page.waitForSelector("li.grid-item", { timeout: 30000 });

    const products = [];
    const processedUrls = new Set();
    let lastProcessedIndex = 0;
    let noChangeCount = 0;

    while (products.length < CONFIG.targetProductsCount) {
      await page.evaluate(() => window.scrollBy(0, 2500));
      await new Promise((r) => setTimeout(r, CONFIG.scrollDelay));

      const prevCount = products.length;
      const cardHandles = await page.$$("li.grid-item");
      const totalCards = cardHandles.length;

      for (let i = lastProcessedIndex; i < cardHandles.length; i++) {
        const cardHandle = cardHandles[i];
        await cardHandle.evaluate((el) =>
          el.scrollIntoView({ block: "center" }),
        );
        await new Promise((r) => setTimeout(r, 80));

        const data = await cardHandle.evaluate(extractProductData);

        const isClothing = CLOTHING_KEYWORDS.some(
          (k) =>
            data.title.toLowerCase().includes(k) ||
            data.productUrl.toLowerCase().includes(k),
        );

        if (data.title && data.productUrl && isClothing) {
          if (!processedUrls.has(data.productUrl)) {
            processedUrls.add(data.productUrl);
            products.push({
              title: data.title,
              price: data.price,
              currency: "AED",
              imageUrl: data.imageUrl,
              productUrl: data.productUrl,
              stockStatus: data.stockStatus,
            });
          }
        }
      }

      lastProcessedIndex = totalCards;

      const newProductsCount = products.length - prevCount;
      console.log(
        `Collected ${products.length} products out of ${totalCards} total (+${newProductsCount} new)`,
      );

      if (products.length >= CONFIG.targetProductsCount) break;

      if (prevCount === products.length) {
        noChangeCount++;
        if (noChangeCount >= 3) {
          console.log("No new products found. Stopping.");
          break;
        }
      } else {
        noChangeCount = 0;
      }
    }

    fs.writeFileSync(CONFIG.outputFile, JSON.stringify(products, null, 2));
    console.log(`Saved ${products.length} products to ${CONFIG.outputFile}`);

    return products;
  } finally {
    await browser.close();
  }
};

scrapeClothes()
  .then(() => console.log("Done!"))
  .catch((err) => {
    console.error("Failed:", err);
    process.exit(1);
  });
