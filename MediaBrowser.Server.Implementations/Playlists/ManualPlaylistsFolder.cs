﻿using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MediaBrowser.Common.Configuration;
using MediaBrowser.Controller.Entities;
using MediaBrowser.Controller.Playlists;
using MediaBrowser.Model.IO;
using MediaBrowser.Model.Querying;
using MediaBrowser.Model.Serialization;

namespace MediaBrowser.Server.Implementations.Playlists
{
    public class PlaylistsFolder : BasePluginFolder
    {
        public PlaylistsFolder()
        {
            Name = "Playlists";
        }

        public override bool IsVisible(User user)
        {
            return base.IsVisible(user) && GetChildren(user, true).Any();
        }

        protected override IEnumerable<BaseItem> GetEligibleChildrenForRecursiveChildren(User user)
        {
            return base.GetEligibleChildrenForRecursiveChildren(user).OfType<Playlist>();
        }

        [IgnoreDataMember]
        public override bool IsHidden
        {
            get
            {
                return true;
            }
        }

        [IgnoreDataMember]
        public override string CollectionType
        {
            get { return MediaBrowser.Model.Entities.CollectionType.Playlists; }
        }

        protected override Task<QueryResult<BaseItem>> GetItemsInternal(InternalItemsQuery query)
        {
            query.Recursive = false;
            return base.GetItemsInternal(query);
        }
    }

    public class PlaylistsDynamicFolder : IVirtualFolderCreator
    {
        private readonly IApplicationPaths _appPaths;
        private readonly IFileSystem _fileSystem;

        public PlaylistsDynamicFolder(IApplicationPaths appPaths, IFileSystem fileSystem)
        {
            _appPaths = appPaths;
            _fileSystem = fileSystem;
        }

        public BasePluginFolder GetFolder()
        {
            var path = Path.Combine(_appPaths.DataPath, "playlists");

			_fileSystem.CreateDirectory(path);

            return new PlaylistsFolder
            {
                Path = path
            };
        }
    }
}
