import Header from "../islands/Header.tsx";
import links from "../links.json" assert { type: "json" };

export default function Home() {
  // Define a default date for links without a dateAdded field
  const defaultDate = new Date(0); // This sets the date to Unix Epoch (January 1, 1970)

  // Sort links by date and time in descending order
  const sortedLinks = [...links].sort((a, b) => {
    const dateA = a.dateAdded ? new Date(a.dateAdded) : defaultDate;
    const dateB = b.dateAdded ? new Date(b.dateAdded) : defaultDate;

    return dateB - dateA;
  });

  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <Header />
      <h1 class="my-6">
        This is a collection of components created via <a href="https://v0.dev" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 transition-colors duration-200">v0.dev</a>
      </h1>

      <div class="p-2">
        {sortedLinks.map((link, index) => (
          <div key={index} class="px-4 py-2 mb-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div class="p-4">
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                class="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                {link.url}
              </a>
              {link.label && <p class="font-semibold mt-1">{link.label}</p>}
              <p class="text-gray-600 text-sm">Date Added: {link.dateAdded ? new Date(link.dateAdded).toLocaleString() : 'Unknown'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
