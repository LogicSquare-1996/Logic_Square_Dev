const cheerio = require("cheerio");
const puppeteer = require("puppeteer-extra");
const Stealth = require("puppeteer-extra-plugin-stealth");
const ScrappingData = require("../../models/scrappedData");

puppeteer.use(Stealth());

module.exports = {
  async getScrapData(req, res) {
    try {

      const {url} = req.query
      // const url =
      //   "https://www.podchaser.com/charts/apple/us/science?date=2024-11-11";
      
      
      

      // Launch Puppeteer
      // const browser = await puppeteer.launch();
      // const page = await browser.newPage();
      // await page.setViewport({ width: 1920, height: 1080 });
      // await page.setUserAgent(
      //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
      // );

      // // Go to the URL
      // await page.goto(url, { waitUntil: "networkidle2" });

      // // Wait for 5 seconds
      // await new Promise((resolve) => setTimeout(resolve, 5000));

      // // Take a screenshot for debugging purposes
      // await page.screenshot({ path: "./snips/screenshot.png", fullPage: true });
      // console.log("Screenshot saved as screenshot.png");

      // // Get the page content after the delay
      // const html = await page.content();

      // // Close the browser
      // await browser.close();

      // // Load the HTML into Cheerio
      // const $ = cheerio.load(html);

      // // Extract the date text
      // const dateText = $("._u3fo9b").first().text().trim();

      // // Extract table rows (for podcast data)
      // const podcastData = [];
      // $("tbody tr").each((i, row) => {
      //   if (i >= 10) return false;
      //   // const rank = $(row).find('td').eq(0).find('span._sn01r5').text().trim() || "N/A"; // Default to "N/A" if rank is missing
      //   const rank = $(row).find("._sn01r5").text().trim();
      //   const podcastLink = $(row).find("._1x1973c").attr("href");
      //   const podcastTitle = $(row).find("._1x1973c").text().trim();
      //   const podcastDescription = $(row)
      //     .find("div._1xligvk")
      //     .find("p._15pjoyp")
      //     .text()
      //     .trim(); // Extract description
      //   const imageLink = $(row).find("._1w3aw69 a img").attr("src");
      //   const categoryLinks = [];
      //   $(row)
      //     .find("._j8ps0c a")
      //     .each((i, category) => {
      //       categoryLinks.push($(category).attr("href"));
      //     });

      //   const networkLink = $(row).find("._j8ps0c a._1009vu8").attr("href");
      //   const networkText = $(row).find("._j8ps0c a._1009vu8").text().trim();
      //   const createdBy = $(row).find("._d8pg30").text().trim();

          
      //   // Handle missing Power Score
      //   // const powerScore = $(row).find('td').eq(4).find('button').length > 0
      //   //   ? "N/A" // If Power Score button is present, mark as N/A
      //   //   : $(row).find('td').eq(4).text().trim() || "N/A"; // Default to "N/A" if empty

      //   // Push the extracted data into the array
      //   podcastData.push({
      //     rank,
      //     imageLink,
      //     title: podcastTitle,
      //     link: podcastLink,
      //     description: podcastDescription,
      //     categoryLinks,
      //     networkLink,
      //     networkText,
      //     createdBy,
      //     platform,
      //     country,
      //     category,
      //     // powerScore
      //   });
      // });

      // Log the extracted podcast data for verification
      // console.log("Podcast Data:", podcastData);

      // Return the extracted date and podcast data in the response
      return res
        .status(200)
        .json({ error: false, date: dateText, podcasts: podcastData });
    } catch (error) {
      return res.status(500).json({ error: true, reason: error.message });
    }
  },
};
