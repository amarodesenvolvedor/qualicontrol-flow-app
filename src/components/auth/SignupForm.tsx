
import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

interface SignupFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  error: string | null;
  isLoading: boolean;
  connectivityStatus: 'checking' | 'online' | 'offline';
  onSubmit: (e: FormEvent) => Promise<void>;
}

export const SignupForm = ({
  email,
  setEmail,
  password,
  setPassword,
  error,
  isLoading,
  connectivityStatus,
  onSubmit,
}: SignupFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email-signup">Email</Label>
        <Input
          id="email-signup"
          type="email"
          placeholder="seu.email@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading || connectivityStatus === 'offline'}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-signup">Senha</Label>
        <Input
          id="password-signup"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading || connectivityStatus === 'offline'}
          required
        />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || connectivityStatus === 'offline'}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Criando conta...
          </>
        ) : connectivityStatus === 'checking' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verificando conexão...
          </>
        ) : (
          "Criar conta"
        )}
      </Button>
    </form>
  );
};
