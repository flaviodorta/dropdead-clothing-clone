yarn add --dev typescript
./node_modules/.bin/tsc
./node_modules/.bin/tsc --init
yarn add --dev nodemon
yarn add --dev ts-node
yarn add --dev prettier
yarn add --dev eslint
npx eslint --init
yarn add --dev jasmine
npx jasmine init
yarn add --dev supertest

docker start postgres

typeorm migration:create ./src/migrations/CreateMigration
