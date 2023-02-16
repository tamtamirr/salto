/*
*                      Copyright 2023 Salto Labs Ltd.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
import { Element } from '@salto-io/adapter-api'
import _ from 'lodash'
import { logger } from '@salto-io/logging'
import { collections, values } from '@salto-io/lowerdash'
import { FilterResult, RemoteFilterCreator } from '../filter'
import {
  ensureSafeFilterFetch,
} from './utils'
import {
  API_NAME,
} from '../constants'
import { getSObjectFieldElement } from '../transformers/transformer'
import SalesforceClient from '../client/client'
import { isToolingField, SupportedToolingObjectName, ToolingObjectType } from '../tooling/types'
import { createToolingObject } from '../tooling/utils'
import { SupportedToolingObject } from '../tooling/constants'

const log = logger(module)
const { awu } = collections.asynciterable
const { keyBy } = collections.array
const { isDefined } = values

const WARNING_MESSAGE = 'Encountered an error while trying to fetch info about the installed packages'

const createToolingObjectTypeFromDescribe = async (
  client: SalesforceClient,
  objectName: SupportedToolingObjectName,
): Promise<ToolingObjectType | undefined> => {
  const { result, errors } = await client.describeToolingObject(objectName)
  if (!_.isEmpty(errors) || _.isEmpty(result)) {
    log.warn('Failed to describe tooling object %s: %o', objectName, errors)
    return undefined
  }
  const [typeDescription] = result

  const [topLevelFields, nestedFields] = _.partition(
    typeDescription.fields,
    field => _.isNil(field.compoundFieldName)
  )

  const objCompoundFieldNames = _.mapValues(
    _.groupBy(nestedFields, field => field.compoundFieldName),
    (_nestedFields, compoundName) => compoundName,
  )

  const toolingType = createToolingObject(objectName)
  const toolingFields = topLevelFields.map(sObjectField =>
    getSObjectFieldElement(
      toolingType,
      sObjectField,
      { [API_NAME]: objectName },
      objCompoundFieldNames
    )).filter(isToolingField)
  toolingFields.forEach(field => _.omitBy(field.annotations, _.isNil))
  toolingType.fields = keyBy(toolingFields, field => field.name)
  return toolingType
}

const filterCreator: RemoteFilterCreator = ({ client, config }) => ({
  name: 'fetchToolingTypesFilter',
  onFetch: ensureSafeFilterFetch({
    filterName: 'describeSObjects',
    warningMessage: WARNING_MESSAGE,
    config,
    fetchFilterFunc: async (elements: Element[]): Promise<void | FilterResult> => {
      await awu(Object.values(SupportedToolingObject))
        .map(objectName => createToolingObjectTypeFromDescribe(client, objectName))
        .filter(isDefined)
        .forEach(toolingType => elements.push(toolingType))
    },
  }),
})


export default filterCreator
