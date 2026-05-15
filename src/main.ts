import type { HtmlTagDescriptor, Plugin } from 'vite';

import generateClarityScript from './preset/clarity';
import generateGtagScript, { type GtagOptions } from './preset/gtag';
import generateFbEventsScript from './preset/fbevents';
import generateGtmScript from './preset/gtm';

export interface ThirdPartyInjectorOptions {
  clarity?: string;
  gtag?: string | GtagOptions;
  fbevents?: string;
  gtm?: string;
}

const pushScript = (source: HtmlTagDescriptor[], generate: (id: string) => HtmlTagDescriptor[], id?: string) => {
  if (id) {
    source.push(...generate(id));
  }
};

const normalizeGtagOptions = (gtag?: string | GtagOptions): GtagOptions | undefined => {
  if (!gtag) {
    return undefined;
  }

  if (typeof gtag === 'string') {
    return {
      id: gtag,
      sendPageView: true
    };
  }

  return {
    id: gtag.id,
    sendPageView: gtag.sendPageView ?? true
  };
};

export default function thirdPartyInjectorPlugin(options: ThirdPartyInjectorOptions = {}): Plugin {
  return {
    name: '@kanjianmusic/vite-plugin-third-party-injector',
    transformIndexHtml() {
      const list: HtmlTagDescriptor[] = [];
      const gtagOptions = normalizeGtagOptions(options.gtag);

      if (gtagOptions?.id) {
        list.push(...generateGtagScript(gtagOptions));
      }

      pushScript(list, generateGtmScript, options.gtm);
      pushScript(list, generateClarityScript, options.clarity);
      pushScript(list, generateFbEventsScript, options.fbevents);

      return list;
    }
  };
}
