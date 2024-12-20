// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// snippet-start:[javascript.v3.scenarios.web.ListObjects]
import { useEffect, useState } from "react";
import {
  ListObjectsCommand,
  type ListObjectsCommandOutput,
  paginateListObjectsV2,
  S3Client,
} from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import "./App.css";

function App() {
  const [objects, setObjects] = useState<
    Required<ListObjectsCommandOutput>["Contents"]
  >([]);

  useEffect(() => {
    // https://stackoverflow.com/questions/42394429/aws-sdk-s3-best-way-to-list-all-keys-with-listobjectsv2#:~:text=Using%20AWS%2DSDK%20v3%20and%20Typescript
    async function getAllS3Files(client: S3Client, s3Opts:any){
      const totalFiles = [];
      for await (const data of paginateListObjectsV2({ client }, s3Opts)) {
        totalFiles.push(...(data.Contents ?? []));
      }
      return totalFiles;
    };

    async function getAsyncList() {
    const client = new S3Client({
      region: "us-east-1",
      // Unless you have a public bucket, you'll need access to a private bucket.
      // One way to do this is to create an Amazon Cognito identity pool, attach a role to the pool,
      // and grant the role access to the 's3:GetObject' action.
      //
      // You'll also need to configure the CORS settings on the bucket to allow traffic from
      // this example site. Here's an example configuration that allows all origins. Don't
      // do this in production.
      //[
      //  {
      //    "AllowedHeaders": ["*"],
      //    "AllowedMethods": ["GET"],
      //    "AllowedOrigins": ["*"],
      //    "ExposeHeaders": [],
      //  },
      //]
      //
      credentials: fromCognitoIdentityPool({
        clientConfig: { region: "us-east-1" },
        identityPoolId: "us-east-1:e4e30be9-2107-46d0-b20e-f7737be90a30",
      }),
    });

    // const command = new ListObjectsCommand({ Bucket: "wickr-desktop-client-ci-builds" });
    // client.send(command).then(({ Contents }) => setObjects(Contents || []));

    // console.log(await getAllS3Files(client, { Bucket: "wickr-desktop-client-ci-builds" }));
    const allS3Files = await getAllS3Files(client, { Bucket: "wickr-desktop-client-ci-builds" });
    console.log('*** allS3Files:', allS3Files);
    setObjects(allS3Files);
  }
  getAsyncList();
}, []);

  return (
    <div className="App">
      {objects.map((o) => (
        <div key={o.ETag}>{o.Key}</div>
      ))}
    </div>
  );
}

export default App;
// snippet-end:[javascript.v3.scenarios.web.ListObjects]
