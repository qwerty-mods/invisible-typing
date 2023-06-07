import { components, util } from "replugged";
import { cfg } from ".";

const { SwitchItem } = components;

export function Settings(): React.ReactElement {
  return (
    <>
      <SwitchItem {...util.useSetting(cfg, "button", true)}>Show Button on ChatBar</SwitchItem>
      <SwitchItem {...util.useSetting(cfg, "invisible", true)}>Enable Invisible Typing</SwitchItem>
    </>
  );
}
