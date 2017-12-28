using Newtonsoft.Json;
using System;

namespace PushToServer.DataModels
{
    public partial class Blogs
    {
        [JsonProperty("Blogs")]
        public BlogsBlog[] PurpleBlogs { get; set; }
    }

    public partial class BlogsBlog
    {
        [JsonProperty("Blog")]
        public BlogBlog Blog { get; set; }
    }

    public partial class BlogBlog
    {
        [JsonProperty("Name")]
        public string Name { get; set; }

        [JsonProperty("BlogPost")]
        public BlogPost BlogPost { get; set; }
    }

    public partial class BlogPost
    {
        [JsonProperty("id")]
        public long Id { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("Comment")]
        public Comment Comment { get; set; }
    }

    public partial class Comment
    {
        private DateTime _datePosted;
        private int _unixDatePosted;

        [JsonProperty("id")]
        public long Id { get; set; }

        [JsonProperty("username")]
        public string Username { get; set; }

        [JsonProperty("text")]
        public string Text { get; set; }

        [JsonProperty("dateposted")]
        public DateTime Dateposted {
            get
            {
                return _datePosted;
            }
            set {
                _datePosted = value;
                _unixDatePosted = (int)(_datePosted.Subtract(new DateTime(1970, 1, 1))).TotalSeconds; ;
            }
        }

        [JsonProperty("approved")]
        public bool Approved { get; set; }

        public int DatePostedUnixTimestamp
        {
            get
            {
                return _unixDatePosted;
            }
        }
    }

    public partial class Blogs
    {
        public static Blogs FromJson(string json) => JsonConvert.DeserializeObject<Blogs>(json, Converter.Settings);
    }

    public static class Serialize
    {
        public static string ToJson(this Blogs self) => JsonConvert.SerializeObject(self, Converter.Settings);
    }

    public class Converter
    {
        public static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
        {
            MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
            DateParseHandling = DateParseHandling.None,
        };
    }
}
