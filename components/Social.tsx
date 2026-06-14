"use client";

import { motion } from "framer-motion";
import { MessageCircle, Instagram } from "lucide-react";

const instagramPlaceholders = [
  { emoji: "🏄", bg: "from-cyan-400 to-teal-500" },
  { emoji: "🌊", bg: "from-blue-400 to-cyan-500" },
  { emoji: "🐢", bg: "from-teal-400 to-emerald-500" },
  { emoji: "🌅", bg: "from-orange-400 to-amber-500" },
  { emoji: "🤿", bg: "from-sky-400 to-blue-500" },
  { emoji: "🏝️", bg: "from-emerald-400 to-teal-500" },
];

export default function Social() {
  return (
    <section id="booking" className="py-0">
      {/* LINE Banner */}
      <div className="bg-ocean py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center text-white"
        >
          <p className="text-sm tracking-widest uppercase mb-3 text-white/80">
            Official LINE
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            LINEで簡単予約
          </h2>
          <p className="text-white/80 leading-relaxed mb-8 max-w-lg mx-auto">
            公式LINEを友達追加して、ご希望の日程・人数をメッセージするだけ。
            24時間以内に返信いたします。お気軽にどうぞ！
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-3 bg-[#06C755] hover:bg-[#05b34d] text-white font-bold text-lg px-10 py-4 rounded-full transition-all hover:scale-105 shadow-xl"
          >
            <MessageCircle size={22} />
            LINE友達追加
          </a>
        </motion.div>
      </div>

      {/* Instagram Grid */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="text-ocean font-semibold tracking-widest text-sm uppercase mb-3">
              Instagram
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-ink mb-2">
              フォトギャラリー
            </h2>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-ocean font-semibold text-sm hover:underline"
            >
              <Instagram size={16} />
              @okinawansup をフォロー
            </a>
          </motion.div>

          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {instagramPlaceholders.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`aspect-square bg-gradient-to-br ${item.bg} rounded-xl flex items-center justify-center text-5xl md:text-6xl cursor-pointer hover:scale-105 transition-transform duration-300 overflow-hidden`}
              >
                <span>{item.emoji}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
