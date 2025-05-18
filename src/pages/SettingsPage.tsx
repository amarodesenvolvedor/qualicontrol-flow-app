
import Layout from "@/components/app/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CompanySettingsForm } from "@/components/settings/CompanySettingsForm";
import { UserPreferencesForm } from "@/components/settings/UserPreferencesForm";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("preferences");
  const { 
    companySettings,
    saveCompanySettings,
    isLoading: isLoadingCompany,
    isSaving: isSavingCompany
  } = useCompanySettings();
  
  const { 
    preferences,
    saveUserPreferences,
    isLoading: isLoadingPreferences,
    isSaving: isSavingPreferences
  } = useUserPreferences();
  
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        </div>

        <Tabs 
          defaultValue="preferences" 
          value={activeTab} 
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
            <TabsTrigger value="company">Dados da Empresa</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preferences">
            {isLoadingPreferences ? (
              <Card>
                <CardHeader>
                  <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
                  <CardDescription><Skeleton className="h-4 w-64" /></CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-5 w-32" />
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-3 w-64" />
                        </div>
                        <Skeleton className="h-6 w-12 rounded-full" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <UserPreferencesForm 
                preferences={preferences}
                onSave={saveUserPreferences}
                isSaving={isSavingPreferences}
              />
            )}
          </TabsContent>
          
          <TabsContent value="company">
            {isLoadingCompany ? (
              <Card>
                <CardHeader>
                  <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
                  <CardDescription><Skeleton className="h-4 w-64" /></CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-5 w-32" />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <CompanySettingsForm 
                settings={companySettings}
                onSave={saveCompanySettings}
                isSaving={isSavingCompany}
              />
            )}
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
