import { ReactNode, useEffect, useState } from "react";
import usePrism from "../../hooks/use-prism";
import { SubmitHandler, type UseFormReturn } from "react-hook-form";
import clsx from "clsx";
import Loading from "../loading";

export type Mode = {
  name: string;
  media_format: string;
  prism_format: string;
};

export interface FormData {
  media_format: string;
}

interface Props {
  children?: ReactNode;
  form: UseFormReturn<any>;
  getUrl: (data: any) => string;
  modes?: Array<Mode>;
}

export const JSON_MODE = {
  name: "JSON",
  media_format: "application/json",
  prism_format: "json",
};
export const JSONLD_MODE = {
  name: "JSON-LD",
  media_format: "application/ld+json",
  prism_format: "json",
};
export const TURTLE_MODE = {
  name: "Turtle",
  media_format: "text/turtle",
  prism_format: "turtle",
};
export const RDFXML_MODE = {
  name: "RDF/XML",
  media_format: "application/rdf+xml",
  prism_format: "xml",
};
export const SUPPORTED_MODES: Array<Mode> = [
  JSON_MODE,
  JSONLD_MODE,
  TURTLE_MODE,
  RDFXML_MODE,
];

export default function SearchForm({
  children,
  form: {
    clearErrors,
    handleSubmit,
    setValue,
    formState: { isLoading, isSubmitting },
  },
  getUrl,
  modes = SUPPORTED_MODES,
}: Props) {
  const highlightAll = usePrism();
  const [url, setUrl] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [selectedMode, setSelectedMode] = useState<Mode>(modes[0]);
  const [requestedMode, setRequestedMode] = useState<Mode | null>(null);
  const [language, setLanguage] = useState<string>(modes[0].prism_format);
  const [error, setError] = useState<Error | null>(null);

  useEffect(
    () => setValue("media_format", selectedMode.media_format),
    [selectedMode],
  );
  useEffect(highlightAll, [result]);

  const onSubmitExtended: SubmitHandler<FormData> = async (data) => {
    const url = getUrl(data);
    const response = await fetch(url, {
      headers: { Accept: data.media_format },
    }).catch(setError);
    if (!response) return;
    const mediaFormat = response.headers.get("content-type");
    const responseText = await response.text();
    const mode =
      modes.find((mode) => mediaFormat?.indexOf(mode.media_format) !== -1) ||
      modes[0];

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
          setSelectedMode(modes[0]);
          setLanguage(modes[0].prism_format);
          setError(null);
          clearErrors();
        }}
      >
        {children}
        <div className="bulma-field">
          <label className="bulma-label">Response format</label>
          <div className="bulma-field bulma-has-addons">
            {modes.map((mode) => (
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
      {(isLoading || isSubmitting) && <Loading />}
      {error && !isSubmitting && (
        <div className="bulma-notification bulma-is-danger">
          <pre>{error.message}</pre>
        </div>
      )}
      {result && language && url && requestedMode && !isLoading && (
        <>
          <div
            className="bulma-content"
            style={{ opacity: isLoading || isSubmitting ? 0.5 : 1 }}
          >
            <h3 className={"bulma-title bulma-is-6"}>Results</h3>
            <dl>
              <dt>Request</dt>
              <dd>
                <code>{url}</code>
              </dd>
              <dt>Header</dt>
              <dd>
                <code>{requestedMode.media_format}</code>
              </dd>
              <dt>curl</dt>
              <dd>
                <code>
                  curl --header "Accept: {requestedMode.media_format}" {url}
                </code>
              </dd>
            </dl>
          </div>
          <pre className={`code language-${language} line-numbers`}>
            <code className={`language-${language}`}>{result}</code>
          </pre>
        </>
      )}
    </div>
  );
}
