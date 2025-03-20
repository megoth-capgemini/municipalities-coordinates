import SearchByName from "../search-by-name";
import SearchByProximity from "../search-by-proximity";

export default function FrontPage() {
  return (
    <div className="bulma-container">
      <header className="bulma-content">
        <h1 className="bulma-title">Norwegian Municipalities</h1>
        <p>
          This is a service for finding Norwegian municipalities by their name
          or coordinates. The data can expressed as a{" "}
          <a href="https://en.wikipedia.org/wiki/Linked_data">Linked Data</a>{" "}
          graph, or a simple{" "}
          <a href="https://www.json.org/json-en.html">JSON</a> response.
        </p>
        <p>
          To learn more about the project, read the{" "}
          <a href={"#documentation"}>documentation</a> or check out the{" "}
          <a href="https://github.com/megoth-capgemini/municipalities-coordinates">
            code repository
          </a>
          .
        </p>
      </header>
      <SearchByName />
      <SearchByProximity />
      <section id="documentation" className="bulma-block bulma-content">
        <h2 className="bulma-title bulma-is-4">Documentation</h2>
        <p>
          This section covers the details of the service, and focuses on what
          you need to know to use the service. If you want to understand the
          technical details of how the service is developed and operated, check
          out the <a href={""}>code repository on GitHub</a>.
        </p>
        <h3 className="bulma-title bulma-is-5">Data</h3>
        <p>
          The data is a combination of{" "}
          <a href="https://data.norge.no/datasets/978a923c-9ab6-3617-8fd6-6622363454e3">
            the list of municipalities from data.norge.no
          </a>{" "}
          and the aggregated responses from{" "}
          <a
            href={
              "https://github.com/megoth-capgemini/municipalities-coordinates"
            }
          >
            Kartverkets stedsnavn API
          </a>{" "}
          (API for searching on place names, developed by the{" "}
          <a href={"https://www.kartverket.no/"}>Norwegian Mapping Authority</a>
          ), providing municipalities with their name, municipality number, and
          coordinates.
        </p>
        <p>
          The data is expressed as a graph that can be downloaded as Turtle from
          the{" "}
          <a
            href={
              "https://github.com/megoth-capgemini/municipalities-coordinates/blob/main/kommunenummer-koordinater.ttl"
            }
          >
            code repository
          </a>
          . Do note that the vocabularies used are slightly different from what
          is exposed through the service, as explained in the next section.
        </p>
        <h3 className="bulma-title bulma-is-5">Schema</h3>
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
