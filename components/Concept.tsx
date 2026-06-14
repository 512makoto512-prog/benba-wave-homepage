"use client";

import { motion } from "framer-motion";
import { Users, Shield, Sunset } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "1組限定のプライベートツアー",
    description:
      "他のお客様と一緒になることはありません。あなただけの特別な空間で、沖縄の海をゆったりとお楽しみいただけます。カップル・家族・友人グループでも気兼ねなくどうぞ。",
  },
  {
    icon: Shield,
    title: "安心・安全のサポート体制",
    description:
      "経験豊富なインストラクターが丁寧にサポート。初心者の方でも安心してご参加いただけます。ライフジャケット完備で、お子様連れのご家族にも人気です。",
  },
  {
    icon: Sunset,
    title: "絶景ポイントへご案内",
    description:
      "地元だからこそ知っている、マップに載らない穴場スポットへご案内。透明度抜群の海でSUPを楽しみながら、忘れられない思い出を作りましょう。",
  },
];

export default function Concept() {
  return (
    <section id="concept" className="py-24 bg-white">
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
            Our Concept
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-ink mb-4">
            当社のこだわり
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            沖縄の海の魅力を最大限に感じていただくために、
            私たちは3つのことを大切にしています。
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-surface rounded-2xl p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-ocean/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon size={32} className="text-ocean" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
