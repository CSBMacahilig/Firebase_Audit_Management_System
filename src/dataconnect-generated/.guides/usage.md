# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useUpsertUserProfile, useDeleteUserProfile, useUpsertSystemUser, useDeleteSystemUser, useUpsertEngagement, useDeleteEngagement, useUpsertWorkingNote, useDeleteWorkingNote, useUpsertFinding, useDeleteFinding } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useUpsertUserProfile(upsertUserProfileVars);

const { data, isPending, isSuccess, isError, error } = useDeleteUserProfile(deleteUserProfileVars);

const { data, isPending, isSuccess, isError, error } = useUpsertSystemUser(upsertSystemUserVars);

const { data, isPending, isSuccess, isError, error } = useDeleteSystemUser(deleteSystemUserVars);

const { data, isPending, isSuccess, isError, error } = useUpsertEngagement(upsertEngagementVars);

const { data, isPending, isSuccess, isError, error } = useDeleteEngagement(deleteEngagementVars);

const { data, isPending, isSuccess, isError, error } = useUpsertWorkingNote(upsertWorkingNoteVars);

const { data, isPending, isSuccess, isError, error } = useDeleteWorkingNote(deleteWorkingNoteVars);

const { data, isPending, isSuccess, isError, error } = useUpsertFinding(upsertFindingVars);

const { data, isPending, isSuccess, isError, error } = useDeleteFinding(deleteFindingVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertUserProfile, deleteUserProfile, upsertSystemUser, deleteSystemUser, upsertEngagement, deleteEngagement, upsertWorkingNote, deleteWorkingNote, upsertFinding, deleteFinding } from '@dataconnect/generated';


// Operation UpsertUserProfile:  For variables, look at type UpsertUserProfileVars in ../index.d.ts
const { data } = await UpsertUserProfile(dataConnect, upsertUserProfileVars);

// Operation DeleteUserProfile:  For variables, look at type DeleteUserProfileVars in ../index.d.ts
const { data } = await DeleteUserProfile(dataConnect, deleteUserProfileVars);

// Operation UpsertSystemUser:  For variables, look at type UpsertSystemUserVars in ../index.d.ts
const { data } = await UpsertSystemUser(dataConnect, upsertSystemUserVars);

// Operation DeleteSystemUser:  For variables, look at type DeleteSystemUserVars in ../index.d.ts
const { data } = await DeleteSystemUser(dataConnect, deleteSystemUserVars);

// Operation UpsertEngagement:  For variables, look at type UpsertEngagementVars in ../index.d.ts
const { data } = await UpsertEngagement(dataConnect, upsertEngagementVars);

// Operation DeleteEngagement:  For variables, look at type DeleteEngagementVars in ../index.d.ts
const { data } = await DeleteEngagement(dataConnect, deleteEngagementVars);

// Operation UpsertWorkingNote:  For variables, look at type UpsertWorkingNoteVars in ../index.d.ts
const { data } = await UpsertWorkingNote(dataConnect, upsertWorkingNoteVars);

// Operation DeleteWorkingNote:  For variables, look at type DeleteWorkingNoteVars in ../index.d.ts
const { data } = await DeleteWorkingNote(dataConnect, deleteWorkingNoteVars);

// Operation UpsertFinding:  For variables, look at type UpsertFindingVars in ../index.d.ts
const { data } = await UpsertFinding(dataConnect, upsertFindingVars);

// Operation DeleteFinding:  For variables, look at type DeleteFindingVars in ../index.d.ts
const { data } = await DeleteFinding(dataConnect, deleteFindingVars);


```