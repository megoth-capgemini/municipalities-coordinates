import { SUPPORTED_MODES } from "../search-form";

export default function SupportedModes() {
  return (
    <span className="supported-modes">
      {SUPPORTED_MODES.map(({ name, media_format }) => (
        <span key={media_format}>
          {name} (<code>{media_format}</code>)
        </span>
      ))}
    </span>
  );
}
