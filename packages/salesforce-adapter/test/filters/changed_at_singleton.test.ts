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
import {
  CORE_ANNOTATIONS,
  InstanceElement,
  Values,
  Element,
  isInstanceElement,
  isObjectType,
} from '@salto-io/adapter-api'
import { buildElementsSourceFromElements } from '@salto-io/adapter-utils'
import _ from 'lodash'
import { mockInstances } from '../mock_elements'
import filterCreator from '../../src/filters/changed_at_singleton'
import { FilterWith } from '../../src/filter'
import { CHANGED_AT_SINGLETON, FLOW_METADATA_TYPE } from '../../src/constants'
import { apiName } from '../../src/transformers/transformer'
import { defaultFilterContext } from '../utils'

describe('createChangedAtSingletonInstanceFilter', () => {
  describe('onFetch', () => {
    describe('when ChangedAtSingleton instance exists in the elementsSource', () => {
      const CHANGED_AT = '2023-03-28T00:00:00.000Z'

      let updatedInstanceTypeName: string
      let updatedInstanceName: string
      let changedAtSingleton: InstanceElement
      let previousChangedAtSingletonValue: Values
      let fetchedElements: Element[]

      beforeEach(async () => {
        const instances = mockInstances()
        const updatedInstance = instances.Profile
        updatedInstanceTypeName = await apiName(await updatedInstance.getType())
        updatedInstanceName = await apiName(updatedInstance)
        updatedInstance.annotations = {
          ...updatedInstance.annotations,
          [CORE_ANNOTATIONS.CHANGED_AT]: CHANGED_AT,
        }

        changedAtSingleton = instances.ChangedAtSingleton
        changedAtSingleton.value = {
          ...changedAtSingleton.value,
          [updatedInstanceTypeName]: {
            [updatedInstanceName]: '2023-03-01T00:00:00.000Z',
            NonModifiedInstance: '2023-03-01T00:00:00.000Z',
          },
          [FLOW_METADATA_TYPE]: {
            TestFlow: '2023-03-01T00:00:00.000Z',
            AnotherTestFlow: '2023-03-01T00:00:00.000Z',
          },
        }
        previousChangedAtSingletonValue = changedAtSingleton.clone().value
        const filter = filterCreator({
          config: {
            ...defaultFilterContext,
            elementsSource: buildElementsSourceFromElements([changedAtSingleton]),
          },
        }) as FilterWith<'onFetch'>
        fetchedElements = [updatedInstance]
        await filter.onFetch(fetchedElements)
      })
      it('should only update the info about the changed instances', async () => {
        expect(fetchedElements).toEqual(expect.arrayContaining([
          expect.objectContaining({ elemID: changedAtSingleton.elemID }),
          expect.objectContaining({ elemID: (await changedAtSingleton.getType()).elemID }),
        ]))
        expect(changedAtSingleton.value).not.toEqual(previousChangedAtSingletonValue)
        const expectedValues = _.cloneDeep(previousChangedAtSingletonValue)
        _.set(expectedValues, [updatedInstanceTypeName, updatedInstanceName], CHANGED_AT)
        expect(changedAtSingleton.value).toEqual(expectedValues)
      })
    })
    describe('when ChangedAtSingleton instance does not exist in the elementsSource', () => {
      const CHANGED_AT = '2023-03-28T00:00:00.000Z'

      let updatedInstanceTypeName: string
      let updatedInstanceName: string
      let fetchedElements: Element[]

      beforeEach(async () => {
        const updatedInstance = mockInstances().Profile
        updatedInstanceTypeName = await apiName(await updatedInstance.getType())
        updatedInstanceName = await apiName(updatedInstance)
        updatedInstance.annotations = {
          ...updatedInstance.annotations,
          [CORE_ANNOTATIONS.CHANGED_AT]: CHANGED_AT,
        }
        const filter = filterCreator({ config: defaultFilterContext }) as FilterWith<'onFetch'>
        fetchedElements = [updatedInstance]
        await filter.onFetch(fetchedElements)
      })
      it('should create the singleton and its type with correct values', async () => {
        const changedAtSingleton = fetchedElements
          .filter(isInstanceElement)
          .find(e => e.elemID.typeName === CHANGED_AT_SINGLETON)
        const changedAtType = fetchedElements
          .filter(isObjectType)
          .find(e => e.elemID.typeName === CHANGED_AT_SINGLETON)
        expect(changedAtSingleton).toBeDefined()
        expect(changedAtType).toBeDefined()
        expect(changedAtSingleton?.value).toEqual({
          [updatedInstanceTypeName]: {
            [updatedInstanceName]: CHANGED_AT,
          },
        })
      })
    })
    describe('when no Elements are annotated with _changed_at', () => {
      let fetchedElements: Element[]
      beforeEach(async () => {
        const { Profile: instance } = mockInstances()
        delete instance.annotations?.[CORE_ANNOTATIONS.CHANGED_AT]
        const filter = filterCreator({ config: defaultFilterContext }) as FilterWith<'onFetch'>
        fetchedElements = [instance]
        await filter.onFetch(fetchedElements)
      })

      it('should not create the singleton and its type', async () => {
        const changedAtSingleton = fetchedElements
          .filter(isInstanceElement)
          .find(e => e.elemID.typeName === CHANGED_AT_SINGLETON)
        const changedAtType = fetchedElements
          .filter(isObjectType)
          .find(e => e.elemID.typeName === CHANGED_AT_SINGLETON)
        expect(changedAtSingleton).toBeUndefined()
        expect(changedAtType).toBeUndefined()
      })
    })
  })
})
