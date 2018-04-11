Emby.Naming
===================

A dependency-free, configurable file naming engine. This library is available on Nuget:

Note: The upstream NuGet package for this is not working when targeting netcore, for this reason it is being brought in manually.

## Features:
- Parse video directories into objects containing metadata that can be determined from the file names
- For movies, extract the name, year, language, 3d format, multi-part info and quality level
- For episodes, extract all of the above plus episode numbers
- For subtitle files, extract the language, default and forced flags
- Support all Kodi movie naming feaures: http://kodi.wiki/view/Naming_video_files/Movies
- Support all Kodi tv naming features: http://kodi.wiki/view/Naming_video_files/TV_shows
- The consumer should be able to configure all features in the same way Kodi parsing can be configured, e.g. no fixed, hard-coded algorithms
- Extract extra files, e.g. trailers, theme songs, etc.
- Determine the relationship between files, e.g. movie has three parts, three subtitle files, three extra videos
- Support optional, injectable logging to write to the consumer's logging system
- Unit tests

## Usage - Video Files:

``` c#

            // Developers are encouraged to create their own ILogger implementation
			var logger = new NullLogger();

			// VideoOptions is based on Kodi wiki documentation
			// ExtendedNamingOptions includes newly introduced Media Browser features
			var options = new NamingOptions();

			var resolver = new VideoResolver(options, logger);

			var result = resolver.ResolveFile(file);
```

The result object will then have a number of properties, including:

- Path
- Container (mkv, ts, etc)
- Name
- Year
- ExtraType (trailer, themesong, etc)
- Is3D
- Format3D (hsbs, fsbs, etc)
- IsStub
- StubType (dvd, hddvd, bluray, etc)

Different parts of the algorithm can be used separately as needed via the following classes:

- CleanDateTimeParser
- CleanStringParser
- ExtraTypeParser
- Format3DParser
- StackResolver
- StubResolver

See the unit tests for samples.

## Configuration

Most of the classes expect a NamingOptions object. This is intended to gradually support all of the configuration available in Kodi advanced settings: http://kodi.wiki/view/Advancedsettings.xml.
