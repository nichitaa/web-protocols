This is the directory where will be saved the files from the FormData using multer diskStorage
as the first step after receiving the POST request to `ftp-api/upload`,
the second step is saving the file from this temporary location to actual FTP server location
and the last step is deleting the temporary file.

Because I need to send to the FTPClient api a readable stream, and apparently the FormData
could not be converted to a readable stream, so the work-around is saving the file temporarily.
