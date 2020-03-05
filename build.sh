#!/usr/bin/env bash

docker build --tag sssb-build .
docker run --rm -it --name sssb-build \
 -v /var/run/docker.sock:/var/run/docker.sock \
 -v $PWD/artifacts:/artifacts \
 -v $PWD/.git:/.git \
 --network host \
 -e TRAVIS_BUILD_NUMBER=$TRAVIS_BUILD_NUMBER \
 sssb-build \
 dotnet run -p /repo/src/SqlStreamStore.Browser.Build/SqlStreamStore.Browser.Build.csproj -- "$@"