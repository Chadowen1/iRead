@echo off
setlocal

:: Check Node.js version
for /f "tokens=*" %%i in ('node -v') do set node_version=%%i
set node_version=%node_version:v=%

for /f "tokens=1-3 delims=." %%a in ("%node_version%") do (
    set major=%%a
    set minor=%%b
    set patch=%%c
)

if %major% lss 20 (
    echo Node.js version must be 20.14.0 or higher.
    exit /b
) else if %major%==20 if %minor% lss 14 (
    echo Node.js version must be 20.14.0 or higher.
    exit /b
)

:: Prompt for Local Database or Dockerized setup
set /p setupType=Choose setup type: Local Database [L] or Dockerized [D]: 

if /i "%setupType%"=="L" (
    :: Check if MongoDB is installed
    mongo --version >nul 2>&1
    if errorlevel 1 (
        echo MongoDB is not installed. Do you want to install MongoDB? [Y/N]
        set /p installMongo=:
        if /i "%installMongo%"=="Y" (
            start "" "https://www.mongodb.com/try/download/community"
            echo Please install MongoDB, then run this script again.
            exit /b
        ) else (
            echo MongoDB is required. Exiting.
            exit /b
        )
    )

    :: Check MongoDB version
    for /f "tokens=*" %%i in ('mongo --version') do set mongo_version=%%i
    for /f "tokens=1-3 delims=." %%a in ("%mongo_version%") do (
        set major=%%a
        set minor=%%b
        set patch=%%c
    )

    if %major% lss 4 (
        echo MongoDB version must be 4.4.18 or higher.
        exit /b
    ) else if %major%==4 if %minor% lss 4 (
        echo MongoDB version must be 4.4.18 or higher.
        exit /b
    ) else if %major%==4 if %minor%==4 if %patch% lss 18 (
        echo MongoDB version must be 4.4.18 or higher.
        exit /b
    )

    :: Create .env file
    echo PORT=3000 > .env
    echo MONGODB_URL=mongodb://root:root@localhost:27017/iReadBase?authSource=admin >> .env

    :: Create MongoDB user and test connection
    mongo --eval "db.createUser({user: 'root', pwd: 'root', roles:[{role:'root', db:'admin'}]})"
    mongo --eval "db = db.getSiblingDB('iReadBase'); db.test.insert({test: 'connection'})"

) else if /i "%setupType%"=="D" (
    :: Check if Docker is installed
    docker --version >nul 2>&1
    if errorlevel 1 (
        echo Docker is not installed. Do you want to install Docker? [Y/N]
        set /p installDocker=:
        if /i "%installDocker%"=="Y" (
            start "" "https://www.docker.com/get-started"
            echo Please install Docker, then run this script again.
            exit /b
        ) else (
            echo Docker is required for this option. Exiting.
            exit /b
        )
    )
    echo Docker is installed.
) else (
    echo Invalid option. Exiting.
    exit /b
)

echo Setup completed successfully.

endlocal
pause
