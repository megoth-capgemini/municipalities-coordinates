import SearchByName from "../search-by-name";
import SearchByProximity from "../search-by-proximity";
import Introduction from "./introduction.mdx";
import Documentation from "./documentation.mdx";

export default function FrontPage() {
  return (
    <div className="bulma-container">
      <header className="bulma-block bulma-content">
        <Introduction />
      </header>
      <SearchByName />
      <SearchByProximity />
      <section className="bulma-block">
        <Documentation />
      </section>
      <footer className="bulma-block bulma-content">
        <a
          href="https://www.flaticon.com/free-icons/norway"
          title="norway icons"
        >
          Norway icons created by iconset.co - Flaticon
        </a>
      </footer>
    </div>
  );
}
