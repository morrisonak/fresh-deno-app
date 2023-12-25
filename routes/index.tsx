import Header from "../islands/Header.tsx";

import links from "./links.json" assert { type: "json" };

export default function Home() {
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <Header />
      <p class="my-6">
        Welcome to `fresh`. Try update this message in the ./routes/index.tsx
        file, and refresh.
      </p>
     

      <div class="links">
        {links.map((link, index) => (
          <div key={index} class="link">
            <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
            {link.label && <p class="description">{link.label}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
