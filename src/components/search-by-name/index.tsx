import { useForm } from "react-hook-form";
import clsx from "clsx";
import SearchForm, { Mode, MODES } from "../search-form";

const SEARCH_API = "http://localhost:8000/name/";

interface FormData {
  name: string;
  media_format: string;
}

export default function SearchByName() {
  const form = useForm<FormData>();
  const {
    register,
    formState: { errors },
  } = form;

  const onSubmit = async ({ name, media_format }: FormData) => {
    if (!name) return;
    const response = await fetch(SEARCH_API + name, {
      headers: { Accept: media_format },
    });
    const responseText = await response.text();
    return [
      media_format === "application/json"
        ? JSON.stringify(JSON.parse(responseText), null, 2)
        : responseText,
      MODES.find((mode) => mode.media_format === media_format) || MODES[0],
    ] as [string, Mode];
  };

  return (
    <SearchForm form={form} onSubmit={onSubmit}>
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
    </SearchForm>
  );
}
