import { useForm } from "react-hook-form";
import clsx from "clsx";
import SearchForm, { Mode, MODES } from "../search-form";

// @ts-ignore
const SEARCH_API = import.meta.env.VITE_NAME_API_URL || "/name/";

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
    const response = await fetch(SEARCH_API + encodeURI(name), {
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
      <div className="bulma-field">
        <label className="bulma-label">Name2</label>
        <div className="bulma-control">
          <input
            className={clsx("bulma-input", {
              "bulma-is-danger": errors.name,
            })}
            placeholder="Name of municipality"
            {...register("name", { required: true })}
          />
        </div>
        {errors.name && (
          <div className="bulma-help bulma-is-danger">
            Please provide a value
          </div>
        )}
      </div>
    </SearchForm>
  );
}
