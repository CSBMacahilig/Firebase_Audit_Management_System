const { mutationRef, executeMutation, validateArgs, makeMemoryCacheProvider } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'csb-ams-2-service',
  location: 'asia-southeast1'
};
exports.connectorConfig = connectorConfig;
const dataConnectSettings = {
  cacheSettings: {
    cacheProvider: makeMemoryCacheProvider()
  }
};
exports.dataConnectSettings = dataConnectSettings;

const upsertUserProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUserProfile', inputVars);
}
upsertUserProfileRef.operationName = 'UpsertUserProfile';
exports.upsertUserProfileRef = upsertUserProfileRef;

exports.upsertUserProfile = function upsertUserProfile(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertUserProfileRef(dcInstance, inputVars));
}
;

const deleteUserProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteUserProfile', inputVars);
}
deleteUserProfileRef.operationName = 'DeleteUserProfile';
exports.deleteUserProfileRef = deleteUserProfileRef;

exports.deleteUserProfile = function deleteUserProfile(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteUserProfileRef(dcInstance, inputVars));
}
;

const upsertSystemUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertSystemUser', inputVars);
}
upsertSystemUserRef.operationName = 'UpsertSystemUser';
exports.upsertSystemUserRef = upsertSystemUserRef;

exports.upsertSystemUser = function upsertSystemUser(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertSystemUserRef(dcInstance, inputVars));
}
;

const deleteSystemUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSystemUser', inputVars);
}
deleteSystemUserRef.operationName = 'DeleteSystemUser';
exports.deleteSystemUserRef = deleteSystemUserRef;

exports.deleteSystemUser = function deleteSystemUser(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteSystemUserRef(dcInstance, inputVars));
}
;

const upsertEngagementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertEngagement', inputVars);
}
upsertEngagementRef.operationName = 'UpsertEngagement';
exports.upsertEngagementRef = upsertEngagementRef;

exports.upsertEngagement = function upsertEngagement(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertEngagementRef(dcInstance, inputVars));
}
;

const deleteEngagementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteEngagement', inputVars);
}
deleteEngagementRef.operationName = 'DeleteEngagement';
exports.deleteEngagementRef = deleteEngagementRef;

exports.deleteEngagement = function deleteEngagement(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteEngagementRef(dcInstance, inputVars));
}
;

const upsertWorkingNoteRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertWorkingNote', inputVars);
}
upsertWorkingNoteRef.operationName = 'UpsertWorkingNote';
exports.upsertWorkingNoteRef = upsertWorkingNoteRef;

exports.upsertWorkingNote = function upsertWorkingNote(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertWorkingNoteRef(dcInstance, inputVars));
}
;

const deleteWorkingNoteRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteWorkingNote', inputVars);
}
deleteWorkingNoteRef.operationName = 'DeleteWorkingNote';
exports.deleteWorkingNoteRef = deleteWorkingNoteRef;

exports.deleteWorkingNote = function deleteWorkingNote(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteWorkingNoteRef(dcInstance, inputVars));
}
;

const upsertFindingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertFinding', inputVars);
}
upsertFindingRef.operationName = 'UpsertFinding';
exports.upsertFindingRef = upsertFindingRef;

exports.upsertFinding = function upsertFinding(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertFindingRef(dcInstance, inputVars));
}
;

const deleteFindingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteFinding', inputVars);
}
deleteFindingRef.operationName = 'DeleteFinding';
exports.deleteFindingRef = deleteFindingRef;

exports.deleteFinding = function deleteFinding(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteFindingRef(dcInstance, inputVars));
}
;

const upsertTimelineActivityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertTimelineActivity', inputVars);
}
upsertTimelineActivityRef.operationName = 'UpsertTimelineActivity';
exports.upsertTimelineActivityRef = upsertTimelineActivityRef;

exports.upsertTimelineActivity = function upsertTimelineActivity(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertTimelineActivityRef(dcInstance, inputVars));
}
;

const deleteTimelineActivityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteTimelineActivity', inputVars);
}
deleteTimelineActivityRef.operationName = 'DeleteTimelineActivity';
exports.deleteTimelineActivityRef = deleteTimelineActivityRef;

exports.deleteTimelineActivity = function deleteTimelineActivity(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteTimelineActivityRef(dcInstance, inputVars));
}
;

const upsertEngagementFileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertEngagementFile', inputVars);
}
upsertEngagementFileRef.operationName = 'UpsertEngagementFile';
exports.upsertEngagementFileRef = upsertEngagementFileRef;

exports.upsertEngagementFile = function upsertEngagementFile(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertEngagementFileRef(dcInstance, inputVars));
}
;

const deleteEngagementFileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteEngagementFile', inputVars);
}
deleteEngagementFileRef.operationName = 'DeleteEngagementFile';
exports.deleteEngagementFileRef = deleteEngagementFileRef;

exports.deleteEngagementFile = function deleteEngagementFile(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteEngagementFileRef(dcInstance, inputVars));
}
;

const upsertActivityLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertActivityLog', inputVars);
}
upsertActivityLogRef.operationName = 'UpsertActivityLog';
exports.upsertActivityLogRef = upsertActivityLogRef;

exports.upsertActivityLog = function upsertActivityLog(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertActivityLogRef(dcInstance, inputVars));
}
;

const deleteActivityLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteActivityLog', inputVars);
}
deleteActivityLogRef.operationName = 'DeleteActivityLog';
exports.deleteActivityLogRef = deleteActivityLogRef;

exports.deleteActivityLog = function deleteActivityLog(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteActivityLogRef(dcInstance, inputVars));
}
;

const upsertIssueRegisterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertIssueRegister', inputVars);
}
upsertIssueRegisterRef.operationName = 'UpsertIssueRegister';
exports.upsertIssueRegisterRef = upsertIssueRegisterRef;

exports.upsertIssueRegister = function upsertIssueRegister(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertIssueRegisterRef(dcInstance, inputVars));
}
;

const deleteIssueRegisterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteIssueRegister', inputVars);
}
deleteIssueRegisterRef.operationName = 'DeleteIssueRegister';
exports.deleteIssueRegisterRef = deleteIssueRegisterRef;

exports.deleteIssueRegister = function deleteIssueRegister(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteIssueRegisterRef(dcInstance, inputVars));
}
;

const upsertUniverseEntityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUniverseEntity', inputVars);
}
upsertUniverseEntityRef.operationName = 'UpsertUniverseEntity';
exports.upsertUniverseEntityRef = upsertUniverseEntityRef;

exports.upsertUniverseEntity = function upsertUniverseEntity(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertUniverseEntityRef(dcInstance, inputVars));
}
;

const deleteUniverseEntityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteUniverseEntity', inputVars);
}
deleteUniverseEntityRef.operationName = 'DeleteUniverseEntity';
exports.deleteUniverseEntityRef = deleteUniverseEntityRef;

exports.deleteUniverseEntity = function deleteUniverseEntity(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteUniverseEntityRef(dcInstance, inputVars));
}
;

const upsertSizingConfigRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertSizingConfig', inputVars);
}
upsertSizingConfigRef.operationName = 'UpsertSizingConfig';
exports.upsertSizingConfigRef = upsertSizingConfigRef;

exports.upsertSizingConfig = function upsertSizingConfig(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertSizingConfigRef(dcInstance, inputVars));
}
;

const deleteSizingConfigRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSizingConfig', inputVars);
}
deleteSizingConfigRef.operationName = 'DeleteSizingConfig';
exports.deleteSizingConfigRef = deleteSizingConfigRef;

exports.deleteSizingConfig = function deleteSizingConfig(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteSizingConfigRef(dcInstance, inputVars));
}
;

const upsertAuditFrequencyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertAuditFrequency', inputVars);
}
upsertAuditFrequencyRef.operationName = 'UpsertAuditFrequency';
exports.upsertAuditFrequencyRef = upsertAuditFrequencyRef;

exports.upsertAuditFrequency = function upsertAuditFrequency(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertAuditFrequencyRef(dcInstance, inputVars));
}
;

const deleteAuditFrequencyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAuditFrequency', inputVars);
}
deleteAuditFrequencyRef.operationName = 'DeleteAuditFrequency';
exports.deleteAuditFrequencyRef = deleteAuditFrequencyRef;

exports.deleteAuditFrequency = function deleteAuditFrequency(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteAuditFrequencyRef(dcInstance, inputVars));
}
;

const upsertMasterDataRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertMasterData', inputVars);
}
upsertMasterDataRef.operationName = 'UpsertMasterData';
exports.upsertMasterDataRef = upsertMasterDataRef;

exports.upsertMasterData = function upsertMasterData(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertMasterDataRef(dcInstance, inputVars));
}
;

const deleteMasterDataRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteMasterData', inputVars);
}
deleteMasterDataRef.operationName = 'DeleteMasterData';
exports.deleteMasterDataRef = deleteMasterDataRef;

exports.deleteMasterData = function deleteMasterData(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteMasterDataRef(dcInstance, inputVars));
}
;

const upsertAuditDivisionRiskScaleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertAuditDivisionRiskScale', inputVars);
}
upsertAuditDivisionRiskScaleRef.operationName = 'UpsertAuditDivisionRiskScale';
exports.upsertAuditDivisionRiskScaleRef = upsertAuditDivisionRiskScaleRef;

exports.upsertAuditDivisionRiskScale = function upsertAuditDivisionRiskScale(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertAuditDivisionRiskScaleRef(dcInstance, inputVars));
}
;

const deleteAuditDivisionRiskScaleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAuditDivisionRiskScale', inputVars);
}
deleteAuditDivisionRiskScaleRef.operationName = 'DeleteAuditDivisionRiskScale';
exports.deleteAuditDivisionRiskScaleRef = deleteAuditDivisionRiskScaleRef;

exports.deleteAuditDivisionRiskScale = function deleteAuditDivisionRiskScale(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteAuditDivisionRiskScaleRef(dcInstance, inputVars));
}
;

const upsertAppSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertAppSession', inputVars);
}
upsertAppSessionRef.operationName = 'UpsertAppSession';
exports.upsertAppSessionRef = upsertAppSessionRef;

exports.upsertAppSession = function upsertAppSession(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertAppSessionRef(dcInstance, inputVars));
}
;

const deleteAppSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAppSession', inputVars);
}
deleteAppSessionRef.operationName = 'DeleteAppSession';
exports.deleteAppSessionRef = deleteAppSessionRef;

exports.deleteAppSession = function deleteAppSession(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteAppSessionRef(dcInstance, inputVars));
}
;
