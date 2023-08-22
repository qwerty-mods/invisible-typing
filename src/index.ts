import { Injector, settings, webpack } from "replugged";

import "./style.css";

const inject = new Injector();

export { Settings } from "./Settings";
export { Icon } from "./Icon";

export interface SettingsType {
  button?: boolean;
  invisible?: boolean;
  channelWise?: boolean;
  channels?: Record<string, boolean>;
}
export const cfg = await settings.init<SettingsType>("dev.kingfish.InvisibleTyping");

export async function start(): Promise<void> {
  const typingMod = await webpack.waitForModule<{
    startTyping: (channelId: string) => void;
  }>(webpack.filters.byProps("startTyping"));
  const getChannelMod = await webpack.waitForModule<{
    getChannel: (id: string) => {
      name: string;
    };
  }>(webpack.filters.byProps("getChannel"));

  if (typingMod && getChannelMod) {
    inject.instead(typingMod, "startTyping", ([channelId]: [string], original) => {
      const global = cfg.get("invisible", true);
      const channelWise = cfg.get("button", true) ? cfg.get("channelWise", true) : false;
      const channels = cfg.get("channels", { [channelId]: global });
      if (channelWise ? channels[channelId] ?? global : global) {
        return null;
      } else {
        return original(channelId);
      }
    });
  }
}

export function stop(): void {
  inject.uninjectAll();
}
