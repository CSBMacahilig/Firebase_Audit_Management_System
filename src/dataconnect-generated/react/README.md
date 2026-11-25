# Generated React README
This README will guide you through the process of using the generated React SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `JavaScript README`, you can find it at [`dataconnect-generated/README.md`](../README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@dataconnect/generated/react` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#react).

# Table of Contents
- [**Overview**](#generated-react-readme)
- [**TanStack Query Firebase & TanStack React Query**](#tanstack-query-firebase-tanstack-react-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-react-query-packages)
  - [*Configuring TanStack Query*](#configuring-tanstack-query)
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

# TanStack Query Firebase & TanStack React Query
This SDK provides [React](https://react.dev/) hooks generated specific to your application, for the operations found in the connector `example`. These hooks are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack React Query v5](https://tanstack.com/query/v5/docs/framework/react/overview).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated React SDK.

## Installing TanStack Query Firebase and TanStack React Query Packages
In order to use the React generated SDK, you must install the `TanStack React Query` and `TanStack Query Firebase` packages.
```bash
npm i --save @tanstack/react-query @tanstack-query-firebase/react
```
```bash
npm i --save firebase@latest # Note: React has a peer dependency on ^11.3.0
```

You can also follow the installation instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#tanstack-install), or the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react) and [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/installation).

## Configuring TanStack Query
In order to use the React generated SDK in your application, you must wrap your application's component tree in a `QueryClientProvider` component from TanStack React Query. None of your generated React SDK hooks will work without this provider.

```javascript
import { QueryClientProvider } from '@tanstack/react-query';

// Create a TanStack Query client instance
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MyApplication />
    </QueryClientProvider>
  )
}
```

To learn more about `QueryClientProvider`, see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start) and the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/react#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the hooks provided from your generated React SDK.

# Queries

No Queries were generated for the `example` connector.

If you want to learn more about how to use queries in Data Connect, you can follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

# Mutations

The React generated SDK provides Mutations hook functions that call and return [`useDataConnectMutation`](https://react-query-firebase.invertase.dev/react/data-connect/mutations) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/mutations).

Mutation hooks do not execute their Mutations automatically when called. Rather, after calling the Mutation hook function and getting a `UseMutationResult` object, you must call the `UseMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack React Query's Mutations, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations).

## Using Mutation Hooks
Here's a general overview of how to use the generated Mutation hooks in your code:

- Mutation hook functions are not called with the arguments to the Mutation. Instead, arguments are passed to `UseMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation hook function does not require any arguments.
- Mutation hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Mutation hooks also accept an `options` argument of type `useDataConnectMutationOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-side-effects).
  - `UseMutationResult.mutate()` also accepts an `options` argument of type `useDataConnectMutationOptions`.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `UseMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `example` connector's generated Mutation hook functions to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## UpsertUserProfile
You can execute the `UpsertUserProfile` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertUserProfile(options?: useDataConnectMutationOptions<UpsertUserProfileData, FirebaseError, UpsertUserProfileVariables>): UseDataConnectMutationResult<UpsertUserProfileData, UpsertUserProfileVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertUserProfile(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertUserProfileData, FirebaseError, UpsertUserProfileVariables>): UseDataConnectMutationResult<UpsertUserProfileData, UpsertUserProfileVariables>;
```

### Variables
The `UpsertUserProfile` Mutation requires an argument of type `UpsertUserProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpsertUserProfile` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertUserProfile` Mutation is of type `UpsertUserProfileData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertUserProfileData {
  userProfile_upsert: UserProfile_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertUserProfile`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertUserProfileVariables } from '@dataconnect/generated';
import { useUpsertUserProfile } from '@dataconnect/generated/react'

export default function UpsertUserProfileComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertUserProfile();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertUserProfile(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertUserProfile(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertUserProfile(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertUserProfile` Mutation requires an argument of type `UpsertUserProfileVariables`:
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
  mutation.mutate(upsertUserProfileVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., name: ..., roleTitle: ..., fullLabel: ..., headerSubtitle: ..., department: ..., canApproveHead: ..., canApproveIndependent: ..., canApproveCae: ..., employeeNumber: ..., accountStatus: ..., failedLoginCount: ..., isLocked: ..., requiresPasswordChange: ..., passwordHistory: ..., mfaEnabled: ..., isPrivileged: ..., addedBy: ..., modifiedBy: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertUserProfileVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.userProfile_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteUserProfile
You can execute the `DeleteUserProfile` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteUserProfile(options?: useDataConnectMutationOptions<DeleteUserProfileData, FirebaseError, DeleteUserProfileVariables>): UseDataConnectMutationResult<DeleteUserProfileData, DeleteUserProfileVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteUserProfile(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteUserProfileData, FirebaseError, DeleteUserProfileVariables>): UseDataConnectMutationResult<DeleteUserProfileData, DeleteUserProfileVariables>;
```

### Variables
The `DeleteUserProfile` Mutation requires an argument of type `DeleteUserProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteUserProfileVariables {
  id: string;
}
```
### Return Type
Recall that calling the `DeleteUserProfile` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteUserProfile` Mutation is of type `DeleteUserProfileData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteUserProfileData {
  userProfile_delete?: UserProfile_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteUserProfile`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteUserProfileVariables } from '@dataconnect/generated';
import { useDeleteUserProfile } from '@dataconnect/generated/react'

export default function DeleteUserProfileComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteUserProfile();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteUserProfile(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteUserProfile(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteUserProfile(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteUserProfile` Mutation requires an argument of type `DeleteUserProfileVariables`:
  const deleteUserProfileVars: DeleteUserProfileVariables = {
    id: ..., 
  };
  mutation.mutate(deleteUserProfileVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteUserProfileVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.userProfile_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertSystemUser
You can execute the `UpsertSystemUser` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertSystemUser(options?: useDataConnectMutationOptions<UpsertSystemUserData, FirebaseError, UpsertSystemUserVariables>): UseDataConnectMutationResult<UpsertSystemUserData, UpsertSystemUserVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertSystemUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertSystemUserData, FirebaseError, UpsertSystemUserVariables>): UseDataConnectMutationResult<UpsertSystemUserData, UpsertSystemUserVariables>;
```

### Variables
The `UpsertSystemUser` Mutation requires an argument of type `UpsertSystemUserVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpsertSystemUser` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertSystemUser` Mutation is of type `UpsertSystemUserData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertSystemUserData {
  systemUser_upsert: SystemUser_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertSystemUser`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertSystemUserVariables } from '@dataconnect/generated';
import { useUpsertSystemUser } from '@dataconnect/generated/react'

export default function UpsertSystemUserComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertSystemUser();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertSystemUser(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertSystemUser(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertSystemUser(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertSystemUser` Mutation requires an argument of type `UpsertSystemUserVariables`:
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
  mutation.mutate(upsertSystemUserVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., username: ..., fullName: ..., email: ..., role: ..., passwordHash: ..., isActive: ..., isLocked: ..., failedLoginCount: ..., requiresPasswordChange: ..., addedBy: ..., modifiedBy: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertSystemUserVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.systemUser_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteSystemUser
You can execute the `DeleteSystemUser` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteSystemUser(options?: useDataConnectMutationOptions<DeleteSystemUserData, FirebaseError, DeleteSystemUserVariables>): UseDataConnectMutationResult<DeleteSystemUserData, DeleteSystemUserVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteSystemUser(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteSystemUserData, FirebaseError, DeleteSystemUserVariables>): UseDataConnectMutationResult<DeleteSystemUserData, DeleteSystemUserVariables>;
```

### Variables
The `DeleteSystemUser` Mutation requires an argument of type `DeleteSystemUserVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteSystemUserVariables {
  id: string;
}
```
### Return Type
Recall that calling the `DeleteSystemUser` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteSystemUser` Mutation is of type `DeleteSystemUserData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteSystemUserData {
  systemUser_delete?: SystemUser_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteSystemUser`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteSystemUserVariables } from '@dataconnect/generated';
import { useDeleteSystemUser } from '@dataconnect/generated/react'

export default function DeleteSystemUserComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteSystemUser();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteSystemUser(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteSystemUser(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteSystemUser(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteSystemUser` Mutation requires an argument of type `DeleteSystemUserVariables`:
  const deleteSystemUserVars: DeleteSystemUserVariables = {
    id: ..., 
  };
  mutation.mutate(deleteSystemUserVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteSystemUserVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.systemUser_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertEngagement
You can execute the `UpsertEngagement` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertEngagement(options?: useDataConnectMutationOptions<UpsertEngagementData, FirebaseError, UpsertEngagementVariables>): UseDataConnectMutationResult<UpsertEngagementData, UpsertEngagementVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertEngagement(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertEngagementData, FirebaseError, UpsertEngagementVariables>): UseDataConnectMutationResult<UpsertEngagementData, UpsertEngagementVariables>;
```

### Variables
The `UpsertEngagement` Mutation requires an argument of type `UpsertEngagementVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpsertEngagement` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertEngagement` Mutation is of type `UpsertEngagementData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertEngagementData {
  engagement_upsert: Engagement_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertEngagement`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertEngagementVariables } from '@dataconnect/generated';
import { useUpsertEngagement } from '@dataconnect/generated/react'

export default function UpsertEngagementComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertEngagement();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertEngagement(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertEngagement(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertEngagement(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertEngagement` Mutation requires an argument of type `UpsertEngagementVariables`:
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
  mutation.mutate(upsertEngagementVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., ref: ..., year: ..., title: ..., category: ..., department: ..., entityName: ..., likelihood: ..., impact: ..., riskScore: ..., riskLevel: ..., lead: ..., headReviewer: ..., independentReviewer: ..., startDate: ..., endDate: ..., durationDays: ..., budgetedHours: ..., status: ..., readyRatio: ..., lifecycleStage: ..., fieldworkPct: ..., fieldworkDayCurrent: ..., fieldworkDayTotal: ..., reportStatus: ..., reportRef: ..., executiveSummary: ..., reportRating: ..., addedBy: ..., modifiedBy: ..., auditDivisionId: ..., objectives: ..., scope: ..., criteria: ..., addresseeName: ..., addresseeTitle: ..., copyFurnished: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertEngagementVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.engagement_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteEngagement
You can execute the `DeleteEngagement` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteEngagement(options?: useDataConnectMutationOptions<DeleteEngagementData, FirebaseError, DeleteEngagementVariables>): UseDataConnectMutationResult<DeleteEngagementData, DeleteEngagementVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteEngagement(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteEngagementData, FirebaseError, DeleteEngagementVariables>): UseDataConnectMutationResult<DeleteEngagementData, DeleteEngagementVariables>;
```

### Variables
The `DeleteEngagement` Mutation requires an argument of type `DeleteEngagementVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteEngagementVariables {
  id: string;
}
```
### Return Type
Recall that calling the `DeleteEngagement` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteEngagement` Mutation is of type `DeleteEngagementData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteEngagementData {
  engagement_delete?: Engagement_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteEngagement`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteEngagementVariables } from '@dataconnect/generated';
import { useDeleteEngagement } from '@dataconnect/generated/react'

export default function DeleteEngagementComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteEngagement();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteEngagement(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteEngagement(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteEngagement(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteEngagement` Mutation requires an argument of type `DeleteEngagementVariables`:
  const deleteEngagementVars: DeleteEngagementVariables = {
    id: ..., 
  };
  mutation.mutate(deleteEngagementVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteEngagementVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.engagement_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertWorkingNote
You can execute the `UpsertWorkingNote` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertWorkingNote(options?: useDataConnectMutationOptions<UpsertWorkingNoteData, FirebaseError, UpsertWorkingNoteVariables>): UseDataConnectMutationResult<UpsertWorkingNoteData, UpsertWorkingNoteVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertWorkingNote(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertWorkingNoteData, FirebaseError, UpsertWorkingNoteVariables>): UseDataConnectMutationResult<UpsertWorkingNoteData, UpsertWorkingNoteVariables>;
```

### Variables
The `UpsertWorkingNote` Mutation requires an argument of type `UpsertWorkingNoteVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpsertWorkingNote` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertWorkingNote` Mutation is of type `UpsertWorkingNoteData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertWorkingNoteData {
  workingNote_upsert: WorkingNote_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertWorkingNote`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertWorkingNoteVariables } from '@dataconnect/generated';
import { useUpsertWorkingNote } from '@dataconnect/generated/react'

export default function UpsertWorkingNoteComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertWorkingNote();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertWorkingNote(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertWorkingNote(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertWorkingNote(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertWorkingNote` Mutation requires an argument of type `UpsertWorkingNoteVariables`:
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
  mutation.mutate(upsertWorkingNoteVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., engagementId: ..., ref: ..., title: ..., controlArea: ..., author: ..., status: ..., hasException: ..., updatedAt: ..., testingProcedure: ..., conclusion: ..., reviewerComments: ..., addedBy: ..., modifiedBy: ..., observations: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertWorkingNoteVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.workingNote_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteWorkingNote
You can execute the `DeleteWorkingNote` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteWorkingNote(options?: useDataConnectMutationOptions<DeleteWorkingNoteData, FirebaseError, DeleteWorkingNoteVariables>): UseDataConnectMutationResult<DeleteWorkingNoteData, DeleteWorkingNoteVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteWorkingNote(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteWorkingNoteData, FirebaseError, DeleteWorkingNoteVariables>): UseDataConnectMutationResult<DeleteWorkingNoteData, DeleteWorkingNoteVariables>;
```

### Variables
The `DeleteWorkingNote` Mutation requires an argument of type `DeleteWorkingNoteVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteWorkingNoteVariables {
  id: string;
}
```
### Return Type
Recall that calling the `DeleteWorkingNote` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteWorkingNote` Mutation is of type `DeleteWorkingNoteData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteWorkingNoteData {
  workingNote_delete?: WorkingNote_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteWorkingNote`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteWorkingNoteVariables } from '@dataconnect/generated';
import { useDeleteWorkingNote } from '@dataconnect/generated/react'

export default function DeleteWorkingNoteComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteWorkingNote();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteWorkingNote(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteWorkingNote(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteWorkingNote(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteWorkingNote` Mutation requires an argument of type `DeleteWorkingNoteVariables`:
  const deleteWorkingNoteVars: DeleteWorkingNoteVariables = {
    id: ..., 
  };
  mutation.mutate(deleteWorkingNoteVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteWorkingNoteVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.workingNote_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertFinding
You can execute the `UpsertFinding` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertFinding(options?: useDataConnectMutationOptions<UpsertFindingData, FirebaseError, UpsertFindingVariables>): UseDataConnectMutationResult<UpsertFindingData, UpsertFindingVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertFinding(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertFindingData, FirebaseError, UpsertFindingVariables>): UseDataConnectMutationResult<UpsertFindingData, UpsertFindingVariables>;
```

### Variables
The `UpsertFinding` Mutation requires an argument of type `UpsertFindingVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpsertFinding` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertFinding` Mutation is of type `UpsertFindingData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertFindingData {
  finding_upsert: Finding_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertFinding`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertFindingVariables } from '@dataconnect/generated';
import { useUpsertFinding } from '@dataconnect/generated/react'

export default function UpsertFindingComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertFinding();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertFinding(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertFinding(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertFinding(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertFinding` Mutation requires an argument of type `UpsertFindingVariables`:
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
  mutation.mutate(upsertFindingVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., engagementId: ..., ref: ..., title: ..., severity: ..., condition: ..., criteria: ..., cause: ..., effect: ..., recommendation: ..., owner: ..., targetDate: ..., status: ..., linkedNoteRef: ..., addedBy: ..., modifiedBy: ..., category: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertFindingVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.finding_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteFinding
You can execute the `DeleteFinding` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteFinding(options?: useDataConnectMutationOptions<DeleteFindingData, FirebaseError, DeleteFindingVariables>): UseDataConnectMutationResult<DeleteFindingData, DeleteFindingVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteFinding(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteFindingData, FirebaseError, DeleteFindingVariables>): UseDataConnectMutationResult<DeleteFindingData, DeleteFindingVariables>;
```

### Variables
The `DeleteFinding` Mutation requires an argument of type `DeleteFindingVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteFindingVariables {
  id: string;
}
```
### Return Type
Recall that calling the `DeleteFinding` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteFinding` Mutation is of type `DeleteFindingData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteFindingData {
  finding_delete?: Finding_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteFinding`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteFindingVariables } from '@dataconnect/generated';
import { useDeleteFinding } from '@dataconnect/generated/react'

export default function DeleteFindingComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteFinding();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteFinding(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteFinding(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteFinding(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteFinding` Mutation requires an argument of type `DeleteFindingVariables`:
  const deleteFindingVars: DeleteFindingVariables = {
    id: ..., 
  };
  mutation.mutate(deleteFindingVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteFindingVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.finding_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertTimelineActivity
You can execute the `UpsertTimelineActivity` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertTimelineActivity(options?: useDataConnectMutationOptions<UpsertTimelineActivityData, FirebaseError, UpsertTimelineActivityVariables>): UseDataConnectMutationResult<UpsertTimelineActivityData, UpsertTimelineActivityVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertTimelineActivity(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertTimelineActivityData, FirebaseError, UpsertTimelineActivityVariables>): UseDataConnectMutationResult<UpsertTimelineActivityData, UpsertTimelineActivityVariables>;
```

### Variables
The `UpsertTimelineActivity` Mutation requires an argument of type `UpsertTimelineActivityVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpsertTimelineActivity` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertTimelineActivity` Mutation is of type `UpsertTimelineActivityData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertTimelineActivityData {
  timelineActivity_upsert: TimelineActivity_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertTimelineActivity`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertTimelineActivityVariables } from '@dataconnect/generated';
import { useUpsertTimelineActivity } from '@dataconnect/generated/react'

export default function UpsertTimelineActivityComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertTimelineActivity();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertTimelineActivity(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertTimelineActivity(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertTimelineActivity(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertTimelineActivity` Mutation requires an argument of type `UpsertTimelineActivityVariables`:
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
  mutation.mutate(upsertTimelineActivityVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., engagementId: ..., name: ..., roleResponsible: ..., dueDate: ..., completedDate: ..., status: ..., stageId: ..., addedBy: ..., modifiedBy: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertTimelineActivityVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.timelineActivity_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteTimelineActivity
You can execute the `DeleteTimelineActivity` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteTimelineActivity(options?: useDataConnectMutationOptions<DeleteTimelineActivityData, FirebaseError, DeleteTimelineActivityVariables>): UseDataConnectMutationResult<DeleteTimelineActivityData, DeleteTimelineActivityVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteTimelineActivity(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteTimelineActivityData, FirebaseError, DeleteTimelineActivityVariables>): UseDataConnectMutationResult<DeleteTimelineActivityData, DeleteTimelineActivityVariables>;
```

### Variables
The `DeleteTimelineActivity` Mutation requires an argument of type `DeleteTimelineActivityVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteTimelineActivityVariables {
  id: string;
}
```
### Return Type
Recall that calling the `DeleteTimelineActivity` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteTimelineActivity` Mutation is of type `DeleteTimelineActivityData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteTimelineActivityData {
  timelineActivity_delete?: TimelineActivity_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteTimelineActivity`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteTimelineActivityVariables } from '@dataconnect/generated';
import { useDeleteTimelineActivity } from '@dataconnect/generated/react'

export default function DeleteTimelineActivityComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteTimelineActivity();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteTimelineActivity(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteTimelineActivity(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteTimelineActivity(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteTimelineActivity` Mutation requires an argument of type `DeleteTimelineActivityVariables`:
  const deleteTimelineActivityVars: DeleteTimelineActivityVariables = {
    id: ..., 
  };
  mutation.mutate(deleteTimelineActivityVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteTimelineActivityVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.timelineActivity_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertEngagementFile
You can execute the `UpsertEngagementFile` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertEngagementFile(options?: useDataConnectMutationOptions<UpsertEngagementFileData, FirebaseError, UpsertEngagementFileVariables>): UseDataConnectMutationResult<UpsertEngagementFileData, UpsertEngagementFileVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertEngagementFile(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertEngagementFileData, FirebaseError, UpsertEngagementFileVariables>): UseDataConnectMutationResult<UpsertEngagementFileData, UpsertEngagementFileVariables>;
```

### Variables
The `UpsertEngagementFile` Mutation requires an argument of type `UpsertEngagementFileVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpsertEngagementFile` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertEngagementFile` Mutation is of type `UpsertEngagementFileData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertEngagementFileData {
  engagementFile_upsert: EngagementFile_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertEngagementFile`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertEngagementFileVariables } from '@dataconnect/generated';
import { useUpsertEngagementFile } from '@dataconnect/generated/react'

export default function UpsertEngagementFileComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertEngagementFile();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertEngagementFile(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertEngagementFile(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertEngagementFile(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertEngagementFile` Mutation requires an argument of type `UpsertEngagementFileVariables`:
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
  mutation.mutate(upsertEngagementFileVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., engagementId: ..., name: ..., folder: ..., size: ..., uploadedBy: ..., uploadedAt: ..., addedBy: ..., modifiedBy: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertEngagementFileVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.engagementFile_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteEngagementFile
You can execute the `DeleteEngagementFile` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteEngagementFile(options?: useDataConnectMutationOptions<DeleteEngagementFileData, FirebaseError, DeleteEngagementFileVariables>): UseDataConnectMutationResult<DeleteEngagementFileData, DeleteEngagementFileVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteEngagementFile(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteEngagementFileData, FirebaseError, DeleteEngagementFileVariables>): UseDataConnectMutationResult<DeleteEngagementFileData, DeleteEngagementFileVariables>;
```

### Variables
The `DeleteEngagementFile` Mutation requires an argument of type `DeleteEngagementFileVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteEngagementFileVariables {
  id: string;
}
```
### Return Type
Recall that calling the `DeleteEngagementFile` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteEngagementFile` Mutation is of type `DeleteEngagementFileData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteEngagementFileData {
  engagementFile_delete?: EngagementFile_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteEngagementFile`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteEngagementFileVariables } from '@dataconnect/generated';
import { useDeleteEngagementFile } from '@dataconnect/generated/react'

export default function DeleteEngagementFileComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteEngagementFile();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteEngagementFile(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteEngagementFile(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteEngagementFile(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteEngagementFile` Mutation requires an argument of type `DeleteEngagementFileVariables`:
  const deleteEngagementFileVars: DeleteEngagementFileVariables = {
    id: ..., 
  };
  mutation.mutate(deleteEngagementFileVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteEngagementFileVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.engagementFile_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertActivityLog
You can execute the `UpsertActivityLog` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertActivityLog(options?: useDataConnectMutationOptions<UpsertActivityLogData, FirebaseError, UpsertActivityLogVariables>): UseDataConnectMutationResult<UpsertActivityLogData, UpsertActivityLogVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertActivityLog(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertActivityLogData, FirebaseError, UpsertActivityLogVariables>): UseDataConnectMutationResult<UpsertActivityLogData, UpsertActivityLogVariables>;
```

### Variables
The `UpsertActivityLog` Mutation requires an argument of type `UpsertActivityLogVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpsertActivityLog` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertActivityLog` Mutation is of type `UpsertActivityLogData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertActivityLogData {
  activityLog_upsert: ActivityLog_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertActivityLog`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertActivityLogVariables } from '@dataconnect/generated';
import { useUpsertActivityLog } from '@dataconnect/generated/react'

export default function UpsertActivityLogComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertActivityLog();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertActivityLog(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertActivityLog(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertActivityLog(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertActivityLog` Mutation requires an argument of type `UpsertActivityLogVariables`:
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
  mutation.mutate(upsertActivityLogVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., engagementId: ..., timestamp: ..., actor: ..., action: ..., detail: ..., addedBy: ..., modifiedBy: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertActivityLogVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.activityLog_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteActivityLog
You can execute the `DeleteActivityLog` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteActivityLog(options?: useDataConnectMutationOptions<DeleteActivityLogData, FirebaseError, DeleteActivityLogVariables>): UseDataConnectMutationResult<DeleteActivityLogData, DeleteActivityLogVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteActivityLog(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteActivityLogData, FirebaseError, DeleteActivityLogVariables>): UseDataConnectMutationResult<DeleteActivityLogData, DeleteActivityLogVariables>;
```

### Variables
The `DeleteActivityLog` Mutation requires an argument of type `DeleteActivityLogVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteActivityLogVariables {
  id: string;
}
```
### Return Type
Recall that calling the `DeleteActivityLog` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteActivityLog` Mutation is of type `DeleteActivityLogData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteActivityLogData {
  activityLog_delete?: ActivityLog_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteActivityLog`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteActivityLogVariables } from '@dataconnect/generated';
import { useDeleteActivityLog } from '@dataconnect/generated/react'

export default function DeleteActivityLogComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteActivityLog();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteActivityLog(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteActivityLog(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteActivityLog(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteActivityLog` Mutation requires an argument of type `DeleteActivityLogVariables`:
  const deleteActivityLogVars: DeleteActivityLogVariables = {
    id: ..., 
  };
  mutation.mutate(deleteActivityLogVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteActivityLogVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.activityLog_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertIssueRegister
You can execute the `UpsertIssueRegister` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertIssueRegister(options?: useDataConnectMutationOptions<UpsertIssueRegisterData, FirebaseError, UpsertIssueRegisterVariables>): UseDataConnectMutationResult<UpsertIssueRegisterData, UpsertIssueRegisterVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertIssueRegister(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertIssueRegisterData, FirebaseError, UpsertIssueRegisterVariables>): UseDataConnectMutationResult<UpsertIssueRegisterData, UpsertIssueRegisterVariables>;
```

### Variables
The `UpsertIssueRegister` Mutation requires an argument of type `UpsertIssueRegisterVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpsertIssueRegister` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertIssueRegister` Mutation is of type `UpsertIssueRegisterData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertIssueRegisterData {
  issueRegister_upsert: IssueRegister_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertIssueRegister`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertIssueRegisterVariables } from '@dataconnect/generated';
import { useUpsertIssueRegister } from '@dataconnect/generated/react'

export default function UpsertIssueRegisterComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertIssueRegister();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertIssueRegister(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertIssueRegister(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertIssueRegister(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertIssueRegister` Mutation requires an argument of type `UpsertIssueRegisterVariables`:
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
  mutation.mutate(upsertIssueRegisterVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., ref: ..., title: ..., auditRef: ..., auditTitle: ..., severity: ..., owner: ..., ownerUnit: ..., originalDue: ..., currentDue: ..., extensionCount: ..., daysStatus: ..., isOverdue: ..., isDueSoon: ..., status: ..., actionPlanSummary: ..., evidenceNote: ..., addedBy: ..., modifiedBy: ..., extensionReason: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertIssueRegisterVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.issueRegister_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteIssueRegister
You can execute the `DeleteIssueRegister` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteIssueRegister(options?: useDataConnectMutationOptions<DeleteIssueRegisterData, FirebaseError, DeleteIssueRegisterVariables>): UseDataConnectMutationResult<DeleteIssueRegisterData, DeleteIssueRegisterVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteIssueRegister(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteIssueRegisterData, FirebaseError, DeleteIssueRegisterVariables>): UseDataConnectMutationResult<DeleteIssueRegisterData, DeleteIssueRegisterVariables>;
```

### Variables
The `DeleteIssueRegister` Mutation requires an argument of type `DeleteIssueRegisterVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteIssueRegisterVariables {
  id: string;
}
```
### Return Type
Recall that calling the `DeleteIssueRegister` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteIssueRegister` Mutation is of type `DeleteIssueRegisterData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteIssueRegisterData {
  issueRegister_delete?: IssueRegister_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteIssueRegister`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteIssueRegisterVariables } from '@dataconnect/generated';
import { useDeleteIssueRegister } from '@dataconnect/generated/react'

export default function DeleteIssueRegisterComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteIssueRegister();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteIssueRegister(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteIssueRegister(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteIssueRegister(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteIssueRegister` Mutation requires an argument of type `DeleteIssueRegisterVariables`:
  const deleteIssueRegisterVars: DeleteIssueRegisterVariables = {
    id: ..., 
  };
  mutation.mutate(deleteIssueRegisterVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteIssueRegisterVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.issueRegister_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertUniverseEntity
You can execute the `UpsertUniverseEntity` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertUniverseEntity(options?: useDataConnectMutationOptions<UpsertUniverseEntityData, FirebaseError, UpsertUniverseEntityVariables>): UseDataConnectMutationResult<UpsertUniverseEntityData, UpsertUniverseEntityVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertUniverseEntity(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertUniverseEntityData, FirebaseError, UpsertUniverseEntityVariables>): UseDataConnectMutationResult<UpsertUniverseEntityData, UpsertUniverseEntityVariables>;
```

### Variables
The `UpsertUniverseEntity` Mutation requires an argument of type `UpsertUniverseEntityVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpsertUniverseEntity` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertUniverseEntity` Mutation is of type `UpsertUniverseEntityData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertUniverseEntityData {
  universeEntity_upsert: UniverseEntity_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertUniverseEntity`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertUniverseEntityVariables } from '@dataconnect/generated';
import { useUpsertUniverseEntity } from '@dataconnect/generated/react'

export default function UpsertUniverseEntityComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertUniverseEntity();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertUniverseEntity(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertUniverseEntity(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertUniverseEntity(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertUniverseEntity` Mutation requires an argument of type `UpsertUniverseEntityVariables`:
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
  mutation.mutate(upsertUniverseEntityVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., code: ..., name: ..., division: ..., category: ..., likelihood: ..., impact: ..., riskScore: ..., riskLevel: ..., lastAudited: ..., nextDue: ..., cycleMonths: ..., defaultLead: ..., addedBy: ..., modifiedBy: ..., auditDivisionId: ..., riskNotes: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertUniverseEntityVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.universeEntity_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteUniverseEntity
You can execute the `DeleteUniverseEntity` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteUniverseEntity(options?: useDataConnectMutationOptions<DeleteUniverseEntityData, FirebaseError, DeleteUniverseEntityVariables>): UseDataConnectMutationResult<DeleteUniverseEntityData, DeleteUniverseEntityVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteUniverseEntity(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteUniverseEntityData, FirebaseError, DeleteUniverseEntityVariables>): UseDataConnectMutationResult<DeleteUniverseEntityData, DeleteUniverseEntityVariables>;
```

### Variables
The `DeleteUniverseEntity` Mutation requires an argument of type `DeleteUniverseEntityVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteUniverseEntityVariables {
  id: string;
}
```
### Return Type
Recall that calling the `DeleteUniverseEntity` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteUniverseEntity` Mutation is of type `DeleteUniverseEntityData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteUniverseEntityData {
  universeEntity_delete?: UniverseEntity_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteUniverseEntity`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteUniverseEntityVariables } from '@dataconnect/generated';
import { useDeleteUniverseEntity } from '@dataconnect/generated/react'

export default function DeleteUniverseEntityComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteUniverseEntity();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteUniverseEntity(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteUniverseEntity(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteUniverseEntity(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteUniverseEntity` Mutation requires an argument of type `DeleteUniverseEntityVariables`:
  const deleteUniverseEntityVars: DeleteUniverseEntityVariables = {
    id: ..., 
  };
  mutation.mutate(deleteUniverseEntityVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteUniverseEntityVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.universeEntity_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertSizingConfig
You can execute the `UpsertSizingConfig` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertSizingConfig(options?: useDataConnectMutationOptions<UpsertSizingConfigData, FirebaseError, UpsertSizingConfigVariables>): UseDataConnectMutationResult<UpsertSizingConfigData, UpsertSizingConfigVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertSizingConfig(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertSizingConfigData, FirebaseError, UpsertSizingConfigVariables>): UseDataConnectMutationResult<UpsertSizingConfigData, UpsertSizingConfigVariables>;
```

### Variables
The `UpsertSizingConfig` Mutation requires an argument of type `UpsertSizingConfigVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpsertSizingConfig` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertSizingConfig` Mutation is of type `UpsertSizingConfigData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertSizingConfigData {
  sizingConfig_upsert: SizingConfig_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertSizingConfig`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertSizingConfigVariables } from '@dataconnect/generated';
import { useUpsertSizingConfig } from '@dataconnect/generated/react'

export default function UpsertSizingConfigComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertSizingConfig();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertSizingConfig(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertSizingConfig(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertSizingConfig(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertSizingConfig` Mutation requires an argument of type `UpsertSizingConfigVariables`:
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
  mutation.mutate(upsertSizingConfigVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., sizeName: ..., code: ..., workingDays: ..., calendarSpan: ..., auditors: ..., hoursPerDay: ..., budgetedHours: ..., typicalUse: ..., addedBy: ..., modifiedBy: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertSizingConfigVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.sizingConfig_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteSizingConfig
You can execute the `DeleteSizingConfig` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteSizingConfig(options?: useDataConnectMutationOptions<DeleteSizingConfigData, FirebaseError, DeleteSizingConfigVariables>): UseDataConnectMutationResult<DeleteSizingConfigData, DeleteSizingConfigVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteSizingConfig(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteSizingConfigData, FirebaseError, DeleteSizingConfigVariables>): UseDataConnectMutationResult<DeleteSizingConfigData, DeleteSizingConfigVariables>;
```

### Variables
The `DeleteSizingConfig` Mutation requires an argument of type `DeleteSizingConfigVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteSizingConfigVariables {
  id: string;
}
```
### Return Type
Recall that calling the `DeleteSizingConfig` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteSizingConfig` Mutation is of type `DeleteSizingConfigData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteSizingConfigData {
  sizingConfig_delete?: SizingConfig_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteSizingConfig`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteSizingConfigVariables } from '@dataconnect/generated';
import { useDeleteSizingConfig } from '@dataconnect/generated/react'

export default function DeleteSizingConfigComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteSizingConfig();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteSizingConfig(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteSizingConfig(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteSizingConfig(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteSizingConfig` Mutation requires an argument of type `DeleteSizingConfigVariables`:
  const deleteSizingConfigVars: DeleteSizingConfigVariables = {
    id: ..., 
  };
  mutation.mutate(deleteSizingConfigVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteSizingConfigVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.sizingConfig_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertAuditFrequency
You can execute the `UpsertAuditFrequency` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertAuditFrequency(options?: useDataConnectMutationOptions<UpsertAuditFrequencyData, FirebaseError, UpsertAuditFrequencyVariables>): UseDataConnectMutationResult<UpsertAuditFrequencyData, UpsertAuditFrequencyVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertAuditFrequency(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertAuditFrequencyData, FirebaseError, UpsertAuditFrequencyVariables>): UseDataConnectMutationResult<UpsertAuditFrequencyData, UpsertAuditFrequencyVariables>;
```

### Variables
The `UpsertAuditFrequency` Mutation requires an argument of type `UpsertAuditFrequencyVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpsertAuditFrequency` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertAuditFrequency` Mutation is of type `UpsertAuditFrequencyData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertAuditFrequencyData {
  auditFrequency_upsert: AuditFrequency_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertAuditFrequency`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertAuditFrequencyVariables } from '@dataconnect/generated';
import { useUpsertAuditFrequency } from '@dataconnect/generated/react'

export default function UpsertAuditFrequencyComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertAuditFrequency();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertAuditFrequency(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertAuditFrequency(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertAuditFrequency(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertAuditFrequency` Mutation requires an argument of type `UpsertAuditFrequencyVariables`:
  const upsertAuditFrequencyVars: UpsertAuditFrequencyVariables = {
    id: ..., 
    high: ..., 
    medium: ..., 
    low: ..., 
    addedBy: ..., // optional
    modifiedBy: ..., // optional
  };
  mutation.mutate(upsertAuditFrequencyVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., high: ..., medium: ..., low: ..., addedBy: ..., modifiedBy: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertAuditFrequencyVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.auditFrequency_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteAuditFrequency
You can execute the `DeleteAuditFrequency` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteAuditFrequency(options?: useDataConnectMutationOptions<DeleteAuditFrequencyData, FirebaseError, DeleteAuditFrequencyVariables>): UseDataConnectMutationResult<DeleteAuditFrequencyData, DeleteAuditFrequencyVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteAuditFrequency(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteAuditFrequencyData, FirebaseError, DeleteAuditFrequencyVariables>): UseDataConnectMutationResult<DeleteAuditFrequencyData, DeleteAuditFrequencyVariables>;
```

### Variables
The `DeleteAuditFrequency` Mutation requires an argument of type `DeleteAuditFrequencyVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteAuditFrequencyVariables {
  id: string;
}
```
### Return Type
Recall that calling the `DeleteAuditFrequency` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteAuditFrequency` Mutation is of type `DeleteAuditFrequencyData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteAuditFrequencyData {
  auditFrequency_delete?: AuditFrequency_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteAuditFrequency`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteAuditFrequencyVariables } from '@dataconnect/generated';
import { useDeleteAuditFrequency } from '@dataconnect/generated/react'

export default function DeleteAuditFrequencyComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteAuditFrequency();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteAuditFrequency(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteAuditFrequency(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteAuditFrequency(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteAuditFrequency` Mutation requires an argument of type `DeleteAuditFrequencyVariables`:
  const deleteAuditFrequencyVars: DeleteAuditFrequencyVariables = {
    id: ..., 
  };
  mutation.mutate(deleteAuditFrequencyVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteAuditFrequencyVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.auditFrequency_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertMasterData
You can execute the `UpsertMasterData` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertMasterData(options?: useDataConnectMutationOptions<UpsertMasterDataData, FirebaseError, UpsertMasterDataVariables>): UseDataConnectMutationResult<UpsertMasterDataData, UpsertMasterDataVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertMasterData(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertMasterDataData, FirebaseError, UpsertMasterDataVariables>): UseDataConnectMutationResult<UpsertMasterDataData, UpsertMasterDataVariables>;
```

### Variables
The `UpsertMasterData` Mutation requires an argument of type `UpsertMasterDataVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertMasterDataVariables {
  id: string;
  data: unknown;
  addedBy?: string | null;
  modifiedBy?: string | null;
}
```
### Return Type
Recall that calling the `UpsertMasterData` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertMasterData` Mutation is of type `UpsertMasterDataData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertMasterDataData {
  masterData_upsert: MasterData_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertMasterData`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertMasterDataVariables } from '@dataconnect/generated';
import { useUpsertMasterData } from '@dataconnect/generated/react'

export default function UpsertMasterDataComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertMasterData();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertMasterData(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertMasterData(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertMasterData(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertMasterData` Mutation requires an argument of type `UpsertMasterDataVariables`:
  const upsertMasterDataVars: UpsertMasterDataVariables = {
    id: ..., 
    data: ..., 
    addedBy: ..., // optional
    modifiedBy: ..., // optional
  };
  mutation.mutate(upsertMasterDataVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., data: ..., addedBy: ..., modifiedBy: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertMasterDataVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.masterData_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteMasterData
You can execute the `DeleteMasterData` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteMasterData(options?: useDataConnectMutationOptions<DeleteMasterDataData, FirebaseError, DeleteMasterDataVariables>): UseDataConnectMutationResult<DeleteMasterDataData, DeleteMasterDataVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteMasterData(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteMasterDataData, FirebaseError, DeleteMasterDataVariables>): UseDataConnectMutationResult<DeleteMasterDataData, DeleteMasterDataVariables>;
```

### Variables
The `DeleteMasterData` Mutation requires an argument of type `DeleteMasterDataVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteMasterDataVariables {
  id: string;
}
```
### Return Type
Recall that calling the `DeleteMasterData` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteMasterData` Mutation is of type `DeleteMasterDataData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteMasterDataData {
  masterData_delete?: MasterData_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteMasterData`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteMasterDataVariables } from '@dataconnect/generated';
import { useDeleteMasterData } from '@dataconnect/generated/react'

export default function DeleteMasterDataComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteMasterData();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteMasterData(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteMasterData(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteMasterData(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteMasterData` Mutation requires an argument of type `DeleteMasterDataVariables`:
  const deleteMasterDataVars: DeleteMasterDataVariables = {
    id: ..., 
  };
  mutation.mutate(deleteMasterDataVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteMasterDataVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.masterData_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertAuditDivisionRiskScale
You can execute the `UpsertAuditDivisionRiskScale` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertAuditDivisionRiskScale(options?: useDataConnectMutationOptions<UpsertAuditDivisionRiskScaleData, FirebaseError, UpsertAuditDivisionRiskScaleVariables>): UseDataConnectMutationResult<UpsertAuditDivisionRiskScaleData, UpsertAuditDivisionRiskScaleVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertAuditDivisionRiskScale(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertAuditDivisionRiskScaleData, FirebaseError, UpsertAuditDivisionRiskScaleVariables>): UseDataConnectMutationResult<UpsertAuditDivisionRiskScaleData, UpsertAuditDivisionRiskScaleVariables>;
```

### Variables
The `UpsertAuditDivisionRiskScale` Mutation requires an argument of type `UpsertAuditDivisionRiskScaleVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpsertAuditDivisionRiskScale` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertAuditDivisionRiskScale` Mutation is of type `UpsertAuditDivisionRiskScaleData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertAuditDivisionRiskScaleData {
  auditDivisionRiskScale_upsert: AuditDivisionRiskScale_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertAuditDivisionRiskScale`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertAuditDivisionRiskScaleVariables } from '@dataconnect/generated';
import { useUpsertAuditDivisionRiskScale } from '@dataconnect/generated/react'

export default function UpsertAuditDivisionRiskScaleComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertAuditDivisionRiskScale();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertAuditDivisionRiskScale(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertAuditDivisionRiskScale(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertAuditDivisionRiskScale(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertAuditDivisionRiskScale` Mutation requires an argument of type `UpsertAuditDivisionRiskScaleVariables`:
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
  mutation.mutate(upsertAuditDivisionRiskScaleVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., name: ..., highMinScore: ..., mediumMinScore: ..., highCycleMonths: ..., mediumCycleMonths: ..., lowCycleMonths: ..., highFieldworkWeeks: ..., mediumFieldworkWeeks: ..., lowFieldworkWeeks: ..., addedBy: ..., modifiedBy: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertAuditDivisionRiskScaleVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.auditDivisionRiskScale_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteAuditDivisionRiskScale
You can execute the `DeleteAuditDivisionRiskScale` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteAuditDivisionRiskScale(options?: useDataConnectMutationOptions<DeleteAuditDivisionRiskScaleData, FirebaseError, DeleteAuditDivisionRiskScaleVariables>): UseDataConnectMutationResult<DeleteAuditDivisionRiskScaleData, DeleteAuditDivisionRiskScaleVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteAuditDivisionRiskScale(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteAuditDivisionRiskScaleData, FirebaseError, DeleteAuditDivisionRiskScaleVariables>): UseDataConnectMutationResult<DeleteAuditDivisionRiskScaleData, DeleteAuditDivisionRiskScaleVariables>;
```

### Variables
The `DeleteAuditDivisionRiskScale` Mutation requires an argument of type `DeleteAuditDivisionRiskScaleVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteAuditDivisionRiskScaleVariables {
  id: string;
}
```
### Return Type
Recall that calling the `DeleteAuditDivisionRiskScale` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteAuditDivisionRiskScale` Mutation is of type `DeleteAuditDivisionRiskScaleData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteAuditDivisionRiskScaleData {
  auditDivisionRiskScale_delete?: AuditDivisionRiskScale_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteAuditDivisionRiskScale`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteAuditDivisionRiskScaleVariables } from '@dataconnect/generated';
import { useDeleteAuditDivisionRiskScale } from '@dataconnect/generated/react'

export default function DeleteAuditDivisionRiskScaleComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteAuditDivisionRiskScale();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteAuditDivisionRiskScale(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteAuditDivisionRiskScale(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteAuditDivisionRiskScale(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteAuditDivisionRiskScale` Mutation requires an argument of type `DeleteAuditDivisionRiskScaleVariables`:
  const deleteAuditDivisionRiskScaleVars: DeleteAuditDivisionRiskScaleVariables = {
    id: ..., 
  };
  mutation.mutate(deleteAuditDivisionRiskScaleVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteAuditDivisionRiskScaleVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.auditDivisionRiskScale_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertAppSession
You can execute the `UpsertAppSession` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertAppSession(options?: useDataConnectMutationOptions<UpsertAppSessionData, FirebaseError, UpsertAppSessionVariables>): UseDataConnectMutationResult<UpsertAppSessionData, UpsertAppSessionVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertAppSession(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertAppSessionData, FirebaseError, UpsertAppSessionVariables>): UseDataConnectMutationResult<UpsertAppSessionData, UpsertAppSessionVariables>;
```

### Variables
The `UpsertAppSession` Mutation requires an argument of type `UpsertAppSessionVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertAppSessionVariables {
  tokenHash: string;
  userId: string;
  expiresAt: TimestampString;
  revokedAt?: TimestampString | null;
}
```
### Return Type
Recall that calling the `UpsertAppSession` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertAppSession` Mutation is of type `UpsertAppSessionData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertAppSessionData {
  appSession_upsert: AppSession_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertAppSession`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertAppSessionVariables } from '@dataconnect/generated';
import { useUpsertAppSession } from '@dataconnect/generated/react'

export default function UpsertAppSessionComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertAppSession();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertAppSession(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertAppSession(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertAppSession(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertAppSession` Mutation requires an argument of type `UpsertAppSessionVariables`:
  const upsertAppSessionVars: UpsertAppSessionVariables = {
    tokenHash: ..., 
    userId: ..., 
    expiresAt: ..., 
    revokedAt: ..., // optional
  };
  mutation.mutate(upsertAppSessionVars);
  // Variables can be defined inline as well.
  mutation.mutate({ tokenHash: ..., userId: ..., expiresAt: ..., revokedAt: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertAppSessionVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.appSession_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteAppSession
You can execute the `DeleteAppSession` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteAppSession(options?: useDataConnectMutationOptions<DeleteAppSessionData, FirebaseError, DeleteAppSessionVariables>): UseDataConnectMutationResult<DeleteAppSessionData, DeleteAppSessionVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteAppSession(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteAppSessionData, FirebaseError, DeleteAppSessionVariables>): UseDataConnectMutationResult<DeleteAppSessionData, DeleteAppSessionVariables>;
```

### Variables
The `DeleteAppSession` Mutation requires an argument of type `DeleteAppSessionVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteAppSessionVariables {
  tokenHash: string;
}
```
### Return Type
Recall that calling the `DeleteAppSession` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteAppSession` Mutation is of type `DeleteAppSessionData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteAppSessionData {
  appSession_delete?: AppSession_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteAppSession`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteAppSessionVariables } from '@dataconnect/generated';
import { useDeleteAppSession } from '@dataconnect/generated/react'

export default function DeleteAppSessionComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteAppSession();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteAppSession(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteAppSession(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteAppSession(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteAppSession` Mutation requires an argument of type `DeleteAppSessionVariables`:
  const deleteAppSessionVars: DeleteAppSessionVariables = {
    tokenHash: ..., 
  };
  mutation.mutate(deleteAppSessionVars);
  // Variables can be defined inline as well.
  mutation.mutate({ tokenHash: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteAppSessionVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.appSession_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

