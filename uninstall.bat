@ECHO OFF

CALL yarn clean

SET FOLDER=%CD%\node_modules
CD /
DEL /F/Q/S "%FOLDER%" > NUL
RMDIR /Q/S "%FOLDER%"

EXIT