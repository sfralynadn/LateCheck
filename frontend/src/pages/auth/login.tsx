import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input, PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Token } from "@/types/token";

type Fields = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const queryClient = useQueryClient();
  const form = useForm<Fields>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: signIn, isPending } = useMutation({
    mutationFn: async (data: Fields) => {
      try {
        const res = await api.post("/auth/login", data);
        if (res.status == 200) return res.data.data;
      } catch (err: any) {
        if (err instanceof AxiosError && err.response && err.response.data) {
          throw new Error(err.response.data.message);
        }
        throw new Error(err.message);
      }
    },
    onSuccess: (data: Token) => {
      localStorage.setItem("accessToken", data.access_token);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="w-full flex max-lg:items-center max-lg:justify-center lg:grid  lg:grid-cols-2 min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[340px] md:w-[23rem] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign In</h1>
            <p className="text-muted-foreground text-balance pb-2">
              Enter your credentials below to login to your account
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(signIn as any)}
              className="grid gap-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                    />
                  </div>
                )}
              />
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => <PasswordInput {...field} />}
                />
              </div>
              <Button
                disabled={isPending}
                type="submit"
                className="w-full mt-1 disabled:bg-muted-foreground"
              >
                {isPending ? "Loading.." : "Sign In"}
              </Button>
            </form>
          </Form>
          <Link to="#" className="ml-auto inline-block text-sm underline">
            Forgot your password?
          </Link>
        </div>
      </div>
      <div className="hidden bg-zinc-900 lg:block"></div>
    </div>
  );
}
