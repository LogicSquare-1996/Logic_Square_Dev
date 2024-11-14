const cheerio = require("cheerio");
const puppeteer = require("puppeteer-extra");
const Stealth = require("puppeteer-extra-plugin-stealth");
const ScrappingData = require("../../models/scrappedData");

puppeteer.use(Stealth());

module.exports = {
  async getScrapData(req, res) {
    try {
      const baseUrl = "https://www.podchaser.com";
      const { platform, country, category } = req.params;
      const date = req.query.date;

      // Encode each part of the URL to handle spaces and special characters
      const encodedPlatform = encodeURIComponent(platform);
      const encodedCountry = encodeURIComponent(country);
      const encodedCategory = encodeURIComponent(category);

      const url = `${baseUrl}/charts/${encodedPlatform}/${encodedCountry}/${encodedCategory}?date=${date}`;
      console.log(url);

      // Launch Puppeteer
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent("Mozilla/5.0 ...");

      // Go to the URL
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await page.screenshot({ path: "./snips/screenshot.png", fullPage: true });

      const html = await page.content();
      await browser.close();

      const $ = cheerio.load(html);
      const dateText = $("._u3fo9b").first().text().trim();

      const podcastData = [];
      $("tbody tr").each((i, row) => {
        if (i >= 2) return false;

        const rank = $(row).find("._sn01r5").text().trim();
        const podcastLink = $(row).find("._1x1973c").attr("href");
        const podcastTitle = $(row).find("._1x1973c").text().trim();
        const podcastDescription = $(row).find("div._1xligvk").find("p._15pjoyp").text().trim();
        const imageLink = $(row).find("div._1w3aw69 a img").attr("src");

        const categories = $(row).find("._j8ps0c a").map((i, el) => ({
          categoryText: $(el).text().trim(),
          categoryLink: $(el).attr("href")
        })).get();

        const networks = $(row).find("._j8ps0c a._1009vu8").map((i, el) => ({
          networkText: $(el).text().trim(),
          networkLink: $(el).attr("href")
        })).get();

        const createdBy = $(row).find("._d8pg30").text().trim();

        podcastData.push({
          url,
          platform,
          country,
          category,
          dateOfData: dateText,
          rank,
          imageLink,
          title: podcastTitle,
          link: podcastLink,
          description: podcastDescription,
          categories,
          networks,
          createdBy
        });
      });

      await ScrappingData.insertMany(podcastData);

      return res.status(200).json({ error: false, date: dateText, podcasts: podcastData });
    } catch (error) {
      return res.status(500).json({ error: true, reason: error.message });
    }
  },
};
