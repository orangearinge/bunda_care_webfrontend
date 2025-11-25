import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLogin } from "@/hooks/useAuthHooks"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { IconInnerShadowTop } from "@tabler/icons-react"
import { loginSchema } from "@/schemas/authSchemas"

export default function LoginPage() {
    const navigate = useNavigate()
    const loginMutation = useLogin()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = (data) => {
        loginMutation.mutate(data, {
            onSuccess: () => {
                navigate("/admin/dashboard")
            },
        })
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-muted via-background to-muted/50 p-4">
            <div className="w-full max-w-md">
                <div className="rounded-xl border border-border bg-card shadow-lg p-8">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center mb-8">
                                <div className="flex size-14 items-center justify-center rounded-lg bg-primary/10 ring-2 ring-primary/20">
                                    <IconInnerShadowTop className="size-7 text-primary" />
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">Bunda Care Admin</h1>
                                <FieldDescription className="text-base text-muted-foreground">
                                    Enter your credentials to access the admin panel
                                </FieldDescription>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@bundacare.com"
                                    {...register("email")}
                                    className="h-11"
                                    disabled={loginMutation.isPending}
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    {...register("password")}
                                    className="h-11"
                                    disabled={loginMutation.isPending}
                                />
                                {errors.password && (
                                    <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
                                )}
                            </Field>

                            <Field>
                                <Button type="submit" className="w-full h-11" disabled={loginMutation.isPending}>
                                    {loginMutation.isPending ? "Logging in..." : "Login"}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </div>
            </div>
        </div>
    )
}
