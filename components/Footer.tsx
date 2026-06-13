import { Instagram, MessageCircle, Mail } from "lucide-react";

const footerLinks = [
  { label: "About", href: "#concept" },
  { label: "Locations", href: "#locations" },
  { label: "Reviews", href: "#reviews" },
  { label: "Booking", href: "#booking" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-black tracking-widest mb-4 text-ocean">
              OKINAWANSUP
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              沖縄の美しい海で、あなたのための特別なSUP体験を。
              1組限定のプライベートツアーで最高の思い出を作りましょう。
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-sm tracking-widest uppercase mb-4 text-gray-300">
              Navigation
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-ocean transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm tracking-widest uppercase mb-4 text-gray-300">
              Contact
            </h4>
            <div className="space-y-3">
              <a
                href="#"
                className="flex items-center gap-3 text-gray-400 text-sm hover:text-ocean transition-colors"
              >
                <MessageCircle size={16} />
                LINE公式アカウント
              </a>
              <a
                href="mailto:info@okinawansup.com"
                className="flex items-center gap-3 text-gray-400 text-sm hover:text-ocean transition-colors"
              >
                <Mail size={16} />
                info@okinawansup.com
              </a>
              <a
                href="#"
                className="flex items-center gap-3 text-gray-400 text-sm hover:text-ocean transition-colors"
              >
                <Instagram size={16} />
                @okinawansup
              </a>
            </div>

            {/* Company Info */}
            <div className="mt-6 text-xs text-gray-600 leading-relaxed space-y-1">
              <p>営業エリア：沖縄県（恩納村・名護市・金武町）</p>
              <p>受付時間：8:00〜20:00（年中無休）</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} OKINAWANSUP. All Rights Reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-600">
            <a href="#" className="hover:text-gray-400 transition-colors">
              プライバシーポリシー
            </a>
            <a href="#" className="hover:text-gray-400 transition-colors">
              特定商取引法に基づく表記
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
