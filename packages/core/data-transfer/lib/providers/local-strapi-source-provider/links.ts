import { Readable } from 'stream';

import type { ILink } from '../../../types';
import { createLinkQuery } from '../shared/strapi/link';

/**
 * Create a Duplex instance which will stream all the links from a Strapi instance
 */
export const createLinksStream = (strapi: Strapi.Strapi): Readable => {
  const uids = [...Object.keys(strapi.contentTypes), ...Object.keys(strapi.components)] as string[];

  // Async generator stream that returns every link from a Strapi instance
  return Readable.from(
    (async function* linkGenerator(): AsyncGenerator<ILink> {
      const query = createLinkQuery(strapi);

      for (const uid of uids) {
        const generator = query().generateAll(uid);

        for await (const link of generator) {
          yield link;
        }
      }
    })()
  );
};
