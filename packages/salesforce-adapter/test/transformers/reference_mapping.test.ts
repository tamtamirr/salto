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
import { InstanceElement, ReferenceExpression, toChange } from '@salto-io/adapter-api'
import { GetLookupNameFunc, resolveValues } from '@salto-io/adapter-utils'
import { mockTypes } from '../mock_elements'
import { getLookupNameFromChangeGroup } from '../../src/transformers/reference_mapping'
import { CUSTOM_OBJECT_ID_FIELD, SALESFORCE_METADATA_GROUP } from '../../src/constants'

describe('referenceMapping tests', () => {
  describe('getLookupNameFromChangeGroup', () => {
    const FIELD_NAME = 'Product__c'

    let firstProduct: InstanceElement
    let secondProduct: InstanceElement
    let getLookupNameFunc: GetLookupNameFunc

    beforeEach(() => {
      firstProduct = new InstanceElement(
        'Product1',
        mockTypes.Product2,
        {
          Name: 'Product1',
        }
      )
      secondProduct = new InstanceElement(
        'Product2',
        mockTypes.Product2,
        {
          Name: 'Product2',
        }
      )
      firstProduct.value[FIELD_NAME] = new ReferenceExpression(secondProduct.elemID, secondProduct)
      secondProduct.value[FIELD_NAME] = new ReferenceExpression(firstProduct.elemID, firstProduct)
    })
    describe('when the default strategy resolves to undefined', () => {
      describe('when both Products are in the same ChangeGroup', () => {
        describe(`when the groupID is ${SALESFORCE_METADATA_GROUP}`, () => {
          beforeEach(() => {
            const changes = [
              toChange({ after: firstProduct }),
              toChange({ after: secondProduct }),
            ]
            getLookupNameFunc = getLookupNameFromChangeGroup({
              groupID: SALESFORCE_METADATA_GROUP,
              changes,
            })
          })
          it('should resolve to undefined', async () => {
            const resolvedFirstProduct = await resolveValues(firstProduct, getLookupNameFunc)
            const resolvedSecondProduct = await resolveValues(secondProduct, getLookupNameFunc)
            expect(resolvedFirstProduct.value).toEqual({
              Name: 'Product1',
              [FIELD_NAME]: undefined,
            })
            expect(resolvedSecondProduct.value).toEqual({
              Name: 'Product2',
              [FIELD_NAME]: undefined,
            })
          })
        })
        describe(`when the groupID is not ${SALESFORCE_METADATA_GROUP}`, () => {
          beforeEach(() => {
            const changes = [
              toChange({ after: firstProduct }),
              toChange({ after: secondProduct }),
            ]
            getLookupNameFunc = getLookupNameFromChangeGroup({
              groupID: 'Test_Group',
              changes,
            })
          })

          it('should resolve to the referenced Product InstanceElement', async () => {
            const resolvedFirstProduct = await resolveValues(firstProduct, getLookupNameFunc)
            const resolvedSecondProduct = await resolveValues(secondProduct, getLookupNameFunc)
            expect(resolvedFirstProduct.value).toEqual({
              Name: 'Product1',
              [FIELD_NAME]: secondProduct,
            })
            expect(resolvedSecondProduct.value).toEqual({
              Name: 'Product2',
              [FIELD_NAME]: firstProduct,
            })
          })
        })
      })
      describe('when the Products are in different ChangeGroups', () => {
        beforeEach(() => {
          const changes = [
            toChange({ after: firstProduct }),
          ]
          getLookupNameFunc = getLookupNameFromChangeGroup({
            groupID: 'Test_Group',
            changes,
          })
        })
        it('should resolve to undefined', async () => {
          const resolvedFirstProduct = await resolveValues(firstProduct, getLookupNameFunc)
          expect(resolvedFirstProduct.value).toEqual({
            Name: 'Product1',
            [FIELD_NAME]: undefined,
          })
        })
      })
    })
    describe('when the default strategy resolves to Id', () => {
      const FIRST_PRODUCT_ID = '01t000000000000'
      const SECOND_PRODUCT_ID = '01t13D000000000'
      beforeEach(() => {
        firstProduct.value[CUSTOM_OBJECT_ID_FIELD] = FIRST_PRODUCT_ID
        secondProduct.value[CUSTOM_OBJECT_ID_FIELD] = SECOND_PRODUCT_ID
      })
      describe('when both Products are in the same ChangeGroup', () => {
        beforeEach(() => {
          const changes = [
            toChange({ after: firstProduct }),
            toChange({ after: secondProduct }),
          ]
          getLookupNameFunc = getLookupNameFromChangeGroup({
            groupID: 'Test_Group',
            changes,
          })
        })
        it('should resolve to the Product Id', async () => {
          const resolvedFirstProduct = await resolveValues(firstProduct, getLookupNameFunc)
          const resolvedSecondProduct = await resolveValues(secondProduct, getLookupNameFunc)
          expect(resolvedFirstProduct.value).toEqual({
            [CUSTOM_OBJECT_ID_FIELD]: FIRST_PRODUCT_ID,
            Name: 'Product1',
            [FIELD_NAME]: SECOND_PRODUCT_ID,
          })
          expect(resolvedSecondProduct.value).toEqual({
            [CUSTOM_OBJECT_ID_FIELD]: SECOND_PRODUCT_ID,
            Name: 'Product2',
            [FIELD_NAME]: FIRST_PRODUCT_ID,
          })
        })
      })
      describe('when the Products are in different ChangeGroups', () => {
        beforeEach(() => {
          const changes = [
            toChange({ after: firstProduct }),
          ]
          getLookupNameFunc = getLookupNameFromChangeGroup({
            groupID: 'Test_Group',
            changes,
          })
        })
        it('should resolve to the Product Id', async () => {
          const resolvedFirstProduct = await resolveValues(firstProduct, getLookupNameFunc)
          const resolvedSecondProduct = await resolveValues(secondProduct, getLookupNameFunc)
          expect(resolvedFirstProduct.value).toEqual({
            [CUSTOM_OBJECT_ID_FIELD]: FIRST_PRODUCT_ID,
            Name: 'Product1',
            [FIELD_NAME]: SECOND_PRODUCT_ID,
          })
          expect(resolvedSecondProduct.value).toEqual({
            [CUSTOM_OBJECT_ID_FIELD]: SECOND_PRODUCT_ID,
            Name: 'Product2',
            [FIELD_NAME]: FIRST_PRODUCT_ID,
          })
        })
      })
    })
  })
})
