import { mutationRef, executeMutation, validateArgs, makeMemoryCacheProvider } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'csb-ams-2-service',
  location: 'asia-southeast1'
};
export const dataConnectSettings = {
  cacheSettings: {
    cacheProvider: makeMemoryCacheProvider()
  }
};
export const upsertUserProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUserProfile', inputVars);
}
upsertUserProfileRef.operationName = 'UpsertUserProfile';

export function upsertUserProfile(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertUserProfileRef(dcInstance, inputVars));
}

export const deleteUserProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteUserProfile', inputVars);
}
deleteUserProfileRef.operationName = 'DeleteUserProfile';

export function deleteUserProfile(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteUserProfileRef(dcInstance, inputVars));
}

export const upsertSystemUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertSystemUser', inputVars);
}
upsertSystemUserRef.operationName = 'UpsertSystemUser';

export function upsertSystemUser(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertSystemUserRef(dcInstance, inputVars));
}

export const deleteSystemUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSystemUser', inputVars);
}
deleteSystemUserRef.operationName = 'DeleteSystemUser';

export function deleteSystemUser(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteSystemUserRef(dcInstance, inputVars));
}

export const upsertEngagementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertEngagement', inputVars);
}
upsertEngagementRef.operationName = 'UpsertEngagement';

export function upsertEngagement(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertEngagementRef(dcInstance, inputVars));
}

export const deleteEngagementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteEngagement', inputVars);
}
deleteEngagementRef.operationName = 'DeleteEngagement';

export function deleteEngagement(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteEngagementRef(dcInstance, inputVars));
}

export const upsertWorkingNoteRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertWorkingNote', inputVars);
}
upsertWorkingNoteRef.operationName = 'UpsertWorkingNote';

export function upsertWorkingNote(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertWorkingNoteRef(dcInstance, inputVars));
}

export const deleteWorkingNoteRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteWorkingNote', inputVars);
}
deleteWorkingNoteRef.operationName = 'DeleteWorkingNote';

export function deleteWorkingNote(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteWorkingNoteRef(dcInstance, inputVars));
}

export const upsertFindingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertFinding', inputVars);
}
upsertFindingRef.operationName = 'UpsertFinding';

export function upsertFinding(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertFindingRef(dcInstance, inputVars));
}

export const deleteFindingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteFinding', inputVars);
}
deleteFindingRef.operationName = 'DeleteFinding';

export function deleteFinding(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteFindingRef(dcInstance, inputVars));
}

export const upsertTimelineActivityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertTimelineActivity', inputVars);
}
upsertTimelineActivityRef.operationName = 'UpsertTimelineActivity';

export function upsertTimelineActivity(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertTimelineActivityRef(dcInstance, inputVars));
}

export const deleteTimelineActivityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteTimelineActivity', inputVars);
}
deleteTimelineActivityRef.operationName = 'DeleteTimelineActivity';

export function deleteTimelineActivity(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteTimelineActivityRef(dcInstance, inputVars));
}

export const upsertEngagementFileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertEngagementFile', inputVars);
}
upsertEngagementFileRef.operationName = 'UpsertEngagementFile';

export function upsertEngagementFile(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertEngagementFileRef(dcInstance, inputVars));
}

export const deleteEngagementFileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteEngagementFile', inputVars);
}
deleteEngagementFileRef.operationName = 'DeleteEngagementFile';

export function deleteEngagementFile(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteEngagementFileRef(dcInstance, inputVars));
}

export const upsertActivityLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertActivityLog', inputVars);
}
upsertActivityLogRef.operationName = 'UpsertActivityLog';

export function upsertActivityLog(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertActivityLogRef(dcInstance, inputVars));
}

export const deleteActivityLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteActivityLog', inputVars);
}
deleteActivityLogRef.operationName = 'DeleteActivityLog';

export function deleteActivityLog(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteActivityLogRef(dcInstance, inputVars));
}

export const upsertIssueRegisterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertIssueRegister', inputVars);
}
upsertIssueRegisterRef.operationName = 'UpsertIssueRegister';

export function upsertIssueRegister(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertIssueRegisterRef(dcInstance, inputVars));
}

export const deleteIssueRegisterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteIssueRegister', inputVars);
}
deleteIssueRegisterRef.operationName = 'DeleteIssueRegister';

export function deleteIssueRegister(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteIssueRegisterRef(dcInstance, inputVars));
}

export const upsertUniverseEntityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUniverseEntity', inputVars);
}
upsertUniverseEntityRef.operationName = 'UpsertUniverseEntity';

export function upsertUniverseEntity(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertUniverseEntityRef(dcInstance, inputVars));
}

export const deleteUniverseEntityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteUniverseEntity', inputVars);
}
deleteUniverseEntityRef.operationName = 'DeleteUniverseEntity';

export function deleteUniverseEntity(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteUniverseEntityRef(dcInstance, inputVars));
}

export const upsertSizingConfigRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertSizingConfig', inputVars);
}
upsertSizingConfigRef.operationName = 'UpsertSizingConfig';

export function upsertSizingConfig(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertSizingConfigRef(dcInstance, inputVars));
}

export const deleteSizingConfigRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSizingConfig', inputVars);
}
deleteSizingConfigRef.operationName = 'DeleteSizingConfig';

export function deleteSizingConfig(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteSizingConfigRef(dcInstance, inputVars));
}

export const upsertAuditFrequencyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertAuditFrequency', inputVars);
}
upsertAuditFrequencyRef.operationName = 'UpsertAuditFrequency';

export function upsertAuditFrequency(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertAuditFrequencyRef(dcInstance, inputVars));
}

export const deleteAuditFrequencyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAuditFrequency', inputVars);
}
deleteAuditFrequencyRef.operationName = 'DeleteAuditFrequency';

export function deleteAuditFrequency(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteAuditFrequencyRef(dcInstance, inputVars));
}

export const upsertMasterDataRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertMasterData', inputVars);
}
upsertMasterDataRef.operationName = 'UpsertMasterData';

export function upsertMasterData(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertMasterDataRef(dcInstance, inputVars));
}

export const deleteMasterDataRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteMasterData', inputVars);
}
deleteMasterDataRef.operationName = 'DeleteMasterData';

export function deleteMasterData(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteMasterDataRef(dcInstance, inputVars));
}

export const upsertAuditDivisionRiskScaleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertAuditDivisionRiskScale', inputVars);
}
upsertAuditDivisionRiskScaleRef.operationName = 'UpsertAuditDivisionRiskScale';

export function upsertAuditDivisionRiskScale(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertAuditDivisionRiskScaleRef(dcInstance, inputVars));
}

export const deleteAuditDivisionRiskScaleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAuditDivisionRiskScale', inputVars);
}
deleteAuditDivisionRiskScaleRef.operationName = 'DeleteAuditDivisionRiskScale';

export function deleteAuditDivisionRiskScale(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteAuditDivisionRiskScaleRef(dcInstance, inputVars));
}

export const upsertAppSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertAppSession', inputVars);
}
upsertAppSessionRef.operationName = 'UpsertAppSession';

export function upsertAppSession(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertAppSessionRef(dcInstance, inputVars));
}

export const deleteAppSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAppSession', inputVars);
}
deleteAppSessionRef.operationName = 'DeleteAppSession';

export function deleteAppSession(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteAppSessionRef(dcInstance, inputVars));
}

