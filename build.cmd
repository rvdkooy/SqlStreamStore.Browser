docker build --tag sssb-build .
docker run --rm -it --name sssb-build ^
 -v /var/run/docker.sock:/var/run/docker.sock ^
 -v %cd%/artifacts:/artifacts ^
 -v %cd%/.git:/.git ^
 --network host ^
 sssb-build ^
 dotnet run -p /repo/src/SqlStreamStore.Browser.Build/SqlStreamStore.Browser.Build.csproj -- %*