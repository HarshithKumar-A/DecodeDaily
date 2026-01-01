import { getAllPosts, getPostBySlug } from '@/lib/getPosts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';

export const revalidate = 86400;

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) {
        return {};
    }

    return {
        title: post.title,
        description: post.description,
        alternates: {
            canonical: `/blog/${post.slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.description,
            type: 'article',
            url: `/blog/${post.slug}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.description,
        },
    };
}

export default async function BlogPost({ params }: Props) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="max-w-3xl mx-auto px-4 py-12 animate-in fade-in duration-500">
            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 tracking-tight">
                    {post.title}
                </h1>
                <div className="flex justify-center items-center space-x-4 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    <time dateTime={post.date} className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                        {post.date}
                    </time>
                </div>
                <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                    {post.description}
                </p>
            </header>

            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500 transition-colors prose-img:rounded-xl prose-img:shadow-lg">
                <MDXRemote source={post.content} />
            </div>
        </article>
    );
}
