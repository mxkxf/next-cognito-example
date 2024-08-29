import { NextApiRequest, NextApiResponse } from "next";
import { randomBytes } from "crypto";
import {
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import dayjs from "dayjs";

const client = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;
  const token = randomBytes(20).toString("hex");

  const command = new AdminUpdateUserAttributesCommand({
    UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
    Username: email,
    UserAttributes: [
      {
        Name: "custom:magicLinkToken",
        Value: token,
      },
      {
        Name: "custom:magicLinkExpiresAt",
        Value: dayjs().add(2, "hour").toISOString(),
      },
    ],
  });

  try {
    const response = await client.send(command);

    // TODO: Send an email here, but for now just console.log this out so that we can test it on the front-end
    console.log({ token });

    return res.status(response["$metadata"].httpStatusCode as number).send({
      message: "Magic link sent to user",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(err["$metadata"].httpStatusCode)
      .json({ message: err.toString() });
  }
};

export default handler;
