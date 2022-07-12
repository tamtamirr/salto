/*
*                      Copyright 2022 Salto Labs Ltd.
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
  Change,
  Element,
  ElemID,
  getChangeData,
  InstanceElement,
  isInstanceElement,
  ObjectType,
} from '@salto-io/adapter-api'
import { buildElementsSourceFromElements } from '@salto-io/adapter-utils'
import filterCreator from '../../src/filters/split_custom_labels'
import mockClient from '../client'
import { defaultFilterContext } from '../utils'
import { FilterWith } from '../../src/filter'
import {
  CUSTOM_LABEL_METADATA_TYPE,
  CUSTOM_LABELS_METADATA_TYPE,
  INSTANCE_FULL_NAME_FIELD, METADATA_TYPE,
  RECORDS_PATH,
  SALESFORCE,
} from '../../src/constants'


describe('Test split custom labels filter', () => {
  let customLabelsType: ObjectType
  let customLabelType: ObjectType
  beforeEach(() => {
    customLabelsType = new ObjectType({
      elemID: new ElemID(SALESFORCE, CUSTOM_LABELS_METADATA_TYPE),
      annotations: {
        [METADATA_TYPE]: CUSTOM_LABELS_METADATA_TYPE,
      },
    })
    customLabelType = new ObjectType({
      elemID: new ElemID(SALESFORCE, CUSTOM_LABEL_METADATA_TYPE),
      annotations: {
        [METADATA_TYPE]: CUSTOM_LABEL_METADATA_TYPE,
      },
    })
  })
  describe('fetch', () => {
    const CUSTOM_LABEL_1 = 'CustomLabel1'
    const CUSTOM_LABEL_2 = 'CustomLabel2'

    let customLabelsInstance: InstanceElement
    const filter = (): FilterWith<'onFetch'> => filterCreator({
      client: mockClient().client,
      config: defaultFilterContext,
    }) as FilterWith<'onFetch'>

    const runFetch = async (...elements: Element[]): Promise<Element[]> => {
      await filter().onFetch(elements)
      return elements
    }

    beforeEach(() => {
      customLabelsInstance = new InstanceElement(
        CUSTOM_LABEL_METADATA_TYPE,
        customLabelsType,
        {
          [INSTANCE_FULL_NAME_FIELD]: CUSTOM_LABELS_METADATA_TYPE,
          labels: [
            { fullName: CUSTOM_LABEL_1 },
            { fullName: CUSTOM_LABEL_2 },
          ],
        },
      )
    })
    it('should skip if theres no CustomLabels instance', async () => {
      const receivedElements = await runFetch(customLabelType)
      expect(receivedElements).toEqual([customLabelType])
    })

    it('should skip if theres no CustomLabel type', async () => {
      const receivedElements = await runFetch(customLabelsInstance)
      expect(receivedElements).toEqual([customLabelsInstance])
    })

    it('should split CustomLabels instance into CustomLabel instances and remove it', async () => {
      const receivedElements = await runFetch(customLabelsInstance, customLabelType)
      const receivedCustomLabelInstances = receivedElements
        .filter(e => e.elemID.typeName === CUSTOM_LABEL_METADATA_TYPE)
      expect(receivedCustomLabelInstances).toIncludeAllPartialMembers([
        {
          value: customLabelsInstance.value.labels[0],
          path: [SALESFORCE, RECORDS_PATH, CUSTOM_LABEL_METADATA_TYPE, CUSTOM_LABEL_1],
        },
        {
          value: customLabelsInstance.value.labels[1],
          path: [SALESFORCE, RECORDS_PATH, CUSTOM_LABEL_METADATA_TYPE, CUSTOM_LABEL_2],
        },
      ])
      // validates the custom labels instance was removed
      expect(receivedElements)
        .not.toSatisfyAny(e => e.elemID.typeName === CUSTOM_LABELS_METADATA_TYPE)
    })
  })
  describe('preDeploy', () => {
    const CUSTOM_LABEL_NAME = 'TestCustomLabel'
    const OTHER_CHANGE_NAME = 'OtherChange'

    let customLabelChange: Change
    let otherChange: Change
    let afterCustomLabelInstance: InstanceElement

    let filter: () => FilterWith<'preDeploy'>


    const runPreDeploy = async (...changes: Change[]): Promise<Change[]> => {
      await filter().preDeploy(changes)
      return changes
    }

    beforeEach(() => {
      const otherChangeType = new ObjectType({
        elemID: new ElemID(SALESFORCE, 'OtherChangeType'),
      })
      afterCustomLabelInstance = new InstanceElement(
        CUSTOM_LABEL_NAME,
        customLabelType,
        {
          [INSTANCE_FULL_NAME_FIELD]: CUSTOM_LABEL_NAME,
          categories: 'modifiedTestCategory',
          language: 'en-US',
          protected: true,
          shortDescription: 'Test Custom Label',
          value: 'Test Label Value',
        }
      )
      customLabelChange = {
        action: 'modify',
        data: {
          before: new InstanceElement(
            CUSTOM_LABEL_NAME,
            customLabelType,
            {
              [INSTANCE_FULL_NAME_FIELD]: CUSTOM_LABEL_NAME,
              categories: 'testCategory',
              language: 'en-US',
              protected: true,
              shortDescription: 'Test Custom Label',
              value: 'Test Label Value',
            }
          ),
          after: afterCustomLabelInstance,
        },
      }
      otherChange = {
        action: 'modify',
        data: {
          before: new InstanceElement(
            OTHER_CHANGE_NAME,
            otherChangeType,
            {
              testField: 'testValue',
            }
          ),
          after: new InstanceElement(
            OTHER_CHANGE_NAME,
            otherChangeType,
            {
              testField: 'modified testValue',
            }
          ),
        },
      }
      filter = () => filterCreator({
        client: mockClient().client,
        config: {
          ...defaultFilterContext,
          elementsSource: buildElementsSourceFromElements([customLabelsType]),
        },
      }) as FilterWith<'preDeploy'>
    })
    it('should prepare CustomLabels change in preDeploy', async () => {
      const preDeployChanges = await runPreDeploy(customLabelChange, otherChange)
      expect(preDeployChanges).toHaveLength(2)
      const customLabelsChangeInstance = preDeployChanges
        .map(getChangeData)
        .filter(isInstanceElement)
        .find(e => e.elemID.typeName === CUSTOM_LABELS_METADATA_TYPE)
      expect(customLabelsChangeInstance?.value).toMatchObject({
        labels: [afterCustomLabelInstance.value],
      })
    })
  })
})
