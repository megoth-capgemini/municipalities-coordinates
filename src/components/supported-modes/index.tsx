import { SUPPORTED_MODES } from "../search-form";

export default function SupportedModes() {
  return (
    <span className="supported-modes">
      {SUPPORTED_MODES.map(({ name, media_format }) => (
        <span>
          {name} (<code>{media_format}</code>)
        </span>
      ))}
    </span>
  );
}
