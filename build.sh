#!/usr/bin/env bash

docker build --tag sssb-build .
docker run --rm -it --name sssb-build \
 -v /var/run/docker.sock:/var/run/docker.sock \
 -v $PWD/artifacts:/repo/artifacts \
 -v $PWD/.git:/.git \
 --network host \
 -e GITHUB_RUN_NUMBER=$GITHUB_RUN_NUMBER \
 -e NUGET_API_KEY=$NUGET_API_KEY \
 sssb-build \
 dotnet run -p /repo/src/SqlStreamStore.Browser.Build/SqlStreamStore.Browser.Build.csproj -- "$@"