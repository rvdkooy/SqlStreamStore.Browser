FROM mcr.microsoft.com/dotnet/core/sdk:3.1.201-alpine3.11 AS build

RUN apk add git
RUN apk add yarn

WORKDIR /repo

COPY ./src ./src/
COPY ./*.sln .

RUN dotnet restore
WORKDIR /repo/src/sqlstreamstore.ui
RUN yarn

WORKDIR /repo
