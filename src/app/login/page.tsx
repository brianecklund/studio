
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { LogIn, User, ShieldCheck, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [submittingRole, setSubmittingRole] = useState<'client' | 'admin' | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (values: LoginFormValues, role: 'client' | 'admin') => {
    setSubmittingRole(role);
    form.clearErrors("root.serverError");

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));

    const { email, password } = values;
    let isAuthenticated = false;
    let redirectPath = '';

    if (role === 'client') {
      if (email === 'client@example.com' && password === 'password') {
        isAuthenticated = true;
        redirectPath = '/dashboard';
      }
    } else if (role === 'admin') {
      if (email === 'admin@example.com' && password === 'password') {
        isAuthenticated = true;
        redirectPath = '/admin/dashboard';
      }
    }

    if (isAuthenticated) {
      toast({ title: 'Login Successful!', description: `Redirecting to ${role} dashboard...` });
      router.push(redirectPath);
    } else {
      form.setError("root.serverError", { type: "custom", message: "Invalid email or password for the selected role."});
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password for the selected role.',
        variant: 'destructive',
      });
    }
    setSubmittingRole(null);
  };

  return (
    // Adjusted to flex-grow to fit within the new RootLayout structure
    <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-xl">
        <CardHeader className="text-center p-6 sm:p-8">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4 shadow-md">
            <LogIn className="h-8 w-8" />
          </div>
          <CardTitle className="font-headline text-3xl sm:text-4xl">Welcome Back!</CardTitle>
          <CardDescription className="text-base">
            Please enter your credentials to access your Side Brain portal.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-0">
            <CardContent className="px-6 sm:px-8 pb-4 sm:pb-6 space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="you@example.com" 
                        {...field} 
                        className="text-base h-11"
                      />
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
                    <FormLabel className="text-base">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        className="text-base h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.formState.errors.root?.serverError && (
                <p className="text-sm font-medium text-destructive text-center pt-2">{form.formState.errors.root.serverError.message}</p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3 px-6 sm:px-8 pb-6 sm:pb-8 pt-2">
              <Button
                type="button"
                className="w-full h-11 text-base"
                onClick={form.handleSubmit(data => handleLogin(data, 'client'))}
                disabled={!!submittingRole}
              >
                {submittingRole === 'client' ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <User className="mr-2 h-5 w-5" />
                )}
                Login as Client
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full h-11 text-base"
                onClick={form.handleSubmit(data => handleLogin(data, 'admin'))}
                disabled={!!submittingRole}
              >
                {submittingRole === 'admin' ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <ShieldCheck className="mr-2 h-5 w-5" />
                )}
                Login as Admin
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
