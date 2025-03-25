# Quorum-web3

Candidat : Pascal Thao Chanta 

Projet final de passage d'examen pour le titre de développeur blockchain (soutenance alyra du 10 avril 2025) 


## A propos du sujet: 

Quorum est une dApp destiné à la gestion au stockage de données relatives aux ... lors des Assemblées générales ordinaires ayant lieu tous les ans. Au cours de ... , sont votés. .....

L'objectif est de simuler ce que pourrait être une version minimale du projet imaginé avec le groupe constitués de stagiaires de la promo consulting Blockchain. 


## Features et rôles des contrats


## Modop

- En cas d'égalité lors du dépouillement, le choix final revient à owner (notice d'utilisation expliquée plus loin)
- Ajout des view functions pour aider l'IHM à hydrater son frontend 
- Ajout de customs error et d'events pertinents



### Optimization et bonnes pratiques: 
- NatSpec
- State packing
- Limitation de la taille des uint
- Uitlisation du unchecked dans les boucles 
- Utilisation de mapping plutôt que des arrays 
- Elimination des contrôles superflus


### Sécurité appliquée et failles du projets:

- Prévention du reentrancy 
- Ajout d'un fallback adéquat

## Failles Solidity 
CondoGMFactory : constructor 0 for maxAdminNb ?


## Improvements futures 


## Déploiements antérieurs: 

- Contrat déployé sur sepolia (mais pas réussi à le vérifier malgré mon etherscan api key): XXXXXXX TODO put address
- Front end déployé sur vercel: XXXXXXX TODO put address


## Tests et CI

- Qui bénéficient de tests unitaires et de Fuzz tests
- Implémentation d'un Github actions qui trigger les T.U Foundry à chaque push sur main

- Couverture de test : XXXX %



Pour lancer les tests : 

1. Installer forge [https://github.com/foundry-rs/foundry](https://github.com/foundry-rs/foundry).

2. Compiler les contrats: 

```shell
 cd foundry 
 forge build
```

Lancer les T.U. 

```shell
forge test --match-contract VotingOptiTest
```

Rapport sur la couverture de tests: 

```shell
forge coverage
```

## Technos 

- Capable de se connecter via un wallet de browser et de communiquer avec VotingOpti.sol. 
- Offre toute l'interface pour qu'un owner ou un voter puisse mener le processus de vote à son terme
- Ecoute des event et affichage de chaque message reçu
- L'IHM s'adapte à chaque role 
- Application herbergée sur vercel (push sur main)

![screenshot](screenshots/vercel.png)



## Deployer le projet (3 méthodes) 

## A. Lancer le contrat et l'IHM en local :

0) Lancez Anvil :
```shell
anvil
```

1) Ajoutez le network anvil à votre Metamask et importez account0 (qui est owner du contrat dans Metamask) avec la Private key: 

```shell
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
aide :
 
https://ethereum.stackexchange.com/questions/164536/how-can-i-add-anvil-token-from-the-test-token-provided-to-my-metamask-account


2) Déployez le contrat sur anvil (avec le account1 d'Anvil):

Ouvrez un nouveau terminal et: 

```shell
cd foundry
```

```shell
forge script script/DeployCondoGmManager.s.sol --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http://localhost:8545 --broadcast
```

TODO : should use forge create isntead cause cant pass args to constructor


3) Installez et lancez React dans un nouveau terminal: 

```shell
cd /client
npm install
npm run dev
```
Puis allez sur : http://localhost:5173/

(L'adresse du contrat déployé sur Anvil et l'abi sont intégrés dans le code front-end)


Voici quelques addresses publiques mises à dispo par Anvil pour vos tests : 

```
- (1) 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
- (2) 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
- (3) 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6
- (4) 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a
```

et les PK associées (pour import dans metamask et pour switcher d'un compte à l'autre): 

```
- (1) 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
- (2) 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
- (3) 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6
- (4) 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a
```


## B. Contrat sur Sepolia et IHM sur Vercel (vous avez besoin de faucets):

Le contrat a déjà été déployé à l'adresse suivante :

```
[0xd23eAC9890b3Ab0e38492be4A75aB765B68784eD](https://sepolia.etherscan.io/address/0xd23eac9890b3ab0e38492be4a75ab765b68784ed)
** TODO ** 

```

Et voici l'URL vers l'IHM déployée sur Vercel.

```
https://web3-alyra-use-cases.vercel.app/
** TODO ** 
```



## C. Déployer soi-même le contrat sur Sepolia (déconseillé): 

Si vous avez un peu de faucet:

Modifiez votre .env: 

```shell
SEPOLIA_RPC_URL=<your-infura-rpc>
PRIVATE_KEY=<pk-used-to-deploy>
ETHERSCAN_API_KEY=<pk-used-to-deploy>
```

```shell
source . env 
```

Déployez: 

```shell
cd foundry
forge script script/DeployVoting.s.sol --private-key $PRIVATE_KEY --rpc-url $SEPOLIA_RPC_URL --broadcast
```

Vérifiez sur etherscan: 

```shell
forge verify-contract <address-du-contrat-deployé>  ./src/VotingOpti.sol:VotingOpti --rpc-url $SEPOLIA_RPC_URL --watch
```

Changez la valeur de l'adresse sepolia dans :

```
web3-alyra-use-cases/P3/ethers-client/constants/deployed.ts

export const deployed = {
  anvil: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  // replace here when deployed on sepolia
  sepolia: ""
}
```

puis dans : 
```
web3-alyra-use-cases/P3/ethers-client/pages/Home.tsx
```

remplacez :
```
const contractAddress = deployed.anvil;
```
par
```
const contractAddress = deployed.sepolia;
```

Et enfin lancez, react depuis votre local sur web3-alyra-use-cases/P3/ethers-client

```
npm run dev 
```
