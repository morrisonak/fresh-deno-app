import { useState } from 'preact/hooks'; // or 'react' if you are using React
import Header from "../islands/Header.tsx";
import links from "../links.json" assert { type: "json" };

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const linksPerPage = 100;

  // Sort links by date in descending order
  const sortedLinks = links.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

  // Get current links
  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = sortedLinks.slice(indexOfFirstLink, indexOfLastLink);

  // Calculate total pages
  const totalPages = Math.ceil(links.length / linksPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle Next and Previous
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <Header />
      <h1 class="my-6">
        This is a collection of components created via <a href="https://v0.dev" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 transition-colors duration-200">v0.dev</a>
      </h1>

      <div class="p-2">
        {currentLinks.map((link, index) => {
          const imagePath = `/images/${link.url.split('/').pop()}.jpg`;

          return (
            <div key={index} class="px-4 py-2 mb-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              {link.url.includes('/t/') && 
                <img src={imagePath} alt={link.label || 'Image preview'} class="w-full h-40 object-cover rounded-t-lg" />}
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

      <div class="flex justify-center items-center my-4">
        <button onClick={prevPage} class="px-4 py-2 mx-1 bg-gray-300 hover:bg-gray-400 rounded">
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button 
            key={i} 
            onClick={() => paginate(i + 1)} 
            class={`px-3 py-1 mx-1 ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={nextPage} class="px-4 py-2 mx-1 bg-gray-300 hover:bg-gray-400 rounded">
          Next
        </button>
      </div>
    </div>
  );
}
