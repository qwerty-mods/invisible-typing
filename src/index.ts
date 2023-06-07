import { Injector, settings, webpack } from "replugged";
import { Icon } from "./Icon";

import "./style.css";

const inject = new Injector();

export { Settings } from "./Settings";

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

  // @ts-expect-error temp until replugged gets builtin
  window.invisibletyping = {
    Icon,
  };
}

export function stop(): void {
  inject.uninjectAll();

  // @ts-expect-error temp until replugged gets builtin
  delete window.invisibletyping;
}
