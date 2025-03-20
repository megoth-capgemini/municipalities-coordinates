import { useForm } from "react-hook-form";
import clsx from "clsx";
import SearchForm from "../search-form";

// @ts-ignore
export const NAME_SEARCH_API = import.meta.env.VITE_NAME_API_URL || "/name/";

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

  const getUrl = ({ name }: FormData): string => NAME_SEARCH_API + name;

  return (
    <SearchForm form={form} getUrl={getUrl}>
      <div className="bulma-field">
        <label className="bulma-label">Name</label>
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
