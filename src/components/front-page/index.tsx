import SearchByName, { NAME_SEARCH_API } from "../search-by-name";
import SearchByProximity, { PROX_SEARCH_API } from "../search-by-proximity";
import SupportedModes from "../supported-modes";

export default function FrontPage() {
  return (
    <div className="bulma-container">
      <header className="bulma-content">
        <h1 className="bulma-title">Norwegian Municipalities</h1>
        <p>
          This is a service for finding norwegian municipalities by their name
          or coordinates. The data can expressed as a{" "}
          <a href="https://en.wikipedia.org/wiki/Linked_data">Linked Data</a>{" "}
          graph, or a simple{" "}
          <a href="https://www.json.org/json-en.html">JSON</a> response.
        </p>
        <p>
          The data is a combination of{" "}
          <a href="https://data.norge.no/datasets/978a923c-9ab6-3617-8fd6-6622363454e3">
            the list of municipalities from data.norge.no
          </a>{" "}
          and the aggregated responses from{" "}
          <a href={""}>Kartverkets stedsnavn API</a> (API for searching on place
          names, developed by the{" "}
          <a href={"https://www.kartverket.no/"}>Norwegian Mapping Authority</a>
          ), providing municipalities with their name, municipality number, and
          coordinates.
        </p>
        <p>
          To learn more about the project, check out{" "}
          <a href="https://github.com/megoth-capgemini/municipalities-coordinates">
            the code repository
          </a>
          .
        </p>
      </header>
      <article className="bulma-block bulma-content">
        <h2 className="bulma-title bulma-is-4">Search by name</h2>
        <dl>
          <dt>URL</dt>
          <dd>
            <code>{NAME_SEARCH_API}[query]</code>
          </dd>
          <dt>Formats</dt>
          <dd>
            <SupportedModes />
          </dd>
        </dl>
      </article>
      <SearchByName />
      <article className="bulma-block bulma-content">
        <h2 className="bulma-title bulma-is-4">Search by coordinates</h2>
        <dl>
          <dt>URL</dt>
          <dd>
            <code>{PROX_SEARCH_API}[lat]/[long]</code>
          </dd>
          <dt>Formats</dt>
          <dd>
            <SupportedModes />
          </dd>
        </dl>
      </article>
      <SearchByProximity />
      <article className="bulma-block bulma-content">
        <h2 className="bulma-title bulma-is-4">Documentation</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <h3 className="bulma-title bulma-is-5">Coordinates systems</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </article>
      <footer className="bulma-block bulma-content">
        <nav></nav>
      </footer>
    </div>
  );
}
