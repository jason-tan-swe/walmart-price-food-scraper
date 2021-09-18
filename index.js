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


const scrapeProduct = (async () => {
    // Get passed-in data
    const ingredient = '3';

    // Start puppeteer
    const browser = await puppeteer.launch({
        headless: false,
        args
    });

    // Create a new page to walmart
    const page = await browser.newPage();
    const popularQuery = '&sort=Popular%3ADESC';
    await Promise.all([
        // Go to the ingredient with the popular query
        page.goto(`https://www.walmart.ca/search?q=${ingredient}${popularQuery}`),
        page.waitForNavigation(),
    ]);

    // Perform HTML queries to get all the 'products' on the page
    const items = await page.evaluate(() => {
        const divs = document.querySelectorAll("div[data-automation='product']");
        return Array.from(divs).map((div => div.children[0].children[0].children[1].innerText));
    });

    // Initialize JSON for returning ingredients
    const productsInfo = [];

    // Iterate through each product
    for (const item of items){
        // Parse the product to get the price(s) parts
        const itemInfo = item.split('\n');
        const priceParsed = itemInfo.filter(item => {
           return (item.includes('¢') || item.includes('$'));
        });

        // Name of the product always found at zero'th index
        const itemName = itemInfo[0];

        // Add to the array of products available
        productsInfo.push({
            name: itemName,
            price: priceParsed[0],
            ppg: priceParsed[1] ? priceParsed[1] : 'NA',
        });
    }
    console.log(productsInfo);
    console.log(page.url().includes('blocked'));
    // TODO: Check if the ingredients is null!


    // For now, check if the first three are valid 'ingredients'


});

scrapeProduct();