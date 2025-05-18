
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CompanySettings } from "@/types/settings";
import { FormActions } from "@/components/shared/FormActions";
import { Loader2 } from "lucide-react";

interface CompanySettingsFormProps {
  settings: CompanySettings;
  onSave: (settings: CompanySettings) => Promise<{ success: boolean; error?: any }>;
  isSaving: boolean;
}

export const CompanySettingsForm = ({ settings, onSave, isSaving }: CompanySettingsFormProps) => {
  const [formData, setFormData] = useState<CompanySettings>(settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('company-', '')]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados da Empresa</CardTitle>
        <CardDescription>Configure as informações da sua organização</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-medium">Informações Básicas</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company-companyname">Nome da Empresa</Label>
                <Input 
                  id="company-companyname" 
                  value={formData.companyname} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-cnpj">CNPJ</Label>
                <Input 
                  id="company-cnpj" 
                  value={formData.cnpj} 
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-address">Endereço</Label>
              <Input 
                id="company-address" 
                value={formData.address} 
                onChange={handleChange}
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="company-city">Cidade</Label>
                <Input 
                  id="company-city" 
                  value={formData.city} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-state">Estado</Label>
                <Input 
                  id="company-state" 
                  value={formData.state} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-cep">CEP</Label>
                <Input 
                  id="company-cep" 
                  value={formData.cep} 
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-base font-medium">Contato</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company-email">Email</Label>
                <Input 
                  id="company-email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-phone">Telefone</Label>
                <Input 
                  id="company-phone" 
                  value={formData.phone} 
                  onChange={handleChange}
                />
              </div>
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
              "Salvar Informações da Empresa"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
