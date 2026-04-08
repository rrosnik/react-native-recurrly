import { useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useCallback, useEffect, useState } from "react";
import { SignInData, signInSchema } from "../schema.ts";

export const useLogin = () => {
  const { signIn, fetchStatus } = useSignIn();
  const [error, setError] = useState<{ message: string } | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [status, setStatus] = useState<null | "needs_client_trust">(null);

  const router = useRouter();
  const posthog = usePostHog();

  useEffect(() => {
    setIsFetching(fetchStatus === "fetching");
    return () => setIsFetching(false);
  }, [fetchStatus]);

  const login = useCallback(
    async (signInData: SignInData) => {
      const validData = signInSchema.safeParse(signInData);

      if (!validData.success) {
        setError({ message: "Invalid email or password" });
        return;
      }
      const { emailAddress, password } = validData.data;

      // try to sign in the user with the password strategy
      const { error } = await signIn.password({
        // See https://clerk.com/docs/guides/development/custom-flows/authentication/password-strategy for more details on the password sign-in strategy
        emailAddress,
        password,
      });
      if (error) {
        // want't successfult sign-in, show error message
        setError({ message: error.message });
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              // Handle pending session tasks
              // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
              console.log(session?.currentTask);
              return;
            }
            posthog.capture("user_logged_in", {
              method: "email_code_mfa",
            });
            router.replace("/(tabs)");
          },
        });
      } else if (signIn.status === "needs_second_factor") {
        // See https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
        setError({
          message:
            "Multi-factor authentication required, but not implemented in this example",
        });
      } else if (signIn.status === "needs_client_trust") {
        // For other second factor strategies,
        // see https://clerk.com/docs/guides/development/custom-flows/authentication/client-trust
        const emailCodeFactor = signIn.supportedSecondFactors.find(
          (factor) => factor.strategy === "email_code",
        );

        if (emailCodeFactor) {
          const { error } = await signIn.mfa.sendEmailCode();
          if (error) {
            setError({ message: error.message });
            return;
          }
          setStatus("needs_client_trust");
        } else {
          setError({ message: "Unsupported second factor strategy for email" });
        }
      } else {
        // Check why the sign-in is not complete
        setError({ message: "Sign-in attempt not complete" });
      }
    },
    [signIn, router, posthog],
  );

  const reset = useCallback(() => {
    setError(null);
    setIsFetching(false);
    setStatus(null);
    // set signIn state to initial values if needed
    signIn.reset();
  }, [signIn]);

  const resendCode = useCallback(async () => {
    if (status === "needs_client_trust") {
      const { error } = await signIn.mfa.sendEmailCode();
      if (error) {
        setError({ message: error.message });
      } else {
        setError({ message: "Verification code resent" });
      }
    }
  }, [signIn, status]);

  const verifyCode = useCallback(
    async (code: string) => {
      if (status === "needs_client_trust") {
        const { error } = await signIn.mfa.verifyEmailCode({ code });
        if (error) {
          setError({ message: error.message });
          return;
        }

        if (signIn.status === "complete") {
          const { error } = await signIn.finalize({
            navigate: ({ session, decorateUrl }) => {
              if (session?.currentTask) {
                // Handle pending session tasks
                // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
                console.log(session?.currentTask);
                return;
              }
              posthog.capture("user_logged_in", {
                method: "email_code_mfa",
              });
              router.replace("/(tabs)");
            },
          });
          if (error) {
            setError({ message: error.message });
            return;
          }
        } else {
          // Check why the sign-in is not complete
          console.error("Sign-in attempt not complete:", signIn);
        }
      }
    },
      [signIn, status, router, posthog],
  );

  return {
    login: login,
    error,
    isFetching,
    status,
    reset,
    verifyCode,
    resendCode,
  };
};
