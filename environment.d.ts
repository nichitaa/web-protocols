declare global {
    namespace NodeJS {
        interface ProcessEnv {
            FTP_PORT: string // 21
            HOST_NAME: string // 127.0.0.1
            FTP_DIR: string // ../srv
            FTP_USERNAME: string // api
            FTP_PASSWORD: string // api
            API_PORT: string // 8080
            SMTP_HOST: string // SMTPService.gmail.com
            SMTP_PORT: string // 587
            SMTP_FROM_NAME: string // nichitaa
            SMTP_AUTH_USER: string // nodemailertestpr@gmail.com
            SMTP_AUTH_PASS: string // vvftmmufiofzpsdq
            SMTP_TO_ADDRESS: string
        }
    }
}

export {}