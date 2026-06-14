"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const locations = [
  {
    area: "恩納村",
    furigana: "おんなそん",
    description:
      "エメラルドグリーンの透明な海が広がる沖縄屈指のリゾートエリア。珊瑚礁が美しく、ウミガメに出会えることも。",
    tags: ["サンゴ礁", "ウミガメ", "透明度◎"],
    bgColor: "from-cyan-400 to-teal-500",
  },
  {
    area: "名護市",
    furigana: "なごし",
    description:
      "沖縄本島北部のやんばる自然豊かなエリア。マングローブや緑に囲まれた川沿いSUPも楽しめる穴場スポット。",
    tags: ["マングローブ", "自然体験", "川SUP"],
    bgColor: "from-teal-400 to-emerald-500",
  },
  {
    area: "金武町",
    furigana: "きんちょう",
    description:
      "手つかずの自然が残るローカル感あふれるエリア。観光客が少なく、静かな海でのんびりSUPを満喫できます。",
    tags: ["穴場スポット", "プライベート感", "ローカル"],
    bgColor: "from-sky-400 to-cyan-500",
  },
];

export default function Locations() {
  return (
    <section className="py-24 bg-surface">
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
            Locations
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-ink mb-4">
            開催エリア
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            基本的には現地（ビーチや海岸）集合・現地解散です。
            ご希望のエリアをお選びください。
          </p>
        </motion.div>

        {/* Location Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {locations.map((loc, i) => (
            <motion.div
              key={loc.area}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group"
            >
              {/* Image placeholder */}
              <div
                className={`h-52 bg-gradient-to-br ${loc.bgColor} relative overflow-hidden`}
              >
                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMzBRMTUgMCAzMCAzMFQ2MCAzMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+')]" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-xs tracking-widest opacity-80">{loc.furigana}</p>
                  <p className="text-3xl font-black">{loc.area}</p>
                </div>
                <div className="absolute top-4 right-4">
                  <MapPin size={24} className="text-white/70" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {loc.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {loc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-ocean/10 text-ocean text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Meeting point note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <p className="inline-flex items-center gap-2 bg-white border border-ocean/20 text-gray-500 text-sm px-6 py-3 rounded-full">
            <MapPin size={14} className="text-ocean" />
            ご予約後に現地の集合場所をお伝えします
          </p>
        </motion.div>
      </div>
    </section>
  );
}
