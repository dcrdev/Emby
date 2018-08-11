CONFIG    = Release
RUNTIME   = linux-x64

# Use with xterm to prevent incompatibility with distros who 
# ship a recent version of ncurses. See:
# https://github.com/dotnet/sdk/issues/1916#issuecomment-367080527
TERM      = xterm

all : cleanup restore build

cleanup:
	dotnet clean --configuration $(CONFIG) --runtime $(RUNTIME) \
	./MediaBrowser.sln

restore:
	dotnet restore --runtime $(RUNTIME) ./MediaBrowser.sln

build:
	dotnet build --configuration $(CONFIG) --runtime $(RUNTIME) \
	./MediaBrowser.sln
run:
	dotnet ./Emby.Server.Unix/bin/Release/netcoreapp2.1/linux-x64/Emby.Server.Unix.dll
