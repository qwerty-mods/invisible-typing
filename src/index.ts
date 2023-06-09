import { Injector, settings, webpack } from "replugged";

import "./style.css";

const inject = new Injector();

export { Settings } from "./Settings";
export { Icon } from "./Icon";

export interface SettingsType {
  button?: boolean;
  invisible?: boolean;
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
    inject.instead(typingMod, "startTyping", ([channel], original) => {
      if (cfg.get("invisible", true)) {
        return null;
      } else {
        return original(channel);
      }
    });
  }
}

export function stop(): void {
  inject.uninjectAll();
}
