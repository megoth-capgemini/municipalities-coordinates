import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import clsx from "clsx";
import usePrism from "../../hooks/use-prism";

const SEARCH_API = "http://localhost:8000/name/";
const MODES = [
  { name: "JSON", media_format: "application/json", prism_format: "json" },
  {
    name: "JSON-LD",
    media_format: "application/ld+json",
    prism_format: "json",
  },
  { name: "Turtle", media_format: "text/turtle", prism_format: "turtle" },
  { name: "RDF/XML", media_format: "application/rdf+xml", prism_format: "xml" },
];

interface FormData {
  name: string;
  media_format: string;
}

export default function SearchName() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>();
  const highlightAll = usePrism();
  const [result, setResult] = useState<string>("");
  const [prismFormat, setPrismFormat] = useState<string>(MODES[0].prism_format);

  useEffect(() => highlightAll(), [result]);

  const onSubmit: SubmitHandler<FormData> = async ({ name, media_format }) => {
    if (!name) return;
    const response = await fetch(SEARCH_API + name, {
      headers: { Accept: media_format },
    });
    const responseText = await response.text();
    setResult(
      media_format === "application/json"
        ? JSON.stringify(JSON.parse(responseText), null, 2)
        : responseText,
    );
    setPrismFormat(
      (MODES.find((mode) => mode.media_format === media_format) || MODES[0])
        .prism_format,
    );
    highlightAll();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} onReset={() => setResult("")}>
        <div className="field">
          <label className="label">Name</label>
          <div className="control">
            <input
              className={clsx("input", {
                "is-danger": errors.name,
              })}
              defaultValue="Oslo"
              placeholder="Name of municipality"
              {...register("name", { required: true })}
            />
          </div>
          {errors.name && (
            <div className="help is-danger">Please provide a value</div>
          )}
        </div>
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
