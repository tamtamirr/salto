/*
 * Copyright 2024 Salto Labs Ltd.
 * Licensed under the Salto Terms of Use (the "License");
 * You may not use this file except in compliance with the License.  You may obtain a copy of the License at https://www.salto.io/terms-of-use
 *
 * CERTAIN THIRD PARTY SOFTWARE MAY BE CONTAINED IN PORTIONS OF THE SOFTWARE. See NOTICE FILE AT https://github.com/salto-io/salto/blob/main/NOTICES
 */
import { FixElementsFunc, GetCustomReferencesFunc } from '@salto-io/adapter-api'

export type WeakReferencesHandler<T> = {
  findWeakReferences: GetCustomReferencesFunc
  removeWeakReferences: (args: T) => FixElementsFunc
}
