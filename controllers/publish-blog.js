import cron from 'node-cron';
import BLOG from '../models/blogs.js';

function BlogScheduler() {
  cron.schedule('0 */6 * * *', async () => {
    const now = new Date();
    const blogsToPublish = await BLOG.find({
      status: 'scheduled',
      publishAt: { $lte: now },
    });

    for (const blog of blogsToPublish) {
      blog.status = 'published';
      await blog.save();
      console.log(`Published blog ${blog._id} at ${now.toISOString()}`);
    }
  });
}

export default BlogScheduler;
