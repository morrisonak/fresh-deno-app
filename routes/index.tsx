import Header from "../islands/Header.tsx";
import links from "../links.json" assert { type: "json" };

export default function Home() {
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <Header />
      <h1 class="my-6">
        This is a collection of components created via <a href="https://v0.dev" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 transition-colors duration-200">v0.dev</a>
      </h1>

      <div class="p-2">
        {links.map((link, index) => {
          // Construct the image path
          const imagePath = `/images/${link.url.split('/').pop()}.jpg`;

          return (
            <div key={index} class="px-4 py-2 mb-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              {link.url.includes('/t/') && 
              {/* <img src={imagePath} alt={link.label || 'Image preview'} class="w-full h-40 object-cover rounded-t-lg" />} */}
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
                <p class="text-gray-600 text-sm">Date Added: {link.dateAdded}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
