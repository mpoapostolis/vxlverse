import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { pb } from "../lib/pocketbase";
import { BlogPost as BlogPostType } from "../types/blog";
import { FaTag, FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";
import useSWR from "swr";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

// Fetcher function for the blog post - just one simple function to get a single post by ID
async function fetchBlogPost(id: string) {
  const record = await pb.collection("blog_articles").getOne(id, {
    expand: "author",
  });

  return record as unknown as BlogPostType;
}

export function BlogPostPage() {
  // Get the ID from the URL path parameter
  const { id } = useParams<{ id: string }>();

  // Fetch only the single blog post by ID
  const {
    data: post,
    error: postError,
    isLoading,
  } = useSWR(id ? `blog-article-${id}` : null, () => fetchBlogPost(id!), {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
  });

  const error = postError ? postError.message : null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent  animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
        <div className="text-center text-red-500 p-8 rounded-lg border border-red-800 bg-red-900 bg-opacity-20 max-w-2xl w-full">
          <h1 className="text-2xl font-bold mb-4">{error || "Blog post not found"}</h1>
        </div>
      </div>
    );
  }

  // Get the full URL for the cover image
  const coverImageUrl = post.coverImage
    ? pb.files.getURL(post, post.coverImage)
    : "https://placehold.co/1200x800/222/444?text=No+Image";

  const authorAvatarUrl = post.expand?.author?.avatar
    ? pb.files.getURL(post.expand.author, post.expand.author.avatar)
    : "https://placehold.co/200x200/222/444?text=Author";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <Helmet>
        <title>{post.title} | VXLVerse Blog</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://vxlverse.com/blog/${post.id}`} />
        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={pb.files.getURL(post, post.coverImage)} />
        <meta property="og:url" content={`https://vxlverse.com/blog/${post.id}`} />
        <meta property="og:type" content="article" />
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={pb.files.getURL(post, post.coverImage)} />
      </Helmet>

      <Header />

      {/* Full-width hero image with title overlay */}
      <div className="relative w-full h-[60vh] mb-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${coverImageUrl})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full p-8">
          <div className="container mx-auto max-w-5xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center text-white/80">
              <img
                src={authorAvatarUrl}
                alt={post.expand?.author?.name || "Author"}
                className="w-12 h-12 rounded-full border-2 border-purple-500 mr-4 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/200x200/222/444?text=Author";
                }}
              />
              <div>
                <div className="font-medium text-white">
                  {post.expand?.author?.name || "Unknown Author"}
                </div>
                <div className="text-sm">
                  {new Date(post.created).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-5xl px-4 pb-16">
        {/* Tags at the top */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-12 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Link
                key={index}
                to={`/blog?tag=${tag}`}
                className="text-sm px-4 py-2 rounded-full bg-gray-800 hover:bg-purple-700 text-gray-300 hover:text-white transition-all"
              >
                <FaTag className="inline mr-1 text-xs" /> {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Excerpt in a callout box */}
        {post.excerpt && (
          <div className="mb-12 p-6 bg-purple-900/20 border-l-4 border-purple-600 rounded-r-lg">
            <p className="text-xl text-gray-200 font-light">{post.excerpt}</p>
          </div>
        )}

        {/* Article content */}
        <article className="mb-16">
          <div
            className="prose prose-lg prose-invert max-w-none
              prose-headings:text-purple-300 
              prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6
              prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-8
              prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-6
              prose-p:mb-4 prose-p:leading-relaxed
              prose-a:text-purple-400 prose-a:no-underline prose-a:border-b prose-a:border-purple-400/30 hover:prose-a:text-purple-300 hover:prose-a:border-purple-300
              prose-strong:text-white prose-strong:font-bold
              prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-purple-300
              prose-pre:bg-gray-800/80 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-lg
              prose-img:rounded-lg prose-img:shadow-lg prose-img:mx-auto
              prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2
              prose-ol:list-decimal prose-ol:pl-6
              prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-300
              prose-hr:border-gray-700
              prose-table:border-collapse prose-table:w-full
              prose-th:bg-gray-800 prose-th:p-2 prose-th:text-left prose-th:border prose-th:border-gray-700
              prose-td:p-2 prose-td:border prose-td:border-gray-700"
            dangerouslySetInnerHTML={{ __html: post.article }}
          />
        </article>

        {/* Author bio card */}
        <div className="mb-16 bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 shadow-lg">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gradient-to-br from-purple-900/50 to-gray-900/50 p-6 flex flex-col justify-center items-center">
              <img
                src={authorAvatarUrl}
                alt={post.expand?.author?.name || "Author"}
                className="w-24 h-24 rounded-full border-2 border-purple-500 mb-4 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/200x200/222/444?text=Author";
                }}
              />
              <h3 className="text-xl font-bold text-white text-center">
                {post.expand?.author?.name || "Unknown Author"}
              </h3>
              <div className="text-purple-400 text-sm text-center">Content Creator</div>
            </div>
            <div className="md:w-2/3 p-6">
              <h3 className="text-xl font-semibold mb-4">About the Author</h3>
              <p className="text-gray-300">
                Expert in 3D modeling and virtual environments with a passion for creating immersive
                digital experiences. As a key contributor to the VXLVerse platform, they specialize
                in developing interactive 3D content and sharing knowledge through comprehensive
                tutorials and articles.
              </p>
              <div className="mt-4 flex gap-3">
                <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                  More articles
                </a>
                <span className="text-gray-600">•</span>
                <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Portfolio
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related articles section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 pb-4 border-b border-gray-800">
            You might also like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group">
                <a
                  href="/blog"
                  className="block rounded-xl overflow-hidden bg-gray-800/30 border border-gray-700/50 hover:border-purple-600/50 transition-all"
                >
                  <div className="h-48 bg-gray-700 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-purple-900/30 to-gray-800/30 flex items-center justify-center text-gray-500">
                      <span>Featured Image</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors">
                      Another Interesting Article
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      A brief description of another interesting article that readers might enjoy
                      after reading this one.
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Apr 5, 2025</span>
                      <span>5 min read</span>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Share section */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-6">Share this article</h3>
          <div className="flex justify-center gap-4">
            <a
              href={`https://twitter.com/intent/tweet?url=https://vxlverse.com/blog/${post.id}&text=${post.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#1DA1F2] rounded-full hover:opacity-80 transition-opacity"
            >
              <FaTwitter className="text-white text-xl" />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=https://vxlverse.com/blog/${post.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#4267B2] rounded-full hover:opacity-80 transition-opacity"
            >
              <FaFacebook className="text-white text-xl" />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=https://vxlverse.com/blog/${post.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#0077B5] rounded-full hover:opacity-80 transition-opacity"
            >
              <FaLinkedin className="text-white text-xl" />
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
