## Castia Technical Test

## Deployed API on Heroku

https://castia-challenge.herokuapp.com/

https://castia-challenge.herokuapp.com/api/github/top-users/joseph

## Installation instructions

1.- Clone repository
```sh
    git clone https://github.com/OscarVerdugo/castia-challenge.git
    cd castia-challenge
```

2.- Install dependencies
```sh
    npm i
```

3.- Add .env file with `GITHUB_TOKEN` and `PORT` configs
> Note: `GITHUB_TOKEN` is required, you can create one [here](https://github.com/settings/tokens)

4.- Run the server in dev mode
```sh
    npm run dev
```