declare global {
    namespace NodeJS {
        interface ProcessEnv {
            FTP_PORT: string // 21
            HOST_NAME: string // 127.0.0.1
            FTP_DIR: string // ../srv
            FTP_USERNAME: string // api
            FTP_PASSWORD: string // api
            API_PORT: string // 8080
        }
    }
}

export {}