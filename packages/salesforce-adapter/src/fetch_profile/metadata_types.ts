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

import _ from 'lodash'

export const METADATA_TYPES_WITHOUT_DEPENDENCIES = [
  'AIApplication',
  'AIApplicationConfig',
  'AccessMapping',
  'AccountSharingRuleSettings',
  'ActionLinkGroupTemplate',
  'ActionLinkTemplate',
  'ActionOverride',
  'AnalyticSnapshot',
  'AnalyticSnapshotMapping',
  'AnalyticsCloudComponentLayoutItem',
  'AnimationRule',
  'ApexClass',
  'ApexComponent',
  'ApexEmailNotification',
  'ApexEmailNotifications',
  'ApexPage',
  'ApexTestSuite',
  'ApexTrigger',
  'AppActionOverride',
  'AppBrand',
  'AppComponentList',
  'AppMenu',
  'AppMenuItem',
  'AppPreferences',
  'AppProfileActionOverride',
  'AppSettings',
  'AppWorkspaceConfig',
  'AppointmentAssignmentPolicy',
  'AppointmentSchedulingPolicy',
  'ApprovalAction',
  'ApprovalEntryCriteria',
  'ApprovalPageField',
  'ApprovalProcess',
  'ApprovalStep',
  'ApprovalStepApprover',
  'ApprovalStepRejectBehavior',
  'ApprovalSubmitter',
  'Approver',
  'ArticleTypeChannelDisplay',
  'ArticleTypeTemplate',
  'AssignmentRules',
  'Attachment',
  'AuraDefinition',
  'AuraDefinitionBundle',
  'AuraDefinitions',
  'AuthProvider',
  'AutoResponseRule',
  'AutoResponseRules',
  'BlacklistedConsumer',
  'BrandingSet',
  'BrandingSetProperty',
  'BriefcaseDefinition',
  'BriefcaseRule',
  'BriefcaseRuleFilter',
  'BusinessProcess',
  'CallCenter',
  'CallCenterItem',
  'CallCenterRoutingMap',
  'CallCenterSection',
  'CallCoachingMediaProvider',
  'CanvasMetadata',
  'Capabilities',
  'Certificate',
  'ChannelLayout',
  'ChannelLayoutItem',
  'ChartSummary',
  'ChatterAnswersReputationLevel',
  'ChatterExtension',
  'CleanDataService',
  'CleanRule',
  'Community',
  'CompactLayout',
  'ComponentInstance',
  'ComponentInstanceProperty',
  'ComponentInstancePropertyList',
  'ComponentInstancePropertyListItem',
  'ConnectedApp',
  'ConnectedAppAttribute',
  'ConnectedAppCanvasConfig',
  'ConnectedAppIpRange',
  'ConnectedAppMobileDetailConfig',
  'ConnectedAppOauthAssetToken',
  'ConnectedAppOauthConfig',
  'ConnectedAppOauthIdToken',
  'ConnectedAppOauthPolicy',
  'ConnectedAppSamlConfig',
  'ConnectedAppSessionPolicy',
  'ContactCenterChannel',
  'Container',
  'ContentAsset',
  'ContentAssetLink',
  'ContentAssetRelationships',
  'ContentAssetVersion',
  'ContentAssetVersions',
  'ConversationVendorInfo',
  'CorsWhitelistOrigin',
  'CspTrustedSite',
  'CustomApplication',
  'CustomApplicationComponent',
  'CustomConsoleComponents',
  'CustomFeedFilter',
  'CustomFieldTranslation',
  'CustomHelpMenuItem',
  'CustomHelpMenuSection',
  'CustomHttpHeader',
  'CustomLabels',
  'CustomMetadataValue',
  'CustomNotificationType',
  'CustomObjectTranslation',
  'CustomPageWebLink',
  'CustomPermission',
  'CustomPermissionDependencyRequired',
  'CustomShortcut',
  'CustomSite',
  'CustomTab',
  'CustomValue',
  'DashboardComponent',
  'DashboardComponentColumn',
  'DashboardComponentGroupingSort',
  'DashboardComponentGroupingSortProperties',
  'DashboardComponentSection',
  'DashboardComponentSortInfo',
  'DashboardDynamicValue',
  'DashboardFilter',
  'DashboardFilterColumn',
  'DashboardFilterOption',
  'DashboardFlexTableComponentProperties',
  'DashboardFolder',
  'DashboardGridComponent',
  'DashboardGridLayout',
  'DashboardTableColumn',
  'DataCategory',
  'DataCategoryGroup',
  'DefaultShortcut',
  'DelegateGroup',
  'Document',
  'DocumentFolder',
  'DuplicateRule',
  'DuplicateRuleFilter',
  'DuplicateRuleFilterItem',
  'DuplicateRuleMatchRule',
  'EclairGeoData',
  'EclairMap',
  'EmailFolder',
  'EmailServicesAddress',
  'EmailServicesFunction',
  'EmbeddedServiceAppointmentSettings',
  'EmbeddedServiceBranding',
  'EmbeddedServiceConfig',
  'EmbeddedServiceCustomComponent',
  'EmbeddedServiceCustomLabel',
  'EmbeddedServiceCustomization',
  'EmbeddedServiceFlow',
  'EmbeddedServiceFlowConfig',
  'EmbeddedServiceLayout',
  'EmbeddedServiceLayoutRule',
  'EmbeddedServiceMenuItem',
  'EmbeddedServiceMenuSettings',
  'EmbeddedServiceResource',
  'EnrichedField',
  'EntitlementProcess',
  'EntitlementProcessMilestoneItem',
  'EntitlementProcessMilestoneTimeTrigger',
  'EntitlementTemplate',
  'EntityImplements',
  'EscalationAction',
  'EscalationRules',
  'ExternalCredential',
  'ExternalCredentialParameter',
  'ExternalDataSource',
  'ExternalDataSrcDescriptor',
  'ExternalServiceOperation',
  'ExternalServiceRegistration',
  'FeedFilterCriterion',
  'FeedLayout',
  'FeedLayoutComponent',
  'FeedLayoutFilter',
  'FieldImplements',
  'FieldInstance',
  'FieldInstanceProperty',
  'FieldMapping',
  'FieldMappingField',
  'FieldMappingRow',
  'FieldOverride',
  'FieldRestrictionRule',
  'FieldSet',
  'FieldSetItem',
  'FieldSetTranslation',
  'FlexiPageEvent',
  'FlexiPageEventPropertyMapping',
  'FlexiPageEventSourceProperty',
  'FlexiPageEventTarget',
  'FlexiPageEventTargetProperty',
  'Flow',
  'FlowActionCall',
  'FlowActionCallInputParameter',
  'FlowActionCallOutputParameter',
  'FlowApexPluginCall',
  'FlowApexPluginCallInputParameter',
  'FlowApexPluginCallOutputParameter',
  'FlowAssignment',
  'FlowAssignmentItem',
  'FlowCategory',
  'FlowCategoryItems',
  'FlowChoice',
  'FlowChoiceUserInput',
  'FlowCollectionMapItem',
  'FlowCollectionProcessor',
  'FlowCollectionSortOption',
  'FlowCondition',
  'FlowConnector',
  'FlowConstant',
  'FlowDataTypeMapping',
  'FlowDecision',
  'FlowDynamicChoiceSet',
  'FlowElementReferenceOrValue',
  'FlowFormula',
  'FlowInputFieldAssignment',
  'FlowInputValidationRule',
  'FlowLoop',
  'FlowMetadataValue',
  'FlowOrchestratedStage',
  'FlowOutputFieldAssignment',
  'FlowRecordCreate',
  'FlowRecordDelete',
  'FlowRecordFilter',
  'FlowRecordLookup',
  'FlowRecordRollback',
  'FlowRecordUpdate',
  'FlowRule',
  'FlowSchedule',
  'FlowScheduledPath',
  'FlowScreen',
  'FlowScreenField',
  'FlowScreenFieldInputParameter',
  'FlowScreenFieldOutputParameter',
  'FlowScreenRule',
  'FlowScreenRuleAction',
  'FlowStage',
  'FlowStageStep',
  'FlowStageStepAssignee',
  'FlowStageStepEntryActionInputParameter',
  'FlowStageStepEntryActionOutputParameter',
  'FlowStageStepExitActionInputParameter',
  'FlowStageStepExitActionOutputParameter',
  'FlowStageStepInputParameter',
  'FlowStageStepOutputParameter',
  'FlowStart',
  'FlowStep',
  'FlowSubflow',
  'FlowSubflowInputAssignment',
  'FlowSubflowOutputAssignment',
  'FlowTest',
  'FlowTestAssertion',
  'FlowTestCondition',
  'FlowTestParameter',
  'FlowTestPoint',
  'FlowTestReferenceOrValue',
  'FlowTextTemplate',
  'FlowVariable',
  'FlowVisibilityRule',
  'FlowWait',
  'FlowWaitEvent',
  'FlowWaitEventInputParameter',
  'FlowWaitEventOutputParameter',
  'FolderShare',
  'GatewayProviderPaymentMethodType',
  'GlobalValueSet',
  'GlobalValueSetTranslation',
  'Group',
  'HistoryRetentionPolicy',
  'HomePageComponent',
  'HomePageLayout',
  'IPAddressRange',
  'IdeaReputationLevel',
  'IfExpression',
  'IframeWhiteListUrl',
  'IframeWhiteListUrlSettings',
  'InboundNetworkConnProperty',
  'InboundNetworkConnection',
  'Index',
  'IndexField',
  'InstalledPackage',
  'ItemInstance',
  'KeyboardShortcuts',
  'Layout',
  'LayoutColumn',
  'LayoutItem',
  'LayoutSection',
  'LayoutSectionTranslation',
  'LayoutTranslation',
  'LeadConvertSettings',
  'Letterhead',
  'LetterheadHeaderFooter',
  'LetterheadLine',
  'LightningBolt',
  'LightningBoltFeatures',
  'LightningBoltImages',
  'LightningBoltItems',
  'LightningComponentBundle',
  'LightningExperienceTheme',
  'LightningMessageChannel',
  'LightningMessageField',
  'LightningOnboardingConfig',
  'LightningPage',
  'LightningPageRegion',
  'LightningPageTemplateInstance',
  'ListPlacement',
  'ListView',
  'ListViewFilter',
  'LiveAgentConfig',
  'LiveChatSensitiveDataRule',
  'LoginFlow',
  'LookupFilterTranslation',
  'LwcResource',
  'LwcResources',
  'MLDataDefinition',
  'MLField',
  'MLFilter',
  'MLPredictionDefinition',
  'MLRecommendationDefinition',
  'ManagedContentNodeType',
  'ManagedContentType',
  'MapExpression',
  'MatchingRule',
  'MatchingRuleItem',
  'MatchingRules',
  'MilestoneType',
  'MiniLayout',
  'MktDataLakeAttributes',
  'MktDataLakeFieldAttributes',
  'MktDataModelAttributes',
  'MktDataModelFieldAttributes',
  'MobileApplicationDetail',
  'MutingPermissionSet',
  'MyDomainDiscoverableLogin',
  'NamedCredential',
  'NamedCredentialParameter',
  'NetworkBranding',
  'NextAutomatedApprover',
  'NotificationChannels',
  'NotificationTypeConfig',
  'NotificationTypeSettings',
  'OauthCustomScope',
  'OauthCustomScopeApp',
  'ObjectMapping',
  'ObjectMappingField',
  'ObjectNameCaseValue',
  'ObjectRelationship',
  'ObjectUsage',
  'OutboundNetworkConnProperty',
  'OutboundNetworkConnection',
  'PackageVersion',
  'PathAssistant',
  'PathAssistantStep',
  'PaymentGatewayProvider',
  'PermissionSet',
  'PermissionSetApexClassAccess',
  'PermissionSetApexPageAccess',
  'PermissionSetApplicationVisibility',
  'PermissionSetCustomMetadataTypeAccess',
  'PermissionSetCustomPermissions',
  'PermissionSetCustomSettingAccess',
  'PermissionSetCustomSettingAccesses',
  'PermissionSetExternalDataSourceAccess',
  'PermissionSetFieldPermissions',
  'PermissionSetFlowAccess',
  'PermissionSetGroup',
  'PermissionSetObjectPermissions',
  'PermissionSetRecordTypeVisibility',
  'PermissionSetTabSetting',
  'PermissionSetUserPermission',
  'PicklistValue',
  'PicklistValueTranslation',
  'PlatformActionList',
  'PlatformActionListItem',
  'PlatformCachePartition',
  'PlatformCachePartitionType',
  'PlatformEventChannel',
  'PlatformEventChannelMember',
  'PlatformEventSubscriberConfig',
  'PostTemplate',
  'PrimaryTabComponents',
  'ProductAttributeSet',
  'ProductAttributeSetItem',
  'Profile',
  'ProfileActionOverride',
  'ProfileApexClassAccess',
  'ProfileApexPageAccess',
  'ProfileApplicationVisibility',
  'ProfileCategoryGroupVisibility',
  'ProfileCustomMetadataTypeAccess',
  'ProfileCustomPermissions',
  'ProfileCustomSettingAccess',
  'ProfileExternalDataSourceAccess',
  'ProfileFieldLevelSecurity',
  'ProfileFlowAccess',
  'ProfileLayoutAssignment',
  'ProfileLoginHours',
  'ProfileLoginIpRange',
  'ProfileObjectPermissions',
  'ProfilePasswordPolicy',
  'ProfileRecordTypeVisibility',
  'ProfileSearchLayouts',
  'ProfileSessionSetting',
  'ProfileTabVisibility',
  'ProfileUserPermission',
  'Prompt',
  'PromptVersion',
  'PublicGroups',
  'PushNotification',
  'Queue',
  'QueueMembers',
  'QueueSobject',
  'QuickAction',
  'QuickActionLayout',
  'QuickActionLayoutColumn',
  'QuickActionLayoutItem',
  'QuickActionList',
  'QuickActionListItem',
  'QuickActionSendEmailOptions',
  'QuickActionTranslation',
  'RecommendationConditionValue',
  'RecommendationLoadCondition',
  'RecommendationStrategy',
  'RecordActionDefaultItem',
  'RecordActionDeployment',
  'RecordActionDeploymentChannel',
  'RecordActionDeploymentContext',
  'RecordActionRecommendation',
  'RecordActionSelectableItem',
  'RecordType',
  'RecordTypePicklistValue',
  'RecordTypeTranslation',
  'RedirectWhitelistUrl',
  'RelatedContent',
  'RelatedContentItem',
  'RelatedList',
  'RelatedListItem',
  'RemoteSiteSetting',
  'ReportAggregate',
  'ReportAggregateReference',
  'ReportBlockInfo',
  'ReportBucketField',
  'ReportBucketFieldSourceValue',
  'ReportBucketFieldValue',
  'ReportChart',
  'ReportChartComponentLayoutItem',
  'ReportColorRange',
  'ReportColumn',
  'ReportCrossFilter',
  'ReportCustomDetailFormula',
  'ReportDataCategoryFilter',
  'ReportFilter',
  'ReportFilterItem',
  'ReportFolder',
  'ReportFormattingRule',
  'ReportFormattingRuleValue',
  'ReportGrouping',
  'ReportHistoricalSelector',
  'ReportLayoutSection',
  'ReportParam',
  'ReportTimeFrameFilter',
  'ReportType',
  'ReportTypeColumn',
  'ReputationLevels',
  'RestrictionRule',
  'Role',
  'RoleAndSubordinates',
  'RoleAndSubordinatesInternal',
  'Roles',
  'RuleEntry',
  'SamlSsoConfig',
  'Scontrol',
  'SearchLayouts',
  'ServiceCloudConsoleConfig',
  'SharedTo',
  'SharingCriteriaRule',
  'SharingGuestRule',
  'SharingOwnerRule',
  'SharingReason',
  'SharingReasonTranslation',
  'SharingRecalculation',
  'SharingRules',
  'SharingSet',
  'SharingTerritoryRule',
  'SidebarComponent',
  'SiteDotCom',
  'SiteIframeWhiteListUrl',
  'SiteRedirectMapping',
  'SiteWebAddress',
  'Skill',
  'SkillAssignments',
  'SkillProfileAssignments',
  'SkillUserAssignments',
  'StandardFieldTranslation',
  'StandardValue',
  'StandardValueSet',
  'StandardValueSetTranslation',
  'StaticResource',
  'StrategyAction',
  'StrategyActionArg',
  'StrategyNodeExclusive',
  'StrategyNodeFilter',
  'StrategyNodeIf',
  'StrategyNodeInvocableAction',
  'StrategyNodeInvocableActionArg',
  'StrategyNodeMap',
  'StrategyNodeRecommendationLimit',
  'StrategyNodeRecommendationLoad',
  'StrategyNodeSort',
  'StrategyNodeSortField',
  'StrategyNodeUnion',
  'SubtabComponents',
  'SummaryLayout',
  'SummaryLayoutItem',
  'SynonymDictionary',
  'SynonymGroup',
  'TabLimitConfig',
  'Targets',
  'TopicsForObjects',
  'TransactionSecurityAction',
  'TransactionSecurityNotification',
  'TransactionSecurityPolicy',
  'UiFormulaCriterion',
  'UiFormulaRule',
  'UserProfileSearchScope',
  'UserProvisioningConfig',
  'Users',
  'ValidationRule',
  'ValidationRuleTranslation',
  'ValueSet',
  'ValueSetValuesDefinition',
  'ValueTranslation',
  'VendorCallCenterStatusMap',
  'WebLink',
  'WebLinkTranslation',
  'WorkflowActionReference',
  'WorkflowAlert',
  'WorkflowEmailRecipient',
  'WorkflowFieldUpdate',
  'WorkflowFlowAction',
  'WorkflowFlowActionParameter',
  'WorkflowKnowledgePublish',
  'WorkflowOutboundMessage',
  'WorkflowRule',
  'WorkflowTask',
  'WorkflowTaskTranslation',
  'WorkflowTimeTrigger',
  'WorkspaceMapping',
] as const

export const METADATA_TYPES_WITH_DEPENDENCIES = [
  'CustomMetadata',
  'CustomObject',
  'Workflow',
] as const

export const EXCLUDED_METADATA_TYPES = [
  'AssignmentRule', // Fetched through parent type
  'CustomField', // Has a specific handling in Salto
  'CustomIndex', // Cannot retrieve by Record name
  'CustomLabel', // Fetched through parent type
  'EmailTemplate', // Fetched with specific names
  'EscalationRule', // Fetched through parent type
  'FlowDefinition', // Not recommended since API version 44.0
  'Settings', // Has a specific handling in Salto
  'Report', // Fetched with specific names
  'Dashboard', // Fetched with specific names
] as const


export const SUPPORTED_METADATA_TYPES = [
  ...METADATA_TYPES_WITHOUT_DEPENDENCIES,
  ...METADATA_TYPES_WITH_DEPENDENCIES,
] as const

export const CUSTOM_OBJECT_DEPENDENCIES = [
  'WebLink',
  'ValidationRule',
  'BusinessProcess',
  'RecordType',
  'ListView',
  'FieldSet',
  'CompactLayout',
  'SharingReason',
  'Index',
] as const

export const WORKFLOW_DEPENDENCIES = [
  'WorkflowAlert',
  'WorkflowFieldUpdate',
  'WorkflowFlowAction',
  'WorkflowOutboundMessage',
  'WorkflowKnowledgePublish',
  'WorkflowTask',
  'WorkflowRule',
] as const

export type MetadataTypeWithoutDependencies = typeof METADATA_TYPES_WITHOUT_DEPENDENCIES[number]
export type MetadataTypeWithDependencies = typeof METADATA_TYPES_WITH_DEPENDENCIES[number]
export type ExcludedMetadataType = typeof EXCLUDED_METADATA_TYPES[number]
export type SupportedMetadataType = typeof SUPPORTED_METADATA_TYPES[number]
export type SalesforceMetadataType = SupportedMetadataType | ExcludedMetadataType

export type CustomObjectDependency = typeof CUSTOM_OBJECT_DEPENDENCIES[number]
export type WorkflowDependency = typeof WORKFLOW_DEPENDENCIES[number]

export const METADATA_TYPE_TO_DEPENDENCIES: Record<MetadataTypeWithDependencies, SupportedMetadataType[]> = {
  CustomMetadata: ['CustomObject'],
  CustomObject: CUSTOM_OBJECT_DEPENDENCIES as ReadonlyArray<string> as SupportedMetadataType[],
  Workflow: WORKFLOW_DEPENDENCIES as ReadonlyArray<string> as SupportedMetadataType[],
}

export const isMetadataTypeWithDependency = (
  metadataType: SupportedMetadataType
): metadataType is MetadataTypeWithDependencies => (
  (METADATA_TYPES_WITH_DEPENDENCIES as ReadonlyArray<string>).includes(metadataType)
)

export const getFetchTargets = (target: SupportedMetadataType[]): SupportedMetadataType[] => {
  const allTypes = [...target]
  const handledTypesWithDependencies: MetadataTypeWithDependencies[] = []
  let typesWithDependencies = allTypes.filter(isMetadataTypeWithDependency)
  while (!_.isEmpty(typesWithDependencies)) {
    _(METADATA_TYPE_TO_DEPENDENCIES)
      .pick(typesWithDependencies)
      .values()
      .flatten()
      .forEach(metadataType => allTypes.push(metadataType))
    typesWithDependencies.forEach(metadataType => handledTypesWithDependencies.push(metadataType))
    typesWithDependencies = allTypes
      .filter(isMetadataTypeWithDependency)
      .filter(typeWithDependency => !handledTypesWithDependencies.includes(typeWithDependency))
  }
  return _.uniq(allTypes)
}
