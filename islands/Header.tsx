export default function Header() {
  return (
    <header class="text-gray-600 body-font">
      <div class="container flex flex-col flex-wrap items-center p-5 mx-auto md:flex-row">
        <a
          class="flex items-center mb-4 font-medium text-gray-900 md:mb-0 title-font"
          href="/"
        >
          <img
            src="/logo.svg"
            height="100px"
            alt="the fresh logo: a sliced lemon dripping with juice"
          />
          <span class="ml-3 text-xl">Component Showcase</span>
        </a>
        <nav class="flex flex-wrap justify-center items-center text-base md:mr-auto md:ml-auto">
          <a href="/about" class="mr-5 hover:text-gray-900">
            About
          </a>
         
        </nav>
       
       
      </div>
    </header>
  );
}
