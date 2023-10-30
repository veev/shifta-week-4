const puppeteer = require('puppeteer');

async function scrape() {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('http://books.toscrape.com/');

  const lightInTheAtticSelector = "#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a > img";

  await page.click(lightInTheAtticSelector);

  await page.waitForTimeout(1000);

  const result = await page.evaluate(() => {
    let title = document.querySelector('h1').innerText
    let price = document.querySelector('.price_color').innerText
    let availability = document.querySelector('.availability').innerText

    return {
      title,
      price,
      availability
    }
  });

  browser.close()
  return result
}

scrape().then((value) => {
  console.log(value);
})
