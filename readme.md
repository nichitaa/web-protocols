> Pasecinic Nichita
>
> FAF 192



### **REST API for your FTP server**

#### **Description**

`TCP` server that will redirect the incoming request on `HTTP` or `HTTPS` implementation.`HTTPS` app - API for `FTP` manipulations, see the [postman collection](https://github.com/nichitaa/web-protocols/blob/main/pr_webprotocols_dev.postman_collection.json) or [swagger API docs](https://app.swaggerhub.com/apis-docs/nichitaa/PR-web-protocols-API/1.1), `HTTP` app - will proxy the requests to the `HTTPS` API (motivation [NodeJS issues 121](https://github.com/nodejs/node/issues/121)), `HTTP` and `HTTPS` connections are easy to distinguish based on the first byte send by client trying to connect [a more detailed description](https://github.com/mscdex/httpolyglot/issues/3#issuecomment-173680155 ).

Each successful or failed request will notify the user by sending emails with a similar structure, example below:

![email-example](https://github.com/nichitaa/web-protocols/blob/main/img/email.png)  

`FTP` server will serve the directory `ftp/srv`. 

`FtpController`, internally uses `FTPClient` commands, that handles all the manipulations

#### Environment variables

The `API` requires several environment variables in order to run locally on your machine. Please modify the `.env` file in the root of the project with your specific configurations

```
FTP_PORT=21           // this is the default ftp port
FTP_DIR=../srv        // the directory that 

// ftp credentials
FTP_USERNAME=api 
FTP_PASSWORD=api

// smtp credentials
SMTP_HOST = smtp.gmail.com    // host
SMTP_PORT = 587				  // port 
SMTP_FROM_NAME = nichitaa     // name for the sender (you)
SMTP_AUTH_USER = nodemailertestpr@gmail.com   // email
SMTP_AUTH_PASS = vvftmmufiofzpsdq			  // email app pass
SMTP_TO_ADDRESS = nichitastrix@gmail.com 	  // receiver 

API_PORT=8080					// api port 
HOST_NAME=127.0.0.1				// api host (localhost)
```

------

#### Used protocols

- [x] TCP
- [x] HTTP
- [x] HTTPS
- [x] FTP
- [x] SMTP

