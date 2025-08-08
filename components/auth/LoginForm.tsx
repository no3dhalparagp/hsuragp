"use client";
import { useState, useTransition, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RefreshCw,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Home,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { login } from "@/action/login";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  captcha: z.string().length(6, { message: "CAPTCHA must be 6 characters" }),
  rememberMe: z.boolean().default(false),
  code: z.string().optional(),
});

export default function LoginForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("");
  const [isRefreshingCaptcha, setIsRefreshingCaptcha] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Another account already exists with the same email address"
      : "";

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      captcha: "",
      rememberMe: false,
      code: "",
    },
  });

  const generateCaptcha = () => {
    setIsRefreshingCaptcha(true);
    const characters =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setCaptchaCode(result);
    setIsRefreshingCaptcha(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (values.captcha !== captchaCode) {
      setError("Invalid CAPTCHA. Please try again.");
      generateCaptcha();
      form.setValue("captcha", "");
      setIsLoading(false);
      return;
    }

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          } else if (data?.success) {
            // Check if it's a verification message
            if (data.success.includes("Confirmation email sent")) {
              setVerificationMessage(data.success);
              setShowVerificationDialog(true);
            } else {
              setSuccess(data.success);
              window.location.href = data.redirectUrl ?? DEFAULT_LOGIN_REDIRECT;
            }
          }
        })
        .catch(() => {
          setError("Something went wrong. Please try again.");
        })
        .finally(() => setIsLoading(false));
    });
  };

  return (
    <Dialog open={true} onOpenChange={() => window.history.back()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <Card className="w-full border-0 shadow-none">
          <CardHeader className="space-y-1 px-4 pt-4 pb-1">
            <CardTitle className="text-xl font-semibold text-gray-800 text-center">
              {showTwoFactor ? "Two-Factor Verification" : "Welcome Back"}
            </CardTitle>
          </CardHeader>

          <CardContent className="px-4 py-3">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="text-center text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                {showTwoFactor
                  ? "Secure Verification"
                  : "Sign in to your account"}
              </h2>
              <p className="mt-1 text-center text-sm text-gray-600">
                {showTwoFactor
                  ? "Enter your verification code to continue"
                  : "Access your dashboard and manage your services"}
              </p>
            </div>

            <div className="flex justify-center items-center p-1 group">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                title="Return to homepage"
              >
                <button
                  type="button"
                  className="p-1 rounded-md hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  aria-label="Home"
                >
                  <Home className="h-4 w-4 transition-transform group-hover:scale-110" />
                </button>
              </Link>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3 mt-2"
              >
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-2 rounded-md flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-700">
                        {error}
                      </p>
                      {urlError && (
                        <p className="text-sm text-red-600 mt-0.5">
                          {urlError}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-2 rounded-md flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium text-green-700">
                      {success}
                    </p>
                  </div>
                )}

                {showTwoFactor ? (
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Verification Code
                          </FormLabel>
                          <p className="text-xs text-gray-500 mb-1">
                            Please enter the 6-digit code from your
                            authenticator app
                          </p>
                          <FormControl>
                            <Input
                              placeholder="123456"
                              className="py-2 text-center font-mono tracking-[0.3em] text-base"
                              autoFocus
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="name@company.com"
                              type="email"
                              className="py-2"
                              disabled={isPending}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Password
                            </FormLabel>
                            <Link
                              href="/auth/reset"
                              className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              Forgot password?
                            </Link>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="••••••••"
                                type={showPassword ? "text" : "password"}
                                className="py-2 pr-10"
                                disabled={isPending}
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                                aria-label={
                                  showPassword
                                    ? "Hide password"
                                    : "Show password"
                                }
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-gray-300"
                              aria-label="Remember this device"
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal text-gray-600">
                            Remember this device
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <div className="space-y-1">
                      <FormLabel className="text-sm font-medium text-gray-700 block">
                        Security Verification
                      </FormLabel>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-md p-1.5 flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-700 font-mono tracking-wider">
                            {captchaCode}
                          </span>
                          <button
                            type="button"
                            onClick={generateCaptcha}
                            disabled={isRefreshingCaptcha}
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Refresh CAPTCHA"
                          >
                            <RefreshCw
                              className={`h-4 w-4 ${
                                isRefreshingCaptcha ? "animate-spin" : ""
                              }`}
                            />
                          </button>
                        </div>
                        <FormField
                          control={form.control}
                          name="captcha"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder="Enter code"
                                  className="py-2 font-mono"
                                  disabled={isPending}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className={cn(
                    "w-full py-2 text-sm font-medium rounded-md transition-colors",
                    "bg-indigo-600 hover:bg-indigo-700 text-white",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                    (isPending || isLoading) && "opacity-70 cursor-not-allowed"
                  )}
                  disabled={isPending || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      {showTwoFactor ? "Verifying..." : "Signing in..."}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {showTwoFactor ? "Verify Code" : "Continue"}
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>

            {!showTwoFactor && (
              <div className="mt-3 text-center text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Create account
                </Link>
              </div>
            )}
          </CardContent>

          <CardFooter className="px-4 py-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              By continuing, you agree to our{" "}
              <Link
                href="/terms"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </CardFooter>
        </Card>

        {/* Email Verification Dialog */}
        <Dialog
          open={showVerificationDialog}
          onOpenChange={setShowVerificationDialog}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">
                Email Verification Required
              </DialogTitle>
              <DialogDescription className="text-center">
                We&apos;ve sent a verification link to your email address.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <div className="rounded-full bg-blue-50 p-3">
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-center text-sm text-gray-700">
                {verificationMessage}
              </p>
              <p className="text-center text-xs text-gray-500">
                Please check your inbox and click on the verification link to
                activate your account. If you don&apos;t see the email, check
                your spam folder.
              </p>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-center">
              <Button
                type="button"
                variant="default"
                onClick={() => {
                  setShowVerificationDialog(false);
                  window.location.href = "/";
                }}
                className="w-full sm:w-auto"
              >
                Got it
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
