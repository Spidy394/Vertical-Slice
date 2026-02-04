import puppeteer from "puppeteer";
import fs from "fs";

const CONFIG = {
  targetURL: "https://www.bershka.com/ae/men/clothes/view-all-c1010834564.html",
  targetProductsCount: 1000,
  scrollDelay: 3000,
  outputFile: "products.json",
};

const scrapCloths = async () => {
  console.log(`Starting to scrape: ${CONFIG.targetURL}`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log("Navigating to the page...");
    await page.goto(CONFIG.targetURL, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    console.log("Detecting products...");
    await page.waitForSelector("li.grid-item", { timeout: 10000 });

    let products = [];
    let noChangeCount = 0;

    console.log("Collecting products...\n");

    while (products.length < CONFIG.targetProductsCount) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise((resolve) => setTimeout(resolve, CONFIG.scrollDelay));

      const currentProducts = await page.evaluate(() => {
        const cards = document.querySelectorAll("li.grid-item");
        const data = [];
        const totalCards = cards.length;

        cards.forEach((card) => {
          const img = card.querySelector("img");
          const title = img?.alt?.trim().replace(/\s+/g, " ") || "";

          const priceEl = card.querySelector('[data-qa-anchor="productPrice"]');
          const priceMatch = priceEl?.textContent.match(/([\d,]+\.?\d*)/);
          const price = priceMatch ? priceMatch[1].replace(/,/g, "") : "N/A";

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

          const clothingKeywords = [
            "t-shirt", "shirt", "polo", "blouse", "top",
            "jeans", "trousers", "pants", "shorts", "joggers",
            "jacket", "coat", "blazer", "puffer", "bomber",
            "hoodie", "sweatshirt", "sweater", "jumper", "cardigan",
            "dress", "skirt", "suit",
            "vest", "gilet", "waistcoat",
            "overshirt", "shacket",
            "baggy", "cargo", "denim", "chino"
          ];

          const isClothing = clothingKeywords.some(
            (k) =>
              title.toLowerCase().includes(k) ||
              productUrl.toLowerCase().includes(k),
          );

          if (title && productUrl && isClothing) {
            data.push({
              title,
              price,
              currency: "AED",
              imageUrl,
              productUrl,
              stockStatus,
            });
          }
        });

        return { products: data, totalCards };
      });

      const previousCount = products.length;
      currentProducts.products.forEach((product) => {
        if (!products.find((p) => p.productUrl === product.productUrl)) {
          products.push(product);
        }
      });

      const newProductsCount = products.length - previousCount;
      console.log(
        `Collected ${products.length} products out of ${currentProducts.totalCards} total (+${newProductsCount} new)`,
      );

      if (products.length === previousCount) {
        noChangeCount++;
        if (noChangeCount >= 5) {
          console.log("Stopped: No new products loaded after 5 attempts.");
          break;
        }
      } else {
        noChangeCount = 0;
      }

      const reachedEnd = await page.evaluate(
        () =>
          window.innerHeight + window.scrollY >=
          document.body.scrollHeight - 100,
      );
      if (reachedEnd && noChangeCount >= 3) {
        console.log("Stopped: Reached end of page.");
        break;
      }
    }

    if (products.length >= CONFIG.targetProductsCount) {
      console.log("Stopped: Target product count reached.");
    }

    console.log(`Collected ${products.length} products.`);

    fs.writeFileSync(CONFIG.outputFile, JSON.stringify(products, null, 2));
    console.log(`Saved to ${CONFIG.outputFile}`);

    await browser.close();
    return products;
  } catch (error) {
    console.error("Error:", error);
    if (browser) await browser.close();
    throw error;
  }
};

scrapCloths()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed:", error);
    process.exit(1);
  });