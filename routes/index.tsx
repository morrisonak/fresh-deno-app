import Header from "../islands/Header.tsx";
import links from "../links.json" assert { type: "json" };

export default function Home() {
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <Header />
      <h1 class="my-6">
        This is a collection of components created via <a href="V0.dev></a>
      </h1>

      <div class="p-2">
        {links.map((link, index) => (
          <div key={index} class="px-4 py-2 mb-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <a 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              class="text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              {link.url}
            </a>
            {link.label && <p class="font-semibold mt-1">{link.label}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
