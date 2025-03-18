import SearchByName from "../search-by-name";
import SearchByProximity from "../search-by-proximity";

export default function FrontPage() {
  return (
    <div className="bulma-container">
      <header className="bulma-content">
        <h1 className="bulma-title">Municipalities search</h1>
      </header>
      <article className="bulma-block bulma-content">
        <h2 className="bulma-title bulma-is-4">Search by name</h2>
      </article>
      <SearchByName />
      <article className="bulma-block bulma-content">
        <h2 className="bulma-title bulma-is-4">Search by coordinates</h2>
      </article>
      <SearchByProximity />
    </div>
  );
}
