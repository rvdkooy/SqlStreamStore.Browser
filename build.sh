#!/usr/bin/env bash

docker build --tag sssb-build .
docker run --rm --name sssb-build \
 -v /var/run/docker.sock:/var/run/docker.sock \
 -v $PWD/artifacts:/repo/artifacts \
 --network host \
 -e GITHUB_RUN_NUMBER=$GITHUB_RUN_NUMBER \
 -e FEEDZ_API_KEY=$FEEDZ_API_KEY \
 -e GITHUB_REF=$GITHUB_REF \
 sssb-build \
 dotnet run -p /repo/src/SqlStreamStore.Browser.Build/SqlStreamStore.Browser.Build.csproj -- "$@"