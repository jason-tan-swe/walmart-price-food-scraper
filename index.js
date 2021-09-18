const puppeteer = require('puppeteer');

// Options for puppeteer
const args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-infobars',
    '--window-position=0,0',
    '--ignore-certifcate-errors',
    '--ignore-certifcate-errors-spki-list',
    '--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.0 Safari/537.36"'
    ];


(async () => {
    // Start puppeteer
    const browser = await puppeteer.launch({
        headless: false,
        args
    });

    // Create a new page to walmart
    const page = await browser.newPage();
    await Promise.all([
        // TODO: Create a route string for any specific
        // ingredient (SENT TO US!)
        page.goto('https://www.walmart.ca/search?q=apple'),
        page.waitForNavigation(),
    ]);

    // Get the items
    const itemInfo = await page.evaluate(() => {
        // Path to items
        const divs = document.querySelectorAll("div[data-automation='product']");
        const productRef = Array.from(divs)[0].children[0].children[0].children[1];
        const productText = productRef.children[1].children[0].innerText;
        const productPrice = productRef.children[2].children[0].children[0].children[0].children[0].innerText
        return {productText, productPrice};
    });
    // For debugging
    console.log(itemInfo.productText, itemInfo.productPrice);

    // TODO: Instead of getting one item,
    // loop through all possible items and
    // check to see if ingredient SENT TO US
    // is inside any of the content (return first one for now!)

})();