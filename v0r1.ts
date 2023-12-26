import { fetch } from 'node-fetch';
import cheerio from 'cheerio';
import { promises as fs } from 'fs';
import path from 'path';

const domain = "https://v0.dev";
const ignoredLinks = [
  "/",
  "/faq",
  "/agreement",
  "/policy",
  "https://vercel.com/privacy",
  "https://vercel.com/?utm_source=v0-site&utm_medium=banner&utm_campaign=home"
];

interface LinkWithLabelAndDate {
  url: string;
  label: string | undefined;
  dateAdded: string;
}

const fetchLinks = async (url: string): Promise<LinkWithLabelAndDate[]> => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const links = new Set<LinkWithLabelAndDate>();

    $('a').each((_, element) => {
      const url = $(element).attr('href');
      const label = $(element).find('img').attr('alt'); // Get the alt attribute from the nested img tag

      if (url && !ignoredLinks.includes(url)) {
        const fullUrl = url.startsWith('http') ? url : `${domain}${url}`; // Prepend domain if not already present
        const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

        const linkWithLabelAndDate: LinkWithLabelAndDate = { url: fullUrl, label, dateAdded: currentDate };
        links.add(linkWithLabelAndDate);
      }
    });

    return Array.from(links);
  } catch (error) {
    console.error(`Error fetching the webpage: ${error}`);
    return [];
  }
};

const downloadImage = async (url, filePath) => {
    try {
        // Check if the file already exists
        if (await fs.stat(filePath).then(() => true).catch(() => false)) {
            console.log(`Image already exists: ${filePath}`);
            return; // File exists, so skip downloading
        }

        console.log(`Downloading image from URL: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Failed to fetch image: ${response.statusText}. URL: ${url}`);
            return; // Skip this image and continue
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.writeFile(filePath, buffer);
        console.log(`Image saved to ${filePath}`);
    } catch (error) {
        console.error(`Error in downloading image: ${error.message}`);
    }
};



const appendLinksToJson = async (newLinks: LinkWithLabelAndDate[], filename: string) => {
  try {
    // Read existing links from the file, if it exists
    let existingLinks: LinkWithLabelAndDate[] = [];
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

    // Download images for 't' links and update the combined links
    for (const link of combinedLinks) {
      if (link.url.includes('/t/')) {
        const imageId = link.url.split('/t/')[1];
        const imageUrl = `${domain}/api/${imageId}/image`;
        const imagePath = path.join('images', `${imageId}.jpg`);

        await downloadImage(imageUrl, imagePath);
      }
    }

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
