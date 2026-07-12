/**
 * Configure wsx-press asset/doc fetch base before client components register.
 * Must import from `/client/paths` — not full client — to avoid early side effects.
 */
import { configurePressBase } from '@wsxjs/wsx-press/client/paths';

configurePressBase(import.meta.env.BASE_URL);
