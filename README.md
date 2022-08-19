## helix admin dashboard
## clone the project
`https://github.com/jss-codd/helix_admin_dashboard.git`
- checkout to branch `feature/add-functionality` to get latest code 
- install all the dependencies by run commad `npm install`
- configure your .env file 
- add `keycloak.json` file in public folder and copy and paste keyclock OIDC JSON of `admin-dash` client
- start locally `npm run start`
- in permission tab admin can see all the permission (keylock roles) assign to which group and edit it
- for  add roles (permission) admin can add from keyclock roles tab 

## deploy
- connect to server
- checkout to `iot_anik_latest folder`
- then checkout to `admin-dash/helix_admin_dashboard`
- install the dependencies by run commad `npm install`
- Start the pm2 service: `pm2 start npm --name admin-dash -- start`