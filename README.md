## Requisitos

- Docker 20.10.7, build f0df350 https://www.docker.com/get-started

- Docker compose 1.29.2, build 5becea4c

- Node JS v15.3.0 - https://nodejs.org/en/download/

- PostgreSQL 13.3 (usada no docker-compose)

---

## Postgres

- caso queira trocar os dados de acesso ao Postres é só trocar no arquivo ".env" dentro da pasta postgres antes de inicializar o banco e consequentemente trocar a configuração da api no "ormconfig.json".

- abra a pasta postgres e dê docker-compose up -d.

</br>
</br>

## Api

abra a pasta backend e digite os comandos seguindo os passos abaixo.

</br>

### Ambiente de desenvolvimento:

</br>

- "npm i" para instalar os pacotes necessários

- "npm run schema-sync" ou "npm run migration:run" para criar o modelo de dados user no postgres.

- "npm run dev" para rodar a api em modo de desenvolvimento.

</br>

comandos para manipulação de migrations e eslint estão no package.json em "scripts", digite "npm run nome_do_script", para rodar.

</br>

### Build:

</br>

- npm run build na pasta backend

- copie os arquivos "package.json", "ormconfig.json", "pm2config.json" e a pasta "docs" para a pasta dist.

- abra a pasta dist no terminal com "cd dist" e dê um "npm start".

</br>

comandos para manipulação do PM2 estão no package.json em "scripts", digite "npm stop" ou "npm restart", para rodar.

</br>

### Documentação e Consumo

</br>

- para consumir da aplicação utilize Insomnia (https://insomnia.rest/download) ou Postman(https://www.postman.com/downloads/).
