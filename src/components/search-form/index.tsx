import { ReactNode, useEffect, useState } from "react";
import usePrism from "../../hooks/use-prism";
import { SubmitHandler, type UseFormReturn } from "react-hook-form";
import clsx from "clsx";

export type Mode = {
  name: string;
  media_format: string;
  prism_format: string;
};

interface Props {
  children: ReactNode;
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<[string, Mode] | undefined>;
}

export const MODES: Array<Mode> = [
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
  onSubmit,
}: Props) {
  const highlightAll = usePrism();
  const [result, setResult] = useState<string>("");
  const [selectedMode, setSelectedMode] = useState<Mode>(MODES[0]);
  const [language, setLanguage] = useState<string>(MODES[0].prism_format);

  useEffect(() => setValue("media_format", selectedMode.media_format), []);
  useEffect(() => highlightAll(), [result]);

  const onSubmitExtended: SubmitHandler<any> = async (data) => {
    const response = await onSubmit(data);
    if (!response) return;
    setResult(response[0]);
    setSelectedMode(response[1]);
    setLanguage(response[1].prism_format);
    highlightAll();
  };

  return (
    <div className="bulma-box">
      <form
        onSubmit={handleSubmit(onSubmitExtended)}
        onReset={() => {
          setResult("");
          setSelectedMode(MODES[0]);
          setLanguage(MODES[0].prism_format);
          clearErrors();
        }}
      >
        {children}
        <div className="bulma-field">
          <label className="bulma-label">Response format</label>
          <div className="bulma-field bulma-has-addons">
            {MODES.map((mode) => (
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
      {result && language && (
        <pre className={`language-${language} line-numbers`}>
          <code className={`language-${language}`}>{result}</code>
        </pre>
      )}
    </div>
  );
}
