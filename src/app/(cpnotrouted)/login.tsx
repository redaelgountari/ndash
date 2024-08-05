"use client";
import "../globals.css";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Updated import

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Define the schema using zod with English validation messages
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const router = useRouter(); // useRouter from next/navigation
  const [logInError, setLogInError] = React.useState<string | null>(null);

  // Set up the form with react-hook-form and zod resolver
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  // Function to handle form submission
  const onSubmit = async (data) => {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      console.log("SignIn Response:", res); // Log the signIn response

      if (res.error) {
        setLogInError(res.error);
        return;
      }

      // Fetch the session after a successful sign-in
      const session = await getSession();
      console.log("Session Object:", session);

      // Assuming you have access to the user's type after login
      const userType = session?.user?.type;
      console.log("User Type:", userType); // Check userType in console

      switch (userType) {
        case 'seller':
          console.log("Redirecting to seller dashboard");
          router.push("/seller/dashboard");
          break;
        case 'client':
          console.log("Redirecting to client dashboard");
          router.push("/client/dashboard");
          break;
        case 'admin':
          console.log("Redirecting to admin dashboard");
          router.push("/admin/dashboard");
          break;
        default:
          console.log("Unknown user type:", userType);
          // Handle any other cases or unexpected types
          break;
      }
    } catch (e) {
      console.log(e);
      // Handle error
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.email?.message}</FormMessage>
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
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.password?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormMessage>{logInError}</FormMessage>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button type="button" className="w-full bg-white border-black text-black">
                Connect with google 
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/register">New here? Register</Link>
        </CardFooter>
      </Card>
    </div>
  );
}