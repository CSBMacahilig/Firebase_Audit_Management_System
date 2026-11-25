import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

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

/** Generated Node Admin SDK operation action function for the 'UpsertUserProfile' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertUserProfile(dc: DataConnect, vars: UpsertUserProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertUserProfileData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertUserProfile' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertUserProfile(vars: UpsertUserProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertUserProfileData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteUserProfile' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteUserProfile(dc: DataConnect, vars: DeleteUserProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserProfileData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteUserProfile' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteUserProfile(vars: DeleteUserProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserProfileData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertSystemUser' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertSystemUser(dc: DataConnect, vars: UpsertSystemUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertSystemUserData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertSystemUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertSystemUser(vars: UpsertSystemUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertSystemUserData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteSystemUser' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteSystemUser(dc: DataConnect, vars: DeleteSystemUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteSystemUserData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteSystemUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteSystemUser(vars: DeleteSystemUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteSystemUserData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertEngagement' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertEngagement(dc: DataConnect, vars: UpsertEngagementVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertEngagementData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertEngagement' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertEngagement(vars: UpsertEngagementVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertEngagementData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteEngagement' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteEngagement(dc: DataConnect, vars: DeleteEngagementVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteEngagementData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteEngagement' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteEngagement(vars: DeleteEngagementVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteEngagementData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertWorkingNote' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertWorkingNote(dc: DataConnect, vars: UpsertWorkingNoteVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertWorkingNoteData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertWorkingNote' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertWorkingNote(vars: UpsertWorkingNoteVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertWorkingNoteData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteWorkingNote' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteWorkingNote(dc: DataConnect, vars: DeleteWorkingNoteVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteWorkingNoteData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteWorkingNote' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteWorkingNote(vars: DeleteWorkingNoteVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteWorkingNoteData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertFinding' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertFinding(dc: DataConnect, vars: UpsertFindingVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertFindingData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertFinding' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertFinding(vars: UpsertFindingVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertFindingData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteFinding' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteFinding(dc: DataConnect, vars: DeleteFindingVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteFindingData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteFinding' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteFinding(vars: DeleteFindingVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteFindingData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertTimelineActivity' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertTimelineActivity(dc: DataConnect, vars: UpsertTimelineActivityVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertTimelineActivityData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertTimelineActivity' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertTimelineActivity(vars: UpsertTimelineActivityVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertTimelineActivityData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteTimelineActivity' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteTimelineActivity(dc: DataConnect, vars: DeleteTimelineActivityVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteTimelineActivityData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteTimelineActivity' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteTimelineActivity(vars: DeleteTimelineActivityVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteTimelineActivityData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertEngagementFile' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertEngagementFile(dc: DataConnect, vars: UpsertEngagementFileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertEngagementFileData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertEngagementFile' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertEngagementFile(vars: UpsertEngagementFileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertEngagementFileData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteEngagementFile' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteEngagementFile(dc: DataConnect, vars: DeleteEngagementFileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteEngagementFileData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteEngagementFile' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteEngagementFile(vars: DeleteEngagementFileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteEngagementFileData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertActivityLog' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertActivityLog(dc: DataConnect, vars: UpsertActivityLogVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertActivityLogData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertActivityLog' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertActivityLog(vars: UpsertActivityLogVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertActivityLogData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteActivityLog' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteActivityLog(dc: DataConnect, vars: DeleteActivityLogVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteActivityLogData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteActivityLog' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteActivityLog(vars: DeleteActivityLogVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteActivityLogData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertIssueRegister' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertIssueRegister(dc: DataConnect, vars: UpsertIssueRegisterVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertIssueRegisterData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertIssueRegister' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertIssueRegister(vars: UpsertIssueRegisterVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertIssueRegisterData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteIssueRegister' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteIssueRegister(dc: DataConnect, vars: DeleteIssueRegisterVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteIssueRegisterData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteIssueRegister' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteIssueRegister(vars: DeleteIssueRegisterVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteIssueRegisterData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertUniverseEntity' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertUniverseEntity(dc: DataConnect, vars: UpsertUniverseEntityVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertUniverseEntityData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertUniverseEntity' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertUniverseEntity(vars: UpsertUniverseEntityVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertUniverseEntityData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteUniverseEntity' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteUniverseEntity(dc: DataConnect, vars: DeleteUniverseEntityVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUniverseEntityData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteUniverseEntity' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteUniverseEntity(vars: DeleteUniverseEntityVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUniverseEntityData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertSizingConfig' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertSizingConfig(dc: DataConnect, vars: UpsertSizingConfigVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertSizingConfigData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertSizingConfig' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertSizingConfig(vars: UpsertSizingConfigVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertSizingConfigData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteSizingConfig' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteSizingConfig(dc: DataConnect, vars: DeleteSizingConfigVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteSizingConfigData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteSizingConfig' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteSizingConfig(vars: DeleteSizingConfigVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteSizingConfigData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertAuditFrequency' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertAuditFrequency(dc: DataConnect, vars: UpsertAuditFrequencyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertAuditFrequencyData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertAuditFrequency' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertAuditFrequency(vars: UpsertAuditFrequencyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertAuditFrequencyData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteAuditFrequency' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteAuditFrequency(dc: DataConnect, vars: DeleteAuditFrequencyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteAuditFrequencyData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteAuditFrequency' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteAuditFrequency(vars: DeleteAuditFrequencyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteAuditFrequencyData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertMasterData' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertMasterData(dc: DataConnect, vars: UpsertMasterDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertMasterDataData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertMasterData' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertMasterData(vars: UpsertMasterDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertMasterDataData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteMasterData' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteMasterData(dc: DataConnect, vars: DeleteMasterDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteMasterDataData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteMasterData' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteMasterData(vars: DeleteMasterDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteMasterDataData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertAuditDivisionRiskScale' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertAuditDivisionRiskScale(dc: DataConnect, vars: UpsertAuditDivisionRiskScaleVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertAuditDivisionRiskScaleData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertAuditDivisionRiskScale' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertAuditDivisionRiskScale(vars: UpsertAuditDivisionRiskScaleVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertAuditDivisionRiskScaleData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteAuditDivisionRiskScale' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteAuditDivisionRiskScale(dc: DataConnect, vars: DeleteAuditDivisionRiskScaleVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteAuditDivisionRiskScaleData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteAuditDivisionRiskScale' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteAuditDivisionRiskScale(vars: DeleteAuditDivisionRiskScaleVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteAuditDivisionRiskScaleData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertAppSession' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertAppSession(dc: DataConnect, vars: UpsertAppSessionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertAppSessionData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertAppSession' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertAppSession(vars: UpsertAppSessionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertAppSessionData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteAppSession' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteAppSession(dc: DataConnect, vars: DeleteAppSessionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteAppSessionData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteAppSession' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteAppSession(vars: DeleteAppSessionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteAppSessionData>>;

