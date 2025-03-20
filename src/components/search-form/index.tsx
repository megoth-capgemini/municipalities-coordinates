import { ReactNode, useEffect, useState } from "react";
import usePrism from "../../hooks/use-prism";
import { SubmitHandler, type UseFormReturn } from "react-hook-form";
import clsx from "clsx";

export type Mode = {
  name: string;
  media_format: string;
  prism_format: string;
};

export interface FormData {
  media_format: string;
}

interface Props {
  children: ReactNode;
  form: UseFormReturn<any>;
  getUrl: (data: any) => string;
}

export const SUPPORTED_MODES: Array<Mode> = [
  { name: "JSON", media_format: "application/json", prism_format: "json" },
  {
    name: "JSON-LD",
    media_format: "application/ld+json",
    prism_format: "json",
  },
  { name: "Turtle", media_format: "text/turtle", prism_format: "turtle" },
  { name: "RDF/XML", media_format: "application/rdf+xml", prism_format: "xml" },
];

export default function SearchForm({
  children,
  form: { clearErrors, handleSubmit, setValue },
  getUrl,
}: Props) {
  const highlightAll = usePrism();
  const [url, setUrl] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [selectedMode, setSelectedMode] = useState<Mode>(SUPPORTED_MODES[0]);
  const [requestedMode, setRequestedMode] = useState<Mode | null>(null);
  const [language, setLanguage] = useState<string>(
    SUPPORTED_MODES[0].prism_format,
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(
    () => setValue("media_format", selectedMode.media_format),
    [selectedMode],
  );
  useEffect(() => highlightAll(), [result]);

  const onSubmitExtended: SubmitHandler<FormData> = async (data) => {
    const url = getUrl(data);
    const response = await fetch(url, {
      headers: { Accept: data.media_format },
    }).catch(setError);
    if (!response) return;
    const mediaFormat = response.headers.get("content-type");
    const responseText = await response.text();
    const mode =
      SUPPORTED_MODES.find(
        (mode) => mediaFormat?.indexOf(mode.media_format) !== -1,
      ) || SUPPORTED_MODES[0];

    setUrl(url);
    setResult(
      mediaFormat === "application/json"
        ? JSON.stringify(JSON.parse(responseText), null, 2)
        : responseText,
    );
    setRequestedMode(mode);
    setLanguage(mode.prism_format);
  };

  return (
    <div className="bulma-box">
      <form
        className="bulma-block"
        onSubmit={handleSubmit(onSubmitExtended)}
        onReset={() => {
          setResult("");
          setRequestedMode(null);
          setSelectedMode(SUPPORTED_MODES[0]);
          setLanguage(SUPPORTED_MODES[0].prism_format);
          setError(null);
          clearErrors();
        }}
      >
        {children}
        <div className="bulma-field">
          <label className="bulma-label">Response format</label>
          <div className="bulma-field bulma-has-addons">
            {SUPPORTED_MODES.map((mode) => (
              <div className="bulma-control" key={mode.media_format}>
                <button
                  className={clsx("bulma-button", {
                    "bulma-is-link": selectedMode === mode,
                  })}
                  onClick={(event) => {
                    event.preventDefault();
                    setValue("media_format", mode.media_format);
                    setSelectedMode(mode);
                  }}
                  type="button"
                >
                  {mode.name}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="bulma-field bulma-is-grouped">
          <div className="bulma-control">
            <button className="bulma-button bulma-is-primary" type="submit">
              Submit
            </button>
          </div>
          <div className="bulma-control">
            <button className="bulma-button bulma-is-light" type="reset">
              Reset
            </button>
          </div>
        </div>
      </form>
      {error && (
        <div className="bulma-notification bulma-is-danger">
          <pre>{error.message}</pre>
        </div>
      )}
      {result && language && url && requestedMode && (
        <>
          <div className="bulma-content">
            <h3 className={"bulma-title bulma-is-6"}>Results</h3>
            <p>
              Request: <code>{url}</code>
              <br />
              Header: <code>{requestedMode.media_format}</code>
              <br />
              Using curl:{" "}
              <code>
                curl --header "Accept: {requestedMode.media_format}" {url}
              </code>
            </p>
          </div>
          <pre className={`language-${language} line-numbers`}>
            <code className={`language-${language}`}>{result}</code>
          </pre>
        </>
      )}
    </div>
  );
}
