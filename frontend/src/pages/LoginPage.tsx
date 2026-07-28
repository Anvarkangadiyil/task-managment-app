import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckSquare,
  ArrowRight,
} from "lucide-react";

export const LoginPage = () => {
  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    clearError();
    try {
      await login(data.email.trim(), data.password);
      navigate("/dashboard");
    } catch (err: any) {
      setServerError(
        err.message || "Failed to sign in. Please check your credentials.",
      );
    }
  };

  const handleQuickFill = (email: string, pass: string) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", pass, { shouldValidate: true });
    setServerError(null);
    clearError();
  };

  const activeError = serverError || authError;

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Minimal Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 mb-1">
            <CheckSquare className="w-6 h-6 text-zinc-100" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            TaskManager
          </h1>
          <p className="text-sm text-zinc-400">
            Sign in to access your workspace
          </p>
        </div>

        {/* Login Card */}
        <Card className="border border-zinc-800 bg-zinc-900/90 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-zinc-100">Sign In</CardTitle>
            <CardDescription className="text-zinc-400">
              Enter your credentials to manage your tasks
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {activeError && (
              <Alert
                variant="destructive"
                className="bg-red-950/40 border-red-900 text-red-200"
              >
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-xs font-medium ml-2">
                  {activeError}
                </AlertDescription>
              </Alert>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-9 bg-zinc-950 border-zinc-800 focus-visible:ring-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                    error={!!errors.email}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-10 bg-zinc-950 border-zinc-800 focus-visible:ring-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                    error={!!errors.password}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 font-medium cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Quick Demo Fill Helper */}
            <div className="pt-3 border-t border-zinc-800/80">
              <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2 font-medium">
                Demo Accounts (Click to Fill)
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() =>
                    handleQuickFill("admin@example.com", "admin123")
                  }
                  className="px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300 hover:border-zinc-700 text-left transition-colors cursor-pointer"
                >
                  <div className="font-semibold text-zinc-200">Admin</div>
                  <div className="text-[10px] text-zinc-500 truncate">
                    admin@example.com
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill("user@example.com", "user123")}
                  className="px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300 hover:border-zinc-700 text-left transition-colors cursor-pointer"
                >
                  <div className="font-semibold text-zinc-200">User</div>
                  <div className="text-[10px] text-zinc-500 truncate">
                    user@example.com
                  </div>
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-zinc-800/80 py-4">
            <p className="text-xs text-zinc-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-zinc-200 hover:text-white underline underline-offset-4"
              >
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
