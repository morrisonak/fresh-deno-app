import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { promises as fs } from 'fs';

// ... [rest of your code, including the fetchLinks function] ...

const domain = "https://v0.dev";
const ignoredLinks = [
  "/",
  "/faq",
  "/agreement",
  "/policy",
  "https://vercel.com/privacy",
  "https://vercel.com/?utm_source=v0-site&utm_medium=banner&utm_campaign=home"
];

interface LinkWithLabel {
  url: string;
  label: string | undefined;
}

const fetchLinks = async (url: string): Promise<LinkWithLabel[]> => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const links = new Set<LinkWithLabel>();

    $('a').each((_, element) => {
      const url = $(element).attr('href');
      const label = $(element).find('img').attr('alt'); // Get the alt attribute from the nested img tag

      if (url && !ignoredLinks.includes(url)) {
        const fullUrl = url.startsWith('http') ? url : `${domain}${url}`; // Prepend domain if not already present

        const linkWithLabel: LinkWithLabel = { url: fullUrl, label };
        links.add(linkWithLabel);
      }
    });

    return Array.from(links);
  } catch (error) {
    console.error(`Error fetching the webpage: ${error}`);
    return [];
  }
};



const appendLinksToJson = async (newLinks: LinkWithLabel[], filename: string) => {
  try {
    // Read existing links from the file, if it exists
    let existingLinks: LinkWithLabel[] = [];
    try {
      const fileContents = await fs.readFile(filename, 'utf8');
      existingLinks = JSON.parse(fileContents);
    } catch (error) {
      console.log("File not found or empty. A new file will be created.");
    }

    // Combine new links with existing ones and remove duplicates
    const combinedLinks = Array.from(new Set([...existingLinks, ...newLinks]
                              .map(link => JSON.stringify(link))))
                              .map(str => JSON.parse(str));

    // Write the updated list of links to the file
    await fs.writeFile(filename, JSON.stringify(combinedLinks, null, 2));
    console.log(`Links appended to ${filename}`);
  } catch (error) {
    console.error(`Error updating file: ${error}`);
  }
};

// Example usage
const url = 'https://v0.dev'; // Replace with the URL you want to fetch
fetchLinks(url).then(links => {
  appendLinksToJson(links, 'links.json');
});
