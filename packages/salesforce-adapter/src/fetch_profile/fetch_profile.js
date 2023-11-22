"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.validateFetchParameters = exports.buildFetchProfile = void 0;
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
var types_1 = require("../types");
var data_management_1 = require("./data_management");
var metadata_query_1 = require("./metadata_query");
var constants_1 = require("../constants");
var optionalFeaturesDefaultValues = {
    fetchProfilesUsingReadApi: false,
    generateRefsInProfiles: false,
    skipAliases: false,
    toolingDepsOfCurrentNamespace: false,
    fixRetrieveFilePaths: true,
};
var buildFetchProfile = function (_a) {
    var fetchParams = _a.fetchParams, _b = _a.metadataQuery, metadataQuery = _b === void 0 ? metadata_query_1.buildMetadataQuery({ fetchParams: fetchParams }) : _b;
    var data = fetchParams.data, fetchAllCustomSettings = fetchParams.fetchAllCustomSettings, optionalFeatures = fetchParams.optionalFeatures, maxInstancesPerType = fetchParams.maxInstancesPerType, preferActiveFlowVersions = fetchParams.preferActiveFlowVersions, addNamespacePrefixToFullName = fetchParams.addNamespacePrefixToFullName, warningSettings = fetchParams.warningSettings;
    return {
        dataManagement: data && data_management_1.buildDataManagement(data),
        isFeatureEnabled: function (name) { var _a, _b; return (_b = (_a = optionalFeatures === null || optionalFeatures === void 0 ? void 0 : optionalFeatures[name]) !== null && _a !== void 0 ? _a : optionalFeaturesDefaultValues[name]) !== null && _b !== void 0 ? _b : true; },
        shouldFetchAllCustomSettings: function () { return fetchAllCustomSettings !== null && fetchAllCustomSettings !== void 0 ? fetchAllCustomSettings : true; },
        maxInstancesPerType: maxInstancesPerType !== null && maxInstancesPerType !== void 0 ? maxInstancesPerType : constants_1.DEFAULT_MAX_INSTANCES_PER_TYPE,
        preferActiveFlowVersions: preferActiveFlowVersions !== null && preferActiveFlowVersions !== void 0 ? preferActiveFlowVersions : false,
        addNamespacePrefixToFullName: addNamespacePrefixToFullName !== null && addNamespacePrefixToFullName !== void 0 ? addNamespacePrefixToFullName : true,
        isWarningEnabled: function (name) {
            var _a;
            return ((_a = warningSettings === null || warningSettings === void 0 ? void 0 : warningSettings[name]) !== null && _a !== void 0 ? _a : true);
        },
        metadataQuery: metadataQuery,
    };
};
exports.buildFetchProfile = buildFetchProfile;
var validateFetchParameters = function (params, fieldPath) {
    var _a;
    metadata_query_1.validateMetadataParams((_a = params.metadata) !== null && _a !== void 0 ? _a : {}, __spreadArrays(fieldPath, [types_1.METADATA_CONFIG]));
    if (params.data !== undefined) {
        data_management_1.validateDataManagementConfig(params.data, __spreadArrays(fieldPath, [types_1.DATA_CONFIGURATION]));
    }
};
exports.validateFetchParameters = validateFetchParameters;
