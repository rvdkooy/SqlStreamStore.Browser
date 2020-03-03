FROM mcr.microsoft.com/dotnet/core/sdk:3.1.100-alpine3.10 AS build

RUN apk add git
RUN apk add yarn

WORKDIR /repo

# https://github.com/moby/moby/issues/15858
# Docker will flatten out the file structure on COPY
# We don't want to specify each csproj either - it creates pointless layers and it looks ugly
# https://code-maze.com/aspnetcore-app-dockerfiles/
COPY ./src ./src/
COPY ./*.sln .
# RUN for file in $(ls src/*.csproj); do mkdir -p ./${file%.*}/ && mv $file ./${file%.*}/; done

# COPY ./NuGet.Config ./

RUN dotnet restore
WORKDIR /repo/src/sqlstreamstore.ui
RUN yarn

WORKDIR /repo/build

COPY ./build/build.csproj .
RUN dotnet restore

COPY ./build .

WORKDIR /repo
