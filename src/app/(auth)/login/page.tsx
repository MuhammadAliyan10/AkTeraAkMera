"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, UserCircle, Mail, Phone, Lock } from "lucide-react";

const usernameSchema = z.object({
  identifier: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const emailSchema = z.object({
  identifier: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const phoneSchema = z.object({
  identifier: z.string().regex(/^(\+92|92|0)(3\d{9})$/, {
    message: "Please enter a valid Pakistani phone number",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type LoginFormValues = z.infer<typeof usernameSchema>;

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState("username");

  const getSchema = () => {
    switch (loginMethod) {
      case "email":
        return emailSchema;
      case "phone":
        return phoneSchema;
      default:
        return usernameSchema;
    }
  };

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  function onSubmit(data: LoginFormValues) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log({ loginMethod, ...data });
      setIsLoading(false);
      // Redirect to dashboard or home after successful login
      router.push("/dashboard");
    }, 1500);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    exit: { y: -20, opacity: 0 },
  };

  const getLoginLabel = () => {
    switch (loginMethod) {
      case "email":
        return "Email";
      case "phone":
        return "Phone Number";
      default:
        return "Username";
    }
  };

  const getLoginPlaceholder = () => {
    switch (loginMethod) {
      case "email":
        return "you@example.com";
      case "phone":
        return "+923XXXXXXXXX";
      default:
        return "yourusername";
    }
  };

  const getLoginIcon = () => {
    switch (loginMethod) {
      case "email":
        return <Mail className="h-4 w-4 text-muted-foreground" />;
      case "phone":
        return <Phone className="h-4 w-4 text-muted-foreground" />;
      default:
        return <UserCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleTabChange = (value: string) => {
    form.reset({ identifier: "", password: "" });
    setLoginMethod(value);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 transition-all duration-300">
      <div className="absolute top-4 right-4 z-10">
        {/* <ThemeToggle /> */}
        <h2>Hello</h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-md"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-none shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-950/90">
            <CardHeader className="space-y-2">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="mx-auto overflow-hidden relative w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"
              >
                <span className="text-white font-bold text-xl">AkTM</span>
                <div className="absolute inset-0 bg-white dark:bg-gray-950 mix-blend-overlay opacity-10"></div>
              </motion.div>

              <CardTitle className="text-2xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                AkTeraAkMera
              </CardTitle>
              <CardDescription className="text-center">
                Welcome back! Log in to your account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Tabs
                defaultValue="username"
                className="w-full"
                onValueChange={handleTabChange}
              >
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="username">Username</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={loginMethod}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name="identifier"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{getLoginLabel()}</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <div className="absolute left-3 top-3">
                                    {getLoginIcon()}
                                  </div>
                                  <Input
                                    className="pl-10"
                                    placeholder={getLoginPlaceholder()}
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <div className="absolute left-3 top-3">
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <Input
                                    className="pl-10"
                                    type="password"
                                    placeholder="••••••••"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end">
                          <Link
                            href="/reset-password"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <Button
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center"
                            >
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Logging in...
                            </motion.div>
                          ) : (
                            "Login"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-gray-100 dark:border-gray-800 pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Create account
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
