import { ConnectorConfig, DataConnect, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface ActivityLog_Key {
  id: string;
  __typename?: 'ActivityLog_Key';
}

export interface AppSession_Key {
  tokenHash: string;
  __typename?: 'AppSession_Key';
}

export interface AuditDivisionRiskScale_Key {
  id: string;
  __typename?: 'AuditDivisionRiskScale_Key';
}

export interface AuditFrequency_Key {
  id: string;
  __typename?: 'AuditFrequency_Key';
}

export interface DeleteActivityLogData {
  activityLog_delete?: ActivityLog_Key | null;
}

export interface DeleteActivityLogVariables {
  id: string;
}

export interface DeleteAppSessionData {
  appSession_delete?: AppSession_Key | null;
}

export interface DeleteAppSessionVariables {
  tokenHash: string;
}

export interface DeleteAuditDivisionRiskScaleData {
  auditDivisionRiskScale_delete?: AuditDivisionRiskScale_Key | null;
}

export interface DeleteAuditDivisionRiskScaleVariables {
  id: string;
}

export interface DeleteAuditFrequencyData {
  auditFrequency_delete?: AuditFrequency_Key | null;
}

export interface DeleteAuditFrequencyVariables {
  id: string;
}

export interface DeleteEngagementData {
  engagement_delete?: Engagement_Key | null;
}

export interface DeleteEngagementFileData {
  engagementFile_delete?: EngagementFile_Key | null;
}

export interface DeleteEngagementFileVariables {
  id: string;
}

export interface DeleteEngagementVariables {
  id: string;
}

export interface DeleteFindingData {
  finding_delete?: Finding_Key | null;
}

export interface DeleteFindingVariables {
  id: string;
}

export interface DeleteIssueRegisterData {
  issueRegister_delete?: IssueRegister_Key | null;
}

export interface DeleteIssueRegisterVariables {
  id: string;
}

export interface DeleteMasterDataData {
  masterData_delete?: MasterData_Key | null;
}

export interface DeleteMasterDataVariables {
  id: string;
}

export interface DeleteSizingConfigData {
  sizingConfig_delete?: SizingConfig_Key | null;
}

export interface DeleteSizingConfigVariables {
  id: string;
}

export interface DeleteSystemUserData {
  systemUser_delete?: SystemUser_Key | null;
}

export interface DeleteSystemUserVariables {
  id: string;
}

export interface DeleteTimelineActivityData {
  timelineActivity_delete?: TimelineActivity_Key | null;
}

export interface DeleteTimelineActivityVariables {
  id: string;
}

export interface DeleteUniverseEntityData {
  universeEntity_delete?: UniverseEntity_Key | null;
}

export interface DeleteUniverseEntityVariables {
  id: string;
}

export interface DeleteUserProfileData {
  userProfile_delete?: UserProfile_Key | null;
}

export interface DeleteUserProfileVariables {
  id: string;
}

export interface DeleteWorkingNoteData {
  workingNote_delete?: WorkingNote_Key | null;
}

export interface DeleteWorkingNoteVariables {
  id: string;
}

export interface EngagementFile_Key {
  id: string;
  __typename?: 'EngagementFile_Key';
}

export interface Engagement_Key {
  id: string;
  __typename?: 'Engagement_Key';
}

export interface Finding_Key {
  id: string;
  __typename?: 'Finding_Key';
}

export interface IssueRegister_Key {
  id: string;
  __typename?: 'IssueRegister_Key';
}

export interface MasterData_Key {
  id: string;
  __typename?: 'MasterData_Key';
}

export interface SizingConfig_Key {
  id: string;
  __typename?: 'SizingConfig_Key';
}

export interface SystemUser_Key {
  id: string;
  __typename?: 'SystemUser_Key';
}

export interface TimelineActivity_Key {
  id: string;
  __typename?: 'TimelineActivity_Key';
}

export interface UniverseEntity_Key {
  id: string;
  __typename?: 'UniverseEntity_Key';
}

export interface UpsertActivityLogData {
  activityLog_upsert: ActivityLog_Key;
}

export interface UpsertActivityLogVariables {
  id: string;
  engagementId: string;
  timestamp: string;
  actor: string;
  action: string;
  detail?: string | null;
  addedBy?: string | null;
  modifiedBy?: string | null;
}

export interface UpsertAppSessionData {
  appSession_upsert: AppSession_Key;
}

export interface UpsertAppSessionVariables {
  tokenHash: string;
  userId: string;
  expiresAt: TimestampString;
  revokedAt?: TimestampString | null;
}

export interface UpsertAuditDivisionRiskScaleData {
  auditDivisionRiskScale_upsert: AuditDivisionRiskScale_Key;
}

export interface UpsertAuditDivisionRiskScaleVariables {
  id: string;
  name: string;
  highMinScore: number;
  mediumMinScore: number;
  highCycleMonths: number;
  mediumCycleMonths: number;
  lowCycleMonths: number;
  highFieldworkWeeks: number;
  mediumFieldworkWeeks: number;
  lowFieldworkWeeks: number;
  addedBy?: string | null;
  modifiedBy?: string | null;
}

export interface UpsertAuditFrequencyData {
  auditFrequency_upsert: AuditFrequency_Key;
}

export interface UpsertAuditFrequencyVariables {
  id: string;
  high: number;
  medium: number;
  low: number;
  addedBy?: string | null;
  modifiedBy?: string | null;
}

export interface UpsertEngagementData {
  engagement_upsert: Engagement_Key;
}

export interface UpsertEngagementFileData {
  engagementFile_upsert: EngagementFile_Key;
}

export interface UpsertEngagementFileVariables {
  id: string;
  engagementId: string;
  name: string;
  folder: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  addedBy?: string | null;
  modifiedBy?: string | null;
}

export interface UpsertEngagementVariables {
  id: string;
  ref: string;
  year: number;
  title: string;
  category: string;
  department: string;
  entityName: string;
  likelihood: number;
  impact: number;
  riskScore: number;
  riskLevel: string;
  lead: string;
  headReviewer: string;
  independentReviewer: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  budgetedHours: number;
  status: string;
  readyRatio: string;
  lifecycleStage: number;
  fieldworkPct: number;
  fieldworkDayCurrent: number;
  fieldworkDayTotal: number;
  reportStatus: string;
  reportRef: string;
  executiveSummary: string;
  reportRating?: string | null;
  addedBy?: string | null;
  modifiedBy?: string | null;
  auditDivisionId?: string | null;
  objectives: string;
  scope: string;
  criteria: string;
  addresseeName: string;
  addresseeTitle: string;
  copyFurnished: string;
}

export interface UpsertFindingData {
  finding_upsert: Finding_Key;
}

export interface UpsertFindingVariables {
  id: string;
  engagementId: string;
  ref: string;
  title: string;
  severity: string;
  condition: string;
  criteria: string;
  cause: string;
  effect: string;
  recommendation: string;
  owner: string;
  targetDate: string;
  status: string;
  linkedNoteRef: string;
  addedBy?: string | null;
  modifiedBy?: string | null;
  category: string;
}

export interface UpsertIssueRegisterData {
  issueRegister_upsert: IssueRegister_Key;
}

export interface UpsertIssueRegisterVariables {
  id: string;
  ref: string;
  title: string;
  auditRef: string;
  auditTitle: string;
  severity: string;
  owner: string;
  ownerUnit: string;
  originalDue: string;
  currentDue: string;
  extensionCount: number;
  daysStatus: string;
  isOverdue: boolean;
  isDueSoon: boolean;
  status: string;
  actionPlanSummary: string;
  evidenceNote?: string | null;
  addedBy?: string | null;
  modifiedBy?: string | null;
  extensionReason: string;
}

export interface UpsertMasterDataData {
  masterData_upsert: MasterData_Key;
}

export interface UpsertMasterDataVariables {
  id: string;
  data: unknown;
  addedBy?: string | null;
  modifiedBy?: string | null;
}

export interface UpsertSizingConfigData {
  sizingConfig_upsert: SizingConfig_Key;
}

export interface UpsertSizingConfigVariables {
  id: string;
  sizeName: string;
  code: string;
  workingDays: number;
  calendarSpan: string;
  auditors: number;
  hoursPerDay: number;
  budgetedHours: number;
  typicalUse: string;
  addedBy?: string | null;
  modifiedBy?: string | null;
}

export interface UpsertSystemUserData {
  systemUser_upsert: SystemUser_Key;
}

export interface UpsertSystemUserVariables {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  passwordHash: string;
  isActive: boolean;
  isLocked: boolean;
  failedLoginCount: number;
  requiresPasswordChange: boolean;
  addedBy?: string | null;
  modifiedBy?: string | null;
}

export interface UpsertTimelineActivityData {
  timelineActivity_upsert: TimelineActivity_Key;
}

export interface UpsertTimelineActivityVariables {
  id: string;
  engagementId: string;
  name: string;
  roleResponsible: string;
  dueDate: string;
  completedDate?: string | null;
  status: string;
  stageId: number;
  addedBy?: string | null;
  modifiedBy?: string | null;
}

export interface UpsertUniverseEntityData {
  universeEntity_upsert: UniverseEntity_Key;
}

export interface UpsertUniverseEntityVariables {
  id: string;
  code: string;
  name: string;
  division: string;
  category: string;
  likelihood: number;
  impact: number;
  riskScore: number;
  riskLevel: string;
  lastAudited: string;
  nextDue: string;
  cycleMonths: number;
  defaultLead: string;
  addedBy?: string | null;
  modifiedBy?: string | null;
  auditDivisionId?: string | null;
  riskNotes: string;
}

export interface UpsertUserProfileData {
  userProfile_upsert: UserProfile_Key;
}

export interface UpsertUserProfileVariables {
  id: string;
  name: string;
  roleTitle: string;
  fullLabel: string;
  headerSubtitle: string;
  department: string;
  canApproveHead: boolean;
  canApproveIndependent: boolean;
  canApproveCae: boolean;
  employeeNumber?: string | null;
  accountStatus: string;
  failedLoginCount: number;
  isLocked: boolean;
  requiresPasswordChange: boolean;
  passwordHistory: string[];
  mfaEnabled: boolean;
  isPrivileged: boolean;
  addedBy?: string | null;
  modifiedBy?: string | null;
}

export interface UpsertWorkingNoteData {
  workingNote_upsert: WorkingNote_Key;
}

export interface UpsertWorkingNoteVariables {
  id: string;
  engagementId: string;
  ref: string;
  title: string;
  controlArea: string;
  author: string;
  status: string;
  hasException: boolean;
  updatedAt: string;
  testingProcedure: string;
  conclusion: string;
  reviewerComments?: string | null;
  addedBy?: string | null;
  modifiedBy?: string | null;
  observations: string;
}

export interface UserProfile_Key {
  id: string;
  __typename?: 'UserProfile_Key';
}

export interface WorkingNote_Key {
  id: string;
  __typename?: 'WorkingNote_Key';
}

interface UpsertUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
  operationName: string;
}
export const upsertUserProfileRef: UpsertUserProfileRef;

export function upsertUserProfile(vars: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;
export function upsertUserProfile(dc: DataConnect, vars: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;

interface DeleteUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserProfileVariables): MutationRef<DeleteUserProfileData, DeleteUserProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteUserProfileVariables): MutationRef<DeleteUserProfileData, DeleteUserProfileVariables>;
  operationName: string;
}
export const deleteUserProfileRef: DeleteUserProfileRef;

export function deleteUserProfile(vars: DeleteUserProfileVariables): MutationPromise<DeleteUserProfileData, DeleteUserProfileVariables>;
export function deleteUserProfile(dc: DataConnect, vars: DeleteUserProfileVariables): MutationPromise<DeleteUserProfileData, DeleteUserProfileVariables>;

interface UpsertSystemUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertSystemUserVariables): MutationRef<UpsertSystemUserData, UpsertSystemUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertSystemUserVariables): MutationRef<UpsertSystemUserData, UpsertSystemUserVariables>;
  operationName: string;
}
export const upsertSystemUserRef: UpsertSystemUserRef;

export function upsertSystemUser(vars: UpsertSystemUserVariables): MutationPromise<UpsertSystemUserData, UpsertSystemUserVariables>;
export function upsertSystemUser(dc: DataConnect, vars: UpsertSystemUserVariables): MutationPromise<UpsertSystemUserData, UpsertSystemUserVariables>;

interface DeleteSystemUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSystemUserVariables): MutationRef<DeleteSystemUserData, DeleteSystemUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteSystemUserVariables): MutationRef<DeleteSystemUserData, DeleteSystemUserVariables>;
  operationName: string;
}
export const deleteSystemUserRef: DeleteSystemUserRef;

export function deleteSystemUser(vars: DeleteSystemUserVariables): MutationPromise<DeleteSystemUserData, DeleteSystemUserVariables>;
export function deleteSystemUser(dc: DataConnect, vars: DeleteSystemUserVariables): MutationPromise<DeleteSystemUserData, DeleteSystemUserVariables>;

interface UpsertEngagementRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertEngagementVariables): MutationRef<UpsertEngagementData, UpsertEngagementVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertEngagementVariables): MutationRef<UpsertEngagementData, UpsertEngagementVariables>;
  operationName: string;
}
export const upsertEngagementRef: UpsertEngagementRef;

export function upsertEngagement(vars: UpsertEngagementVariables): MutationPromise<UpsertEngagementData, UpsertEngagementVariables>;
export function upsertEngagement(dc: DataConnect, vars: UpsertEngagementVariables): MutationPromise<UpsertEngagementData, UpsertEngagementVariables>;

interface DeleteEngagementRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteEngagementVariables): MutationRef<DeleteEngagementData, DeleteEngagementVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteEngagementVariables): MutationRef<DeleteEngagementData, DeleteEngagementVariables>;
  operationName: string;
}
export const deleteEngagementRef: DeleteEngagementRef;

export function deleteEngagement(vars: DeleteEngagementVariables): MutationPromise<DeleteEngagementData, DeleteEngagementVariables>;
export function deleteEngagement(dc: DataConnect, vars: DeleteEngagementVariables): MutationPromise<DeleteEngagementData, DeleteEngagementVariables>;

interface UpsertWorkingNoteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertWorkingNoteVariables): MutationRef<UpsertWorkingNoteData, UpsertWorkingNoteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertWorkingNoteVariables): MutationRef<UpsertWorkingNoteData, UpsertWorkingNoteVariables>;
  operationName: string;
}
export const upsertWorkingNoteRef: UpsertWorkingNoteRef;

export function upsertWorkingNote(vars: UpsertWorkingNoteVariables): MutationPromise<UpsertWorkingNoteData, UpsertWorkingNoteVariables>;
export function upsertWorkingNote(dc: DataConnect, vars: UpsertWorkingNoteVariables): MutationPromise<UpsertWorkingNoteData, UpsertWorkingNoteVariables>;

interface DeleteWorkingNoteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteWorkingNoteVariables): MutationRef<DeleteWorkingNoteData, DeleteWorkingNoteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteWorkingNoteVariables): MutationRef<DeleteWorkingNoteData, DeleteWorkingNoteVariables>;
  operationName: string;
}
export const deleteWorkingNoteRef: DeleteWorkingNoteRef;

export function deleteWorkingNote(vars: DeleteWorkingNoteVariables): MutationPromise<DeleteWorkingNoteData, DeleteWorkingNoteVariables>;
export function deleteWorkingNote(dc: DataConnect, vars: DeleteWorkingNoteVariables): MutationPromise<DeleteWorkingNoteData, DeleteWorkingNoteVariables>;

interface UpsertFindingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertFindingVariables): MutationRef<UpsertFindingData, UpsertFindingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertFindingVariables): MutationRef<UpsertFindingData, UpsertFindingVariables>;
  operationName: string;
}
export const upsertFindingRef: UpsertFindingRef;

export function upsertFinding(vars: UpsertFindingVariables): MutationPromise<UpsertFindingData, UpsertFindingVariables>;
export function upsertFinding(dc: DataConnect, vars: UpsertFindingVariables): MutationPromise<UpsertFindingData, UpsertFindingVariables>;

interface DeleteFindingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteFindingVariables): MutationRef<DeleteFindingData, DeleteFindingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteFindingVariables): MutationRef<DeleteFindingData, DeleteFindingVariables>;
  operationName: string;
}
export const deleteFindingRef: DeleteFindingRef;

export function deleteFinding(vars: DeleteFindingVariables): MutationPromise<DeleteFindingData, DeleteFindingVariables>;
export function deleteFinding(dc: DataConnect, vars: DeleteFindingVariables): MutationPromise<DeleteFindingData, DeleteFindingVariables>;

interface UpsertTimelineActivityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertTimelineActivityVariables): MutationRef<UpsertTimelineActivityData, UpsertTimelineActivityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertTimelineActivityVariables): MutationRef<UpsertTimelineActivityData, UpsertTimelineActivityVariables>;
  operationName: string;
}
export const upsertTimelineActivityRef: UpsertTimelineActivityRef;

export function upsertTimelineActivity(vars: UpsertTimelineActivityVariables): MutationPromise<UpsertTimelineActivityData, UpsertTimelineActivityVariables>;
export function upsertTimelineActivity(dc: DataConnect, vars: UpsertTimelineActivityVariables): MutationPromise<UpsertTimelineActivityData, UpsertTimelineActivityVariables>;

interface DeleteTimelineActivityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTimelineActivityVariables): MutationRef<DeleteTimelineActivityData, DeleteTimelineActivityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteTimelineActivityVariables): MutationRef<DeleteTimelineActivityData, DeleteTimelineActivityVariables>;
  operationName: string;
}
export const deleteTimelineActivityRef: DeleteTimelineActivityRef;

export function deleteTimelineActivity(vars: DeleteTimelineActivityVariables): MutationPromise<DeleteTimelineActivityData, DeleteTimelineActivityVariables>;
export function deleteTimelineActivity(dc: DataConnect, vars: DeleteTimelineActivityVariables): MutationPromise<DeleteTimelineActivityData, DeleteTimelineActivityVariables>;

interface UpsertEngagementFileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertEngagementFileVariables): MutationRef<UpsertEngagementFileData, UpsertEngagementFileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertEngagementFileVariables): MutationRef<UpsertEngagementFileData, UpsertEngagementFileVariables>;
  operationName: string;
}
export const upsertEngagementFileRef: UpsertEngagementFileRef;

export function upsertEngagementFile(vars: UpsertEngagementFileVariables): MutationPromise<UpsertEngagementFileData, UpsertEngagementFileVariables>;
export function upsertEngagementFile(dc: DataConnect, vars: UpsertEngagementFileVariables): MutationPromise<UpsertEngagementFileData, UpsertEngagementFileVariables>;

interface DeleteEngagementFileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteEngagementFileVariables): MutationRef<DeleteEngagementFileData, DeleteEngagementFileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteEngagementFileVariables): MutationRef<DeleteEngagementFileData, DeleteEngagementFileVariables>;
  operationName: string;
}
export const deleteEngagementFileRef: DeleteEngagementFileRef;

export function deleteEngagementFile(vars: DeleteEngagementFileVariables): MutationPromise<DeleteEngagementFileData, DeleteEngagementFileVariables>;
export function deleteEngagementFile(dc: DataConnect, vars: DeleteEngagementFileVariables): MutationPromise<DeleteEngagementFileData, DeleteEngagementFileVariables>;

interface UpsertActivityLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertActivityLogVariables): MutationRef<UpsertActivityLogData, UpsertActivityLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertActivityLogVariables): MutationRef<UpsertActivityLogData, UpsertActivityLogVariables>;
  operationName: string;
}
export const upsertActivityLogRef: UpsertActivityLogRef;

export function upsertActivityLog(vars: UpsertActivityLogVariables): MutationPromise<UpsertActivityLogData, UpsertActivityLogVariables>;
export function upsertActivityLog(dc: DataConnect, vars: UpsertActivityLogVariables): MutationPromise<UpsertActivityLogData, UpsertActivityLogVariables>;

interface DeleteActivityLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteActivityLogVariables): MutationRef<DeleteActivityLogData, DeleteActivityLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteActivityLogVariables): MutationRef<DeleteActivityLogData, DeleteActivityLogVariables>;
  operationName: string;
}
export const deleteActivityLogRef: DeleteActivityLogRef;

export function deleteActivityLog(vars: DeleteActivityLogVariables): MutationPromise<DeleteActivityLogData, DeleteActivityLogVariables>;
export function deleteActivityLog(dc: DataConnect, vars: DeleteActivityLogVariables): MutationPromise<DeleteActivityLogData, DeleteActivityLogVariables>;

interface UpsertIssueRegisterRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertIssueRegisterVariables): MutationRef<UpsertIssueRegisterData, UpsertIssueRegisterVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertIssueRegisterVariables): MutationRef<UpsertIssueRegisterData, UpsertIssueRegisterVariables>;
  operationName: string;
}
export const upsertIssueRegisterRef: UpsertIssueRegisterRef;

export function upsertIssueRegister(vars: UpsertIssueRegisterVariables): MutationPromise<UpsertIssueRegisterData, UpsertIssueRegisterVariables>;
export function upsertIssueRegister(dc: DataConnect, vars: UpsertIssueRegisterVariables): MutationPromise<UpsertIssueRegisterData, UpsertIssueRegisterVariables>;

interface DeleteIssueRegisterRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteIssueRegisterVariables): MutationRef<DeleteIssueRegisterData, DeleteIssueRegisterVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteIssueRegisterVariables): MutationRef<DeleteIssueRegisterData, DeleteIssueRegisterVariables>;
  operationName: string;
}
export const deleteIssueRegisterRef: DeleteIssueRegisterRef;

export function deleteIssueRegister(vars: DeleteIssueRegisterVariables): MutationPromise<DeleteIssueRegisterData, DeleteIssueRegisterVariables>;
export function deleteIssueRegister(dc: DataConnect, vars: DeleteIssueRegisterVariables): MutationPromise<DeleteIssueRegisterData, DeleteIssueRegisterVariables>;

interface UpsertUniverseEntityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUniverseEntityVariables): MutationRef<UpsertUniverseEntityData, UpsertUniverseEntityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertUniverseEntityVariables): MutationRef<UpsertUniverseEntityData, UpsertUniverseEntityVariables>;
  operationName: string;
}
export const upsertUniverseEntityRef: UpsertUniverseEntityRef;

export function upsertUniverseEntity(vars: UpsertUniverseEntityVariables): MutationPromise<UpsertUniverseEntityData, UpsertUniverseEntityVariables>;
export function upsertUniverseEntity(dc: DataConnect, vars: UpsertUniverseEntityVariables): MutationPromise<UpsertUniverseEntityData, UpsertUniverseEntityVariables>;

interface DeleteUniverseEntityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUniverseEntityVariables): MutationRef<DeleteUniverseEntityData, DeleteUniverseEntityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteUniverseEntityVariables): MutationRef<DeleteUniverseEntityData, DeleteUniverseEntityVariables>;
  operationName: string;
}
export const deleteUniverseEntityRef: DeleteUniverseEntityRef;

export function deleteUniverseEntity(vars: DeleteUniverseEntityVariables): MutationPromise<DeleteUniverseEntityData, DeleteUniverseEntityVariables>;
export function deleteUniverseEntity(dc: DataConnect, vars: DeleteUniverseEntityVariables): MutationPromise<DeleteUniverseEntityData, DeleteUniverseEntityVariables>;

interface UpsertSizingConfigRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertSizingConfigVariables): MutationRef<UpsertSizingConfigData, UpsertSizingConfigVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertSizingConfigVariables): MutationRef<UpsertSizingConfigData, UpsertSizingConfigVariables>;
  operationName: string;
}
export const upsertSizingConfigRef: UpsertSizingConfigRef;

export function upsertSizingConfig(vars: UpsertSizingConfigVariables): MutationPromise<UpsertSizingConfigData, UpsertSizingConfigVariables>;
export function upsertSizingConfig(dc: DataConnect, vars: UpsertSizingConfigVariables): MutationPromise<UpsertSizingConfigData, UpsertSizingConfigVariables>;

interface DeleteSizingConfigRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSizingConfigVariables): MutationRef<DeleteSizingConfigData, DeleteSizingConfigVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteSizingConfigVariables): MutationRef<DeleteSizingConfigData, DeleteSizingConfigVariables>;
  operationName: string;
}
export const deleteSizingConfigRef: DeleteSizingConfigRef;

export function deleteSizingConfig(vars: DeleteSizingConfigVariables): MutationPromise<DeleteSizingConfigData, DeleteSizingConfigVariables>;
export function deleteSizingConfig(dc: DataConnect, vars: DeleteSizingConfigVariables): MutationPromise<DeleteSizingConfigData, DeleteSizingConfigVariables>;

interface UpsertAuditFrequencyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertAuditFrequencyVariables): MutationRef<UpsertAuditFrequencyData, UpsertAuditFrequencyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertAuditFrequencyVariables): MutationRef<UpsertAuditFrequencyData, UpsertAuditFrequencyVariables>;
  operationName: string;
}
export const upsertAuditFrequencyRef: UpsertAuditFrequencyRef;

export function upsertAuditFrequency(vars: UpsertAuditFrequencyVariables): MutationPromise<UpsertAuditFrequencyData, UpsertAuditFrequencyVariables>;
export function upsertAuditFrequency(dc: DataConnect, vars: UpsertAuditFrequencyVariables): MutationPromise<UpsertAuditFrequencyData, UpsertAuditFrequencyVariables>;

interface DeleteAuditFrequencyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAuditFrequencyVariables): MutationRef<DeleteAuditFrequencyData, DeleteAuditFrequencyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteAuditFrequencyVariables): MutationRef<DeleteAuditFrequencyData, DeleteAuditFrequencyVariables>;
  operationName: string;
}
export const deleteAuditFrequencyRef: DeleteAuditFrequencyRef;

export function deleteAuditFrequency(vars: DeleteAuditFrequencyVariables): MutationPromise<DeleteAuditFrequencyData, DeleteAuditFrequencyVariables>;
export function deleteAuditFrequency(dc: DataConnect, vars: DeleteAuditFrequencyVariables): MutationPromise<DeleteAuditFrequencyData, DeleteAuditFrequencyVariables>;

interface UpsertMasterDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertMasterDataVariables): MutationRef<UpsertMasterDataData, UpsertMasterDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertMasterDataVariables): MutationRef<UpsertMasterDataData, UpsertMasterDataVariables>;
  operationName: string;
}
export const upsertMasterDataRef: UpsertMasterDataRef;

export function upsertMasterData(vars: UpsertMasterDataVariables): MutationPromise<UpsertMasterDataData, UpsertMasterDataVariables>;
export function upsertMasterData(dc: DataConnect, vars: UpsertMasterDataVariables): MutationPromise<UpsertMasterDataData, UpsertMasterDataVariables>;

interface DeleteMasterDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteMasterDataVariables): MutationRef<DeleteMasterDataData, DeleteMasterDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteMasterDataVariables): MutationRef<DeleteMasterDataData, DeleteMasterDataVariables>;
  operationName: string;
}
export const deleteMasterDataRef: DeleteMasterDataRef;

export function deleteMasterData(vars: DeleteMasterDataVariables): MutationPromise<DeleteMasterDataData, DeleteMasterDataVariables>;
export function deleteMasterData(dc: DataConnect, vars: DeleteMasterDataVariables): MutationPromise<DeleteMasterDataData, DeleteMasterDataVariables>;

interface UpsertAuditDivisionRiskScaleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertAuditDivisionRiskScaleVariables): MutationRef<UpsertAuditDivisionRiskScaleData, UpsertAuditDivisionRiskScaleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertAuditDivisionRiskScaleVariables): MutationRef<UpsertAuditDivisionRiskScaleData, UpsertAuditDivisionRiskScaleVariables>;
  operationName: string;
}
export const upsertAuditDivisionRiskScaleRef: UpsertAuditDivisionRiskScaleRef;

export function upsertAuditDivisionRiskScale(vars: UpsertAuditDivisionRiskScaleVariables): MutationPromise<UpsertAuditDivisionRiskScaleData, UpsertAuditDivisionRiskScaleVariables>;
export function upsertAuditDivisionRiskScale(dc: DataConnect, vars: UpsertAuditDivisionRiskScaleVariables): MutationPromise<UpsertAuditDivisionRiskScaleData, UpsertAuditDivisionRiskScaleVariables>;

interface DeleteAuditDivisionRiskScaleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAuditDivisionRiskScaleVariables): MutationRef<DeleteAuditDivisionRiskScaleData, DeleteAuditDivisionRiskScaleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteAuditDivisionRiskScaleVariables): MutationRef<DeleteAuditDivisionRiskScaleData, DeleteAuditDivisionRiskScaleVariables>;
  operationName: string;
}
export const deleteAuditDivisionRiskScaleRef: DeleteAuditDivisionRiskScaleRef;

export function deleteAuditDivisionRiskScale(vars: DeleteAuditDivisionRiskScaleVariables): MutationPromise<DeleteAuditDivisionRiskScaleData, DeleteAuditDivisionRiskScaleVariables>;
export function deleteAuditDivisionRiskScale(dc: DataConnect, vars: DeleteAuditDivisionRiskScaleVariables): MutationPromise<DeleteAuditDivisionRiskScaleData, DeleteAuditDivisionRiskScaleVariables>;

interface UpsertAppSessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertAppSessionVariables): MutationRef<UpsertAppSessionData, UpsertAppSessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertAppSessionVariables): MutationRef<UpsertAppSessionData, UpsertAppSessionVariables>;
  operationName: string;
}
export const upsertAppSessionRef: UpsertAppSessionRef;

export function upsertAppSession(vars: UpsertAppSessionVariables): MutationPromise<UpsertAppSessionData, UpsertAppSessionVariables>;
export function upsertAppSession(dc: DataConnect, vars: UpsertAppSessionVariables): MutationPromise<UpsertAppSessionData, UpsertAppSessionVariables>;

interface DeleteAppSessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAppSessionVariables): MutationRef<DeleteAppSessionData, DeleteAppSessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteAppSessionVariables): MutationRef<DeleteAppSessionData, DeleteAppSessionVariables>;
  operationName: string;
}
export const deleteAppSessionRef: DeleteAppSessionRef;

export function deleteAppSession(vars: DeleteAppSessionVariables): MutationPromise<DeleteAppSessionData, DeleteAppSessionVariables>;
export function deleteAppSession(dc: DataConnect, vars: DeleteAppSessionVariables): MutationPromise<DeleteAppSessionData, DeleteAppSessionVariables>;

