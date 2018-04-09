Emby Server
============

Emby Server is a personal media server with apps on just about every device.

It features a REST-based API with built-in documention to facilitate client development. We also have client libraries for our API to enable rapid development.

## Build Instructions ##
To build Emby you will need to satify the following dependencies - libunwind, libicu, compat-openssl10, dotnet-sdk-2.1.10 for Fedora >= 26, on other distributions you will need the equivalents. The dotnet SDK can be obtained from: https://www.microsoft.com/net/learn/get-started/linux/rhel .
```
git clone https://github.com/dcrdev/Emby
cd ./Emby 
make
```

## Running ##
```
make run
```

## Developer Info ##

[Api Docs](https://github.com/MediaBrowser/MediaBrowser/wiki "Api Workflow")

[How to Build a Server Plugin](https://github.com/MediaBrowser/MediaBrowser/wiki/How-to-build-a-Server-Plugin "How to build a server plugin")
