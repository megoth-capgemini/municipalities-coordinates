import SearchName from "../search-name";

export default function FrontPage() {
  return (
    <div className="container">
      <div className="content">
        <h1 className="title">Municipalities search</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
      <article className="section">
        <h2 className="title is-4">Search by name</h2>
        <SearchName />
      </article>
      <article className="section">
        <h2 className="title is-4">Search by coordinates</h2>
      </article>
    </div>
  );
}
