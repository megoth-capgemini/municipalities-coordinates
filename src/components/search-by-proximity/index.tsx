import { type MouseEvent } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import SearchForm, { Mode, MODES } from "../search-form";

const SEARCH_API = "http://localhost:8000/coords/";

interface FormData {
  lat: number;
  long: number;
  media_format: string;
}

export default function SearchByProximity() {
  const form = useForm<FormData>();
  const {
    clearErrors,
    register,
    formState: { errors },
    setValue,
  } = form;

  const onSubmit = async ({ lat, long, media_format }: FormData) => {
    if (!lat || !long) return;
    const response = await fetch(`${SEARCH_API}${lat}/${long}`, {
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

  const getCoordinates = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition((position) => {
      setValue("lat", position.coords.latitude);
      setValue("long", position.coords.longitude);
      clearErrors();
    });
  };

  return (
    <SearchForm form={form} onSubmit={onSubmit}>
      <div className="bulma-field">
        <label className="bulma-label">Coordinates</label>
        <div className="bulma-field bulma-is-horizontal">
          <div className="bulma-field-body">
            <div className="bulma-field">
              <div className="bulma-control">
                <input
                  className={clsx("bulma-input", {
                    "bulma-is-danger": errors.lat,
                  })}
                  placeholder="Latitude"
                  type="string"
                  {...register("lat", { required: true })}
                />
              </div>
            </div>
            <div className="bulma-field">
              <div className="bulma-control">
                <input
                  className={clsx("bulma-input", {
                    "bulma-is-danger": errors.long,
                  })}
                  placeholder="Longitude"
                  type="string"
                  {...register("long", { required: true })}
                />
              </div>
            </div>
            <div className="bulma-field">
              <button
                className="bulma-button bulma-is-light"
                type="button"
                onClick={getCoordinates}
              >
                Get my location
              </button>
            </div>
          </div>
        </div>
        {(errors.lat || errors.long) && (
          <div className="bulma-help bulma-is-danger">
            Please provide coordinates
          </div>
        )}
      </div>
    </SearchForm>
  );
}
