import Header from "../islands/Header.tsx";

import links from "../links.json" assert { type: "json" };

export default function Home() {
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <Header />
      <p class="my-6">
        Welcome to `fresh`. Try update this message in the ./routes/index.tsx
        file, and refresh.
      </p>
     

      <div class="p-2">
        {links.map((link, index) => (
          <div key={index} class="px-2">
            <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
            {link.label && <p class="font-semibold">{link.label}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
