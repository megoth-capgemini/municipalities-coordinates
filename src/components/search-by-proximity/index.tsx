import { type MouseEvent } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import SearchForm, { FormData } from "../search-form";

export const PROX_SEARCH_API =
  // @ts-ignore
  import.meta.env.VITE_PROXIMITY_API_URL || "/coords/";

interface ProximityFormData extends FormData {
  lat: number;
  long: number;
}

export default function SearchByProximity() {
  const form = useForm<ProximityFormData>();
  const {
    clearErrors,
    register,
    formState: { errors },
    setValue,
  } = form;

  const getUrl = ({ lat, long }: ProximityFormData) =>
    `${PROX_SEARCH_API}${lat}/${long}`;

  const getCoordinates = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition((position) => {
      setValue("lat", position.coords.latitude);
      setValue("long", position.coords.longitude);
      clearErrors();
    });
  };

  return (
    <SearchForm form={form} getUrl={getUrl}>
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
