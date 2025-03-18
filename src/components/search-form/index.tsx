import { ReactNode, useEffect, useState } from "react";
import usePrism from "../../hooks/use-prism";
import { SubmitHandler, type UseFormReturn } from "react-hook-form";

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
  form: { handleSubmit, register },
  onSubmit,
}: Props) {
  const highlightAll = usePrism();
  const [result, setResult] = useState<string>("");
  const [prismFormat, setPrismFormat] = useState<string>(MODES[0].prism_format);

  useEffect(() => highlightAll(), [result]);

  const onSubmitExtended: SubmitHandler<any> = async (data) => {
    const response = await onSubmit(data);
    if (!response) return;
    setResult(response[0]);
    setPrismFormat(response[1].prism_format);
    highlightAll();
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmitExtended)}
        onReset={() => setResult("")}
      >
        {children}
        <div className="field">
          <div className="control">
            <div className="select">
              <select {...register("media_format")}>
                {MODES.map((mode) => (
                  <option key={mode.media_format} value={mode.media_format}>
                    {mode.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button className="button is-primary" type="submit">
              Submit
            </button>
          </div>
          <div className="control">
            <button className="button is-light" type="reset">
              Reset
            </button>
          </div>
        </div>
      </form>
      {result && (
        <pre className={`language-${prismFormat}`}>
          <code className={`language-${prismFormat}`}>{result}</code>
        </pre>
      )}
    </div>
  );
}
