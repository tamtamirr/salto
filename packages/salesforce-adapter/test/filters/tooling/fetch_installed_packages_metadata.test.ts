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
import { BuiltinTypes, Element, Field, isInstanceElement } from '@salto-io/adapter-api'
import { collections } from '@salto-io/lowerdash'
import mockClient from '../../client'
import { SalesforceRecord } from '../../../src/client/types'
import filterCreator from '../../../src/filters/tooling/fetch_installed_packages_metadata'
import { defaultFilterContext } from '../../utils'
import { FilterWith } from '../../../src/filter'
import { createToolingObject } from '../../../src/tooling/utils'
import { API_NAME } from '../../../src/constants'
import { ToolingField, ToolingObject } from '../../../src/tooling/types'
import { buildFetchProfile } from '../../../src/fetch_profile/fetch_profile'
import { SalesforceClient } from '../../../index'

const { awu } = collections.asynciterable

describe('fetchSubscriberPackageInstancesFilter', () => {
  describe('onFetch', () => {
    const QUERY_RESULT = [
      // The first two are coming from the same namespace
      [{ SubscriberPackage: { Id: '03330000000wDAbAAM', Name: 'Test Package Name', NamespacePrefix: 'test', Description: 'description', IsPackageValid: true, attributes: {} } }],
      [{ SubscriberPackage: { Id: '03330000000wDAbAAB', Name: 'Another Test Package Name', NamespacePrefix: 'test', Description: 'description', IsPackageValid: true, attributes: {} } }],
      [{ SubscriberPackage: { Id: '03330000000wDAbAAC', Name: 'Test Package Name', NamespacePrefix: 'test2', Description: 'description', IsPackageValid: true, attributes: {} } }],
    ]

    let client: SalesforceClient

    const createSubscriberPackageType = (): ToolingObject['SubscriberPackage'] => {
      const objectType = createToolingObject('SubscriberPackage')
      objectType.fields.Id = new Field(
        objectType,
        'Id',
        BuiltinTypes.SERVICE_ID,
        {
          [API_NAME]: 'SubscriberPackage.Id',
        }
      ) as ToolingField
      objectType.fields.Name = new Field(
        objectType,
        'Name',
        BuiltinTypes.STRING,
        {
          [API_NAME]: 'SubscriberPackage.Name',
        }
      ) as ToolingField
      objectType.fields.NamespacePrefix = new Field(
        objectType,
        'NamespacePrefix',
        BuiltinTypes.STRING,
        {
          [API_NAME]: 'SubscriberPackage.NamespacePrefix',
        }
      ) as ToolingField
      objectType.fields.Description = new Field(
        objectType,
        'Description',
        BuiltinTypes.STRING,
        {
          [API_NAME]: 'SubscriberPackage.Description',
        }
      ) as ToolingField
      objectType.fields.IsPackageValid = new Field(
        objectType,
        'IsPackageValid',
        BuiltinTypes.BOOLEAN,
        {
          [API_NAME]: 'SubscriberPackage.IsPackageValid',
        }
      ) as ToolingField
      return objectType
    }

    let elements: Element[]
    let subscriberPackageType: ToolingObject['SubscriberPackage']

    beforeEach(async () => {
      client = mockClient().client
      jest.spyOn(client, 'queryAll').mockResolvedValue(awu(QUERY_RESULT as unknown as SalesforceRecord[][]))
      subscriberPackageType = createSubscriberPackageType()
    })
    describe('when SubscriberPackage are not excluded', () => {
      beforeEach(async () => {
        const filter = filterCreator({ client, config: defaultFilterContext }) as FilterWith<'onFetch'>
        elements = [subscriberPackageType]
        await filter.onFetch(elements)
      })
      it('should create SubscriberPackageInstances', () => {
        const subscriberPackageValuesFromQuery = QUERY_RESULT.flat().map(record => record.SubscriberPackage)
        expect(elements.filter(isInstanceElement)).toHaveLength(subscriberPackageValuesFromQuery.length)
        subscriberPackageValuesFromQuery.forEach(subscriberPackageValueFromQuery => {
          expect(elements).toContainEqual(expect.objectContaining({
            refType: expect.objectContaining({ type: subscriberPackageType }),
            value: {
              Id: subscriberPackageValueFromQuery.Id,
              Name: subscriberPackageValueFromQuery.Name,
              NamespacePrefix: subscriberPackageValueFromQuery.NamespacePrefix,
              Description: subscriberPackageValueFromQuery.Description,
              IsPackageValid: subscriberPackageValueFromQuery.IsPackageValid,
            },
          }))
        })
      })
    })

    describe('when a SubscriberPackage are excluded by namespace', () => {
      const EXCLUDED_NAMESPACE = 'test'
      beforeEach(async () => {
        const filterContext = {
          ...defaultFilterContext,
          fetchProfile: buildFetchProfile({
            metadata: {
              exclude: [
                {
                  metadataType: 'InstalledPackage',
                  namespace: EXCLUDED_NAMESPACE,
                },
              ],
            },
          }),
        }
        const filter = filterCreator({ client, config: filterContext }) as FilterWith<'onFetch'>
        elements = [subscriberPackageType]
        await filter.onFetch(elements)
      })
      it('should skip all the instances from this namespace', () => {
        const includedPackageValuesFromQuery = QUERY_RESULT.flat()
          .map(record => record.SubscriberPackage)
          .filter(subscriberPackage => subscriberPackage.NamespacePrefix !== EXCLUDED_NAMESPACE)
        expect(elements.filter(isInstanceElement)).toHaveLength(includedPackageValuesFromQuery.length)
        includedPackageValuesFromQuery.forEach(subscriberPackageValueFromQuery => {
          expect(elements).toContainEqual(expect.objectContaining({
            refType: expect.objectContaining({ type: subscriberPackageType }),
            value: {
              Id: subscriberPackageValueFromQuery.Id,
              Name: subscriberPackageValueFromQuery.Name,
              NamespacePrefix: subscriberPackageValueFromQuery.NamespacePrefix,
              Description: subscriberPackageValueFromQuery.Description,
              IsPackageValid: subscriberPackageValueFromQuery.IsPackageValid,
            },
          }))
        })
      })
    })
    describe('when a SubscriberPackage are excluded by name', () => {
      const EXCLUDED_NAME = 'Test Package Name'
      beforeEach(async () => {
        const filterContext = {
          ...defaultFilterContext,
          fetchProfile: buildFetchProfile({
            metadata: {
              exclude: [
                {
                  metadataType: 'InstalledPackage',
                  name: EXCLUDED_NAME,
                },
              ],
            },
          }),
        }
        const filter = filterCreator({ client, config: filterContext }) as FilterWith<'onFetch'>
        elements = [subscriberPackageType]
        await filter.onFetch(elements)
      })
      it('should skip all the instances from this namespace', () => {
        const includedPackageValuesFromQuery = QUERY_RESULT.flat()
          .map(record => record.SubscriberPackage)
          .filter(subscriberPackage => subscriberPackage.Name !== EXCLUDED_NAME)
        expect(elements.filter(isInstanceElement)).toHaveLength(includedPackageValuesFromQuery.length)
        includedPackageValuesFromQuery.forEach(subscriberPackageValueFromQuery => {
          expect(elements).toContainEqual(expect.objectContaining({
            refType: expect.objectContaining({ type: subscriberPackageType }),
            value: {
              Id: subscriberPackageValueFromQuery.Id,
              Name: subscriberPackageValueFromQuery.Name,
              NamespacePrefix: subscriberPackageValueFromQuery.NamespacePrefix,
              Description: subscriberPackageValueFromQuery.Description,
              IsPackageValid: subscriberPackageValueFromQuery.IsPackageValid,
            },
          }))
        })
      })
    })
  })
})
