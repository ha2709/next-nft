`truffle migrate --reset --compile-all --network development`

migrate

## Goerli : `0x87bca5b2599ad04f56d7542c97b078fe898517a7`

`npm install --force`

To run back end, in local, you need to start postgresql and check in the .env file for credential 
 You need to open main.go. Then uncomment from line 36 to 44, and comment line 46

```
cd mb-be
sudo systemctl status postgresql.service
go run main.go
```

Please use node version 18 to run Front end

```
cd mb-fe
nvm use 18
npm start
```

To run Blockchain local:

`npm i ganache-cli`

Then to start Ganche :

`ganache-cli i 1337`

To interact with Contract on FrontEnd, copy Private Keys Front Ganache-cli and import it to MetaMask. 

Then deploy contract to local: 

`truffle migrate --reset --compile-all --network development`

Then go to browser at : 

`http://localhost:3000/`

To run application, in the project folder, run 

`docker-compose up --build`

It is not a best practice to include both Front End and Backend in the same docker-compose. Because it is expensive if we need to scale using Docker, it will start both Front End and Backend, in some cases, may be Front end have high request than Backend. In production, we should seperate Backend and Front End deployment. 

To run test, in Project folder ; 

`truffle test`

`git rm -r --cached node_modules`