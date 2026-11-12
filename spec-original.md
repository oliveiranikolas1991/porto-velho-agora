# Porto Velho Agora

## 1. Objetivo
O Porto Velho Agora é um portal web colaborativo voltado aos moradores de Porto Velho para centralizar e compartilhar informações sobre o cotidiano da cidade, como feiras livres, buracos nas vias, alagamentos e eventos comunitários. O sistema permite que qualquer visitante consulte as publicações locais sem necessidade de cadastro, enquanto usuários registrados podem autenticar-se e publicar novos avisos de utilidade pública contendo texto e envio opcional de foto. Seu propósito é manter a comunidade informada em tempo real com agilidade e simplicidade, sob o lema: "A cidade acontece. Você fica sabendo."

## 2. Usuários
- Visitante: pode visualizar a lista de avisos recentes no feed, filtrar publicações por categoria ou bairro de Porto Velho e acessar a página de detalhes completos de qualquer aviso, sem necessidade de autenticação.
- Cidadão Colaborador: pode realizar cadastro de conta, efetuar login e logout, cadastrar novos avisos comunitários (com preenchimento de campos textuais e anexo opcional de uma imagem) e visualizar suas próprias publicações no sistema.

## 3. Casos de uso principais
- UC01: Cadastrar novo usuário
- UC02: Autenticar usuário (Login)
- UC03: Encerrar sessão (Logout)
- UC04: Consultar lista de avisos no feed
- UC05: Filtrar avisos por categoria ou bairro
- UC06: Visualizar detalhes completos de um aviso
- UC07: Publicar novo aviso comunitário (com envio opcional de foto)

## 4. Requisitos funcionais
- RF01: O sistema deve permitir o cadastro de novos usuários mediante o fornecimento obrigatório de nome, e-mail único e senha. (Corresponde ao UC01)
- RF02: O sistema deve autenticar o usuário validando e-mail e senha cadastrados, iniciando uma sessão de acesso seguro. (Corresponde ao UC02)
- RF03: O sistema deve permitir que o usuário autenticado encerre sua sessão ativa a qualquer momento. (Corresponde ao UC03)
- RF04: O sistema deve listar na página inicial os avisos cadastrados no banco de dados com status ativo, exibidos em ordem decrescente de publicação (do mais recente para o mais antigo). (Corresponde ao UC04)
- RF05: O sistema deve permitir a filtragem dos avisos listados por categoria (feiras, buracos, chuvas, eventos e outros) ou por bairro de Porto Velho. (Corresponde ao UC05)
- RF06: O sistema deve exibir os detalhes completos de um aviso selecionado, incluindo título, descrição textual, imagem (caso tenha sido anexada), categoria, bairro, data/hora da publicação e nome do autor. (Corresponde ao UC06)
- RF07: O sistema deve permitir que um usuário autenticado cadastre um aviso informando obrigatoriamente título, descrição, categoria e bairro, com a possibilidade de anexar opcionalmente um arquivo de imagem. (Corresponde ao UC07)
- RF08: O sistema deve disponibilizar o aviso recém-cadastrado imediatamente para consulta no feed público com o status inicial 'ativo'. Nota: recursos de denúncia, moderação administrativa e aprovação prévia de publicações são possibilidades previstas para versões futuras e não fazem parte do escopo implementado nesta versão inicial. (Corresponde ao UC07)

## 5. Requisitos não funcionais
- Segurança:
  - Senha nunca em texto puro: as senhas devem ser obrigatoriamente armazenadas no banco de dados com hash criptográfico seguro gerado pela função `password_hash()` do PHP (algoritmo BCRYPT).
  - Validação de todo formulário no servidor: todos os dados enviados via requisição HTTP devem ser rigorosamente validados no backend em PHP (verificação de campos obrigatórios não vazios, integridade do formato de e-mail e validação de upload de imagem rejeitando extensões não permitidas ou arquivos com tamanho superior a 2 MB), não confiando apenas na validação do navegador.
  - Prevenção contra SQL Injection: todas as consultas e operações no banco de dados MySQL/MariaDB devem utilizar instruções preparadas (*Prepared Statements* via PDO).
  - Proteção de credenciais: credenciais e configurações de acesso ao banco de dados não devem ser comitadas no repositório Git, devendo ficar em arquivo de configuração isolado incluído no `.gitignore`.
  - Controle de acesso: o acesso a páginas ou rotas de criação de avisos deve ser bloqueado para usuários não autenticados, exigindo sessão válida ativa.
- Desempenho e Usabilidade:
  - Tempo de resposta e carregamento das páginas locais inferior a 2 segundos sob o servidor Apache do XAMPP.
  - Interface responsiva (*mobile-first*) desenvolvida com HTML5 semântico, CSS3 e JavaScript nativo, aplicando a identidade visual inspirada nas cores da bandeira de Rondônia: Azul (#173E79), Verde (#159447), Branco (#FFFFFF), Cinza-claro (#F0F4F8) e Texto escuro (#253347).

## 6. Modelo de dados (DER simples)

### 6.1 Estrutura das Tabelas

1. **`usuarios`**
   - `id` (INT, Chave Primária, AUTO_INCREMENT): Identificador único do usuário.
   - `nome` (VARCHAR(100), NOT NULL): Nome completo do usuário.
   - `email` (VARCHAR(150), NOT NULL, UNIQUE): E-mail único para autenticação e contato.
   - `senha_hash` (VARCHAR(255), NOT NULL): Hash criptográfico seguro da senha.
   - `criado_em` (DATETIME, DEFAULT CURRENT_TIMESTAMP): Data e hora de criação da conta.

2. **`avisos`**
   - `id` (INT, Chave Primária, AUTO_INCREMENT): Identificador único da publicação.
   - `usuario_id` (INT, NOT NULL, Chave Estrangeira referenciando `usuarios(id)`): Autor da publicação.
   - `titulo` (VARCHAR(120), NOT NULL): Título resumido da ocorrência.
   - `descricao` (TEXT, NOT NULL): Descrição detalhada do aviso.
   - `categoria` (VARCHAR(50), NOT NULL): Categoria do aviso (ex.: Feiras, Buracos, Chuvas, Eventos).
   - `bairro` (VARCHAR(80), NOT NULL): Bairro de Porto Velho onde o fato ocorre.
   - `imagem_url` (VARCHAR(255), NULL): Armazena exclusivamente o caminho relativo do arquivo salvo na pasta do servidor (por exemplo, `uploads/avisos/foto_exemplo.jpg`). O campo permanece nulo quando o usuário opta por publicar sem imagem, evitando armazenar arquivos binários pesados diretamente no banco de dados.
   - `status` (ENUM('ativo', 'pendente', 'removido'), DEFAULT 'ativo'): Define a visibilidade do aviso. Na versão inicial (MVP), todo aviso é registrado com status 'ativo' por padrão e disponibilizado imediatamente no feed público. Os valores 'pendente' e 'removido' existem apenas para manter o modelo de dados preparado para futuras funcionalidades de moderação e análise de denúncias, que não estão implementadas neste momento.
   - `criado_em` (DATETIME, DEFAULT CURRENT_TIMESTAMP): Data e hora da publicação.

### 6.2 Relacionamento
- Cardinalidade 1:N: Um usuário pode cadastrar zero ou múltiplos avisos (`usuarios 1 ----< N avisos`).
- Integridade Referencial: Cada registro na tabela `avisos` está associado a exatamente um usuário existente através da chave estrangeira `usuario_id` vinculada a `usuarios.id`.

```
+--------------------+              +-------------------------------+
|      usuarios      |              |            avisos             |
+--------------------+              +-------------------------------+
| PK id              | 1          N | PK id                         |
|    nome            +--------------< FK usuario_id                 |
|    email (UNIQUE)  |              |    titulo                     |
|    senha_hash      |              |    descricao                  |
|    criado_em       |              |    categoria                  |
+--------------------+              |    bairro                     |
                                    |    imagem_url (NULL)          |
                                    |    status                     |
                                    |    criado_em                  |
                                    +-------------------------------+
```

## 7. Critérios de aceite
- RF01 (Cadastro com sucesso): Dado que um visitante preenche o formulário com nome, e-mail ainda não cadastrado e senha válida, quando submete o cadastro, então o servidor valida os dados, armazena a senha criptografada com hash no banco de dados e redireciona o usuário para a página de login com mensagem de sucesso.
- RF01 (Cadastro - E-mail duplicado): Dado que um visitante tenta se cadastrar utilizando um e-mail que já existe no banco de dados, quando submete o formulário, então o servidor recusa o cadastro, não cria novo registro e exibe uma mensagem de erro informando que o e-mail já está em uso.
- RF01 (Cadastro - Dados inválidos): Dado que um visitante tenta se cadastrar deixando campos obrigatórios em branco ou informando um e-mail com formato inválido, quando submete o formulário, então o servidor barra a requisição e exibe mensagens de validação apontando os campos incorretos.
- RF02 (Login com sucesso): Dado que um usuário cadastrado preenche seu e-mail e senha corretos, quando submete o formulário de login, então o servidor valida as credenciais contra o hash gravado, inicia uma sessão PHP segura e redireciona o usuário para a página inicial com status de autenticado.
- RF02 (Login - Credenciais inválidas): Dado que o usuário informa um e-mail não cadastrado ou uma senha incorreta, quando tenta fazer login, então o servidor nega o acesso, não inicializa a sessão e apresenta uma mensagem clara de credenciais inválidas.
- RF03 (Logout): Dado que um usuário possui sessão autenticada ativa, quando clica no botão de sair/logout, então o servidor invalida e destrói a sessão, retornando o usuário à condição de visitante não autenticado.
- RF04 (Listagem de avisos): Dado que existem avisos com status 'ativo' no banco de dados, quando qualquer usuário acessa a página inicial, então os avisos ativos são recuperados via consulta preparada e renderizados do mais recente para o mais antigo.
- RF05 (Filtragem): Dado que a lista de avisos está sendo exibida, quando o visitante ou colaborador seleciona uma categoria ou bairro no filtro, então a visualização é atualizada exibindo unicamente as publicações correspondentes aos filtros aplicados.
- RF06 (Detalhes do aviso): Dado que um usuário seleciona um aviso no feed, quando a página do aviso é aberta, então o sistema exibe título, texto descritivo completo, categoria, bairro, data/hora, nome do autor e a imagem (ou uma apresentação visual padrão caso nenhuma imagem tenha sido anexada).
- RF07 e RF08 (Publicação com foto): Dado que um usuário autenticado preenche título, descrição, categoria, bairro e anexa um arquivo de imagem válido (JPEG/PNG/WEBP de até 2 MB), quando submete o formulário, então o servidor valida os campos e a imagem, salva o arquivo na pasta de uploads do servidor, grava o registro no banco com o caminho relativo correspondente e status 'ativo', disponibilizando o aviso imediatamente no feed público.
- RF07 e RF08 (Publicação sem imagem - Opcional): Dado que um usuário autenticado preenche todos os campos obrigatórios (título, descrição, categoria e bairro) sem anexar nenhum arquivo de imagem, quando submete o formulário, então o servidor valida os dados com sucesso, grava o registro com `imagem_url` nulo e status 'ativo', disponibilizando o aviso imediatamente para consulta no feed público.
- RF07 (Publicação - Arquivo de imagem inválido): Dado que um usuário autenticado tenta publicar um aviso anexando um arquivo não suportado (ex.: PDF ou executável) ou com tamanho superior a 2 MB, quando envia o formulário, então o servidor recusa o arquivo, impede a inserção do registro no banco e exibe uma mensagem de erro indicando as restrições de formato e tamanho.
- RF07 (Publicação - Campos obrigatórios incompletos): Dado que um usuário autenticado deixa de preencher qualquer um dos campos textuais obrigatórios (título, descrição, categoria ou bairro), quando tenta enviar o formulário, então o servidor bloqueia o cadastro e avisa quais campos devem ser preenchidos.

## 8. Decisão de stack e deploy
- Frontend: HTML5 semântico, CSS3 e JavaScript nativo para validações auxiliares no navegador e enriquecimento visual da interface.
- Backend: PHP 8.x nativo (sem frameworks pesados), utilizando a extensão PDO com *Prepared Statements* para consultas seguras ao banco de dados e gerenciamento de sessões nativas (`$_SESSION`).
- Banco de Dados: MySQL 8.x / MariaDB, administrado e modelado localmente com phpMyAdmin e MySQL Workbench.
- Ambiente Local: XAMPP (servidor web Apache e banco de dados MySQL/MariaDB).
- Versionamento: Git e repositório hospedado no GitHub para controle de versões e histórico de alterações.
- Justificativa de Hospedagem e Deploy:
  Conforme orientado na apostila da disciplina (Fase 6), a plataforma Vercel foi descartada para a hospedagem do backend deste projeto por não possuir suporte nativo para a execução de servidores PHP tradicionais.
  O desenvolvimento e os testes iniciais serão conduzidos inteiramente no ambiente local com XAMPP. A hospedagem web definitiva para a aplicação ainda não foi escolhida e será definida posteriormente.
  O sistema exigirá um provedor compatível com a stack LAMP (Linux, Apache, MySQL/MariaDB, PHP). Provedores compatíveis atualmente em análise incluem opções gratuitas para projetos acadêmicos (como InfinityFree e Alwaysdata) e opções pagas compartilhadas (como Hostinger).
  Configurações que deverão ser confirmadas e realizadas quando o provedor for selecionado:
  1. Criação do banco de dados MySQL/MariaDB no painel da hospedagem e execução do script de criação das tabelas (`schema.sql`).
  2. Definição segura das credenciais de conexão em arquivo de configuração separado do código versionado no GitHub.
  3. Configuração de permissões de escrita adequadas (como chmod 755 ou 775) no diretório de uploads do servidor (`uploads/avisos/`).
  4. Confirmação prévia com o professor quanto à necessidade de entrega com link público em funcionamento na data da avaliação ou se a validação poderá ocorrer em ambiente de apresentação local (XAMPP).
