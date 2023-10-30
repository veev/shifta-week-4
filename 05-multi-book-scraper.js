const puppeteer = require('puppeteer');

async function scrape() {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  const baseURL = 'http://books.toscrape.com/'

  // Navigate the page to a URL
  await page.goto(baseURL);
  console.log(`Navigating to ${baseURL}`);

  await page.waitForSelector('.page_inner');

  let urls = await page.$$eval('section ol > li', links => {
    links = links.map(el => el.querySelector('h3 > a').href)
    return links
  });

  // console.log(urls);

  let pagePromise = (url) => new Promise(async(resolve, reject) => {
    let obj = {}
    let newPage = await browser.newPage();
    await newPage.goto(url);
    obj['title'] = await newPage.$eval('h1', text => text.innerText);
    obj['price'] = await newPage.$eval('.price_color', text => text.innerText);
    obj['numAvailable'] = await newPage.$eval('.instock.availability', text => {
      let stockAvail = text.textContent.split("(")[1].split(" ")[0]
      return stockAvail;
    });
    obj['description'] = await newPage.$eval('#content_inner > article > p', text => text.textContent);
    resolve(obj);
    await newPage.close();
  })

  for (let i = 0; i < urls.length; i++) {
    // call function to get data from each page
    let currentPageData = await pagePromise(urls[i]);
    console.log(currentPageData);
  }

  browser.close()
  // return result
}

scrape();
