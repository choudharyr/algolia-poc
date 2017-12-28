
namespace PushToServer
{
    class Program
    {
        static void Main(string[] args)
        {
            Algolia algolia = new Algolia();
            var index = algolia.CreateIndex("Blogs");

            string[] attributes = {
                "Blog.Name",
                "Blog.BlogPost.title",
                "Blog.BlogPost.Comment.username",
                "Blog.BlogPost.Comment.text",
                "Blog.BlogPost.Comment.dateposted"
            };

            algolia.SetSearchableAttributes(index, attributes);
        }
    }
}
