﻿using MediaBrowser.Controller.Entities;
using MediaBrowser.Controller.Library;
using MediaBrowser.Controller.Sorting;
using MediaBrowser.Model.Querying;

namespace MediaBrowser.Server.Implementations.Sorting
{
    /// <summary>
    /// Class PlayCountComparer
    /// </summary>
    public class PlayCountComparer : IUserBaseItemComparer
    {
        /// <summary>
        /// Gets or sets the user.
        /// </summary>
        /// <value>The user.</value>
        public User User { get; set; }

        /// <summary>
        /// Compares the specified x.
        /// </summary>
        /// <param name="x">The x.</param>
        /// <param name="y">The y.</param>
        /// <returns>System.Int32.</returns>
        public int Compare(BaseItem x, BaseItem y)
        {
            return GetValue(x).CompareTo(GetValue(y));
        }

        /// <summary>
        /// Gets the date.
        /// </summary>
        /// <param name="x">The x.</param>
        /// <returns>DateTime.</returns>
        private int GetValue(BaseItem x)
        {
            var userdata = UserDataRepository.GetUserData(User.Id, x.GetUserDataKey());

            return userdata == null ? 0 : userdata.PlayCount;
        }

        /// <summary>
        /// Gets the name.
        /// </summary>
        /// <value>The name.</value>
        public string Name
        {
            get { return ItemSortBy.PlayCount; }
        }

        /// <summary>
        /// Gets or sets the user data repository.
        /// </summary>
        /// <value>The user data repository.</value>
        public IUserDataManager UserDataRepository { get; set; }
        
        /// <summary>
        /// Gets or sets the user manager.
        /// </summary>
        /// <value>The user manager.</value>
        public IUserManager UserManager { get; set; }
    }
}
