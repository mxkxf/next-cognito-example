import { Amplify } from "aws-amplify";
import type { AppProps } from "next/app";

Amplify.configure({
  aws_cognito_region: process.env.NEXT_PUBLIC_AWS_REGION,
  aws_user_pools_id: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  aws_user_pools_web_client_id: process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID,
  // aws_mandatory_sign_in: false,
});

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
