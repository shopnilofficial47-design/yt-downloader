const ytdl = require('@distube/ytdl-core');

export default async function handler(req, res) {
    // CORS সেটআপ (যাতে ব্রাউজার আমাদের রিকোয়েস্ট ব্লক না করে)
    res.setHeader('Access-Control-Allow-Origin', '*');

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "দয়া করে একটি ইউটিউব লিংক দিন!" });
    }

    try {
        // ইউটিউব থেকে ভিডিওর ভেতরের ডেটা বের করা
        const info = await ytdl.getInfo(url);
        
        // শুধু ভিডিও এবং অডিও একসাথে আছে এমন লিংকগুলো (MP4) ফিল্টার করা
        const formats = ytdl.filterFormats(info.formats, 'videoandaudio');

        // ইউজারের জন্য সহজ করে ডাটা সাজানো
        const videoData = {
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[0].url,
            links: formats.map(format => ({
                quality: format.qualityLabel || 'Unknown',
                url: format.url
            }))
        };

        // আমাদের ওয়েবসাইটকে ডাটা পাঠিয়ে দেওয়া
        res.status(200).json(videoData);

    } catch (error) {
        res.status(500).json({ error: "ভিডিওটি প্রসেস করা যাচ্ছে না। অন্য লিংক দিয়ে চেষ্টা করুন।" });
    }
}

