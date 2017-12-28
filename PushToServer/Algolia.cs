using Algolia.Search;
using Newtonsoft.Json.Linq;
using PushToServer.DataModels;
using System.Collections.Generic;
using System.Configuration;
using System.IO;

namespace PushToServer
{
    class Algolia
    {
        private AlgoliaClient _client;

        private string GetJsonContent(string filename)
        {
            var appPath = System.Reflection.Assembly.GetExecutingAssembly().Location;
            var path = Path.GetDirectoryName(appPath);
            var json = File.ReadAllText(string.Format("{0}/Data/{1}.json", path, filename));

            return json;
        }

        private IEnumerable<object> GetJsonObject(string jsonContent)
        {
            var data = Blogs.FromJson(jsonContent);
            return data.PurpleBlogs;
        }

        public Algolia()
        {
            _client = new AlgoliaClient(ConfigurationManager.AppSettings["AlgoliaApplicationID"], ConfigurationManager.AppSettings["AlgoliaAPIKey"]);
        }

        public Index CreateIndex(string indexName)
        {
            var data = GetJsonObject(GetJsonContent(indexName));

            Index index = _client.InitIndex(indexName);
            index.AddObjects(data);
            return index;
        }

        public void SetSearchableAttributes(Index index, params string[] searchableAttributes)
        {
            JObject jObject = new JObject();
            jObject.Add("searchableAttributes", new JArray(searchableAttributes));
            index.SetSettings(jObject);
        }
    }
}
