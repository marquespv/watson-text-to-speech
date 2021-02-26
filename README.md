# last_challenge2

Projeto utilizando node.js, Ajax, Mysql e Watson Text-to-Speech.

Mensagem digitada no formulário é repassada ao painel lateral, onde pode ser lida através do Watson text-to-speech ao ser clicado botão "Ouvir";

Para ser executado:

- Necessário mysql 5.7.32 instalado na maquina (definir senha 'admin' para usuario root); 
- Necessário node v12.16.1 instalado na maquina;

- Clonar repositorio e executar "npm install".
- Acessar diretorio scripts do projeto e rodar os comandos para criacao de banco e tabela: 

        node create_db.js

        node create_tabledb.js

- Executar : node index.js

- Abrir navegador no endereço:
        http://localhost:3000

        