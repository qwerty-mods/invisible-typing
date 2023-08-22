import { components, util } from "replugged";
import { cfg } from ".";

const { SwitchItem } = components;

export function Settings(): React.ReactElement {
  return (
    <>
      <SwitchItem {...util.useSetting(cfg, "button", true)}>Show Button on ChatBar</SwitchItem>
      <SwitchItem {...util.useSetting(cfg, "channelWise", true)} disabled={!cfg.get("button", true)} key={`${!cfg.get("button", true)}`}>Make Chatbar button toggle it just for channel</SwitchItem>
      <SwitchItem {...util.useSetting(cfg, "invisible", true)}>Enable Global Invisible Typing</SwitchItem>
    </>
  );
}
