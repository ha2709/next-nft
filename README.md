# Project Deployment

To deploy the project, follow the steps outlined below:

## Migrate Contracts

`truffle migrate --reset --compile-all --network development`

migrate

### Goerli Contract Address : `0x87bca5b2599ad04f56d7542c97b078fe898517a7`

## Back End Setup

`npm install --force`

To run the back end locally, ensure that Postgresql is running, and verify the credentials in the .env file. Open main.go, uncomment lines 36 to 44, and comment out line 46. Then execute the following commands:

```
cd mb-be
sudo systemctl status postgresql.service
go run cmd/main.go
```
## Front End Setup

Make sure to use Node version 18 for the front end. Execute the following commands:

```
cd mb-fe
nvm use 18
npm start
```

## Local Blockchain Interaction

To interact with the local blockchain, install Ganache CLI using:

`npm i ganache-cli`

Start Ganache using:

`ganache-cli i 1337`

To interact with Contract on FrontEnd, copy Private Keys Front Ganache-cli and import it to MetaMask. 

## Local Deployment

After deploying the contract locally, navigate to:

`http://localhost:3000/`

## Docker Deployment

To run the application using Docker, execute the following command in the project folder:

`docker-compose up --build`

Note: It is not recommended to include both the Front End and Backend in the same Docker-compose, as this could lead to scalability issues. It is advisable to separate the Backend and Front End deployment in production. 

## Testing

To run tests, execute the following command in the project folder:

`truffle test`

`git rm -r --cached node_modules`

## Troubleshooting
If encountering issues with IPFS, ensure the stable version is 50.1.2. For Metamask issues, make sure to use the stable version "ipfs-http-client": "^56.0.1". Also, ensure you are using Ganache CLI instead of the GUI version when developing with React.