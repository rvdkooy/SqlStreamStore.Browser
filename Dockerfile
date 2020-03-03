FROM mcr.microsoft.com/dotnet/core/sdk:3.1.100-alpine3.10 AS build

RUN apk add git
RUN apk add yarn

WORKDIR /repo

COPY ./src ./src/
COPY ./*.sln .

# COPY ./NuGet.Config ./

RUN dotnet restore
WORKDIR /repo/src/sqlstreamstore.ui
RUN yarn

# WORKDIR /repo/build

# COPY ./build/build.csproj .
# RUN dotnet restore

# COPY ./build .

WORKDIR /repo
