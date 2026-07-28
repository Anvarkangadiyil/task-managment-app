import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail, Lock, Shield, Eye, EyeOff, Loader2, AlertCircle, CheckSquare, ArrowRight } from "lucide-react";

export const RegisterPage = () => {
  const { register: registerAuth, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    clearError();
    try {
      await registerAuth(data.name.trim(), data.email.trim(), data.password, data.role);
      navigate("/dashboard");
    } catch (err: any) {
      setServerError(err.message || "Failed to create account. Please try again.");
    }
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
            Create a new account to get started
          </p>
        </div>

        {/* Register Card */}
        <Card className="border border-zinc-800 bg-zinc-900/90 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-zinc-100">Create Account</CardTitle>
            <CardDescription className="text-zinc-400">
              Enter your details to set up your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {activeError && (
              <Alert variant="destructive" className="bg-red-950/40 border-red-900 text-red-200">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-xs font-medium ml-2">
                  {activeError}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-9 bg-zinc-950 border-zinc-800 focus-visible:ring-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                    error={!!errors.name}
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-400 font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>

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
                <Label htmlFor="password">Password</Label>
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-10 bg-zinc-950 border-zinc-800 focus-visible:ring-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                    error={!!errors.confirmPassword}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400 font-medium">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 z-10 pointer-events-none" />
                  <Select
                    id="role"
                    className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-100"
                    error={!!errors.role}
                    {...register("role")}
                  >
                    <option value="user">User (Standard Access)</option>
                    <option value="admin">Admin (Full Access)</option>
                  </Select>
                </div>
                {errors.role && (
                  <p className="text-xs text-red-400 font-medium">
                    {errors.role.message}
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-zinc-800/80 py-4">
            <p className="text-xs text-zinc-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-zinc-200 hover:text-white underline underline-offset-4"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
