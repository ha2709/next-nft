# Next NFT Project

## Clone the Code

To clone the code, please use the following command:
 

`git clone --branch docker https://github.com/ha2709/next-nft.git`

# Project Deployment

To deploy the project, follow the steps outlined below:

## Migrate Contracts

`truffle migrate --reset --compile-all --network development`

migrate

### Goerli Contract Address : `0xB71d0D6676ECFe62A3779C362612aB926cD383A7`

## Back End Setup

`npm install --force`

To run the back end locally, ensure that Postgresql is running, and verify the credentials in the .env file. Open db/database.go, uncomment lines 30, and comment out line 28. Then execute the following commands:

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

`sudo npm i -g ganache-cli`

Start Ganache using:

`ganache-cli -i 1337`

To interact with Contract on FrontEnd, copy Private Keys Front Ganache-cli and import it to MetaMask. 

To run application, in the project folder, run 

`docker-compose up --build`

Note: It is not recommended to include both the Front End and Backend in the same Docker-compose, as this could lead to scalability issues. It is advisable to separate the Backend and Front End deployment in production. 

## Testing

To run tests, execute the following command in the project folder:

`truffle test`

`git rm -r --cached node_modules`

`sudo -u postgres psql`

## Troubleshooting
If encountering issues with IPFS, ensure the stable version is 50.1.2. For Metamask issues, make sure to use the stable version "ipfs-http-client": "^56.0.1". Also, ensure you are using Ganache CLI instead of the GUI version when developing with React.

I utilized two different machines during the development of this codebase, which is why you'll notice two distinct users associated with this repository.