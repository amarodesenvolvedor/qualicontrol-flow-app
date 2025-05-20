import { Layout } from "@/components/app/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
export default function HelpPage() {
  return <Layout>
      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold mb-6">Ajuda e Tutoriais - IntegraQMS</h1>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="tutorials">Tutoriais</TabsTrigger>
            <TabsTrigger value="faq">Perguntas Frequentes</TabsTrigger>
            <TabsTrigger value="glossary">Glossário</TabsTrigger>
            <TabsTrigger value="support">Suporte</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Sobre o IntegraQMS</CardTitle>
                <CardDescription>Sistema de Gestão da Qualidade Integrado</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    <section>
                      <h3 className="text-lg font-medium">O que é o IntegraQMS?</h3>
                      <p className="mt-2 text-muted-foreground">
                        O IntegraQMS é um sistema integrado de gestão da qualidade desenvolvido para atender às necessidades de empresas 
                        que necessitam de controle eficiente de não conformidades, auditorias e processos de qualidade. O sistema oferece 
                        uma plataforma completa para registro, acompanhamento, análise e relatórios relacionados à gestão da qualidade.
                      </p>
                    </section>

                    <section className="mt-4">
                      <h3 className="text-lg font-medium">Principais Módulos</h3>
                      <div className="mt-2 grid gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Dashboard</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Visão geral com indicadores de desempenho (KPIs), gráficos e alertas 
                              sobre não conformidades pendentes, atrasadas ou que necessitam de atenção.
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Não Conformidades</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Gerenciamento completo de não conformidades, desde o registro até 
                              a conclusão, com acompanhamento de prazos e responsáveis.
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Auditorias</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Planejamento, execução e relatórios de auditorias internas e externas, 
                              com gestão de cronogramas e checklists.
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Relatórios</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Geração de relatórios personalizados para análise de dados e 
                              tomada de decisão baseada em informações concretas.
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Estatísticas</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Visualização gráfica de tendências, comparativos e análises 
                              estatísticas para monitoramento do sistema de qualidade.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </section>

                    <section className="mt-4">
                      <h3 className="text-lg font-medium">Benefícios</h3>
                      <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                        <li>Centralização das informações de qualidade em um único sistema</li>
                        <li>Rastreabilidade completa de não conformidades e ações corretivas</li>
                        <li>Alertas automáticos para prazos e pendências</li>
                        <li>Análise de tendências para melhoria contínua</li>
                        <li>Interface intuitiva e responsiva para acesso em qualquer dispositivo</li>
                        <li>Exportação de dados em diversos formatos para relatórios externos</li>
                      </ul>
                    </section>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tutoriais */}
          <TabsContent value="tutorials">
            <Card>
              <CardHeader>
                <CardTitle>Tutoriais Passo a Passo</CardTitle>
                <CardDescription>Aprenda a utilizar as principais funcionalidades do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="nc-register">
                      <AccordionTrigger>Como registrar uma não conformidade</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-muted-foreground">O registro de uma não conformidade segue os seguintes passos:</p>
                          <ol className="list-decimal pl-5 text-muted-foreground">
                            <li>Acesse o menu "Não Conformidades" na barra lateral</li>
                            <li>Clique no botão "Nova Não Conformidade" no canto superior direito</li>
                            <li>Preencha os dados básicos da não conformidade (título, descrição, data da ocorrência)</li>
                            <li>Selecione a categoria e subcategoria apropriadas</li>
                            <li>Adicione evidências, como fotos ou documentos relacionados</li>
                            <li>Defina as ações corretivas necessárias e os responsáveis</li>
                            <li>Estabeleça os prazos para resposta e conclusão</li>
                            <li>Revise todas as informações e clique em "Salvar"</li>
                          </ol>
                          <p className="text-sm text-muted-foreground mt-2">
                            <strong>Dica:</strong> Utilize descrições claras e objetivas para facilitar o entendimento da não conformidade por todos os envolvidos.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="audit-management">
                      <AccordionTrigger>Como gerenciar auditorias</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-muted-foreground">Para gerenciar auditorias no sistema:</p>
                          <ol className="list-decimal pl-5 text-muted-foreground">
                            <li>Acesse o menu "Auditorias" na barra lateral</li>
                            <li>Para criar uma nova auditoria, clique em "Nova Auditoria"</li>
                            <li>Defina o tipo de auditoria (interna/externa)</li>
                            <li>Estabeleça o escopo e os departamentos envolvidos</li>
                            <li>Agende a data e horário da auditoria</li>
                            <li>Atribua auditores e responsáveis</li>
                            <li>Após a auditoria, registre as constatações e não conformidades identificadas</li>
                            <li>Gere o relatório final com as conclusões e recomendações</li>
                          </ol>
                          <p className="text-sm text-muted-foreground mt-2">
                            <strong>Dica:</strong> Utilize a visão de calendário para melhor planejamento e visualização das auditorias programadas.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="reports">
                      <AccordionTrigger>Como gerar relatórios personalizados</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-muted-foreground">Para criar relatórios personalizados:</p>
                          <ol className="list-decimal pl-5 text-muted-foreground">
                            <li>Acesse o menu "Relatórios" na barra lateral</li>
                            <li>Selecione a aba "Relatórios Personalizados"</li>
                            <li>Clique em "Novo Relatório"</li>
                            <li>Escolha o tipo de dados que deseja incluir no relatório</li>
                            <li>Configure os filtros desejados (data, departamento, status, etc.)</li>
                            <li>Selecione o tipo de visualização (tabela, gráfico)</li>
                            <li>Defina o agrupamento e ordenação dos dados</li>
                            <li>Clique em "Gerar Relatório"</li>
                            <li>Exporte o relatório para o formato desejado (PDF, Excel)</li>
                          </ol>
                          <p className="text-sm text-muted-foreground mt-2">
                            <strong>Dica:</strong> Salve as configurações de relatórios frequentemente utilizados para agilizar futuras consultas.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="statistics">
                      <AccordionTrigger>Como analisar estatísticas</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-muted-foreground">Para analisar dados estatísticos:</p>
                          <ol className="list-decimal pl-5 text-muted-foreground">
                            <li>Acesse o menu "Estatísticas" na barra lateral</li>
                            <li>Escolha entre as diferentes abas disponíveis (Visão Geral, Tendências, Comparativos)</li>
                            <li>Defina o período de análise nos filtros de data</li>
                            <li>Selecione os indicadores que deseja visualizar</li>
                            <li>Utilize os diferentes tipos de gráficos para melhor visualização dos dados</li>
                            <li>Passe o mouse sobre os elementos gráficos para ver detalhes adicionais</li>
                            <li>Exporte os gráficos ou dados para uso em apresentações</li>
                          </ol>
                          <p className="text-sm text-muted-foreground mt-2">
                            <strong>Dica:</strong> Compare diferentes períodos para identificar tendências e padrões nos dados de qualidade.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="dashboard">
                      <AccordionTrigger>Como utilizar o dashboard</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-muted-foreground">O dashboard oferece uma visão consolidada do sistema:</p>
                          <ol className="list-decimal pl-5 text-muted-foreground">
                            <li>Acesse a página inicial do sistema (Dashboard)</li>
                            <li>Visualize os cartões de KPI com indicadores chave</li>
                            <li>Analise os gráficos de tendências de não conformidades</li>
                            <li>Verifique a lista de itens recentes ou pendentes</li>
                            <li>Utilize os filtros de data para ajustar o período de análise</li>
                            <li>Clique nos itens para acessar detalhes específicos</li>
                          </ol>
                          <p className="text-sm text-muted-foreground mt-2">
                            <strong>Dica:</strong> Configure seu dashboard favorito como página inicial para ter acesso rápido às informações mais relevantes.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
                <CardDescription>Respostas para dúvidas comuns sobre o sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Como recuperar minha senha?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">
                          Na página de login, clique em "Esqueceu sua senha?" e siga as instruções enviadas para seu e-mail cadastrado.
                          Se persistir o problema, entre em contato com o administrador do sistema.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger>Como editar uma não conformidade já registrada?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">
                          Acesse a lista de não conformidades, encontre o item desejado e clique no botão de edição (ícone de lápis) 
                          ou acesse a página de detalhes e clique no botão "Editar". Note que algumas informações podem ter restrições 
                          de edição dependendo do status atual da não conformidade e de seu nível de permissão no sistema.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger>É possível exportar todos os dados para Excel?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">
                          Sim, acesse o menu "Exportar Dados" na seção de Estatísticas. Lá você encontrará opções para exportar 
                          dados de não conformidades, auditorias e outros registros em diversos formatos, incluindo Excel (XLSX) 
                          e CSV. É possível aplicar filtros antes da exportação para obter apenas os dados desejados.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-left">Como acompanhar apenas as não conformidades do meu departamento?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">
                          Na página de Não Conformidades, utilize os filtros disponíveis no topo da página. Selecione seu departamento 
                          no filtro correspondente. Você também pode salvar essa configuração de filtro para acessá-la rapidamente em futuras consultas.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger>O sistema envia notificações automáticas?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">
                          Sim, o sistema envia notificações automáticas para diversos eventos, como novas não conformidades, prazos próximos do vencimento, 
                          auditorias programadas, entre outros. As notificações são enviadas por e-mail e também aparecem no ícone de sino na interface do sistema.
                          Você pode configurar quais notificações deseja receber nas configurações do seu perfil.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                      <AccordionTrigger>Como adicionar um novo usuário ao sistema?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">
                          A inclusão de novos usuários é uma função administrativa. Se você possui permissões de administrador, 
                          acesse o menu "Configurações" e selecione a opção "Usuários". Lá você poderá adicionar novos usuários, 
                          definir suas permissões e associá-los aos departamentos correspondentes.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Glossário */}
          <TabsContent value="glossary">
            <Card>
              <CardHeader>
                <CardTitle>Glossário</CardTitle>
                <CardDescription>Termos e definições utilizados no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Não Conformidade (NC)</h3>
                      <p className="mt-1 text-muted-foreground">
                        Qualquer desvio em relação a um requisito especificado, seja ele de normas, procedimentos internos, 
                        legislação ou especificações de clientes.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Ação Corretiva</h3>
                      <p className="mt-1 text-muted-foreground">
                        Medida implementada para eliminar a causa raiz de uma não conformidade identificada, 
                        evitando sua recorrência.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Ação Preventiva</h3>
                      <p className="mt-1 text-muted-foreground">
                        Medida implementada para eliminar a causa potencial de uma não conformidade ainda não identificada, 
                        prevenindo sua ocorrência.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Auditoria</h3>
                      <p className="mt-1 text-muted-foreground">
                        Processo sistemático, documentado e independente para obter evidências e avaliá-las objetivamente, 
                        determinando a extensão na qual os critérios de auditoria são atendidos.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Causa Raiz</h3>
                      <p className="mt-1 text-muted-foreground">
                        Fator original que contribui para a ocorrência de uma não conformidade, cuja eliminação 
                        impede a recorrência do problema.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Data de Ocorrência</h3>
                      <p className="mt-1 text-muted-foreground">
                        Data em que a não conformidade foi identificada ou ocorreu.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Data de Resposta</h3>
                      <p className="mt-1 text-muted-foreground">
                        Prazo estabelecido para que os responsáveis apresentem uma resposta ou plano de ação 
                        para tratamento da não conformidade.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">KPI (Key Performance Indicator)</h3>
                      <p className="mt-1 text-muted-foreground">
                        Indicador-chave de desempenho utilizado para medir e acompanhar o progresso 
                        em relação aos objetivos estabelecidos.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Status Pendente</h3>
                      <p className="mt-1 text-muted-foreground">
                        Indica que a não conformidade foi registrada, mas ainda não teve seu tratamento iniciado.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Status Em Progresso</h3>
                      <p className="mt-1 text-muted-foreground">
                        Indica que o tratamento da não conformidade está em andamento, com ações sendo implementadas.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Status Concluído</h3>
                      <p className="mt-1 text-muted-foreground">
                        Indica que todas as ações relacionadas à não conformidade foram implementadas 
                        e verificadas, finalizando o ciclo de tratamento.
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suporte */}
          <TabsContent value="support">
            <Card>
              <CardHeader>
                <CardTitle>Suporte</CardTitle>
                <CardDescription>Como obter ajuda adicional</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <section>
                    <h3 className="text-lg font-medium">Suporte Técnico</h3>
                    <p className="mt-1 text-muted-foreground">
                      Para problemas técnicos relacionados ao funcionamento do sistema, entre em contato com nossa equipe de suporte:
                    </p>
                    <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                      <li>E-mail: suporte@integraqms.com</li>
                      <li>
                    </li>
                      <li>Horário de atendimento: Segunda a sexta, das 8h às 18h</li>
                    </ul>
                  </section>

                  <section className="mt-4">
                    <h3 className="text-lg font-medium">Recursos Adicionais</h3>
                    <div className="mt-2 grid gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Base de Conhecimento</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Acesse nossa base de conhecimento online com artigos detalhados, 
                            tutoriais em vídeo e soluções para problemas comuns.
                          </p>
                          <a href="#" className="text-sm text-primary mt-2 inline-block">Acessar Base de Conhecimento</a>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Treinamentos</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Confira nossa agenda de treinamentos online e presenciais 
                            para aprofundar seus conhecimentos no IntegraQMS.
                          </p>
                          <a href="#" className="text-sm text-primary mt-2 inline-block">Ver Calendário de Treinamentos</a>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Comunidade</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Participe do fórum da comunidade IntegraQMS para trocar experiências, 
                            dicas e soluções com outros usuários do sistema.
                          </p>
                          <a href="#" className="text-sm text-primary mt-2 inline-block">Acessar Comunidade</a>
                        </CardContent>
                      </Card>
                    </div>
                  </section>

                  <section className="mt-4">
                    <h3 className="text-lg font-medium">Feedback</h3>
                    <p className="mt-1 text-muted-foreground">
                      Sua opinião é muito importante para melhorarmos continuamente o IntegraQMS. 
                      Envie sugestões, críticas ou elogios para:
                    </p>
                    <p className="mt-2 text-primary">feedback@integraqms.com</p>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>;
}