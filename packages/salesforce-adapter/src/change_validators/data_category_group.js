"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
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
var adapter_api_1 = require("@salto-io/adapter-api");
var lowerdash_1 = require("@salto-io/lowerdash");
var constants_1 = require("../constants");
var utils_1 = require("../filters/utils");
var awu = lowerdash_1.collections.asynciterable.awu;
var destructiveDataCategoryGroupDeployError = function (instance) { return ({
    elemID: instance.elemID,
    severity: 'Warning',
    message: 'DataCategoryGroup deployments may be destructive',
    detailedMessage: 'Deploying category changes from one environment to another may permanently remove some categories and record categorizations. It is recommended to manually create data categories and record associations via the Salesforce UI from ‘Setup’ by entering ‘Data Categories’ in the Quick Find box, then selecting ‘Data Categories’. You can learn more about this deployment preview error here: https://help.salto.io/en/articles/8046692-datacategorygroup-deployment-may-be-destructive',
}); };
/*
Changes in DataCategoryGroup can be destructive (remove elements from the current environment).
Issue a warning on all such changes
*/
function changeValidator() {
    var _this = this;
    return function (changes) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (awu(changes)
                    .filter(adapter_api_1.isInstanceChange)
                    .filter(adapter_api_1.isAdditionOrModificationChange)
                    .filter(utils_1.isInstanceOfTypeChange(constants_1.DATA_CATEGORY_GROUP_METADATA_TYPE))
                    .map(adapter_api_1.getChangeData)
                    .map(destructiveDataCategoryGroupDeployError)
                    .toArray())];
        });
    }); };
}
exports["default"] = changeValidator();
