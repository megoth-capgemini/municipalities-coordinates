import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import clsx from "clsx";

const SEARCH_API = "http://localhost:8000/name/";
const MODES = [
  { name: "JSON", media_format: "application/json" },
  { name: "JSON-LD", media_format: "application/ld+json" },
  { name: "Turtle", media_format: "text/turtle" },
  { name: "RDF/XML", media_format: "application/rdf+xml" },
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
  const [result, setResult] = useState<string>("");
  const onSubmit: SubmitHandler<FormData> = async ({ name, media_format }) => {
    if (!name) return;
    const response = await fetch(SEARCH_API + name, {
      headers: { Accept: media_format },
    });
    setResult(await response.text());
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
        <pre>
          <code>{result}</code>
        </pre>
      )}
    </div>
  );
}
