import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { pb } from "../lib/pocketbase";
import { BlogPost as BlogPostType } from "../types/blog";
import { Spinner } from "../components/ui/Spinner";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaTag,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
} from "react-icons/fa";
import useSWR from "swr";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
// Fetcher function for the blog post
async function fetchBlogPost(id: string) {
  const record = await pb.collection("blog_articles").getOne(id, {
    expand: "author",
  });

  return record as unknown as BlogPostType;
}

// Fetcher function for all blog posts with pagination
async function fetchAllBlogPosts() {
  // Load a larger number of posts (50) to reduce pagination needs
  const response = await pb.collection("blog_articles").getList(1, 50, {
    sort: "-created",
    expand: "author",
  });

  return response.items as unknown as BlogPostType[];
}

// Fetcher function for related posts
async function fetchRelatedPosts(_key: string, postData: BlogPostType) {
  if (!postData.tags || postData.tags.length === 0) return [];

  // Get related posts by excluding current post and getting random ones
  const relatedRecords = await pb.collection("blog_articles").getList(1, 3, {
    filter: `id != "${postData.id}"`,
    sort: "-created",
    expand: "author",
  });

  return relatedRecords.items as unknown as BlogPostType[];
}

export function Blog() {
  const { id } = useParams<{ id: string }>();

  // If we have an ID, fetch a single blog post, otherwise fetch all blog posts
  const {
    data: posts,
    error,
    isLoading,
  } = useSWR(!id ? "all-blog-articles" : null, fetchAllBlogPosts, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
  });

  // If we have an ID, fetch the specific blog post
  const {
    data: post,
    error: postError,
    isLoading: isPostLoading,
  } = useSWR(id ? `blog-article-${id}` : null, () => fetchBlogPost(id!), {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
  });

  const { data: relatedPosts = [], isLoading: isRelatedLoading } = useSWR(
    post ? [`related-posts-${post.id}`, post] : null,
    fetchRelatedPosts,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  // Determine loading and error states based on which mode we're in (single post or all posts)
  const isPageLoading = id ? isPostLoading || isRelatedLoading : isLoading;
  const pageError = id ? (postError ? postError.message : null) : error;

  if (isPageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <Spinner size="lg" />
      </div>
    );
  }

  // BlogCard component for the blog list view
  interface BlogCardProps {
    post: BlogPostType;
  }

  function BlogCard({ post }: BlogCardProps) {
    const src = pb.files.getURL(post, post.coverImage);
    const avatarUrl = post.expand?.author
      ? pb.files.getURL(post.expand.author, post.expand.author.avatar)
      : "";

    return (
      <Link to={`/blog/${post.id}`} className="group block h-full">
        <div className="rounded-xl overflow-hidden bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:border-purple-500/70 hover:shadow-xl hover:shadow-purple-500/10 h-full flex flex-col">
          {/* Image container with gradient overlay */}
          <div className="h-56 overflow-hidden relative">
            <img
              src={src}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/1200x800/222/444?text=VXLVerse";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Tags positioned on top of the image */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {post?.tags?.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-3 py-1 rounded-full bg-purple-900/80 text-purple-100 backdrop-blur-sm border border-purple-700/30 shadow-sm"
                >
                  <FaTag className="inline-block mr-1 text-[10px]" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content area */}
          <div className="p-6 flex-grow flex flex-col">
            <h2 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
              {post.title}
            </h2>
            <p className="text-gray-300 text-sm mb-5 line-clamp-3 flex-grow">{post?.excerpt}</p>

            {/* Author and date info */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border-2 border-purple-500/30 group-hover:border-purple-500/70 transition-colors">
                  <img
                    src={avatarUrl}
                    alt={post.expand?.author?.name || ""}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/200x200/222/444?text=Author";
                    }}
                  />
                </div>
                <span className="font-medium text-gray-200 group-hover:text-white transition-colors">
                  {post.expand?.author?.name || "Anonymous"}
                </span>
              </div>
              <div className="text-xs text-gray-400 flex items-center">
                <FaCalendarAlt className="mr-2" />
                {new Date(post?.created).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // If we're in blog list mode (no ID) and have posts, render the blog list
  if (!id && posts && posts.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Helmet>
          <title>Blog | VXLVerse</title>
          <meta
            name="description"
            content="Explore the latest articles, tutorials, and news about VXLVerse, 3D modeling, and web development."
          />
          <meta
            name="keywords"
            content="VXLVerse, blog, 3D modeling, web development, tutorials, React Three Fiber, Three.js"
          />
          <link rel="canonical" href="https://vxlverse.com/blog" />
        </Helmet>
        <Header />

        {/* Hero section with background image and overlay */}
        <div className="relative bg-black">
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <img
              src="https://placehold.co/1920x600/222/444?text=VXLVerse"
              alt="VXLVerse Blog"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>

          <div className="relative container mx-auto px-4 pt-32 pb-24 text-center">
            <div className="inline-block mb-3 px-4 py-1 rounded-full bg-purple-900/40 backdrop-blur-sm border border-purple-700/30 text-purple-200 text-sm font-medium">
              EXPLORE OUR KNOWLEDGE BASE
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
              VXLVerse Blog
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Insights, tutorials, and updates on 3D modeling and virtual environments
            </p>
            <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
              <button className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors">
                Latest Articles
              </button>
              <button className="px-6 py-3 rounded-full bg-gray-800/70 hover:bg-gray-700/70 text-white font-medium transition-colors border border-gray-700/50">
                Tutorials
              </button>
              <button className="px-6 py-3 rounded-full bg-gray-800/70 hover:bg-gray-700/70 text-white font-medium transition-colors border border-gray-700/50">
                3D Modeling
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl font-bold">Latest Articles</h2>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Sort by:</span>
              <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Most Popular</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((blogPost) => (
              <BlogCard key={blogPost.id} post={blogPost} />
            ))}
          </div>

          {/* Newsletter subscription */}
          <div className="mt-20 mb-10 p-10 rounded-2xl bg-gradient-to-r from-purple-900/30 to-gray-900/30 border border-purple-700/20">
            <div className="md:flex items-center justify-between">
              <div className="md:w-1/2 mb-6 md:mb-0">
                <h3 className="text-2xl font-bold mb-3">Stay Updated</h3>
                <p className="text-gray-300">
                  Subscribe to our newsletter for the latest tutorials, articles, and updates.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-grow px-4 py-3 rounded-l-lg bg-gray-800/70 border border-gray-700 focus:outline-none focus:border-purple-500"
                  />
                  <button className="px-6 py-3 rounded-r-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (pageError || (id && !post)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
        <div className="text-center text-red-500 p-8 rounded-lg border border-red-800 bg-red-900 bg-opacity-20 max-w-2xl w-full">
          <h1 className="text-2xl font-bold mb-4">{error || "Blog post not found"}</h1>
          <Link
            to="/blog"
            className="inline-flex items-center text-purple-400 hover:text-purple-300"
          >
            <FaArrowLeft className="mr-2" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // We've already checked that post exists in the if statement above
  const safePost = post!;
  const coverImageUrl = safePost.coverImage
    ? pb.files.getURL(safePost, safePost.coverImage)
    : "https://placehold.co/1200x800/222/444?text=VXLVerse";
  const authorAvatarUrl = safePost.expand?.author?.avatar
    ? pb.files.getURL(safePost.expand.author, safePost.expand.author.avatar)
    : "https://placehold.co/200x200/222/444?text=Author";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Helmet>
        <title>{safePost.title} | VXLVerse Blog</title>
        <meta name="description" content={safePost.excerpt || ""} />
        <meta name="keywords" content={(safePost.tags?.join(", ") || "") + ", VXLVerse, blog"} />
        <link rel="canonical" href={`https://vxlverse.com/blog/${safePost.id}`} />
        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content={safePost.title} />
        <meta property="og:description" content={safePost.excerpt || ""} />
        <meta property="og:image" content={coverImageUrl} />
        <meta property="og:url" content={`https://vxlverse.com/blog/${safePost.id}`} />
        <meta property="og:type" content="article" />
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={safePost.title} />
        <meta name="twitter:description" content={safePost.excerpt || ""} />
        <meta name="twitter:image" content={coverImageUrl} />
      </Helmet>

      {/* Full-width hero image with title overlay */}
      <div className="relative w-full h-[60vh] mb-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${coverImageUrl})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full p-8">
          <div className="container mx-auto max-w-5xl">
            <Link
              to="/blog"
              className="inline-flex items-center text-white bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-2 rounded-md mb-6"
            >
              <FaArrowLeft className="mr-2" /> Back to Blog
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {safePost.title}
            </h1>

            <div className="flex items-center text-white/80">
              <img
                src={authorAvatarUrl}
                alt={safePost.expand?.author?.name || "Author"}
                className="w-12 h-12 rounded-full mr-4 border-2 border-purple-500/50 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/200x200/222/444?text=Author";
                }}
              />
              <div>
                <div className="font-medium text-white">
                  {safePost.expand?.author?.name || "Unknown Author"}
                </div>
                <div className="text-sm">
                  {new Date(safePost.created).toLocaleDateString("en-US", {
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

      <div className="container mx-auto px-4 max-w-5xl">
        {/* Tags */}
        {safePost.tags && safePost.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {safePost.tags.map((tag, index) => (
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
        {safePost.excerpt && (
          <div className="mb-12 p-6 bg-purple-900/20 border-l-4 border-purple-600 rounded-r-lg">
            <p className="text-xl text-gray-200 font-light">{safePost.excerpt}</p>
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
            dangerouslySetInnerHTML={{ __html: safePost.article }}
          />
        </article>

        {/* Author bio card */}
        <div className="mb-16 bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 shadow-lg">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gradient-to-br from-purple-900/50 to-gray-900/50 p-6 flex flex-col justify-center items-center">
              <img
                src={authorAvatarUrl}
                alt={safePost.expand?.author?.name || "Author"}
                className="w-24 h-24 rounded-full border-2 border-purple-500 mb-4 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/200x200/222/444?text=Author";
                }}
              />
              <h3 className="text-xl font-bold text-white text-center">
                {safePost.expand?.author?.name || "Unknown Author"}
              </h3>
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

        {/* Social sharing section */}
        <div className="mb-16 text-center">
          <h3 className="text-lg font-medium mb-4">Share this article</h3>
          <div className="flex justify-center gap-4">
            <a
              href="#"
              className="text-white bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 p-3 rounded-full transition-colors"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="#"
              className="text-white bg-[#4267B2] hover:bg-[#4267B2]/90 p-3 rounded-full transition-colors"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="#"
              className="text-white bg-[#0077B5] hover:bg-[#0077B5]/90 p-3 rounded-full transition-colors"
            >
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>

        {/* Related articles section */}
        {relatedPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 pb-4 border-b border-gray-800">
              You might also like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="group">
                  <Link
                    to={`/blog/${relatedPost.id}`}
                    className="block rounded-xl overflow-hidden bg-gray-800/30 border border-gray-700/50 hover:border-purple-600/50 transition-all"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={pb.files.getURL(relatedPost, relatedPost.coverImage)}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/1200x800/222/444?text=VXLVerse";
                        }}
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {relatedPost.excerpt ||
                          "A brief description of another interesting article that readers might enjoy after reading this one."}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>
                          {new Date(relatedPost.created).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span>5 min read</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
