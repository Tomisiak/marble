import { getArrayFromEnum } from '../../+internal/utils';
import { coreErrorFactory, CoreErrorOptions } from '../../error/error.factory';
import { HttpEffect } from '../effects/http.effects.interface';
import { RouteEffect } from '../router/http.router.interface';
import { HttpMethod, HttpMethodType } from '../http.interface';

const httpMethods = getArrayFromEnum(HttpMethodType);
const coreErrorOptions: CoreErrorOptions =  { contextMethod: 'EffectFactory' };

/**
 * @deprecated since version 3.0, use pipable builder instead
 *
 * #EffectFactory will be deleted in the next major version (v4.0),
 */
export const EffectFactory = {
   matchPath: (path: string) => {
    if (!path) {
      throw coreErrorFactory('Path cannot be empty', coreErrorOptions);
    }

    return { matchType: EffectFactory.matchType(path) };
  },

  matchType: (path: string) => (method: HttpMethod) => {
    if (!method) {
      throw coreErrorFactory('HttpMethod needs to be defined', coreErrorOptions);
    }

    if (!httpMethods.includes(method)) {
      throw coreErrorFactory(
        `HttpMethod needs to be one of the following: ${httpMethods}`,
        coreErrorOptions,
      );
    }

    return { use: EffectFactory.use(path)(method) };
  },

  use: (path: string) => (method: HttpMethod) => (effect: HttpEffect): RouteEffect => {
    if (!effect) {
      throw coreErrorFactory('Effect needs to be provided', coreErrorOptions);
    }

    return { path, method, effect };
  },
}
