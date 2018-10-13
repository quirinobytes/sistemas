# Webserver

- Modified the start script to use .env vars too.
- Updated socketio path in `client_new/scripts/main.js`
- Removed recaptcha
- Added satoshis to user in registration

## How to run

### Requirements

- Git
- Gulp
- Node (tested with v4.9.1)
- Npm (tested with v2.15.11)

1 - Install postgresql 10

```bash
$ sudo apt-get install postgresql postgresql-10-plv8
```

2 - Clone the repo

```bash
$ git clone git@github.com:popstand/bustabit-webserver.git webserver
$ cd webserver
```

3 - Setup the Database

```bash
$ sudo -u postgres createuser -P bustabit
$ sudo -u postgres createdb -O bustabit bustabitdb
$ sudo -u postgres psql -d bustabitdb -c "CREATE EXTENSION IF NOT EXISTS plv8"
$ psql -W -U bustabit -d bustabitdb -h localhost -f server/sql/schema.sql
```

4 - Copy the .env.example to a .env file and update the vars

- Replace PASSWORD with the password you choose at createuser step
- BIP32_DERIVED_KEY is an extended public key as defined by BIP 32 (starts with xpub) you may generate the key at [bip32.org](http://bip32.org/)
- You may set PORT var to change the webserver port

```bash
$ cp .env.example .env
```

5 - Run npm install, build the dependencies and then start the webserver

```bash
$ npm install
$ gulp build
$ npm run start
```

> Below is the README untouched.

INSTALLATION
============

Debian/Ubuntu
-------------

These are instructions for running bustabit locally on a Debian / Ubuntu machine.

### Distribution packages

You will need to install the Postgres DBMS and node.js. The `nodejs-legacy`
package installs `nodejs` but will additionally create a symlink from
`/usr/bin/node` to `/usr/bin/nodejs`.

    sudo apt-get install git npm postgresql nodejs-legacy

### Getting the sources

    git clone https://github.com/moneypot/bustabit-webserver.git
    cd bustabit-webserver

### Create a database user and setup the tables

Create a user. It will prompt you for a password.

    sudo -u postgres createuser -P bustabit

Create the database and setup the tables. The second command will prompt you
for the password again.

    sudo -u postgres createdb -O bustabit bustabitdb
    psql -W -U bustabit -d bustabitdb -h localhost -f server/schema.sql

Mac OS X
--------

These are instructions for running bustabit locally on a Mac using homebrew.

### Install homebrew packages

    brew install git node npm postgresql

### Getting the sources

    git clone https://github.com/moneypot/bustabit-webserver.git
    cd bustabit-webserver

### Create a database user and setup the tables

Create a user. It will prompt you for a password.

    createuser -P bustabit

Create the database and setup the tables. The second command will prompt you
for the password again.

    createdb -O bustabit bustabitdb
    psql -W -U bustabit -d bustabitdb -h localhost -f src/server/schema.sql


Configuration
=============

### Installing node.js dependencies locally.

This will download and install all dependencies in the `node_modules` subdirectory.

    npm install

### Database

Export the database link as an environment variable

    export DATABASE_URL=postgres://bustabit:<YOURPASSWORD>@localhost/bustabitdb

### BIP32 Key

You will need to create a BIP32 key pair. You can do at your own risk online at [bip32.org](http://bip32.org/). Export the public key as an environment variable

    export BIP32_DERIVED_KEY=xpub6AH.....


Running
=======

You can run the server by using `npm start`. By default it will listen on port `3841`.
