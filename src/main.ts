import type { HtmlTagDescriptor, Plugin } from 'vite';

import generateClarityScript from './preset/clarity';
import generateGtagScript from './preset/gtag';
import generateFbEventsScript from './preset/fbevents';
import generateGtmScript from './preset/gtm';

interface Options {
  clarity?: string;
  gtag?: string;
  fbevents?: string;
  gtm?: string;
}

const pushScript = (source: HtmlTagDescriptor[], generate: (id: string) => HtmlTagDescriptor[], id?: string) => {
  if (id) {
    source.push(...generate(id));
  }
}

export default function thirdPartyInjectorPlugin(options?: Options): Plugin {
    return {
      name: '@kanjianmusic/vite-plugin-third-party-injector',
      transformIndexHtml() {
        const list: HtmlTagDescriptor[] = [];

        if (!options) {
          return [];
        }

        pushScript(list, generateGtagScript, options.gtag);
        pushScript(list, generateGtmScript, options.gtm);
        pushScript(list, generateClarityScript, options.clarity);
        pushScript(list, generateFbEventsScript, options.fbevents);

        return list;
      }
    };
  }
