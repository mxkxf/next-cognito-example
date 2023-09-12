import {
  AdminConfirmSignUpCommand,
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { NextApiRequest, NextApiResponse } from "next";

const client = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).send({});
  }

  const { email, password, phoneNumber } = req.body;

  const createUserCommand = new SignUpCommand({
    ClientId: process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "phone_number",
        Value: phoneNumber,
      },
    ],
  });

  try {
    const createUserResponse = await client.send(createUserCommand);

    const confirmSignUpCommand = new AdminConfirmSignUpCommand({
      UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      Username: email,
    });

    const confirmSignUpResponse = await client.send(confirmSignUpCommand);

    return res
      .status(createUserResponse["$metadata"].httpStatusCode as number)
      .send({
        message: "User created",
      });
  } catch (err) {
    console.error(err);
    return res
      .status(err["$metadata"].httpStatusCode)
      .json({ message: err.toString() });
  }
};

export default handler;
