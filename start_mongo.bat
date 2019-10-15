@echo off
REM Need Administrator privileges to run 

REM Change the path to installation directory of Monogo and then point out to bin folder
cd "C:\mongodb\bin"

REM Used to run to mongo file check if they have the same name
start mongod.exe 
timeout 4
start mongo.exe
exit