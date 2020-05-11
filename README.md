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
For more details please consult the "deployment repository"

To code you will have to run the following command on a first shellpreferred editor

```bash
docker-compose up backend
```
On a second shell the following commands 
```bash
docker-compose exec  backend bash
cd micado-backend/
npm start
```
The container will mount the application folder and it will be possibile to code with.

### Funded by

![EU Logo](https://github.com/micado-eu/MICADO/blob/master/img/Flag_of_Europe.svg_.png)This project has received funding from the European Union’s H2020 Innovation Action under Grant Agreement No 822717.