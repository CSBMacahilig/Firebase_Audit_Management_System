# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
- [**Mutations**](#mutations)
  - [*UpsertUserProfile*](#upsertuserprofile)
  - [*DeleteUserProfile*](#deleteuserprofile)
  - [*UpsertSystemUser*](#upsertsystemuser)
  - [*DeleteSystemUser*](#deletesystemuser)
  - [*UpsertEngagement*](#upsertengagement)
  - [*DeleteEngagement*](#deleteengagement)
  - [*UpsertWorkingNote*](#upsertworkingnote)
  - [*DeleteWorkingNote*](#deleteworkingnote)
  - [*UpsertFinding*](#upsertfinding)
  - [*DeleteFinding*](#deletefinding)
  - [*UpsertTimelineActivity*](#upserttimelineactivity)
  - [*DeleteTimelineActivity*](#deletetimelineactivity)
  - [*UpsertEngagementFile*](#upsertengagementfile)
  - [*DeleteEngagementFile*](#deleteengagementfile)
  - [*UpsertActivityLog*](#upsertactivitylog)
  - [*DeleteActivityLog*](#deleteactivitylog)
  - [*UpsertIssueRegister*](#upsertissueregister)
  - [*DeleteIssueRegister*](#deleteissueregister)
  - [*UpsertUniverseEntity*](#upsertuniverseentity)
  - [*DeleteUniverseEntity*](#deleteuniverseentity)
  - [*UpsertSizingConfig*](#upsertsizingconfig)
  - [*DeleteSizingConfig*](#deletesizingconfig)
  - [*UpsertAuditFrequency*](#upsertauditfrequency)
  - [*DeleteAuditFrequency*](#deleteauditfrequency)
  - [*UpsertMasterData*](#upsertmasterdata)
  - [*DeleteMasterData*](#deletemasterdata)
  - [*UpsertAuditDivisionRiskScale*](#upsertauditdivisionriskscale)
  - [*DeleteAuditDivisionRiskScale*](#deleteauditdivisionriskscale)
  - [*UpsertAppSession*](#upsertappsession)
  - [*DeleteAppSession*](#deleteappsession)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

No queries were generated for the `example` connector.

If you want to learn more about how to use queries in Data Connect, you can follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertUserProfile
You can execute the `UpsertUserProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertUserProfile(vars: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;

interface UpsertUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
}
export const upsertUserProfileRef: UpsertUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUserProfile(dc: DataConnect, vars: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;

interface UpsertUserProfileRef {
  ...
  (dc: DataConnect, vars: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
}
export const upsertUserProfileRef: UpsertUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUserProfileRef:
```typescript
const name = upsertUserProfileRef.operationName;
console.log(name);
```

### Variables
The `UpsertUserProfile` mutation requires an argument of type `UpsertUserProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertUserProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserProfileData {
  userProfile_upsert: UserProfile_Key;
}
```
### Using `UpsertUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUserProfile, UpsertUserProfileVariables } from '@dataconnect/generated';

// The `UpsertUserProfile` mutation requires an argument of type `UpsertUserProfileVariables`:
const upsertUserProfileVars: UpsertUserProfileVariables = {
  id: ..., 
  name: ..., 
  roleTitle: ..., 
  fullLabel: ..., 
  headerSubtitle: ..., 
  department: ..., 
  canApproveHead: ..., 
  canApproveIndependent: ..., 
  canApproveCae: ..., 
  employeeNumber: ..., // optional
  accountStatus: ..., 
  failedLoginCount: ..., 
  isLocked: ..., 
  requiresPasswordChange: ..., 
  passwordHistory: ..., 
  mfaEnabled: ..., 
  isPrivileged: ..., 
  addedBy: ..., // optional
  modifiedBy: ..., // optional
};

// Call the `upsertUserProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUserProfile(upsertUserProfileVars);
// Variables can be defined inline as well.
const { data } = await upsertUserProfile({ id: ..., name: ..., roleTitle: ..., fullLabel: ..., headerSubtitle: ..., department: ..., canApproveHead: ..., canApproveIndependent: ..., canApproveCae: ..., employeeNumber: ..., accountStatus: ..., failedLoginCount: ..., isLocked: ..., requiresPasswordChange: ..., passwordHistory: ..., mfaEnabled: ..., isPrivileged: ..., addedBy: ..., modifiedBy: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUserProfile(dataConnect, upsertUserProfileVars);

console.log(data.userProfile_upsert);

// Or, you can use the `Promise` API.
upsertUserProfile(upsertUserProfileVars).then((response) => {
  const data = response.data;
  console.log(data.userProfile_upsert);
});
```

### Using `UpsertUserProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserProfileRef, UpsertUserProfileVariables } from '@dataconnect/generated';

// The `UpsertUserProfile` mutation requires an argument of type `UpsertUserProfileVariables`:
const upsertUserProfileVars: UpsertUserProfileVariables = {
  id: ..., 
  name: ..., 
  roleTitle: ..., 
  fullLabel: ..., 
  headerSubtitle: ..., 
  department: ..., 
  canApproveHead: ..., 
  canApproveIndependent: ..., 
  canApproveCae: ..., 
  employeeNumber: ..., // optional
  accountStatus: ..., 
  failedLoginCount: ..., 
  isLocked: ..., 
  requiresPasswordChange: ..., 
  passwordHistory: ..., 
  mfaEnabled: ..., 
  isPrivileged: ..., 
  addedBy: ..., // optional
  modifiedBy: ..., // optional
};

// Call the `upsertUserProfileRef()` function to get a reference to the mutation.
const ref = upsertUserProfileRef(upsertUserProfileVars);
// Variables can be defined inline as well.
const ref = upsertUserProfileRef({ id: ..., name: ..., roleTitle: ..., fullLabel: ..., headerSubtitle: ..., department: ..., canApproveHead: ..., canApproveIndependent: ..., canApproveCae: ..., employeeNumber: ..., accountStatus: ..., failedLoginCount: ..., isLocked: ..., requiresPasswordChange: ..., passwordHistory: ..., mfaEnabled: ..., isPrivileged: ..., addedBy: ..., modifiedBy: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserProfileRef(dataConnect, upsertUserProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userProfile_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userProfile_upsert);
});
```

## DeleteUserProfile
You can execute the `DeleteUserProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteUserProfile(vars: DeleteUserProfileVariables): MutationPromise<DeleteUserProfileData, DeleteUserProfileVariables>;

interface DeleteUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserProfileVariables): MutationRef<DeleteUserProfileData, DeleteUserProfileVariables>;
}
export const deleteUserProfileRef: DeleteUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUserProfile(dc: DataConnect, vars: DeleteUserProfileVariables): MutationPromise<DeleteUserProfileData, DeleteUserProfileVariables>;

interface DeleteUserProfileRef {
  ...
  (dc: DataConnect, vars: DeleteUserProfileVariables): MutationRef<DeleteUserProfileData, DeleteUserProfileVariables>;
}
export const deleteUserProfileRef: DeleteUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserProfileRef:
```typescript
const name = deleteUserProfileRef.operationName;
console.log(name);
```

### Variables
The `DeleteUserProfile` mutation requires an argument of type `DeleteUserProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteUserProfileVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteUserProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserProfileData {
  userProfile_delete?: UserProfile_Key | null;
}
```
### Using `DeleteUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUserProfile, DeleteUserProfileVariables } from '@dataconnect/generated';

// The `DeleteUserProfile` mutation requires an argument of type `DeleteUserProfileVariables`:
const deleteUserProfileVars: DeleteUserProfileVariables = {
  id: ..., 
};

// Call the `deleteUserProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUserProfile(deleteUserProfileVars);
// Variables can be defined inline as well.
const { data } = await deleteUserProfile({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUserProfile(dataConnect, deleteUserProfileVars);

console.log(data.userProfile_delete);

// Or, you can use the `Promise` API.
deleteUserProfile(deleteUserProfileVars).then((response) => {
  const data = response.data;
  console.log(data.userProfile_delete);
});
```

### Using `DeleteUserProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserProfileRef, DeleteUserProfileVariables } from '@dataconnect/generated';

// The `DeleteUserProfile` mutation requires an argument of type `DeleteUserProfileVariables`:
const deleteUserProfileVars: DeleteUserProfileVariables = {
  id: ..., 
};

// Call the `deleteUserProfileRef()` function to get a reference to the mutation.
const ref = deleteUserProfileRef(deleteUserProfileVars);
// Variables can be defined inline as well.
const ref = deleteUserProfileRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserProfileRef(dataConnect, deleteUserProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userProfile_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userProfile_delete);
});
```

## UpsertSystemUser
You can execute the `UpsertSystemUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertSystemUser(vars: UpsertSystemUserVariables): MutationPromise<UpsertSystemUserData, UpsertSystemUserVariables>;

interface UpsertSystemUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertSystemUserVariables): MutationRef<UpsertSystemUserData, UpsertSystemUserVariables>;
}
export const upsertSystemUserRef: UpsertSystemUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertSystemUser(dc: DataConnect, vars: UpsertSystemUserVariables): MutationPromise<UpsertSystemUserData, UpsertSystemUserVariables>;

interface UpsertSystemUserRef {
  ...
  (dc: DataConnect, vars: UpsertSystemUserVariables): MutationRef<UpsertSystemUserData, UpsertSystemUserVariables>;
}
export const upsertSystemUserRef: UpsertSystemUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertSystemUserRef:
```typescript
const name = upsertSystemUserRef.operationName;
console.log(name);
```

### Variables
The `UpsertSystemUser` mutation requires an argument of type `UpsertSystemUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertSystemUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertSystemUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertSystemUserData {
  systemUser_upsert: SystemUser_Key;
}
```
### Using `UpsertSystemUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertSystemUser, UpsertSystemUserVariables } from '@dataconnect/generated';

// The `UpsertSystemUser` mutation requires an argument of type `UpsertSystemUserVariables`:
const upsertSystemUserVars: UpsertSystemUserVariables = {
  id: ..., 
  username: ..., 
  fullName: ..., 
  email: ..., 
  role: ..., 
  passwordHash: ..., 
  isActive: ..., 
  isLocked: ..., 
  failedLoginCount: ..., 
  requiresPasswordChange: ..., 
  addedBy: ..., // optional
  modifiedBy: ..., // optional
};

// Call the `upsertSystemUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertSystemUser(upsertSystemUserVars);
// Variables can be defined inline as well.
const { data } = await upsertSystemUser({ id: ..., username: ..., fullName: ..., email: ..., role: ..., passwordHash: ..., isActive: ..., isLocked: ..., failedLoginCount: ..., requiresPasswordChange: ..., addedBy: ..., modifiedBy: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertSystemUser(dataConnect, upsertSystemUserVars);

console.log(data.systemUser_upsert);

// Or, you can use the `Promise` API.
upsertSystemUser(upsertSystemUserVars).then((response) => {
  const data = response.data;
  console.log(data.systemUser_upsert);
});
```

### Using `UpsertSystemUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertSystemUserRef, UpsertSystemUserVariables } from '@dataconnect/generated';

// The `UpsertSystemUser` mutation requires an argument of type `UpsertSystemUserVariables`:
const upsertSystemUserVars: UpsertSystemUserVariables = {
  id: ..., 
  username: ..., 
  fullName: ..., 
  email: ..., 
  role: ..., 
  passwordHash: ..., 
  isActive: ..., 
  isLocked: ..., 
  failedLoginCount: ..., 
  requiresPasswordChange: ..., 
  addedBy: ..., // optional
  modifiedBy: ..., // optional
};

// Call the `upsertSystemUserRef()` function to get a reference to the mutation.
const ref = upsertSystemUserRef(upsertSystemUserVars);
// Variables can be defined inline as well.
const ref = upsertSystemUserRef({ id: ..., username: ..., fullName: ..., email: ..., role: ..., passwordHash: ..., isActive: ..., isLocked: ..., failedLoginCount: ..., requiresPasswordChange: ..., addedBy: ..., modifiedBy: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertSystemUserRef(dataConnect, upsertSystemUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.systemUser_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.systemUser_upsert);
});
```

## DeleteSystemUser
You can execute the `DeleteSystemUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteSystemUser(vars: DeleteSystemUserVariables): MutationPromise<DeleteSystemUserData, DeleteSystemUserVariables>;

interface DeleteSystemUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSystemUserVariables): MutationRef<DeleteSystemUserData, DeleteSystemUserVariables>;
}
export const deleteSystemUserRef: DeleteSystemUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSystemUser(dc: DataConnect, vars: DeleteSystemUserVariables): MutationPromise<DeleteSystemUserData, DeleteSystemUserVariables>;

interface DeleteSystemUserRef {
  ...
  (dc: DataConnect, vars: DeleteSystemUserVariables): MutationRef<DeleteSystemUserData, DeleteSystemUserVariables>;
}
export const deleteSystemUserRef: DeleteSystemUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSystemUserRef:
```typescript
const name = deleteSystemUserRef.operationName;
console.log(name);
```

### Variables
The `DeleteSystemUser` mutation requires an argument of type `DeleteSystemUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSystemUserVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteSystemUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSystemUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSystemUserData {
  systemUser_delete?: SystemUser_Key | null;
}
```
### Using `DeleteSystemUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSystemUser, DeleteSystemUserVariables } from '@dataconnect/generated';

// The `DeleteSystemUser` mutation requires an argument of type `DeleteSystemUserVariables`:
const deleteSystemUserVars: DeleteSystemUserVariables = {
  id: ..., 
};

// Call the `deleteSystemUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSystemUser(deleteSystemUserVars);
// Variables can be defined inline as well.
const { data } = await deleteSystemUser({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSystemUser(dataConnect, deleteSystemUserVars);

console.log(data.systemUser_delete);

// Or, you can use the `Promise` API.
deleteSystemUser(deleteSystemUserVars).then((response) => {
  const data = response.data;
  console.log(data.systemUser_delete);
});
```

### Using `DeleteSystemUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSystemUserRef, DeleteSystemUserVariables } from '@dataconnect/generated';

// The `DeleteSystemUser` mutation requires an argument of type `DeleteSystemUserVariables`:
const deleteSystemUserVars: DeleteSystemUserVariables = {
  id: ..., 
};

// Call the `deleteSystemUserRef()` function to get a reference to the mutation.
const ref = deleteSystemUserRef(deleteSystemUserVars);
// Variables can be defined inline as well.
const ref = deleteSystemUserRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSystemUserRef(dataConnect, deleteSystemUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.systemUser_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.systemUser_delete);
});
```

## UpsertEngagement
You can execute the `UpsertEngagement` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertEngagement(vars: UpsertEngagementVariables): MutationPromise<UpsertEngagementData, UpsertEngagementVariables>;

interface UpsertEngagementRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertEngagementVariables): MutationRef<UpsertEngagementData, UpsertEngagementVariables>;
}
export const upsertEngagementRef: UpsertEngagementRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertEngagement(dc: DataConnect, vars: UpsertEngagementVariables): MutationPromise<UpsertEngagementData, UpsertEngagementVariables>;

interface UpsertEngagementRef {
  ...
  (dc: DataConnect, vars: UpsertEngagementVariables): MutationRef<UpsertEngagementData, UpsertEngagementVariables>;
}
export const upsertEngagementRef: UpsertEngagementRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertEngagementRef:
```typescript
const name = upsertEngagementRef.operationName;
console.log(name);
```

### Variables
The `UpsertEngagement` mutation requires an argument of type `UpsertEngagementVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertEngagement` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertEngagementData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertEngagementData {
  engagement_upsert: Engagement_Key;
}
```
### Using `UpsertEngagement`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertEngagement, UpsertEngagementVariables } from '@dataconnect/generated';

// The `UpsertEngagement` mutation requires an argument of type `UpsertEngagementVariables`:
const upsertEngagementVars: UpsertEngagementVariables = {
  id: ..., 
  ref: ..., 
  year: ..., 
  title: ..., 
  category: ..., 
  department: ..., 
  entityName: ..., 
  likelihood: ..., 
  impact: ..., 
  riskScore: ..., 
  riskLevel: ..., 
  lead: ..., 
  headReviewer: ..., 
  independentReviewer: ..., 
  startDate: ..., 
  endDate: ..., 
  durationDays: ..., 
  budgetedHours: ..., 
  status: ..., 
  readyRatio: ..., 
  lifecycleStage: ..., 
  fieldworkPct: ..., 
  fieldworkDayCurrent: ..., 
  fieldworkDayTotal: ..., 
  reportStatus: ..., 
  reportRef: ..., 
  executiveSummary: ..., 
  reportRating: ..., // optional
  addedBy: ..., // optional
  modifiedBy: ..., // optional
  auditDivisionId: ..., // optional
  objectives: ..., 
  scope: ..., 
  criteria: ..., 
  addresseeName: ..., 
  addresseeTitle: ..., 
  copyFurnished: ..., 
};

// Call the `upsertEngagement()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertEngagement(upsertEngagementVars);
// Variables can be defined inline as well.
const { data } = await upsertEngagement({ id: ..., ref: ..., year: ..., title: ..., category: ..., department: ..., entityName: ..., likelihood: ..., impact: ..., riskScore: ..., riskLevel: ..., lead: ..., headReviewer: ..., independentReviewer: ..., startDate: ..., endDate: ..., durationDays: ..., budgetedHours: ..., status: ..., readyRatio: ..., lifecycleStage: ..., fieldworkPct: ..., fieldworkDayCurrent: ..., fieldworkDayTotal: ..., reportStatus: ..., reportRef: ..., executiveSummary: ..., reportRating: ..., addedBy: ..., modifiedBy: ..., auditDivisionId: ..., objectives: ..., scope: ..., criteria: ..., addresseeName: ..., addresseeTitle: ..., copyFurnished: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertEngagement(dataConnect, upsertEngagementVars);

console.log(data.engagement_upsert);

// Or, you can use the `Promise` API.
upsertEngagement(upsertEngagementVars).then((response) => {
  const data = response.data;
  console.log(data.engagement_upsert);
});
```

### Using `UpsertEngagement`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertEngagementRef, UpsertEngagementVariables } from '@dataconnect/generated';

// The `UpsertEngagement` mutation requires an argument of type `UpsertEngagementVariables`:
const upsertEngagementVars: UpsertEngagementVariables = {
  id: ..., 
  ref: ..., 
  year: ..., 
  title: ..., 
  category: ..., 
  department: ..., 
  entityName: ..., 
  likelihood: ..., 
  impact: ..., 
  riskScore: ..., 
  riskLevel: ..., 
  lead: ..., 
  headReviewer: ..., 
  independentReviewer: ..., 
  startDate: ..., 
  endDate: ..., 
  durationDays: ..., 
  budgetedHours: ..., 
  status: ..., 
  readyRatio: ..., 
  lifecycleStage: ..., 
  fieldworkPct: ..., 
  fieldworkDayCurrent: ..., 
  fieldworkDayTotal: ..., 
  reportStatus: ..., 
  reportRef: ..., 
  executiveSummary: ..., 
  reportRating: ..., // optional
  addedBy: ..., // optional
  modifiedBy: ..., // optional
  auditDivisionId: ..., // optional
  objectives: ..., 
  scope: ..., 
  criteria: ..., 
  addresseeName: ..., 
  addresseeTitle: ..., 
  copyFurnished: ..., 
};

// Call the `upsertEngagementRef()` function to get a reference to the mutation.
const ref = upsertEngagementRef(upsertEngagementVars);
// Variables can be defined inline as well.
const ref = upsertEngagementRef({ id: ..., ref: ..., year: ..., title: ..., category: ..., department: ..., entityName: ..., likelihood: ..., impact: ..., riskScore: ..., riskLevel: ..., lead: ..., headReviewer: ..., independentReviewer: ..., startDate: ..., endDate: ..., durationDays: ..., budgetedHours: ..., status: ..., readyRatio: ..., lifecycleStage: ..., fieldworkPct: ..., fieldworkDayCurrent: ..., fieldworkDayTotal: ..., reportStatus: ..., reportRef: ..., executiveSummary: ..., reportRating: ..., addedBy: ..., modifiedBy: ..., auditDivisionId: ..., objectives: ..., scope: ..., criteria: ..., addresseeName: ..., addresseeTitle: ..., copyFurnished: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertEngagementRef(dataConnect, upsertEngagementVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.engagement_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.engagement_upsert);
});
```

## DeleteEngagement
You can execute the `DeleteEngagement` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteEngagement(vars: DeleteEngagementVariables): MutationPromise<DeleteEngagementData, DeleteEngagementVariables>;

interface DeleteEngagementRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteEngagementVariables): MutationRef<DeleteEngagementData, DeleteEngagementVariables>;
}
export const deleteEngagementRef: DeleteEngagementRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteEngagement(dc: DataConnect, vars: DeleteEngagementVariables): MutationPromise<DeleteEngagementData, DeleteEngagementVariables>;

interface DeleteEngagementRef {
  ...
  (dc: DataConnect, vars: DeleteEngagementVariables): MutationRef<DeleteEngagementData, DeleteEngagementVariables>;
}
export const deleteEngagementRef: DeleteEngagementRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteEngagementRef:
```typescript
const name = deleteEngagementRef.operationName;
console.log(name);
```

### Variables
The `DeleteEngagement` mutation requires an argument of type `DeleteEngagementVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteEngagementVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteEngagement` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteEngagementData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteEngagementData {
  engagement_delete?: Engagement_Key | null;
}
```
### Using `DeleteEngagement`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteEngagement, DeleteEngagementVariables } from '@dataconnect/generated';

// The `DeleteEngagement` mutation requires an argument of type `DeleteEngagementVariables`:
const deleteEngagementVars: DeleteEngagementVariables = {
  id: ..., 
};

// Call the `deleteEngagement()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteEngagement(deleteEngagementVars);
// Variables can be defined inline as well.
const { data } = await deleteEngagement({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteEngagement(dataConnect, deleteEngagementVars);

console.log(data.engagement_delete);

// Or, you can use the `Promise` API.
deleteEngagement(deleteEngagementVars).then((response) => {
  const data = response.data;
  console.log(data.engagement_delete);
});
```

### Using `DeleteEngagement`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteEngagementRef, DeleteEngagementVariables } from '@dataconnect/generated';

// The `DeleteEngagement` mutation requires an argument of type `DeleteEngagementVariables`:
const deleteEngagementVars: DeleteEngagementVariables = {
  id: ..., 
};

// Call the `deleteEngagementRef()` function to get a reference to the mutation.
const ref = deleteEngagementRef(deleteEngagementVars);
// Variables can be defined inline as well.
const ref = deleteEngagementRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteEngagementRef(dataConnect, deleteEngagementVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.engagement_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.engagement_delete);
});
```

## UpsertWorkingNote
You can execute the `UpsertWorkingNote` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertWorkingNote(vars: UpsertWorkingNoteVariables): MutationPromise<UpsertWorkingNoteData, UpsertWorkingNoteVariables>;

interface UpsertWorkingNoteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertWorkingNoteVariables): MutationRef<UpsertWorkingNoteData, UpsertWorkingNoteVariables>;
}
export const upsertWorkingNoteRef: UpsertWorkingNoteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertWorkingNote(dc: DataConnect, vars: UpsertWorkingNoteVariables): MutationPromise<UpsertWorkingNoteData, UpsertWorkingNoteVariables>;

interface UpsertWorkingNoteRef {
  ...
  (dc: DataConnect, vars: UpsertWorkingNoteVariables): MutationRef<UpsertWorkingNoteData, UpsertWorkingNoteVariables>;
}
export const upsertWorkingNoteRef: UpsertWorkingNoteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertWorkingNoteRef:
```typescript
const name = upsertWorkingNoteRef.operationName;
console.log(name);
```

### Variables
The `UpsertWorkingNote` mutation requires an argument of type `UpsertWorkingNoteVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertWorkingNote` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertWorkingNoteData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertWorkingNoteData {
  workingNote_upsert: WorkingNote_Key;
}
```
### Using `UpsertWorkingNote`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertWorkingNote, UpsertWorkingNoteVariables } from '@dataconnect/generated';

// The `UpsertWorkingNote` mutation requires an argument of type `UpsertWorkingNoteVariables`:
const upsertWorkingNoteVars: UpsertWorkingNoteVariables = {
  id: ..., 
  engagementId: ..., 
  ref: ..., 
  title: ..., 
  controlArea: ..., 
  author: ..., 
  status: ..., 
  hasException: ..., 
  updatedAt: ..., 
  testingProcedure: ..., 
  conclusion: ..., 
  reviewerComments: ..., // optional
  addedBy: ..., // optional
  modifiedBy: ..., // optional
  observations: ..., 
};

// Call the `upsertWorkingNote()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertWorkingNote(upsertWorkingNoteVars);
// Variables can be defined inline as well.
const { data } = await upsertWorkingNote({ id: ..., engagementId: ..., ref: ..., title: ..., controlArea: ..., author: ..., status: ..., hasException: ..., updatedAt: ..., testingProcedure: ..., conclusion: ..., reviewerComments: ..., addedBy: ..., modifiedBy: ..., observations: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertWorkingNote(dataConnect, upsertWorkingNoteVars);

console.log(data.workingNote_upsert);

// Or, you can use the `Promise` API.
upsertWorkingNote(upsertWorkingNoteVars).then((response) => {
  const data = response.data;
  console.log(data.workingNote_upsert);
});
```

### Using `UpsertWorkingNote`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertWorkingNoteRef, UpsertWorkingNoteVariables } from '@dataconnect/generated';

// The `UpsertWorkingNote` mutation requires an argument of type `UpsertWorkingNoteVariables`:
const upsertWorkingNoteVars: UpsertWorkingNoteVariables = {
  id: ..., 
  engagementId: ..., 
  ref: ..., 
  title: ..., 
  controlArea: ..., 
  author: ..., 
  status: ..., 
  hasException: ..., 
  updatedAt: ..., 
  testingProcedure: ..., 
  conclusion: ..., 
  reviewerComments: ..., // optional
  addedBy: ..., // optional
  modifiedBy: ..., // optional
  observations: ..., 
};

// Call the `upsertWorkingNoteRef()` function to get a reference to the mutation.
const ref = upsertWorkingNoteRef(upsertWorkingNoteVars);
// Variables can be defined inline as well.
const ref = upsertWorkingNoteRef({ id: ..., engagementId: ..., ref: ..., title: ..., controlArea: ..., author: ..., status: ..., hasException: ..., updatedAt: ..., testingProcedure: ..., conclusion: ..., reviewerComments: ..., addedBy: ..., modifiedBy: ..., observations: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertWorkingNoteRef(dataConnect, upsertWorkingNoteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.workingNote_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.workingNote_upsert);
});
```

## DeleteWorkingNote
You can execute the `DeleteWorkingNote` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteWorkingNote(vars: DeleteWorkingNoteVariables): MutationPromise<DeleteWorkingNoteData, DeleteWorkingNoteVariables>;

interface DeleteWorkingNoteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteWorkingNoteVariables): MutationRef<DeleteWorkingNoteData, DeleteWorkingNoteVariables>;
}
export const deleteWorkingNoteRef: DeleteWorkingNoteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteWorkingNote(dc: DataConnect, vars: DeleteWorkingNoteVariables): MutationPromise<DeleteWorkingNoteData, DeleteWorkingNoteVariables>;

interface DeleteWorkingNoteRef {
  ...
  (dc: DataConnect, vars: DeleteWorkingNoteVariables): MutationRef<DeleteWorkingNoteData, DeleteWorkingNoteVariables>;
}
export const deleteWorkingNoteRef: DeleteWorkingNoteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteWorkingNoteRef:
```typescript
const name = deleteWorkingNoteRef.operationName;
console.log(name);
```

### Variables
The `DeleteWorkingNote` mutation requires an argument of type `DeleteWorkingNoteVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteWorkingNoteVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteWorkingNote` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteWorkingNoteData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteWorkingNoteData {
  workingNote_delete?: WorkingNote_Key | null;
}
```
### Using `DeleteWorkingNote`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteWorkingNote, DeleteWorkingNoteVariables } from '@dataconnect/generated';

// The `DeleteWorkingNote` mutation requires an argument of type `DeleteWorkingNoteVariables`:
const deleteWorkingNoteVars: DeleteWorkingNoteVariables = {
  id: ..., 
};

// Call the `deleteWorkingNote()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteWorkingNote(deleteWorkingNoteVars);
// Variables can be defined inline as well.
const { data } = await deleteWorkingNote({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteWorkingNote(dataConnect, deleteWorkingNoteVars);

console.log(data.workingNote_delete);

// Or, you can use the `Promise` API.
deleteWorkingNote(deleteWorkingNoteVars).then((response) => {
  const data = response.data;
  console.log(data.workingNote_delete);
});
```

### Using `DeleteWorkingNote`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteWorkingNoteRef, DeleteWorkingNoteVariables } from '@dataconnect/generated';

// The `DeleteWorkingNote` mutation requires an argument of type `DeleteWorkingNoteVariables`:
const deleteWorkingNoteVars: DeleteWorkingNoteVariables = {
  id: ..., 
};

// Call the `deleteWorkingNoteRef()` function to get a reference to the mutation.
const ref = deleteWorkingNoteRef(deleteWorkingNoteVars);
// Variables can be defined inline as well.
const ref = deleteWorkingNoteRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteWorkingNoteRef(dataConnect, deleteWorkingNoteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.workingNote_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.workingNote_delete);
});
```

## UpsertFinding
You can execute the `UpsertFinding` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertFinding(vars: UpsertFindingVariables): MutationPromise<UpsertFindingData, UpsertFindingVariables>;

interface UpsertFindingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertFindingVariables): MutationRef<UpsertFindingData, UpsertFindingVariables>;
}
export const upsertFindingRef: UpsertFindingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertFinding(dc: DataConnect, vars: UpsertFindingVariables): MutationPromise<UpsertFindingData, UpsertFindingVariables>;

interface UpsertFindingRef {
  ...
  (dc: DataConnect, vars: UpsertFindingVariables): MutationRef<UpsertFindingData, UpsertFindingVariables>;
}
export const upsertFindingRef: UpsertFindingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertFindingRef:
```typescript
const name = upsertFindingRef.operationName;
console.log(name);
```

### Variables
The `UpsertFinding` mutation requires an argument of type `UpsertFindingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertFinding` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertFindingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertFindingData {
  finding_upsert: Finding_Key;
}
```
### Using `UpsertFinding`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertFinding, UpsertFindingVariables } from '@dataconnect/generated';

// The `UpsertFinding` mutation requires an argument of type `UpsertFindingVariables`:
const upsertFindingVars: UpsertFindingVariables = {
  id: ..., 
  engagementId: ..., 
  ref: ..., 
  title: ..., 
  severity: ..., 
  condition: ..., 
  criteria: ..., 
  cause: ..., 
  effect: ..., 
  recommendation: ..., 
  owner: ..., 
  targetDate: ..., 
  status: ..., 
  linkedNoteRef: ..., 
  addedBy: ..., // optional
  modifiedBy: ..., // optional
  category: ..., 
};

// Call the `upsertFinding()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertFinding(upsertFindingVars);
// Variables can be defined inline as well.
const { data } = await upsertFinding({ id: ..., engagementId: ..., ref: ..., title: ..., severity: ..., condition: ..., criteria: ..., cause: ..., effect: ..., recommendation: ..., owner: ..., targetDate: ..., status: ..., linkedNoteRef: ..., addedBy: ..., modifiedBy: ..., category: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertFinding(dataConnect, upsertFindingVars);

console.log(data.finding_upsert);

// Or, you can use the `Promise` API.
upsertFinding(upsertFindingVars).then((response) => {
  const data = response.data;
  console.log(data.finding_upsert);
});
```

### Using `UpsertFinding`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertFindingRef, UpsertFindingVariables } from '@dataconnect/generated';

// The `UpsertFinding` mutation requires an argument of type `UpsertFindingVariables`:
const upsertFindingVars: UpsertFindingVariables = {
  id: ..., 
  engagementId: ..., 
  ref: ..., 
  title: ..., 
  severity: ..., 
  condition: ..., 
  criteria: ..., 
  cause: ..., 
  effect: ..., 
  recommendation: ..., 
  owner: ..., 
  targetDate: ..., 
  status: ..., 
  linkedNoteRef: ..., 
  addedBy: ..., // optional
  modifiedBy: ..., // optional
  category: ..., 
};

// Call the `upsertFindingRef()` function to get a reference to the mutation.
const ref = upsertFindingRef(upsertFindingVars);
// Variables can be defined inline as well.
const ref = upsertFindingRef({ id: ..., engagementId: ..., ref: ..., title: ..., severity: ..., condition: ..., criteria: ..., cause: ..., effect: ..., recommendation: ..., owner: ..., targetDate: ..., status: ..., linkedNoteRef: ..., addedBy: ..., modifiedBy: ..., category: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertFindingRef(dataConnect, upsertFindingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.finding_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.finding_upsert);
});
```

## DeleteFinding
You can execute the `DeleteFinding` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteFinding(vars: DeleteFindingVariables): MutationPromise<DeleteFindingData, DeleteFindingVariables>;

interface DeleteFindingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteFindingVariables): MutationRef<DeleteFindingData, DeleteFindingVariables>;
}
export const deleteFindingRef: DeleteFindingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteFinding(dc: DataConnect, vars: DeleteFindingVariables): MutationPromise<DeleteFindingData, DeleteFindingVariables>;

interface DeleteFindingRef {
  ...
  (dc: DataConnect, vars: DeleteFindingVariables): MutationRef<DeleteFindingData, DeleteFindingVariables>;
}
export const deleteFindingRef: DeleteFindingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteFindingRef:
```typescript
const name = deleteFindingRef.operationName;
console.log(name);
```

### Variables
The `DeleteFinding` mutation requires an argument of type `DeleteFindingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteFindingVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteFinding` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteFindingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteFindingData {
  finding_delete?: Finding_Key | null;
}
```
### Using `DeleteFinding`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteFinding, DeleteFindingVariables } from '@dataconnect/generated';

// The `DeleteFinding` mutation requires an argument of type `DeleteFindingVariables`:
const deleteFindingVars: DeleteFindingVariables = {
  id: ..., 
};

// Call the `deleteFinding()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteFinding(deleteFindingVars);
// Variables can be defined inline as well.
const { data } = await deleteFinding({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteFinding(dataConnect, deleteFindingVars);

console.log(data.finding_delete);

// Or, you can use the `Promise` API.
deleteFinding(deleteFindingVars).then((response) => {
  const data = response.data;
  console.log(data.finding_delete);
});
```

### Using `DeleteFinding`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteFindingRef, DeleteFindingVariables } from '@dataconnect/generated';

// The `DeleteFinding` mutation requires an argument of type `DeleteFindingVariables`:
const deleteFindingVars: DeleteFindingVariables = {
  id: ..., 
};

// Call the `deleteFindingRef()` function to get a reference to the mutation.
const ref = deleteFindingRef(deleteFindingVars);
// Variables can be defined inline as well.
const ref = deleteFindingRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteFindingRef(dataConnect, deleteFindingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.finding_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.finding_delete);
});
```

## UpsertTimelineActivity
You can execute the `UpsertTimelineActivity` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertTimelineActivity(vars: UpsertTimelineActivityVariables): MutationPromise<UpsertTimelineActivityData, UpsertTimelineActivityVariables>;

interface UpsertTimelineActivityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertTimelineActivityVariables): MutationRef<UpsertTimelineActivityData, UpsertTimelineActivityVariables>;
}
export const upsertTimelineActivityRef: UpsertTimelineActivityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertTimelineActivity(dc: DataConnect, vars: UpsertTimelineActivityVariables): MutationPromise<UpsertTimelineActivityData, UpsertTimelineActivityVariables>;

interface UpsertTimelineActivityRef {
  ...
  (dc: DataConnect, vars: UpsertTimelineActivityVariables): MutationRef<UpsertTimelineActivityData, UpsertTimelineActivityVariables>;
}
export const upsertTimelineActivityRef: UpsertTimelineActivityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertTimelineActivityRef:
```typescript
const name = upsertTimelineActivityRef.operationName;
console.log(name);
```

### Variables
The `UpsertTimelineActivity` mutation requires an argument of type `UpsertTimelineActivityVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertTimelineActivity` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertTimelineActivityData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertTimelineActivityData {
  timelineActivity_upsert: TimelineActivity_Key;
}
```
### Using `UpsertTimelineActivity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertTimelineActivity, UpsertTimelineActivityVariables } from '@dataconnect/generated';

// The `UpsertTimelineActivity` mutation requires an argument of type `UpsertTimelineActivityVariables`:
const upsertTimelineActivityVars: UpsertTimelineActivityVariables = {
  id: ..., 
  engagementId: ..., 
  name: ..., 
  roleResponsible: ..., 
  dueDate: ..., 
  completedDate: ..., // optional
  status: ..., 
  stageId: ..., 
  addedBy: ..., // optional
  modifiedBy: ..., // optional
};

// Call the `upsertTimelineActivity()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertTimelineActivity(upsertTimelineActivityVars);
// Variables can be defined inline as well.
const { data } = await upsertTimelineActivity({ id: ..., engagementId: ..., name: ..., roleResponsible: ..., dueDate: ..., completedDate: ..., status: ..., stageId: ..., addedBy: ..., modifiedBy: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertTimelineActivity(dataConnect, upsertTimelineActivityVars);

console.log(data.timelineActivity_upsert);

// Or, you can use the `Promise` API.
upsertTimelineActivity(upsertTimelineActivityVars).then((response) => {
  const data = response.data;
  console.log(data.timelineActivity_upsert);
});
```

### Using `UpsertTimelineActivity`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertTimelineActivityRef, UpsertTimelineActivityVariables } from '@dataconnect/generated';

// The `UpsertTimelineActivity` mutation requires an argument of type `UpsertTimelineActivityVariables`:
const upsertTimelineActivityVars: UpsertTimelineActivityVariables = {
  id: ..., 
  engagementId: ..., 
  name: ..., 
  roleResponsible: ..., 
  dueDate: ..., 
  completedDate: ..., // optional
  status: ..., 
  stageId: ..., 
  addedBy: ..., // optional
  modifiedBy: ..., // optional
};

// Call the `upsertTimelineActivityRef()` function to get a reference to the mutation.
const ref = upsertTimelineActivityRef(upsertTimelineActivityVars);
// Variables can be defined inline as well.
const ref = upsertTimelineActivityRef({ id: ..., engagementId: ..., name: ..., roleResponsible: ..., dueDate: ..., completedDate: ..., status: ..., stageId: ..., addedBy: ..., modifiedBy: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertTimelineActivityRef(dataConnect, upsertTimelineActivityVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.timelineActivity_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.timelineActivity_upsert);
});
```

## DeleteTimelineActivity
You can execute the `DeleteTimelineActivity` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteTimelineActivity(vars: DeleteTimelineActivityVariables): MutationPromise<DeleteTimelineActivityData, DeleteTimelineActivityVariables>;

interface DeleteTimelineActivityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTimelineActivityVariables): MutationRef<DeleteTimelineActivityData, DeleteTimelineActivityVariables>;
}
export const deleteTimelineActivityRef: DeleteTimelineActivityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteTimelineActivity(dc: DataConnect, vars: DeleteTimelineActivityVariables): MutationPromise<DeleteTimelineActivityData, DeleteTimelineActivityVariables>;

interface DeleteTimelineActivityRef {
  ...
  (dc: DataConnect, vars: DeleteTimelineActivityVariables): MutationRef<DeleteTimelineActivityData, DeleteTimelineActivityVariables>;
}
export const deleteTimelineActivityRef: DeleteTimelineActivityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteTimelineActivityRef:
```typescript
const name = deleteTimelineActivityRef.operationName;
console.log(name);
```

### Variables
The `DeleteTimelineActivity` mutation requires an argument of type `DeleteTimelineActivityVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteTimelineActivityVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteTimelineActivity` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteTimelineActivityData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteTimelineActivityData {
  timelineActivity_delete?: TimelineActivity_Key | null;
}
```
### Using `DeleteTimelineActivity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteTimelineActivity, DeleteTimelineActivityVariables } from '@dataconnect/generated';

// The `DeleteTimelineActivity` mutation requires an argument of type `DeleteTimelineActivityVariables`:
const deleteTimelineActivityVars: DeleteTimelineActivityVariables = {
  id: ..., 
};

// Call the `deleteTimelineActivity()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteTimelineActivity(deleteTimelineActivityVars);
// Variables can be defined inline as well.
const { data } = await deleteTimelineActivity({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteTimelineActivity(dataConnect, deleteTimelineActivityVars);

console.log(data.timelineActivity_delete);

// Or, you can use the `Promise` API.
deleteTimelineActivity(deleteTimelineActivityVars).then((response) => {
  const data = response.data;
  console.log(data.timelineActivity_delete);
});
```

### Using `DeleteTimelineActivity`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteTimelineActivityRef, DeleteTimelineActivityVariables } from '@dataconnect/generated';

// The `DeleteTimelineActivity` mutation requires an argument of type `DeleteTimelineActivityVariables`:
const deleteTimelineActivityVars: DeleteTimelineActivityVariables = {
  id: ..., 
};

// Call the `deleteTimelineActivityRef()` function to get a reference to the mutation.
const ref = deleteTimelineActivityRef(deleteTimelineActivityVars);
// Variables can be defined inline as well.
const ref = deleteTimelineActivityRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteTimelineActivityRef(dataConnect, deleteTimelineActivityVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.timelineActivity_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.timelineActivity_delete);
});
```

## UpsertEngagementFile
You can execute the `UpsertEngagementFile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertEngagementFile(vars: UpsertEngagementFileVariables): MutationPromise<UpsertEngagementFileData, UpsertEngagementFileVariables>;

interface UpsertEngagementFileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertEngagementFileVariables): MutationRef<UpsertEngagementFileData, UpsertEngagementFileVariables>;
}
export const upsertEngagementFileRef: UpsertEngagementFileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertEngagementFile(dc: DataConnect, vars: UpsertEngagementFileVariables): MutationPromise<UpsertEngagementFileData, UpsertEngagementFileVariables>;

interface UpsertEngagementFileRef {
  ...
  (dc: DataConnect, vars: UpsertEngagementFileVariables): MutationRef<UpsertEngagementFileData, UpsertEngagementFileVariables>;
}
export const upsertEngagementFileRef: UpsertEngagementFileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertEngagementFileRef:
```typescript
const name = upsertEngagementFileRef.operationName;
console.log(name);
```

### Variables
The `UpsertEngagementFile` mutation requires an argument of type `UpsertEngagementFileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertEngagementFile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertEngagementFileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertEngagementFileData {
  engagementFile_upsert: EngagementFile_Key;
}
```
### Using `UpsertEngagementFile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertEngagementFile, UpsertEngagementFileVariables } from '@dataconnect/generated';

// The `UpsertEngagementFile` mutation requires an argument of type `UpsertEngagementFileVariables`:
const upsertEngagementFileVars: UpsertEngagementFileVariables = {
  id: ..., 
  engagementId: ..., 
  name: ..., 
  folder: ..., 
  size: ..., 
  uploadedBy: ..., 
  uploadedAt: ..., 
  addedBy: ..., // optional
  modifiedBy: ..., // optional
};

// Call the `upsertEngagementFile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertEngagementFile(upsertEngagementFileVars);
// Variables can be defined inline as well.
const { data } = await upsertEngagementFile({ id: ..., engagementId: ..., name: ..., folder: ..., size: ..., uploadedBy: ..., uploadedAt: ..., addedBy: ..., modifiedBy: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertEngagementFile(dataConnect, upsertEngagementFileVars);

console.log(data.engagementFile_upsert);

// Or, you can use the `Promise` API.
upsertEngagementFile(upsertEngagementFileVars).then((response) => {
  const data = response.data;
  console.log(data.engagementFile_upsert);
});
```

### Using `UpsertEngagementFile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertEngagementFileRef, UpsertEngagementFileVariables } from '@dataconnect/generated';

// The `UpsertEngagementFile` mutation requires an argument of type `UpsertEngagementFileVariables`:
const upsertEngagementFileVars: UpsertEngagementFileVariables = {
  id: ..., 
  engagementId: ..., 
  name: ..., 
  folder: ..., 
  size: ..., 
  uploadedBy: ..., 
  uploadedAt: ..., 
  addedBy: ..., // optional
  modifiedBy: ..., // optional
};

// Call the `upsertEngagementFileRef()` function to get a reference to the mutation.
const ref = upsertEngagementFileRef(upsertEngagementFileVars);
// Variables can be defined inline as well.
const ref = upsertEngagementFileRef({ id: ..., engagementId: ..., name: ..., folder: ..., size: ..., uploadedBy: ..., uploadedAt: ..., addedBy: ..., modifiedBy: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertEngagementFileRef(dataConnect, upsertEngagementFileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.engagementFile_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.engagementFile_upsert);
});
```

## DeleteEngagementFile
You can execute the `DeleteEngagementFile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteEngagementFile(vars: DeleteEngagementFileVariables): MutationPromise<DeleteEngagementFileData, DeleteEngagementFileVariables>;

interface DeleteEngagementFileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteEngagementFileVariables): MutationRef<DeleteEngagementFileData, DeleteEngagementFileVariables>;
}
export const deleteEngagementFileRef: DeleteEngagementFileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteEngagementFile(dc: DataConnect, vars: DeleteEngagementFileVariables): MutationPromise<DeleteEngagementFileData, DeleteEngagementFileVariables>;

interface DeleteEngagementFileRef {
  ...
  (dc: DataConnect, vars: DeleteEngagementFileVariables): MutationRef<DeleteEngagementFileData, DeleteEngagementFileVariables>;
}
export const deleteEngagementFileRef: DeleteEngagementFileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteEngagementFileRef:
```typescript
const name = deleteEngagementFileRef.operationName;
console.log(name);
```

### Variables
The `DeleteEngagementFile` mutation requires an argument of type `DeleteEngagementFileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteEngagementFileVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteEngagementFile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteEngagementFileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteEngagementFileData {
  engagementFile_delete?: EngagementFile_Key | null;
}
```
### Using `DeleteEngagementFile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteEngagementFile, DeleteEngagementFileVariables } from '@dataconnect/generated';

// The `DeleteEngagementFile` mutation requires an argument of type `DeleteEngagementFileVariables`:
const deleteEngagementFileVars: DeleteEngagementFileVariables = {
  id: ..., 
};

// Call the `deleteEngagementFile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteEngagementFile(deleteEngagementFileVars);
// Variables can be defined inline as well.
const { data } = await deleteEngagementFile({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteEngagementFile(dataConnect, deleteEngagementFileVars);

console.log(data.engagementFile_delete);

// Or, you can use the `Promise` API.
deleteEngagementFile(deleteEngagementFileVars).then((response) => {
  const data = response.data;
  console.log(data.engagementFile_delete);
});
```

### Using `DeleteEngagementFile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteEngagementFileRef, DeleteEngagementFileVariables } from '@dataconnect/generated';

// The `DeleteEngagementFile` mutation requires an argument of type `DeleteEngagementFileVariables`:
const deleteEngagementFileVars: DeleteEngagementFileVariables = {
  id: ..., 
};

// Call the `deleteEngagementFileRef()` function to get a reference to the mutation.
const ref = deleteEngagementFileRef(deleteEngagementFileVars);
// Variables can be defined inline as well.
const ref = deleteEngagementFileRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteEngagementFileRef(dataConnect, deleteEngagementFileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.engagementFile_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.engagementFile_delete);
});
```

## UpsertActivityLog
You can execute the `UpsertActivityLog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertActivityLog(vars: UpsertActivityLogVariables): MutationPromise<UpsertActivityLogData, UpsertActivityLogVariables>;

interface UpsertActivityLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertActivityLogVariables): MutationRef<UpsertActivityLogData, UpsertActivityLogVariables>;
}
export const upsertActivityLogRef: UpsertActivityLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertActivityLog(dc: DataConnect, vars: UpsertActivityLogVariables): MutationPromise<UpsertActivityLogData, UpsertActivityLogVariables>;

interface UpsertActivityLogRef {
  ...
  (dc: DataConnect, vars: UpsertActivityLogVariables): MutationRef<UpsertActivityLogData, UpsertActivityLogVariables>;
}
export const upsertActivityLogRef: UpsertActivityLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertActivityLogRef:
```typescript
const name = upsertActivityLogRef.operationName;
console.log(name);
```

### Variables
The `UpsertActivityLog` mutation requires an argument of type `UpsertActivityLogVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertActivityLog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertActivityLogData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertActivityLogData {
  activityLog_upsert: ActivityLog_Key;
}
```
### Using `UpsertActivityLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertActivityLog, UpsertActivityLogVariables } from '@dataconnect/generated';

// The `UpsertActivityLog` mutation requires an argument of type `UpsertActivityLogVariables`:
const upsertActivityLogVars: UpsertActivityLogVariables = {
  id: ..., 
  engagementId: ..., 
  timestamp: ..., 
  actor: ..., 
  action: ..., 
  detail: ..., // optional
  addedBy: ..., // optional
  modifiedBy: ..., // optional
};

// Call the `upsertActivityLog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertActivityLog(upsertActivityLogVars);
// Variables can be defined inline as well.
const { data } = await upsertActivityLog({ id: ..., engagementId: ..., timestamp: ..., actor: ..., action: ..., detail: ..., addedBy: ..., modifiedBy: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertActivityLog(dataConnect, upsertActivityLogVars);

console.log(data.activityLog_upsert);

// Or, you can use the `Promise` API.
upsertActivityLog(upsertActivityLogVars).then((response) => {
  const data = response.data;
  console.log(data.activityLog_upsert);
});
```

### Using `UpsertActivityLog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertActivityLogRef, UpsertActivityLogVariables } from '@dataconnect/generated';

// The `UpsertActivityLog` mutation requires an argument of type `UpsertActivityLogVariables`:
const upsertActivityLogVars: UpsertActivityLogVariables = {
  id: ..., 
  engagementId: ..., 
  timestamp: ..., 
  actor: ..., 
  action: ..., 
  detail: ..., // optional
  addedBy: ..., // optional
  modifiedBy: ..., // optional
};

// Call the `upsertActivityLogRef()` function to get a reference to the mutation.
const ref = upsertActivityLogRef(upsertActivityLogVars);
// Variables can be defined inline as well.
const ref = upsertActivityLogRef({ id: ..., engagementId: ..., timestamp: ..., actor: ..., action: ..., detail: ..., addedBy: ..., modifiedBy: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertActivityLogRef(dataConnect, upsertActivityLogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.activityLog_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.activityLog_upsert);
});
```

## DeleteActivityLog
You can execute the `DeleteActivityLog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteActivityLog(vars: DeleteActivityLogVariables): MutationPromise<DeleteActivityLogData, DeleteActivityLogVariables>;

interface DeleteActivityLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteActivityLogVariables): MutationRef<DeleteActivityLogData, DeleteActivityLogVariables>;
}
export const deleteActivityLogRef: DeleteActivityLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteActivityLog(dc: DataConnect, vars: DeleteActivityLogVariables): MutationPromise<DeleteActivityLogData, DeleteActivityLogVariables>;

interface DeleteActivityLogRef {
  ...
  (dc: DataConnect, vars: DeleteActivityLogVariables): MutationRef<DeleteActivityLogData, DeleteActivityLogVariables>;
}
export const deleteActivityLogRef: DeleteActivityLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteActivityLogRef:
```typescript
const name = deleteActivityLogRef.operationName;
console.log(name);
```

### Variables
The `DeleteActivityLog` mutation requires an argument of type `DeleteActivityLogVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteActivityLogVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteActivityLog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteActivityLogData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteActivityLogData {
  activityLog_delete?: ActivityLog_Key | null;
}
```
### Using `DeleteActivityLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteActivityLog, DeleteActivityLogVariables } from '@dataconnect/generated';

// The `DeleteActivityLog` mutation requires an argument of type `DeleteActivityLogVariables`:
const deleteActivityLogVars: DeleteActivityLogVariables = {
  id: ..., 
};

// Call the `deleteActivityLog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteActivityLog(deleteActivityLogVars);
// Variables can be defined inline as well.
const { data } = await deleteActivityLog({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteActivityLog(dataConnect, deleteActivityLogVars);

console.log(data.activityLog_delete);

// Or, you can use the `Promise` API.
deleteActivityLog(deleteActivityLogVars).then((response) => {
  const data = response.data;
  console.log(data.activityLog_delete);
});
```

### Using `DeleteActivityLog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteActivityLogRef, DeleteActivityLogVariables } from '@dataconnect/generated';

// The `DeleteActivityLog` mutation requires an argument of type `DeleteActivityLogVariables`:
const deleteActivityLogVars: DeleteActivityLogVariables = {
  id: ..., 
};

// Call the `deleteActivityLogRef()` function to get a reference to the mutation.
const ref = deleteActivityLogRef(deleteActivityLogVars);
// Variables can be defined inline as well.
const ref = deleteActivityLogRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteActivityLogRef(dataConnect, deleteActivityLogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.activityLog_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.activityLog_delete);
});
```

## UpsertIssueRegister
You can execute the `UpsertIssueRegister` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertIssueRegister(vars: UpsertIssueRegisterVariables): MutationPromise<UpsertIssueRegisterData, UpsertIssueRegisterVariables>;

interface UpsertIssueRegisterRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertIssueRegisterVariables): MutationRef<UpsertIssueRegisterData, UpsertIssueRegisterVariables>;
}
export const upsertIssueRegisterRef: UpsertIssueRegisterRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertIssueRegister(dc: DataConnect, vars: UpsertIssueRegisterVariables): MutationPromise<UpsertIssueRegisterData, UpsertIssueRegisterVariables>;

interface UpsertIssueRegisterRef {
  ...
  (dc: DataConnect, vars: UpsertIssueRegisterVariables): MutationRef<UpsertIssueRegisterData, UpsertIssueRegisterVariables>;
}
export const upsertIssueRegisterRef: UpsertIssueRegisterRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertIssueRegisterRef:
```typescript
const name = upsertIssueRegisterRef.operationName;
console.log(name);
```

### Variables
The `UpsertIssueRegister` mutation requires an argument of type `UpsertIssueRegisterVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertIssueRegister` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertIssueRegisterData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertIssueRegisterData {
  issueRegister_upsert: IssueRegister_Key;
}
```
### Using `UpsertIssueRegister`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertIssueRegister, UpsertIssueRegisterVariables } from '@dataconnect/generated';

// The `UpsertIssueRegister` mutation requires an argument of type `UpsertIssueRegisterVariables`:
const upsertIssueRegisterVars: UpsertIssueRegisterVariables = {
  id: ..., 
  ref: ..., 
  title: ..., 
  auditRef: ..., 
  auditTitle: ..., 
  severity: ..., 
  owner: ..., 
  ownerUnit: ..., 
  originalDue: ..., 
  currentDue: ..., 
  extensionCount: ..., 
  daysStatus: ..., 
  isOverdue: ..., 
  isDueSoon: ..., 
  status: ..., 
  actionPlanSummary: ..., 
  evidenceNote: ..., // optional
  addedBy: ..., // optional
  modifiedBy: ..., // optional
  extensionReason: ..., 
};

// Call the `upsertIssueRegister()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertIssueRegister(upsertIssueRegisterVars);
// Variables can be defined inline as well.
const { data } = await upsertIssueRegister({ id: ..., ref: ..., title: ..., auditRef: ..., auditTitle: ..., severity: ..., owner: ..., ownerUnit: ..., originalDue: ..., currentDue: ..., extensionCount: ..., daysStatus: ..., isOverdue: ..., isDueSoon: ..., status: ..., actionPlanSummary: ..., evidenceNote: ..., addedBy: ..., modifiedBy: ..., extensionReason: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertIssueRegister(dataConnect, upsertIssueRegisterVars);

console.log(data.issueRegister_upsert);

// Or, you can use the `Promise` API.
upsertIssueRegister(upsertIssueRegisterVars).then((response) => {
  const data = response.data;
  console.log(data.issueRegister_upsert);
});
```

### Using `UpsertIssueRegister`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertIssueRegisterRef, UpsertIssueRegisterVariables } from '@dataconnect/generated';

// The `UpsertIssueRegister` mutation requires an argument of type `UpsertIssueRegisterVariables`:
const upsertIssueRegisterVars: UpsertIssueRegisterVariables = {
  id: ..., 
  ref: ..., 
  title: ..., 
  auditRef: ..., 
  auditTitle: ..., 
  severity: ..., 
  owner: ..., 
  ownerUnit: ..., 
  originalDue: ..., 
  currentDue: ..., 
  extensionCount: ..., 
  daysStatus: ..., 
  isOverdue: ..., 
  isDueSoon: ..., 
  status: ..., 
  actionPlanSummary: ..., 
  evidenceNote: ..., // optional
  addedBy: ..., // optional
  modifiedBy: ..., // optional
  extensionReason: ..., 
};

// Call the `upsertIssueRegisterRef()` function to get a reference to the mutation.
const ref = upsertIssueRegisterRef(upsertIssueRegisterVars);
// Variables can be defined inline as well.
const ref = upsertIssueRegisterRef({ id: ..., ref: ..., title: ..., auditRef: ..., auditTitle: ..., severity: ..., owner: ..., ownerUnit: ..., originalDue: ..., currentDue: ..., extensionCount: ..., daysStatus: ..., isOverdue: ..., isDueSoon: ..., status: ..., actionPlanSummary: ..., evidenceNote: ..., addedBy: ..., modifiedBy: ..., extensionReason: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertIssueRegisterRef(dataConnect, upsertIssueRegisterVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.issueRegister_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.issueRegister_upsert);
});
```

## DeleteIssueRegister
You can execute the `DeleteIssueRegister` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteIssueRegister(vars: DeleteIssueRegisterVariables): MutationPromise<DeleteIssueRegisterData, DeleteIssueRegisterVariables>;

interface DeleteIssueRegisterRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteIssueRegisterVariables): MutationRef<DeleteIssueRegisterData, DeleteIssueRegisterVariables>;
}
export const deleteIssueRegisterRef: DeleteIssueRegisterRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteIssueRegister(dc: DataConnect, vars: DeleteIssueRegisterVariables): MutationPromise<DeleteIssueRegisterData, DeleteIssueRegisterVariables>;

interface DeleteIssueRegisterRef {
  ...
  (dc: DataConnect, vars: DeleteIssueRegisterVariables): MutationRef<DeleteIssueRegisterData, DeleteIssueRegisterVariables>;
}
export const deleteIssueRegisterRef: DeleteIssueRegisterRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteIssueRegisterRef:
```typescript
const name = deleteIssueRegisterRef.operationName;
console.log(name);
```

### Variables
The `DeleteIssueRegister` mutation requires an argument of type `DeleteIssueRegisterVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteIssueRegisterVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteIssueRegister` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteIssueRegisterData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteIssueRegisterData {
  issueRegister_delete?: IssueRegister_Key | null;
}
```
### Using `DeleteIssueRegister`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteIssueRegister, DeleteIssueRegisterVariables } from '@dataconnect/generated';

// The `DeleteIssueRegister` mutation requires an argument of type `DeleteIssueRegisterVariables`:
const deleteIssueRegisterVars: DeleteIssueRegisterVariables = {
  id: ..., 
};

// Call the `deleteIssueRegister()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteIssueRegister(deleteIssueRegisterVars);
// Variables can be defined inline as well.
const { data } = await deleteIssueRegister({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteIssueRegister(dataConnect, deleteIssueRegisterVars);

console.log(data.issueRegister_delete);

// Or, you can use the `Promise` API.
deleteIssueRegister(deleteIssueRegisterVars).then((response) => {
  const data = response.data;
  console.log(data.issueRegister_delete);
});
```

### Using `DeleteIssueRegister`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteIssueRegisterRef, DeleteIssueRegisterVariables } from '@dataconnect/generated';

// The `DeleteIssueRegister` mutation requires an argument of type `DeleteIssueRegisterVariables`:
const deleteIssueRegisterVars: DeleteIssueRegisterVariables = {
  id: ..., 
};

// Call the `deleteIssueRegisterRef()` function to get a reference to the mutation.
const ref = deleteIssueRegisterRef(deleteIssueRegisterVars);
// Variables can be defined inline as well.
const ref = deleteIssueRegisterRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteIssueRegisterRef(dataConnect, deleteIssueRegisterVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.issueRegister_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.issueRegister_delete);
});
```

## UpsertUniverseEntity
You can execute the `UpsertUniverseEntity` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertUniverseEntity(vars: UpsertUniverseEntityVariables): MutationPromise<UpsertUniverseEntityData, UpsertUniverseEntityVariables>;

interface UpsertUniverseEntityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUniverseEntityVariables): MutationRef<UpsertUniverseEntityData, UpsertUniverseEntityVariables>;
}
export const upsertUniverseEntityRef: UpsertUniverseEntityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUniverseEntity(dc: DataConnect, vars: UpsertUniverseEntityVariables): MutationPromise<UpsertUniverseEntityData, UpsertUniverseEntityVariables>;

interface UpsertUniverseEntityRef {
  ...
  (dc: DataConnect, vars: UpsertUniverseEntityVariables): MutationRef<UpsertUniverseEntityData, UpsertUniverseEntityVariables>;
}
export const upsertUniverseEntityRef: UpsertUniverseEntityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUniverseEntityRef:
```typescript
const name = upsertUniverseEntityRef.operationName;
console.log(name);
```

### Variables
The `UpsertUniverseEntity` mutation requires an argument of type `UpsertUniverseEntityVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertUniverseEntity` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUniverseEntityData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUniverseEntityData {
  universeEntity_upsert: UniverseEntity_Key;
}
```
### Using `UpsertUniverseEntity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUniverseEntity, UpsertUniverseEntityVariables } from '@dataconnect/generated';

// The `UpsertUniverseEntity` mutation requires an argument of type `UpsertUniverseEntityVariables`:
const upsertUniverseEntityVars: UpsertUniverseEntityVariables = {
  id: ..., 
  code: ..., 
  name: ..., 
  division: ..., 
  category: ..., 
  likelihood: ..., 
  impact: ..., 
  riskScore: ..., 
  riskLevel: ..., 
  lastAudited: ..., 
  nextDue: ..., 
  cycleMonths: ..., 
  defaultLead: ..., 
  addedBy: ..., // optional
  modifiedBy: ..., // optional
  auditDivisionId: ..., // optional
  riskNotes: ..., 
};

// Call the `upsertUniverseEntity()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUniverseEntity(upsertUniverseEntityVars);
// Variables can be defined inline as well.
const { data } = await upsertUniverseEntity({ id: ..., code: ..., name: ..., division: ..., category: ..., likelihood: ..., impact: ..., riskScore: ..., riskLevel: ..., lastAudited: ..., nextDue: ..., cycleMonths: ..., defaultLead: ..., addedBy: ..., modifiedBy: ..., auditDivisionId: ..., riskNotes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUniverseEntity(dataConnect, upsertUniverseEntityVars);

console.log(data.universeEntity_upsert);

// Or, you can use the `Promise` API.
upsertUniverseEntity(upsertUniverseEntityVars).then((response) => {
  const data = response.data;
  console.log(data.universeEntity_upsert);
});
```

### Using `UpsertUniverseEntity`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUniverseEntityRef, UpsertUniverseEntityVariables } from '@dataconnect/generated';

// The `UpsertUniverseEntity` mutation requires an argument of type `UpsertUniverseEntityVariables`:
const upsertUniverseEntityVars: UpsertUniverseEntityVariables = {
  id: ..., 
  code: ..., 
  name: ..., 
  division: ..., 
  category: ..., 
  likelihood: ..., 
  impact: ..., 
  riskScore: ..., 
  riskLevel: ..., 
  lastAudited: ..., 
  nextDue: ..., 
  cycleMonths: ..., 
  defaultLead: ..., 
  addedBy: ..., // optional
  modifiedBy: ..., // optional
  auditDivisionId: ..., // optional
  riskNotes: ..., 
};

// Call the `upsertUniverseEntityRef()` function to get a reference to the mutation.
const ref = upsertUniverseEntityRef(upsertUniverseEntityVars);
// Variables can be defined inline as well.
const ref = upsertUniverseEntityRef({ id: ..., code: ..., name: ..., division: ..., category: ..., likelihood: ..., impact: ..., riskScore: ..., riskLevel: ..., lastAudited: ..., nextDue: ..., cycleMonths: ..., defaultLead: ..., addedBy: ..., modifiedBy: ..., auditDivisionId: ..., riskNotes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUniverseEntityRef(dataConnect, upsertUniverseEntityVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.universeEntity_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.universeEntity_upsert);
});
```

## DeleteUniverseEntity
You can execute the `DeleteUniverseEntity` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteUniverseEntity(vars: DeleteUniverseEntityVariables): MutationPromise<DeleteUniverseEntityData, DeleteUniverseEntityVariables>;

interface DeleteUniverseEntityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUniverseEntityVariables): MutationRef<DeleteUniverseEntityData, DeleteUniverseEntityVariables>;
}
export const deleteUniverseEntityRef: DeleteUniverseEntityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUniverseEntity(dc: DataConnect, vars: DeleteUniverseEntityVariables): MutationPromise<DeleteUniverseEntityData, DeleteUniverseEntityVariables>;

interface DeleteUniverseEntityRef {
  ...
  (dc: DataConnect, vars: DeleteUniverseEntityVariables): MutationRef<DeleteUniverseEntityData, DeleteUniverseEntityVariables>;
}
export const deleteUniverseEntityRef: DeleteUniverseEntityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUniverseEntityRef:
```typescript
const name = deleteUniverseEntityRef.operationName;
console.log(name);
```

### Variables
The `DeleteUniverseEntity` mutation requires an argument of type `DeleteUniverseEntityVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteUniverseEntityVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteUniverseEntity` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUniverseEntityData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUniverseEntityData {
  universeEntity_delete?: UniverseEntity_Key | null;
}
```
### Using `DeleteUniverseEntity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUniverseEntity, DeleteUniverseEntityVariables } from '@dataconnect/generated';

// The `DeleteUniverseEntity` mutation requires an argument of type `DeleteUniverseEntityVariables`:
const deleteUniverseEntityVars: DeleteUniverseEntityVariables = {
  id: ..., 
};

// Call the `deleteUniverseEntity()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUniverseEntity(deleteUniverseEntityVars);
// Variables can be defined inline as well.
const { data } = await deleteUniverseEntity({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUniverseEntity(dataConnect, deleteUniverseEntityVars);

console.log(data.universeEntity_delete);

// Or, you can use the `Promise` API.
deleteUniverseEntity(deleteUniverseEntityVars).then((response) => {
  const data = response.data;
  console.log(data.universeEntity_delete);
});
```

### Using `DeleteUniverseEntity`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUniverseEntityRef, DeleteUniverseEntityVariables } from '@dataconnect/generated';

// The `DeleteUniverseEntity` mutation requires an argument of type `DeleteUniverseEntityVariables`:
const deleteUniverseEntityVars: DeleteUniverseEntityVariables = {
  id: ..., 
};

// Call the `deleteUniverseEntityRef()` function to get a reference to the mutation.
const ref = deleteUniverseEntityRef(deleteUniverseEntityVars);
// Variables can be defined inline as well.
const ref = deleteUniverseEntityRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUniverseEntityRef(dataConnect, deleteUniverseEntityVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.universeEntity_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.universeEntity_delete);
});
```

## UpsertSizingConfig
You can execute the `UpsertSizingConfig` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertSizingConfig(vars: UpsertSizingConfigVariables): MutationPromise<UpsertSizingConfigData, UpsertSizingConfigVariables>;

interface UpsertSizingConfigRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertSizingConfigVariables): MutationRef<UpsertSizingConfigData, UpsertSizingConfigVariables>;
}
export const upsertSizingConfigRef: UpsertSizingConfigRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertSizingConfig(dc: DataConnect, vars: UpsertSizingConfigVariables): MutationPromise<UpsertSizingConfigData, UpsertSizingConfigVariables>;

interface UpsertSizingConfigRef {
  ...
  (dc: DataConnect, vars: UpsertSizingConfigVariables): MutationRef<UpsertSizingConfigData, UpsertSizingConfigVariables>;
}
export const upsertSizingConfigRef: UpsertSizingConfigRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertSizingConfigRef:
```typescript
const name = upsertSizingConfigRef.operationName;
console.log(name);
```

### Variables
The `UpsertSizingConfig` mutation requires an argument of type `UpsertSizingConfigVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertSizingConfig` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertSizingConfigData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertSizingConfigData {
  sizingConfig_upsert: SizingConfig_Key;
}
```
### Using `UpsertSizingConfig`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertSizingConfig, UpsertSizingConfigVariables } from '@dataconnect/generated';

// The `UpsertSizingConfig` mutation requires an argument of type `UpsertSizingConfigVariables`:
const upsertSizingConfigVars: UpsertSizingConfigVariables = {
  id: ..., 
  sizeName: ..., 
  code: ..., 
  workingDays: ..., 
  calendarSpan: ..., 
  auditors: ..., 
  hoursPerDay: ..., 
  budgetedHours: ..., 
  typicalUse: ..., 
  addedBy: ..., // optional
  modifiedBy: ..., // optional
};

// Call the `upsertSizingConfig()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertSizingConfig(upsertSizingConfigVars);
// Variables can be defined inline as well.
const { data } = await upsertSizingConfig({ id: ..., sizeName: ..., code: ..., workingDays: ..., calendarSpan: ..., auditors: ..., hoursPerDay: ..., budgetedHours: ..., typicalUse: ..., addedBy: ..., modifiedBy: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertSizingConfig(dataConnect, upsertSizingConfigVars);

console.log(data.sizingConfig_upsert);

// Or, you can use the `Promise` API.
upsertSizingConfig(upsertSizingConfigVars).then((response) => {
  const data = response.data;
  console.log(data.sizingConfig_upsert);
});
```

### Using `UpsertSizingConfig`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertSizingConfigRef, UpsertSizingConfigVariables } from '@dataconnect/generated';

// The `UpsertSizingConfig` mutation requires an argument of type `UpsertSizingConfigVariables`:
const upsertSizingConfigVars: UpsertSizingConfigVariables = {
  id: ..., 
  sizeName: ..., 
  code: ..., 
  workingDays: ..., 
  calendarSpan: ..., 
  auditors: ..., 
  hoursPerDay: ..., 
  budgetedHours: ..., 
  typicalUse: ..., 
  addedBy: ..., // optional
  modifiedBy: ..., // optional
};

// Call the `upsertSizingConfigRef()` function to get a reference to the mutation.
const ref = upsertSizingConfigRef(upsertSizingConfigVars);
// Variables can be defined inline as well.
const ref = upsertSizingConfigRef({ id: ..., sizeName: ..., code: ..., workingDays: ..., calendarSpan: ..., auditors: ..., hoursPerDay: ..., budgetedHours: ..., typicalUse: ..., addedBy: ..., modifiedBy: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertSizingConfigRef(dataConnect, upsertSizingConfigVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sizingConfig_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sizingConfig_upsert);
});
```

## DeleteSizingConfig
You can execute the `DeleteSizingConfig` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteSizingConfig(vars: DeleteSizingConfigVariables): MutationPromise<DeleteSizingConfigData, DeleteSizingConfigVariables>;

interface DeleteSizingConfigRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSizingConfigVariables): MutationRef<DeleteSizingConfigData, DeleteSizingConfigVariables>;
}
export const deleteSizingConfigRef: DeleteSizingConfigRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSizingConfig(dc: DataConnect, vars: DeleteSizingConfigVariables): MutationPromise<DeleteSizingConfigData, DeleteSizingConfigVariables>;

interface DeleteSizingConfigRef {
  ...
  (dc: DataConnect, vars: DeleteSizingConfigVariables): MutationRef<DeleteSizingConfigData, DeleteSizingConfigVariables>;
}
export const deleteSizingConfigRef: DeleteSizingConfigRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSizingConfigRef:
```typescript
const name = deleteSizingConfigRef.operationName;
console.log(name);
```

### Variables
The `DeleteSizingConfig` mutation requires an argument of type `DeleteSizingConfigVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSizingConfigVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteSizingConfig` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSizingConfigData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSizingConfigData {
  sizingConfig_delete?: SizingConfig_Key | null;
}
```
### Using `DeleteSizingConfig`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSizingConfig, DeleteSizingConfigVariables } from '@dataconnect/generated';

// The `DeleteSizingConfig` mutation requires an argument of type `DeleteSizingConfigVariables`:
const deleteSizingConfigVars: DeleteSizingConfigVariables = {
  id: ..., 
};

// Call the `deleteSizingConfig()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSizingConfig(deleteSizingConfigVars);
// Variables can be defined inline as well.
const { data } = await deleteSizingConfig({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSizingConfig(dataConnect, deleteSizingConfigVars);

console.log(data.sizingConfig_delete);

// Or, you can use the `Promise` API.
deleteSizingConfig(deleteSizingConfigVars).then((response) => {
  const data = response.data;
  console.log(data.sizingConfig_delete);
});
```

### Using `DeleteSizingConfig`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSizingConfigRef, DeleteSizingConfigVariables } from '@dataconnect/generated';

// The `DeleteSizingConfig` mutation requires an argument of type `DeleteSizingConfigVariables`:
const deleteSizingConfigVars: DeleteSizingConfigVariables = {
  id: ..., 
};

// Call the `deleteSizingConfigRef()` function to get a reference to the mutation.
const ref = deleteSizingConfigRef(deleteSizingConfigVars);
// Variables can be defined inline as well.
const ref = deleteSizingConfigRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSizingConfigRef(dataConnect, deleteSizingConfigVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sizingConfig_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sizingConfig_delete);
});
```

## UpsertAuditFrequency
You can execute the `UpsertAuditFrequency` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertAuditFrequency(vars: UpsertAuditFrequencyVariables): MutationPromise<UpsertAuditFrequencyData, UpsertAuditFrequencyVariables>;

interface UpsertAuditFrequencyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertAuditFrequencyVariables): MutationRef<UpsertAuditFrequencyData, UpsertAuditFrequencyVariables>;
}
export const upsertAuditFrequencyRef: UpsertAuditFrequencyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertAuditFrequency(dc: DataConnect, vars: UpsertAuditFrequencyVariables): MutationPromise<UpsertAuditFrequencyData, UpsertAuditFrequencyVariables>;

interface UpsertAuditFrequencyRef {
  ...
  (dc: DataConnect, vars: UpsertAuditFrequencyVariables): MutationRef<UpsertAuditFrequencyData, UpsertAuditFrequencyVariables>;
}
export const upsertAuditFrequencyRef: UpsertAuditFrequencyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertAuditFrequencyRef:
```typescript
const name = upsertAuditFrequencyRef.operationName;
console.log(name);
```

### Variables
The `UpsertAuditFrequency` mutation requires an argument of type `UpsertAuditFrequencyVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertAuditFrequencyVariables {
  id: string;
  high: number;
  medium: number;
  low: number;
  addedBy?: string | null;
  modifiedBy?: string | null;
}
```
### Return Type
Recall that executing the `UpsertAuditFrequency` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertAuditFrequencyData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertAuditFrequencyData {
  auditFrequency_upsert: AuditFrequency_Key;
}
```
### Using `UpsertAuditFrequency`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertAuditFrequency, UpsertAuditFrequencyVariables } from '@dataconnect/generated';

// The `UpsertAuditFrequency` mutation requires an argument of type `UpsertAuditFrequencyVariables`:
const upsertAuditFrequencyVars: UpsertAuditFrequencyVariables = {
  id: ..., 
  high: ..., 
  medium: ..., 
  low: ..., 
  addedBy: ..., // optional
  modifiedBy: ..., // optional
};

// Call the `upsertAuditFrequency()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertAuditFrequency(upsertAuditFrequencyVars);
// Variables can be defined inline as well.
const { data } = await upsertAuditFrequency({ id: ..., high: ..., medium: ..., low: ..., addedBy: ..., modifiedBy: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertAuditFrequency(dataConnect, upsertAuditFrequencyVars);

console.log(data.auditFrequency_upsert);

// Or, you can use the `Promise` API.
upsertAuditFrequency(upsertAuditFrequencyVars).then((response) => {
  const data = response.data;
  console.log(data.auditFrequency_upsert);
});
```

### Using `UpsertAuditFrequency`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertAuditFrequencyRef, UpsertAuditFrequencyVariables } from '@dataconnect/generated';

// The `UpsertAuditFrequency` mutation requires an argument of type `UpsertAuditFrequencyVariables`:
const upsertAuditFrequencyVars: UpsertAuditFrequencyVariables = {
  id: ..., 
  high: ..., 
  medium: ..., 
  low: ..., 
  addedBy: ..., // optional
  modifiedBy: ..., // optional
};

// Call the `upsertAuditFrequencyRef()` function to get a reference to the mutation.
const ref = upsertAuditFrequencyRef(upsertAuditFrequencyVars);
// Variables can be defined inline as well.
const ref = upsertAuditFrequencyRef({ id: ..., high: ..., medium: ..., low: ..., addedBy: ..., modifiedBy: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertAuditFrequencyRef(dataConnect, upsertAuditFrequencyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.auditFrequency_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.auditFrequency_upsert);
});
```

## DeleteAuditFrequency
You can execute the `DeleteAuditFrequency` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteAuditFrequency(vars: DeleteAuditFrequencyVariables): MutationPromise<DeleteAuditFrequencyData, DeleteAuditFrequencyVariables>;

interface DeleteAuditFrequencyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAuditFrequencyVariables): MutationRef<DeleteAuditFrequencyData, DeleteAuditFrequencyVariables>;
}
export const deleteAuditFrequencyRef: DeleteAuditFrequencyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteAuditFrequency(dc: DataConnect, vars: DeleteAuditFrequencyVariables): MutationPromise<DeleteAuditFrequencyData, DeleteAuditFrequencyVariables>;

interface DeleteAuditFrequencyRef {
  ...
  (dc: DataConnect, vars: DeleteAuditFrequencyVariables): MutationRef<DeleteAuditFrequencyData, DeleteAuditFrequencyVariables>;
}
export const deleteAuditFrequencyRef: DeleteAuditFrequencyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteAuditFrequencyRef:
```typescript
const name = deleteAuditFrequencyRef.operationName;
console.log(name);
```

### Variables
The `DeleteAuditFrequency` mutation requires an argument of type `DeleteAuditFrequencyVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteAuditFrequencyVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteAuditFrequency` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteAuditFrequencyData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteAuditFrequencyData {
  auditFrequency_delete?: AuditFrequency_Key | null;
}
```
### Using `DeleteAuditFrequency`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteAuditFrequency, DeleteAuditFrequencyVariables } from '@dataconnect/generated';

// The `DeleteAuditFrequency` mutation requires an argument of type `DeleteAuditFrequencyVariables`:
const deleteAuditFrequencyVars: DeleteAuditFrequencyVariables = {
  id: ..., 
};

// Call the `deleteAuditFrequency()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteAuditFrequency(deleteAuditFrequencyVars);
// Variables can be defined inline as well.
const { data } = await deleteAuditFrequency({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteAuditFrequency(dataConnect, deleteAuditFrequencyVars);

console.log(data.auditFrequency_delete);

// Or, you can use the `Promise` API.
deleteAuditFrequency(deleteAuditFrequencyVars).then((response) => {
  const data = response.data;
  console.log(data.auditFrequency_delete);
});
```

### Using `DeleteAuditFrequency`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteAuditFrequencyRef, DeleteAuditFrequencyVariables } from '@dataconnect/generated';

// The `DeleteAuditFrequency` mutation requires an argument of type `DeleteAuditFrequencyVariables`:
const deleteAuditFrequencyVars: DeleteAuditFrequencyVariables = {
  id: ..., 
};

// Call the `deleteAuditFrequencyRef()` function to get a reference to the mutation.
const ref = deleteAuditFrequencyRef(deleteAuditFrequencyVars);
// Variables can be defined inline as well.
const ref = deleteAuditFrequencyRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteAuditFrequencyRef(dataConnect, deleteAuditFrequencyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.auditFrequency_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.auditFrequency_delete);
});
```

## UpsertMasterData
You can execute the `UpsertMasterData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertMasterData(vars: UpsertMasterDataVariables): MutationPromise<UpsertMasterDataData, UpsertMasterDataVariables>;

interface UpsertMasterDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertMasterDataVariables): MutationRef<UpsertMasterDataData, UpsertMasterDataVariables>;
}
export const upsertMasterDataRef: UpsertMasterDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertMasterData(dc: DataConnect, vars: UpsertMasterDataVariables): MutationPromise<UpsertMasterDataData, UpsertMasterDataVariables>;

interface UpsertMasterDataRef {
  ...
  (dc: DataConnect, vars: UpsertMasterDataVariables): MutationRef<UpsertMasterDataData, UpsertMasterDataVariables>;
}
export const upsertMasterDataRef: UpsertMasterDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertMasterDataRef:
```typescript
const name = upsertMasterDataRef.operationName;
console.log(name);
```

### Variables
The `UpsertMasterData` mutation requires an argument of type `UpsertMasterDataVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertMasterDataVariables {
  id: string;
  data: unknown;
  addedBy?: string | null;
  modifiedBy?: string | null;
}
```
### Return Type
Recall that executing the `UpsertMasterData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertMasterDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertMasterDataData {
  masterData_upsert: MasterData_Key;
}
```
### Using `UpsertMasterData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertMasterData, UpsertMasterDataVariables } from '@dataconnect/generated';

// The `UpsertMasterData` mutation requires an argument of type `UpsertMasterDataVariables`:
const upsertMasterDataVars: UpsertMasterDataVariables = {
  id: ..., 
  data: ..., 
  addedBy: ..., // optional
  modifiedBy: ..., // optional
};

// Call the `upsertMasterData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertMasterData(upsertMasterDataVars);
// Variables can be defined inline as well.
const { data } = await upsertMasterData({ id: ..., data: ..., addedBy: ..., modifiedBy: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertMasterData(dataConnect, upsertMasterDataVars);

console.log(data.masterData_upsert);

// Or, you can use the `Promise` API.
upsertMasterData(upsertMasterDataVars).then((response) => {
  const data = response.data;
  console.log(data.masterData_upsert);
});
```

### Using `UpsertMasterData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertMasterDataRef, UpsertMasterDataVariables } from '@dataconnect/generated';

// The `UpsertMasterData` mutation requires an argument of type `UpsertMasterDataVariables`:
const upsertMasterDataVars: UpsertMasterDataVariables = {
  id: ..., 
  data: ..., 
  addedBy: ..., // optional
  modifiedBy: ..., // optional
};

// Call the `upsertMasterDataRef()` function to get a reference to the mutation.
const ref = upsertMasterDataRef(upsertMasterDataVars);
// Variables can be defined inline as well.
const ref = upsertMasterDataRef({ id: ..., data: ..., addedBy: ..., modifiedBy: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertMasterDataRef(dataConnect, upsertMasterDataVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.masterData_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.masterData_upsert);
});
```

## DeleteMasterData
You can execute the `DeleteMasterData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteMasterData(vars: DeleteMasterDataVariables): MutationPromise<DeleteMasterDataData, DeleteMasterDataVariables>;

interface DeleteMasterDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteMasterDataVariables): MutationRef<DeleteMasterDataData, DeleteMasterDataVariables>;
}
export const deleteMasterDataRef: DeleteMasterDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteMasterData(dc: DataConnect, vars: DeleteMasterDataVariables): MutationPromise<DeleteMasterDataData, DeleteMasterDataVariables>;

interface DeleteMasterDataRef {
  ...
  (dc: DataConnect, vars: DeleteMasterDataVariables): MutationRef<DeleteMasterDataData, DeleteMasterDataVariables>;
}
export const deleteMasterDataRef: DeleteMasterDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteMasterDataRef:
```typescript
const name = deleteMasterDataRef.operationName;
console.log(name);
```

### Variables
The `DeleteMasterData` mutation requires an argument of type `DeleteMasterDataVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteMasterDataVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteMasterData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteMasterDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteMasterDataData {
  masterData_delete?: MasterData_Key | null;
}
```
### Using `DeleteMasterData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteMasterData, DeleteMasterDataVariables } from '@dataconnect/generated';

// The `DeleteMasterData` mutation requires an argument of type `DeleteMasterDataVariables`:
const deleteMasterDataVars: DeleteMasterDataVariables = {
  id: ..., 
};

// Call the `deleteMasterData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteMasterData(deleteMasterDataVars);
// Variables can be defined inline as well.
const { data } = await deleteMasterData({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteMasterData(dataConnect, deleteMasterDataVars);

console.log(data.masterData_delete);

// Or, you can use the `Promise` API.
deleteMasterData(deleteMasterDataVars).then((response) => {
  const data = response.data;
  console.log(data.masterData_delete);
});
```

### Using `DeleteMasterData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteMasterDataRef, DeleteMasterDataVariables } from '@dataconnect/generated';

// The `DeleteMasterData` mutation requires an argument of type `DeleteMasterDataVariables`:
const deleteMasterDataVars: DeleteMasterDataVariables = {
  id: ..., 
};

// Call the `deleteMasterDataRef()` function to get a reference to the mutation.
const ref = deleteMasterDataRef(deleteMasterDataVars);
// Variables can be defined inline as well.
const ref = deleteMasterDataRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteMasterDataRef(dataConnect, deleteMasterDataVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.masterData_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.masterData_delete);
});
```

## UpsertAuditDivisionRiskScale
You can execute the `UpsertAuditDivisionRiskScale` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertAuditDivisionRiskScale(vars: UpsertAuditDivisionRiskScaleVariables): MutationPromise<UpsertAuditDivisionRiskScaleData, UpsertAuditDivisionRiskScaleVariables>;

interface UpsertAuditDivisionRiskScaleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertAuditDivisionRiskScaleVariables): MutationRef<UpsertAuditDivisionRiskScaleData, UpsertAuditDivisionRiskScaleVariables>;
}
export const upsertAuditDivisionRiskScaleRef: UpsertAuditDivisionRiskScaleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertAuditDivisionRiskScale(dc: DataConnect, vars: UpsertAuditDivisionRiskScaleVariables): MutationPromise<UpsertAuditDivisionRiskScaleData, UpsertAuditDivisionRiskScaleVariables>;

interface UpsertAuditDivisionRiskScaleRef {
  ...
  (dc: DataConnect, vars: UpsertAuditDivisionRiskScaleVariables): MutationRef<UpsertAuditDivisionRiskScaleData, UpsertAuditDivisionRiskScaleVariables>;
}
export const upsertAuditDivisionRiskScaleRef: UpsertAuditDivisionRiskScaleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertAuditDivisionRiskScaleRef:
```typescript
const name = upsertAuditDivisionRiskScaleRef.operationName;
console.log(name);
```

### Variables
The `UpsertAuditDivisionRiskScale` mutation requires an argument of type `UpsertAuditDivisionRiskScaleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertAuditDivisionRiskScale` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertAuditDivisionRiskScaleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertAuditDivisionRiskScaleData {
  auditDivisionRiskScale_upsert: AuditDivisionRiskScale_Key;
}
```
### Using `UpsertAuditDivisionRiskScale`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertAuditDivisionRiskScale, UpsertAuditDivisionRiskScaleVariables } from '@dataconnect/generated';

// The `UpsertAuditDivisionRiskScale` mutation requires an argument of type `UpsertAuditDivisionRiskScaleVariables`:
const upsertAuditDivisionRiskScaleVars: UpsertAuditDivisionRiskScaleVariables = {
  id: ..., 
  name: ..., 
  highMinScore: ..., 
  mediumMinScore: ..., 
  highCycleMonths: ..., 
  mediumCycleMonths: ..., 
  lowCycleMonths: ..., 
  highFieldworkWeeks: ..., 
  mediumFieldworkWeeks: ..., 
  lowFieldworkWeeks: ..., 
  addedBy: ..., // optional
  modifiedBy: ..., // optional
};

// Call the `upsertAuditDivisionRiskScale()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertAuditDivisionRiskScale(upsertAuditDivisionRiskScaleVars);
// Variables can be defined inline as well.
const { data } = await upsertAuditDivisionRiskScale({ id: ..., name: ..., highMinScore: ..., mediumMinScore: ..., highCycleMonths: ..., mediumCycleMonths: ..., lowCycleMonths: ..., highFieldworkWeeks: ..., mediumFieldworkWeeks: ..., lowFieldworkWeeks: ..., addedBy: ..., modifiedBy: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertAuditDivisionRiskScale(dataConnect, upsertAuditDivisionRiskScaleVars);

console.log(data.auditDivisionRiskScale_upsert);

// Or, you can use the `Promise` API.
upsertAuditDivisionRiskScale(upsertAuditDivisionRiskScaleVars).then((response) => {
  const data = response.data;
  console.log(data.auditDivisionRiskScale_upsert);
});
```

### Using `UpsertAuditDivisionRiskScale`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertAuditDivisionRiskScaleRef, UpsertAuditDivisionRiskScaleVariables } from '@dataconnect/generated';

// The `UpsertAuditDivisionRiskScale` mutation requires an argument of type `UpsertAuditDivisionRiskScaleVariables`:
const upsertAuditDivisionRiskScaleVars: UpsertAuditDivisionRiskScaleVariables = {
  id: ..., 
  name: ..., 
  highMinScore: ..., 
  mediumMinScore: ..., 
  highCycleMonths: ..., 
  mediumCycleMonths: ..., 
  lowCycleMonths: ..., 
  highFieldworkWeeks: ..., 
  mediumFieldworkWeeks: ..., 
  lowFieldworkWeeks: ..., 
  addedBy: ..., // optional
  modifiedBy: ..., // optional
};

// Call the `upsertAuditDivisionRiskScaleRef()` function to get a reference to the mutation.
const ref = upsertAuditDivisionRiskScaleRef(upsertAuditDivisionRiskScaleVars);
// Variables can be defined inline as well.
const ref = upsertAuditDivisionRiskScaleRef({ id: ..., name: ..., highMinScore: ..., mediumMinScore: ..., highCycleMonths: ..., mediumCycleMonths: ..., lowCycleMonths: ..., highFieldworkWeeks: ..., mediumFieldworkWeeks: ..., lowFieldworkWeeks: ..., addedBy: ..., modifiedBy: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertAuditDivisionRiskScaleRef(dataConnect, upsertAuditDivisionRiskScaleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.auditDivisionRiskScale_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.auditDivisionRiskScale_upsert);
});
```

## DeleteAuditDivisionRiskScale
You can execute the `DeleteAuditDivisionRiskScale` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteAuditDivisionRiskScale(vars: DeleteAuditDivisionRiskScaleVariables): MutationPromise<DeleteAuditDivisionRiskScaleData, DeleteAuditDivisionRiskScaleVariables>;

interface DeleteAuditDivisionRiskScaleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAuditDivisionRiskScaleVariables): MutationRef<DeleteAuditDivisionRiskScaleData, DeleteAuditDivisionRiskScaleVariables>;
}
export const deleteAuditDivisionRiskScaleRef: DeleteAuditDivisionRiskScaleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteAuditDivisionRiskScale(dc: DataConnect, vars: DeleteAuditDivisionRiskScaleVariables): MutationPromise<DeleteAuditDivisionRiskScaleData, DeleteAuditDivisionRiskScaleVariables>;

interface DeleteAuditDivisionRiskScaleRef {
  ...
  (dc: DataConnect, vars: DeleteAuditDivisionRiskScaleVariables): MutationRef<DeleteAuditDivisionRiskScaleData, DeleteAuditDivisionRiskScaleVariables>;
}
export const deleteAuditDivisionRiskScaleRef: DeleteAuditDivisionRiskScaleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteAuditDivisionRiskScaleRef:
```typescript
const name = deleteAuditDivisionRiskScaleRef.operationName;
console.log(name);
```

### Variables
The `DeleteAuditDivisionRiskScale` mutation requires an argument of type `DeleteAuditDivisionRiskScaleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteAuditDivisionRiskScaleVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteAuditDivisionRiskScale` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteAuditDivisionRiskScaleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteAuditDivisionRiskScaleData {
  auditDivisionRiskScale_delete?: AuditDivisionRiskScale_Key | null;
}
```
### Using `DeleteAuditDivisionRiskScale`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteAuditDivisionRiskScale, DeleteAuditDivisionRiskScaleVariables } from '@dataconnect/generated';

// The `DeleteAuditDivisionRiskScale` mutation requires an argument of type `DeleteAuditDivisionRiskScaleVariables`:
const deleteAuditDivisionRiskScaleVars: DeleteAuditDivisionRiskScaleVariables = {
  id: ..., 
};

// Call the `deleteAuditDivisionRiskScale()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteAuditDivisionRiskScale(deleteAuditDivisionRiskScaleVars);
// Variables can be defined inline as well.
const { data } = await deleteAuditDivisionRiskScale({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteAuditDivisionRiskScale(dataConnect, deleteAuditDivisionRiskScaleVars);

console.log(data.auditDivisionRiskScale_delete);

// Or, you can use the `Promise` API.
deleteAuditDivisionRiskScale(deleteAuditDivisionRiskScaleVars).then((response) => {
  const data = response.data;
  console.log(data.auditDivisionRiskScale_delete);
});
```

### Using `DeleteAuditDivisionRiskScale`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteAuditDivisionRiskScaleRef, DeleteAuditDivisionRiskScaleVariables } from '@dataconnect/generated';

// The `DeleteAuditDivisionRiskScale` mutation requires an argument of type `DeleteAuditDivisionRiskScaleVariables`:
const deleteAuditDivisionRiskScaleVars: DeleteAuditDivisionRiskScaleVariables = {
  id: ..., 
};

// Call the `deleteAuditDivisionRiskScaleRef()` function to get a reference to the mutation.
const ref = deleteAuditDivisionRiskScaleRef(deleteAuditDivisionRiskScaleVars);
// Variables can be defined inline as well.
const ref = deleteAuditDivisionRiskScaleRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteAuditDivisionRiskScaleRef(dataConnect, deleteAuditDivisionRiskScaleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.auditDivisionRiskScale_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.auditDivisionRiskScale_delete);
});
```

## UpsertAppSession
You can execute the `UpsertAppSession` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertAppSession(vars: UpsertAppSessionVariables): MutationPromise<UpsertAppSessionData, UpsertAppSessionVariables>;

interface UpsertAppSessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertAppSessionVariables): MutationRef<UpsertAppSessionData, UpsertAppSessionVariables>;
}
export const upsertAppSessionRef: UpsertAppSessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertAppSession(dc: DataConnect, vars: UpsertAppSessionVariables): MutationPromise<UpsertAppSessionData, UpsertAppSessionVariables>;

interface UpsertAppSessionRef {
  ...
  (dc: DataConnect, vars: UpsertAppSessionVariables): MutationRef<UpsertAppSessionData, UpsertAppSessionVariables>;
}
export const upsertAppSessionRef: UpsertAppSessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertAppSessionRef:
```typescript
const name = upsertAppSessionRef.operationName;
console.log(name);
```

### Variables
The `UpsertAppSession` mutation requires an argument of type `UpsertAppSessionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertAppSessionVariables {
  tokenHash: string;
  userId: string;
  expiresAt: TimestampString;
  revokedAt?: TimestampString | null;
}
```
### Return Type
Recall that executing the `UpsertAppSession` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertAppSessionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertAppSessionData {
  appSession_upsert: AppSession_Key;
}
```
### Using `UpsertAppSession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertAppSession, UpsertAppSessionVariables } from '@dataconnect/generated';

// The `UpsertAppSession` mutation requires an argument of type `UpsertAppSessionVariables`:
const upsertAppSessionVars: UpsertAppSessionVariables = {
  tokenHash: ..., 
  userId: ..., 
  expiresAt: ..., 
  revokedAt: ..., // optional
};

// Call the `upsertAppSession()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertAppSession(upsertAppSessionVars);
// Variables can be defined inline as well.
const { data } = await upsertAppSession({ tokenHash: ..., userId: ..., expiresAt: ..., revokedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertAppSession(dataConnect, upsertAppSessionVars);

console.log(data.appSession_upsert);

// Or, you can use the `Promise` API.
upsertAppSession(upsertAppSessionVars).then((response) => {
  const data = response.data;
  console.log(data.appSession_upsert);
});
```

### Using `UpsertAppSession`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertAppSessionRef, UpsertAppSessionVariables } from '@dataconnect/generated';

// The `UpsertAppSession` mutation requires an argument of type `UpsertAppSessionVariables`:
const upsertAppSessionVars: UpsertAppSessionVariables = {
  tokenHash: ..., 
  userId: ..., 
  expiresAt: ..., 
  revokedAt: ..., // optional
};

// Call the `upsertAppSessionRef()` function to get a reference to the mutation.
const ref = upsertAppSessionRef(upsertAppSessionVars);
// Variables can be defined inline as well.
const ref = upsertAppSessionRef({ tokenHash: ..., userId: ..., expiresAt: ..., revokedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertAppSessionRef(dataConnect, upsertAppSessionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.appSession_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.appSession_upsert);
});
```

## DeleteAppSession
You can execute the `DeleteAppSession` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteAppSession(vars: DeleteAppSessionVariables): MutationPromise<DeleteAppSessionData, DeleteAppSessionVariables>;

interface DeleteAppSessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAppSessionVariables): MutationRef<DeleteAppSessionData, DeleteAppSessionVariables>;
}
export const deleteAppSessionRef: DeleteAppSessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteAppSession(dc: DataConnect, vars: DeleteAppSessionVariables): MutationPromise<DeleteAppSessionData, DeleteAppSessionVariables>;

interface DeleteAppSessionRef {
  ...
  (dc: DataConnect, vars: DeleteAppSessionVariables): MutationRef<DeleteAppSessionData, DeleteAppSessionVariables>;
}
export const deleteAppSessionRef: DeleteAppSessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteAppSessionRef:
```typescript
const name = deleteAppSessionRef.operationName;
console.log(name);
```

### Variables
The `DeleteAppSession` mutation requires an argument of type `DeleteAppSessionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteAppSessionVariables {
  tokenHash: string;
}
```
### Return Type
Recall that executing the `DeleteAppSession` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteAppSessionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteAppSessionData {
  appSession_delete?: AppSession_Key | null;
}
```
### Using `DeleteAppSession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteAppSession, DeleteAppSessionVariables } from '@dataconnect/generated';

// The `DeleteAppSession` mutation requires an argument of type `DeleteAppSessionVariables`:
const deleteAppSessionVars: DeleteAppSessionVariables = {
  tokenHash: ..., 
};

// Call the `deleteAppSession()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteAppSession(deleteAppSessionVars);
// Variables can be defined inline as well.
const { data } = await deleteAppSession({ tokenHash: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteAppSession(dataConnect, deleteAppSessionVars);

console.log(data.appSession_delete);

// Or, you can use the `Promise` API.
deleteAppSession(deleteAppSessionVars).then((response) => {
  const data = response.data;
  console.log(data.appSession_delete);
});
```

### Using `DeleteAppSession`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteAppSessionRef, DeleteAppSessionVariables } from '@dataconnect/generated';

// The `DeleteAppSession` mutation requires an argument of type `DeleteAppSessionVariables`:
const deleteAppSessionVars: DeleteAppSessionVariables = {
  tokenHash: ..., 
};

// Call the `deleteAppSessionRef()` function to get a reference to the mutation.
const ref = deleteAppSessionRef(deleteAppSessionVars);
// Variables can be defined inline as well.
const ref = deleteAppSessionRef({ tokenHash: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteAppSessionRef(dataConnect, deleteAppSessionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.appSession_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.appSession_delete);
});
```

