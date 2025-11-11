import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';

/** @note Utility type for concise function type declaration. */
type FN<I extends unknown[] = [], O = void> = (...args: I) => O;

type IProps = { onToggle: FN<[string]>; values: Record<string, boolean> };

/** @note A list of toggle-able checkboxes displayed next to tag (i.e., `<Badge>`) UI. */
export const TagToggles = (props: IProps) => (
  <fieldset className="flex w-full gap-4">
    <legend>Filter by Tags:</legend>
    {Object.entries(props.values).map(([tag, checked]) => (
      <label
        className="flex items-center"
        key={tag}
        onClick={(event) => {
          event.preventDefault();
          props.onToggle(tag);
        }}
      >
        <Checkbox checked={checked} />
        <Badge>{tag}</Badge>
      </label>
    ))}
  </fieldset>
);
