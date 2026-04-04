import z from "zod";

export const signInSchema = z.object({
  emailAddress: z.email(),
  password: z.string(),
});

export const signUpSchema = z.object({
  emailAddress: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const verifyCodeSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

export type SignUpData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signInSchema>;
export type VerifyCodeData = z.infer<typeof verifyCodeSchema>;
