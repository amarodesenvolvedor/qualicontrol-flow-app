
import Layout from "@/components/app/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const SettingsPage = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  const handleSavePreferences = () => {
    toast({
      title: "Preferências salvas",
      description: "Suas configurações foram atualizadas com sucesso.",
    });
  };

  const handleSaveCompanySettings = () => {
    toast({
      title: "Informações da empresa salvas",
      description: "Os dados da empresa foram atualizados com sucesso.",
    });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        </div>

        <Tabs defaultValue="preferences">
          <TabsList className="mb-4">
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
            <TabsTrigger value="company">Dados da Empresa</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferências do Usuário</CardTitle>
                <CardDescription>Configure suas preferências pessoais no sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-base font-medium">Notificações</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Notificações por Email</Label>
                      <p className="text-sm text-muted-foreground">Receba alertas sobre não conformidades por email</p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="system-notifications">Notificações no Sistema</Label>
                      <p className="text-sm text-muted-foreground">Receba alertas dentro do sistema</p>
                    </div>
                    <Switch 
                      id="system-notifications" 
                      checked={systemNotifications}
                      onCheckedChange={setSystemNotifications}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-base font-medium">Aparência</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Modo Escuro</Label>
                      <p className="text-sm text-muted-foreground">Ativa o tema escuro na interface</p>
                    </div>
                    <Switch 
                      id="dark-mode" 
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSavePreferences}>Salvar Preferências</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Empresa</CardTitle>
                <CardDescription>Configure as informações da sua organização</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-base font-medium">Informações Básicas</h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Nome da Empresa</Label>
                      <Input id="company-name" defaultValue="InduSafe Ltda." />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company-cnpj">CNPJ</Label>
                      <Input id="company-cnpj" defaultValue="12.345.678/0001-90" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-address">Endereço</Label>
                    <Input id="company-address" defaultValue="Av. Industrial, 1000 - Distrito Industrial" />
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="company-city">Cidade</Label>
                      <Input id="company-city" defaultValue="São Paulo" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company-state">Estado</Label>
                      <Input id="company-state" defaultValue="SP" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company-cep">CEP</Label>
                      <Input id="company-cep" defaultValue="00000-000" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-base font-medium">Contato</h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company-email">Email</Label>
                      <Input id="company-email" type="email" defaultValue="contato@indusafe.com.br" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company-phone">Telefone</Label>
                      <Input id="company-phone" defaultValue="(11) 1234-5678" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveCompanySettings}>Salvar Informações da Empresa</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
                <CardDescription>Administre os usuários do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center">
                  <p className="text-center text-muted-foreground">
                    Para adicionar ou gerenciar usuários, entre em contato com o administrador do sistema.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>Configurações avançadas do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center">
                  <p className="text-center text-muted-foreground">
                    As configurações avançadas do sistema estão disponíveis apenas para administradores.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
