# Micado backend application
This is the backend application of the MICADO project.  This is where all the business application logic will reside:
- API
- DB migration

## Development instructions
The Docker compose file is there to help development; in particular there are 2 services:
- backend
- micado_db

The first is the proper backend code and is based on a specific image to be sure that all use the same coding environment,
The second is a PostGIS DB coherent with the production for MICADO: it will install itself with all the needed schemas and configurations.
For more details please consult the "deployment repository" [remember to create the **prod.env** file with password data]


Prepare the backend repo on your local system:

```bash
git clone https://github.com/micado-eu/backend.git
cd backend
cp .env prod.env
mkdir db_data 
```

To code you will have to run the following command on a first shell

```bash
(set -a; source prod.env; set +a; docker-compose -f docker-compose.yaml  up backend micado_db)
```

Wait until you see `database system is ready to accept connections`

On a second shell the following commands 
```bash
docker-compose exec  backend bash
cd micado-backend/
npm install
npm start
```
The container will mount the application folder and it will be possibile to code with preferred editor.
Wait until you see `Server is running at http://[::1]:3000`

### To add a CRUD endpoint for a Model
It is possible to expose directly a Model straightforward as a CRUD API the command is like the one that follows.
This operation is needed to activate the table as managed by the model so that the migration will take it into consideration.

```
lb4 rest-crud --datasource micadoDS --model Topic
```

To control which tables are migrated and in what order there is an array to manage by hand in the 'src/migrate.ts'; the place is the models key.
```
  await app.migrateSchema({existingSchema, models: ['FeaturesFlags', 'Topic']});

```


### How to execute a migration of the DB
We need to have an option to migrate the DB, at the moment we are using the command line, but there is a way to create an APi that will invoke the migration command.

The way of using the cli is (the environment variable is to see the SQL code that the application is using to better understand errors):
```
npm run build
DEBUG=loopback:connector:postgresql npm run migrate
```


### Funded by

![EU Logo](https://github.com/micado-eu/MICADO/blob/master/img/Flag_of_Europe.svg_.png)This project has received funding from the European Union’s H2020 Innovation Action under Grant Agreement No 822717.
