
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserPreferences } from "@/types/settings";
import { Loader2 } from "lucide-react";

interface UserPreferencesFormProps {
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => Promise<{ success: boolean; error?: any }>;
  isSaving: boolean;
}

export const UserPreferencesForm = ({ preferences, onSave, isSaving }: UserPreferencesFormProps) => {
  const [formData, setFormData] = useState<UserPreferences>(preferences);

  const handleSwitchChange = (id: keyof UserPreferences, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências do Usuário</CardTitle>
        <CardDescription>Configure suas preferências pessoais no sistema</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-medium">Notificações</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailnotifications">Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">Receba alertas sobre não conformidades por email</p>
              </div>
              <Switch 
                id="emailnotifications" 
                checked={formData.emailnotifications}
                onCheckedChange={(checked) => handleSwitchChange('emailnotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="systemnotifications">Notificações no Sistema</Label>
                <p className="text-sm text-muted-foreground">Receba alertas dentro do sistema</p>
              </div>
              <Switch 
                id="systemnotifications" 
                checked={formData.systemnotifications}
                onCheckedChange={(checked) => handleSwitchChange('systemnotifications', checked)}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-base font-medium">Aparência</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="darkmode">Modo Escuro</Label>
                <p className="text-sm text-muted-foreground">Ativa o tema escuro na interface</p>
              </div>
              <Switch 
                id="darkmode" 
                checked={formData.darkmode}
                onCheckedChange={(checked) => handleSwitchChange('darkmode', checked)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Preferências"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
