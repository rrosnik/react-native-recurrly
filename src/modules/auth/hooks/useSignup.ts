import { useSignUp } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { SignUpData, signUpSchema } from "../schema.ts";

export const useSignup = () => {
  const { signUp, errors, fetchStatus } = useSignUp();

  const [error, setError] = useState<{ message: string } | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [status, setStatus] = useState<null | "verifyEmailCode">(null);
  const router = useRouter();

  useEffect(() => {
    setIsFetching(fetchStatus === "fetching");
    return () => setIsFetching(false);
  }, [fetchStatus]);

  const signUpWithEmail = useCallback(
    async (signUpData: SignUpData) => {
      const validData = signUpSchema.safeParse(signUpData);

      if (!validData.success) {
        setError({ message: "Invalid email or password format." });
        return;
      }
      const { emailAddress, password } = validData.data;
      const { error } = await signUp.password({ emailAddress, password });
      if (error) {
        setError({ message: error.message });
        return;
      } else {
        const { error } = await signUp.verifications.sendEmailCode();
        if (error) {
          setError({ message: error.message });
          return;
        } else {
          setStatus("verifyEmailCode");
        }
      }
    },
    [signUp],
  );

  const reset = useCallback(() => {
    setError(null);
    setStatus(null);
    setIsFetching(false);
    signUp.reset();
  }, [setError, setStatus, setIsFetching, signUp]);

  const resendCode = useCallback(async () => {
    if (status !== "verifyEmailCode") {
      throw new Error("Cannot resend code before verification step");
    }
    const { error } = await signUp.verifications.sendEmailCode();
    if (error) {
      setError({ message: error.message });
      throw error;
    }
    return "Verification code resent successfully";
  }, [signUp, status]);

  const handleVerify = useCallback(async (code: string) => {
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) {
      setError({ message: error.message });
      return;
    }

    if (signUp.status === "complete") {
      const { error } = await signUp.finalize({
        // Redirect the user to the home page after signing up
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            // Handle pending session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
            console.log(session?.currentTask);
            return;
          }

          router.replace("/(tabs)");
        },
      });
      if (error) {
        setError({ message: error.message });
        return;
      }
    } else {
      // Check why the sign-up is not complete
      setError({ message: "Sign-up attempt not complete" });
    }
  }, []);

  return {
    signUp: signUpWithEmail,
    error,
    isFetching,
    status,
    reset,
    resendCode,
    verifyCode: handleVerify,
  };
};
