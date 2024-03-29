const puppeteer = require('puppeteer-extra');

async function getAllGamesFromWikiListPageID(pageID) {
  const link = `https://en.wikipedia.org/?curid=${pageID}`;
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto(link);
  console.log('Page Loaded');
  await page.waitForTimeout(1000); // cause wikipedia sucks at loading?

  const gameListTable = await page.$('table#softwarelist');

  // get the indexes of the columns we need in in the table
  const columnLabels = await gameListTable.$$eval(
    'thead > tr:nth-child(1) > th',
    (headingElements) => {
      return headingElements.map((el) => el.innerText);
    }
  );
  const neededColumns = ['Title', 'Genre(s)', 'Developer(s)', 'Publisher(s)'];

  const requiredIndexes = neededColumns.map(
    (neededColumn) => neededColumn === columnLabels.indexOf(neededColumn)
  );

  // for each entry(tr) in the table body, find the data in the required indexes
  const data = await gameListTable.evaluate(
    (table, _requiredIndexes, _neededColumns) => {
      const entries = Array.from(table.querySelectorAll('tbody tr'));
      const requiredData = {};
      entries.forEach((entry) => {
        const wikiPageLink =
          entry.firstElementChild.querySelector('a:not(.new)'); // the first entry is the heading i.e gameName
        if (!wikiPageLink) return; // forget the entry if it has no wikipedia page

        const requiredChildren = _requiredIndexes.map(
          (index) => entry.children[index]
        );
        let entryData = requiredChildren.map((child, index) => {
          const key = _neededColumns[index];
          let value;

          // if its a list, make an array
          if (child.querySelector('.hlist.hlist-separated')) {
            value = Array.from(child.querySelectorAll('li')).map(
              (li) => li.innerText
            );
          } else if (key.endsWith('(s)')) value = [child.innerText];
          else value = child.innerText;

          return [key, value];
        });
        entryData.push(['wikiPageTitle', wikiPageLink.title]);

        entryData = Object.fromEntries(entryData);
        requiredData[entryData.Title] = entryData;
      });
      return requiredData;
    },
    requiredIndexes,
    neededColumns
  );

  browser.close();
  return data;
}

module.exports = getAllGamesFromWikiListPageID;
