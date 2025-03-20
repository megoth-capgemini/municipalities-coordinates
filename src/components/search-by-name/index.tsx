import { useForm } from "react-hook-form";
import clsx from "clsx";
import SearchForm from "../search-form";
import type { MouseEvent } from "react";

// @ts-ignore
export const NAME_SEARCH_API = import.meta.env.VITE_NAME_API_URL || "/name/";
const MUNICIPALITY_NAMES = [
  "Arendal",
  "Bergen",
  "Bø",
  "Herøy",
  "Oslo",
  "Risør",
  "Røros",
  "Svalbard",
  "Stavanger",
  "Trondheim",
  "Våler",
  "Ås",
];

interface FormData {
  name: string;
  media_format: string;
}

export default function SearchByName() {
  const form = useForm<FormData>();
  const {
    register,
    formState: { errors },
    setValue,
  } = form;

  const getUrl = ({ name }: FormData): string => NAME_SEARCH_API + name;

  const getRandomName = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const random = Math.floor(Math.random() * MUNICIPALITY_NAMES.length);
    setValue("name", MUNICIPALITY_NAMES[random]);
  };

  return (
    <SearchForm form={form} getUrl={getUrl}>
      <div className="bulma-field">
        <label className="bulma-label">Name</label>
        <div className="bulma-field bulma-is-horizontal">
          <div className="bulma-field-body">
            <div className="bulma-field">
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
            <div className="bulma-field" style={{ flexGrow: 0 }}>
              <button
                className="bulma-button bulma-is-light"
                type="button"
                onClick={getRandomName}
              >
                Add random municipality name
              </button>
            </div>
          </div>
        </div>
      </div>
    </SearchForm>
  );
}
