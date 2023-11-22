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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
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
var lodash_1 = require("lodash");
var adapter_api_1 = require("@salto-io/adapter-api");
var lowerdash_1 = require("@salto-io/lowerdash");
var adapter_utils_1 = require("@salto-io/adapter-utils");
var constants_1 = require("../constants");
var reference_mapping_1 = require("../transformers/reference_mapping");
var custom_object_instances_deploy_1 = require("../custom_object_instances_deploy");
var awu = lowerdash_1.collections.asynciterable.awu;
var getUpdateErrorsForNonUpdateableFields = function (before, after) { return __awaiter(void 0, void 0, void 0, function () {
    var beforeResolved, afterResolved, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, adapter_utils_1.resolveValues(before, reference_mapping_1.getLookUpName)];
            case 1:
                beforeResolved = _c.sent();
                return [4 /*yield*/, adapter_utils_1.resolveValues(after, reference_mapping_1.getLookUpName)];
            case 2:
                afterResolved = _c.sent();
                _b = (_a = Object).values;
                return [4 /*yield*/, afterResolved.getType()];
            case 3: return [2 /*return*/, _b.apply(_a, [(_c.sent()).fields])
                    .filter(function (field) { return !field.annotations[constants_1.FIELD_ANNOTATIONS.UPDATEABLE]; })
                    .map(function (field) {
                    if (afterResolved.value[field.name] !== beforeResolved.value[field.name]) {
                        return {
                            elemID: beforeResolved.elemID,
                            severity: 'Warning',
                            message: 'Cannot modify the value of a non-updatable field',
                            detailedMessage: "Cannot modify " + field.name + "\u2019s value of " + beforeResolved.elemID.getFullName() + " because its field is defined as non-updateable.",
                        };
                    }
                    return undefined;
                }).filter(lowerdash_1.values.isDefined)];
        }
    });
}); };
var getCreateErrorsForNonCreatableFields = function (after) { return __awaiter(void 0, void 0, void 0, function () {
    var afterResolved, _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, adapter_utils_1.resolveValues(after, reference_mapping_1.getLookUpName)];
            case 1:
                afterResolved = _d.sent();
                _a = awu;
                _c = (_b = Object).values;
                return [4 /*yield*/, afterResolved.getType()];
            case 2: return [2 /*return*/, _a.apply(void 0, [_c.apply(_b, [(_d.sent()).fields])])
                    .filter(function (field) { return !field.annotations[constants_1.FIELD_ANNOTATIONS.CREATABLE]; })
                    .map(function (field) {
                    if (!lodash_1["default"].isUndefined(afterResolved.value[field.name])) {
                        return {
                            elemID: afterResolved.elemID,
                            severity: 'Warning',
                            message: 'Cannot set a value to a non-creatable field',
                            detailedMessage: "Cannot set a value for " + field.name + " of " + afterResolved.elemID.getFullName() + " because its field is defined as non-creatable.",
                        };
                    }
                    return undefined;
                }).filter(lowerdash_1.values.isDefined)
                    .toArray()];
        }
    });
}); };
var changeValidator = function (changes) { return __awaiter(void 0, void 0, void 0, function () {
    var updateChangeErrors, createChangeErrors;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, awu(changes)
                    .filter(custom_object_instances_deploy_1.isInstanceOfCustomObjectChange)
                    .filter(adapter_api_1.isModificationChange)
                    .flatMap(function (change) {
                    return getUpdateErrorsForNonUpdateableFields(change.data.before, change.data.after);
                })
                    .toArray()];
            case 1:
                updateChangeErrors = _a.sent();
                return [4 /*yield*/, awu(changes)
                        .filter(custom_object_instances_deploy_1.isInstanceOfCustomObjectChange)
                        .filter(adapter_api_1.isAdditionChange)
                        .flatMap(function (change) { return getCreateErrorsForNonCreatableFields(adapter_api_1.getChangeData(change)); })
                        .toArray()];
            case 2:
                createChangeErrors = _a.sent();
                return [2 /*return*/, __spreadArrays(updateChangeErrors, createChangeErrors)];
        }
    });
}); };
exports["default"] = changeValidator;
