import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const imageMap = {
  "ceremonial-grade-matcha": "https://d2xsxph8kpxj0f.cloudfront.net/310519663316500249/apqtJUDUYHtKki6GyTbyQ9/matcha-ceremonial-H9v4VNShNJdVuTjwwRVwrQ.webp",
  "daily-detox-green-tea": "https://d2xsxph8kpxj0f.cloudfront.net/310519663316500249/apqtJUDUYHtKki6GyTbyQ9/daily-detox-tea-NxteVK8nENTHCoZZf4JDuR.webp",
  "ashwagandha-calm-blend": "https://d2xsxph8kpxj0f.cloudfront.net/310519663316500249/apqtJUDUYHtKki6GyTbyQ9/ashwagandha-blend-PD5DNov5RihRPH9sPQnDBC.webp",
  "turmeric-golden-latte": "https://d2xsxph8kpxj0f.cloudfront.net/310519663316500249/apqtJUDUYHtKki6GyTbyQ9/turmeric-golden-latte-NHDVPoX7bPGorautEaqgpN.webp",
  "moringa-energy-powder": "https://d2xsxph8kpxj0f.cloudfront.net/310519663316500249/apqtJUDUYHtKki6GyTbyQ9/moringa-powder-Lv6Dc9uZnX7YNoHVqTAT9p.webp",
  "jasmine-pearl-green-tea": "https://d2xsxph8kpxj0f.cloudfront.net/310519663316500249/apqtJUDUYHtKki6GyTbyQ9/jasmine-pearl-tea-437UGgKKzWXW9cW7ebxeUS.webp",
  "collagen-beauty-blend": "https://d2xsxph8kpxj0f.cloudfront.net/310519663316500249/apqtJUDUYHtKki6GyTbyQ9/collagen-beauty-MbSS6TEvZ6fiwxshaVt8W6.webp",
  "chamomile-honey-dream": "https://d2xsxph8kpxj0f.cloudfront.net/310519663316500249/apqtJUDUYHtKki6GyTbyQ9/chamomile-honey-fWpznxhWeWty234h2PoVuH.webp",
  "metabolism-fire-blend": "https://d2xsxph8kpxj0f.cloudfront.net/310519663316500249/apqtJUDUYHtKki6GyTbyQ9/metabolism-fire-69DmqEYrm3LYCTa5qw45nM.webp",
  "wellness-starter-gift-set": "https://d2xsxph8kpxj0f.cloudfront.net/310519663316500249/apqtJUDUYHtKki6GyTbyQ9/wellness-gift-set-DAr95V2yoHrY5ZnEHhiDLn.webp",
  "sencha-supreme": "https://d2xsxph8kpxj0f.cloudfront.net/310519663316500249/apqtJUDUYHtKki6GyTbyQ9/sencha-supreme-C5ZkESYwH97ThTj2UqB7Rf.webp",
  "gut-restore-probiotic-tea": "https://d2xsxph8kpxj0f.cloudfront.net/310519663316500249/apqtJUDUYHtKki6GyTbyQ9/gut-restore-tea-3QbzAcG8DterajBmDmGnCs.webp",
};

async function updateImages() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  for (const [slug, imageUrl] of Object.entries(imageMap)) {
    await conn.execute(
      `UPDATE products SET images = ? WHERE slug = ?`,
      [JSON.stringify([imageUrl]), slug]
    );
    console.log(`Updated image for: ${slug}`);
  }

  console.log("All images updated!");
  await conn.end();
  process.exit(0);
}

updateImages().catch(e => { console.error(e); process.exit(1); });
