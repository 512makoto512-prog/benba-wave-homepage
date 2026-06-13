"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "田中 さくら",
    origin: "東京都",
    rating: 5,
    comment:
      "初めてのSUPでしたが、インストラクターの方がとても丁寧に教えてくださいました。透明な海でウミガメにも会えて最高の思い出になりました！",
    tag: "カップル旅行",
    bgColor: "bg-cyan-100",
  },
  {
    name: "山田 健太",
    origin: "大阪府",
    rating: 5,
    comment:
      "プライベートツアーなので子どもたちのペースに合わせてもらえて助かりました。家族全員が大満足でリピート確定です。",
    tag: "家族旅行",
    bgColor: "bg-teal-100",
  },
  {
    name: "Emily S.",
    origin: "Australia",
    rating: 5,
    comment:
      "Absolutely stunning experience! The guide knew all the secret spots. The water was crystal clear and we saw sea turtles. 100% recommend!",
    tag: "Solo Travel",
    bgColor: "bg-sky-100",
  },
  {
    name: "佐藤 美咲",
    origin: "神奈川県",
    rating: 5,
    comment:
      "友達3人で参加しました。秘密のビーチに連れて行ってもらい、写真もたくさん撮ってもらえました。SNS映えも最高でした！",
    tag: "友人グループ",
    bgColor: "bg-emerald-100",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} className="text-sunset fill-sunset" />
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section id="reviews" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-ocean font-semibold tracking-widest text-sm uppercase mb-3">
            Reviews
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-ink mb-4">
            お客様の声
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            毎回全力でサポートした結果、多くの方に喜んでいただいています。
          </p>
        </motion.div>

        {/* Review Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-surface rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              {/* Image placeholder */}
              <div
                className={`w-full aspect-video ${review.bgColor} rounded-xl mb-4 overflow-hidden relative group`}
              >
                <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-30 group-hover:scale-105 transition-transform duration-300">
                  🌊
                </div>
                <div className="absolute top-2 left-2">
                  <span className="bg-white/80 text-ocean text-xs font-semibold px-2 py-0.5 rounded-full">
                    {review.tag}
                  </span>
                </div>
              </div>

              <Stars count={review.rating} />
              <p className="text-gray-600 text-sm leading-relaxed my-3">
                "{review.comment}"
              </p>
              <div className="border-t border-gray-100 pt-3 mt-auto">
                <p className="font-bold text-sm text-ink">{review.name}</p>
                <p className="text-gray-400 text-xs">{review.origin}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
