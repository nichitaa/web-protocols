> Pasecinic Nichita
>
> FAF 192



TCP server that will proxy the incoming request on HTTP or HTTPS implementation (same express application).

FTP server that will serve the directory `ftp/srv`. 

Requests on endpoints `https://localhost:8080/ftp-api` will be handled by the express application `FtpController`, that internally uses `FTPClient` commands.







------

###  **Used protocols**

- [x] TCP
- [x] HTTP
- [x] HTTPS
- [x] FTP
- [ ] SMTP
