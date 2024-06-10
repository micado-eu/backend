[![CodeFactor](https://www.codefactor.io/repository/github/micado-eu/backend/badge)](https://www.codefactor.io/repository/github/micado-eu/backend)

# Micado Backend Application

This is the backend application of the MICADO project. Here resides all the business application logic, including:
- API
- Integration with auth and translation platform

## Development Instructions

The Docker Compose file aids in development by defining several services.

### Network Creation

Before starting the services, you need to create the required network (this operation typically only needs to be done once):

```bash
docker network create micado_net_dev
```

### Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/micado-eu/backend.git
   cd backend
   mkdir db_data db_init shared_images application git_data
   ```

2. **Create a `prod.env` File:**
   Create a file named `prod.env` in the root directory with the following content:
   ```plaintext
   # Hostnames
   MIGRANTS_HOSTNAME=migrant.gioppoluca.it
   PA_HOSTNAME=micado-pa.gioppoluca.it
   NGO_HOSTNAME=ngo.micadoproject.eu
   IDENTITY_HOSTNAME=localhost
   ANALYTIC_HOSTNAME=monitoring.micadoproject.eu
   GIT_HOSTNAME=git.micado.eu
   ROCKETCHAT_HOSTNAME=admin2.micadoproject.eu
   
   # Docker Ports
   IDENTITY_HOSTNAME_PORT=8080

   # Docker Images Tags
   PGROONGA_IMAGE_TAG=3.2.0-alpine-16-slim
   KEYCLOAK_IMAGE_TAG=23.0.0
   GITEA_IMAGE_TAG=1.21.11
   
   # Micado Specific
   MICADO_DB_USER=micadoapp
   MICADO_DB_SCHEMA=micadoapp
   MICADO_TRANSLATIONS_DIR=/tmp/translations
   MICADO_ENV=prod
   MICADO_GIT_URL=http://git
   MICADO_DB_PWD=supersecret

   # Keycloak
   KC_DB=postgres
   KC_DB_USERNAME=micadoapp
   KC_DB_PASSWORD=supersecret
   KC_DB_URL="jdbc:postgresql://micado_db:5432/micado"
   KC_DB_SCHEMA=micadoapp
   KC_METRICS_ENABLED=true
   KC_LOG_LEVEL=INFO
   KC_REALM_NAME=micado
   KEYCLOAK_ADMIN=admin
   KEYCLOAK_ADMIN_PASSWORD=admin

   # Weblate
   WEBLATE_EMAIL_HOST=smtp.micadoproject.eu
   WEBLATE_EMAIL_HOST_USER=development@micadoproject.eu
   WEBLATE_EMAIL_HOST_SSL=false

   # Other
   ANALYTIC_HOSTNAME=monitoring.micadoproject.eu
   ```

3. **Run Docker Compose:**
   Open a terminal and execute:
   ```bash
   (set -a; source prod.env; set +a; docker-compose -f docker-compose.yaml up backend micado_db)
   ```
   Wait until you see `database system is ready to accept connections`.

4. **Set Up Backend:**
   Open a new terminal and run:
   ```bash
   docker-compose exec backend bash
   cd micado-backend/
   npm install
   npm start
   ```
   Wait until you see `Server is running at http://[::1]:3000`.

### Services Description

The `docker-compose.yaml` file defines the following services:

1. **micado_db**
   - **Image**: `groonga/pgroonga:${PGROONGA_IMAGE_TAG}`
   - **Description**: This service runs a PostGIS database, which installs itself with all the needed schemas and configurations.
   - **Ports**: Exposes port `5432`
   - **Volumes**: 
     - `postgres_data` mounted at `/var/lib/postgresql/data`
     - `postgres_init` mounted at `/docker-entrypoint-initdb.d`
   - **Environment Variables**: `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
   - **Healthcheck**: Checks if the database is ready to accept connections.

2. **keycloak**
   - **Image**: `quay.io/keycloak/keycloak:${KEYCLOAK_IMAGE_TAG}`
   - **Description**: This service runs the Keycloak identity server.
   - **Ports**: Exposes port `8080`
   - **Volumes**: 
     - `./keycloak/realm.json` mounted at `/opt/keycloak/data/import/realm.json`
     - `./keycloak/themes` mounted at `/opt/keycloak/themes`
   - **Environment Variables**: Various Keycloak-related variables including `KC_HOSTNAME_PORT` which is required to expose the service on port 8080 for the admin console access since for development environmenr localhost:8080 will be used to access the admin console.
   - **Healthcheck**: Checks if Keycloak is running and responsive.

3. **backend**
   - **Image**: `micadoproject/micado_backend:18.19.1`
   - **Description**: This service runs the Micado backend application.
   - **Ports**: Exposes port `3000`
   - **Volumes**: 
     - `backend` mounted at `/code`
     - `/var/run/docker.sock` mounted as read-only
     - `shared_images` mounted at `/images`
   - **Environment Variables**: Various backend-related variables.

4. **git**
   - **Image**: `gitea/gitea:${GITEA_IMAGE_TAG}`
   - **Description**: This service runs the Gitea Git server for version control.
   - **Ports**: Exposes port `3000`
   - **Volumes**: 
     - `git_data` mounted at `/data`
     - `/etc/timezone` and `/etc/localtime` mounted as read-only
   - **Environment Variables**: Various Gitea-related variables.
   - **Healthcheck**: Depends on the micado_db service.

### Additional Development with Gitea

For developing the backend with Weblate integration, you need to use Gitea:

1. **Run Gitea Container:**
   The first time you run the container, create the admin user:
   ```bash
   docker-compose exec git bash
   /app/gitea/gitea admin create-user --name=gitea --password=gitea --email=test@xx.com --admin --must-change-password=false
   ```

2. **Configure Gitea:**
   Edit `git_data/gitea/conf/app.ini` to include:
   ```ini
   [database]
   ...
   SCHEMA = gitea
   ```

### Adding CRUD Endpoints

To expose a model as a CRUD API:
```bash
lb4 rest-crud --datasource micadoDS --model Topic
```
Update `src/migrate.ts` to include your model:
```javascript
await app.migrateSchema({ existingSchema, models: ['FeaturesFlags', 'Topic'] });
```

### Database Migration

To migrate the database using the CLI:
```bash
npm run build
DEBUG=loopback:connector:postgresql npm run migrate
```

### Funding

![EU Logo](https://github.com/micado-eu/MICADO/blob/master/img/Flag_of_Europe.svg_.png)
This project has received funding from the European Union’s H2020 Innovation Action under Grant Agreement No 822717.
