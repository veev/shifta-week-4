const fs = require('fs');
const puppeteer = require('puppeteer');

const yelpData = JSON.parse(fs.readFileSync('.data/pizza.json', 'utf-8'));
const baseURL = "https://www.yelp.com";

console.log(yelpData);

async function run() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  for (let i = 0; i < yelpData.businesses.length; i++) {
    const id = `${yelpData.businesses[i].id}`
    const filename = `${id}.json`
    console.log(i, id)
    // call a function that grabs the menu items for each restaurant
    await getRestaurantInfo(page, id, filename)
  }

  await browser.close();
}

async function getRestaurantInfo(page, id, filename) {
  const queryStringBiz = `${baseURL}/biz/${id}`;
  const queryStringMenu = `${baseURL}/menu/${id}`;

  await page.waitForTimeout(randomTimeFromInterval(900,1200));
  await page.goto(queryStringBiz)

  let obj = {};

  const NAME_SELECTOR = "body > yelp-react-root > div:nth-child(1) > div.photoHeader__09f24__nPvHp.css-1qn0b6x > div.photo-header-content-container__09f24__jDLBB.css-1qn0b6x > div.photo-header-content__09f24__q7rNO.css-2wl9y > div > div > div.headingLight__09f24__N86u1.css-na7xnn > h1"

  const name = await page.evaluate((sel) => {
    let element = document.querySelector(sel);
    return element ? element.innerText : null
  }, NAME_SELECTOR);

  obj.name = name;
  console.log(name);

  await page.waitForTimeout(randomTimeFromInterval(900,1200));
  await page.goto(queryStringMenu)

  const MENU_ROW_ITEM = "#super-container > div.container.biz-menu > div.clearfix.layout-block.layout-a > div.column.column-alpha > div > div > div"
  const menuItems = await page.evaluate((sel) => {
    let items = []
    const rows = document.querySelectorAll(sel)
    rows.forEach( row => {
      let menuItem = {}
      if (row.querySelector('h4')) {
        menuItem.name = row.querySelector('h4').innerText
      }
      if (row.querySelector('p')) {
        menuItem.description = row.querySelector('p').innerText
      }
      if (row.querySelector('div.menu-item-prices.arrange_unit > table > tbody')) {
        const prices = row.querySelectorAll('div.menu-item-prices.arrange_unit > table > tbody > tr')
        const priceArray = []
        prices.forEach( price => {
          let priceInfo = {}
          if (price.querySelector('th')) {
            priceInfo.description = price.querySelector('th').innerText
          }
          if (price.querySelector('td')) {
            priceInfo.amount = price.querySelector('td').innerText
          }
          priceArray.push(priceInfo)
        })
        menuItem.price = priceArray
      }
      items.push(menuItem)
    })
    return items
  }, MENU_ROW_ITEM)

  if (menuItems.length > 0) {
    obj.restaurant_id = id;
    obj.menu = menuItems;

    fs.writeFileSync(`.data/pizza-menus/${filename}`, JSON.stringify(obj, null, 4), 'utf8');
    console.log(`saved menu for ${obj.name}`);
  } else {
    console.log(`no menu for ${id}`)
  }
}

function randomTimeFromInterval(min,max) {
  return Math.floor(Math.random()*(max-min+1) +min);
}

run()