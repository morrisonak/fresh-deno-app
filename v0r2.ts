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
        const currentDate = new Date().toISOString(); // Get current date and time in ISO format

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
        if (await fs.stat(filePath).then(() => true).catch(() => false)) {
            console.log(`Image already exists: ${filePath}`);
            return; 
        }

        console.log(`Downloading image from URL: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Failed to fetch image: ${response.statusText}. URL: ${url}`);
            return;
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.writeFile(filePath, buffer);
        console.log(`Image saved to ${filePath}`);
    } catch (error) {
        console.error(`Error in downloading image: ${error.message}`);
    }
};

const appendLinksToJson = async (newLinks: LinkWithLabelAndDate[], imageLinksFile: string, userLinksFile: string) => {
  try {
    let existingImageLinks: LinkWithLabelAndDate[] = [];
    let existingUserLinks: LinkWithLabelAndDate[] = [];

    try {
      const imageLinksContent = await fs.readFile(imageLinksFile, 'utf8');
      existingImageLinks = JSON.parse(imageLinksContent);
    } catch (error) {
      console.log("Image links file not found or empty. A new file will be created.");
    }

    try {
      const userLinksContent = await fs.readFile(userLinksFile, 'utf8');
      existingUserLinks = JSON.parse(userLinksContent);
    } catch (error) {
      console.log("User links file not found or empty. A new file will be created.");
    }

    const newImageLinks = newLinks.filter(link => link.url.includes('/t/'));
    const newUserLinks = newLinks.filter(link => !link.url.includes('/t/'));

    const combinedImageLinks = Array.from(new Set([...existingImageLinks, ...newImageLinks].map(link => JSON.stringify(link)))).map(str => JSON.parse(str));
    const combinedUserLinks = Array.from(new Set([...existingUserLinks, ...newUserLinks].map(link => JSON.stringify(link)))).map(str => JSON.parse(str));

    for (const link of newImageLinks) {
      const imageId = link.url.split('/t/')[1];
      const imageUrl = `${domain}/api/${imageId}/image`;
      const imagePath = path.join('static', 'images', `${imageId}.jpg`);

      await downloadImage(imageUrl, imagePath);
    }

    await fs.writeFile(imageLinksFile, JSON.stringify(combinedImageLinks, null, 2));
    console.log(`Image links appended to ${imageLinksFile}`);

    await fs.writeFile(userLinksFile, JSON.stringify(combinedUserLinks, null, 2));
    console.log(`User links appended to ${userLinksFile}`);
  } catch (error) {
    console.error(`Error updating files: ${error}`);
  }
};

// Example usage
const url = 'https://v0.dev'; // Replace with the URL you want to fetch
fetchLinks(url).then(links => {
  appendLinksToJson(links, 'links.json', 'users.json');
});
