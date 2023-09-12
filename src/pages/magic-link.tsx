import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import { Auth } from "aws-amplify";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type CognitoUser = {
  username: string;
};

const Page = () => {
  const [user, setUser] = useState<CognitoUser | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    setLoading(true);

    const { email, token } = router.query as Record<string, string>;

    // This ultimately calls the Define Auth Challenge -> Create Auth Challenge lambdas
    Auth.signIn(email)
      .then(async (response) => {
        try {
          // This calls the Verify Auth Challenge lambda
          const cognitoUser = await Auth.sendCustomChallengeAnswer(
            response,
            token
          );

          setUser(cognitoUser);
        } catch (err) {
          console.error(err);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return <span>Loading...</span>;
  }

  if (!user) {
    return <span>The link you have used is invalid or may have expired.</span>;
  }

  return <div>Hello {user.username}</div>;
};

export default Page;
