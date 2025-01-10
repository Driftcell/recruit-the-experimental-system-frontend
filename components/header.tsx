"use client";

/* eslint-disable @next/next/no-img-element */
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

const navLinks = [
  { name: "首页", url: "/" },
  { name: "AI小智", url: "/chat" },
  { name: "爱丁堡产后抑郁量表", url: "/edps" },
  { name: "个人信息", url: "/profile" },
];

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useDebounce(false, 100);

  const [prevScrollY, setPrevScrollY] = useState(0);
  const [diffY, setDiffY] = useState(0);
  const [showNavLinks, setShowNavLinks] = useState<typeof navLinks>([]);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setDiffY(0);
        setShowMobileMenu(false);
        return;
      }
      setDiffY(currentScrollY - prevScrollY);
      if (diffY < 0 && currentScrollY > 0) {
        setShowMobileMenu(false);
      }
      setPrevScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
      },
    }).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        
        if (data.Profile === null) {
          setShowNavLinks(navLinks);
        } else if (data.Profile.edps === null) {
          setShowNavLinks(navLinks.slice(0, 3));
        } else {
          setShowNavLinks(navLinks.slice(0, 2));
        }
      }
    });
  });

  return (
    <nav
      className="bg-[#E9A79B] sticky top-0 z-50 transition-all duration-300 ease-in-out"
      style={{ transform: `translateY(${diffY <= 0 ? "0" : "-100%"})` }}
    >
      <div className="flex items-end pb-2 justify-between px-6 h-[4.5rem] max-w-6xl mx-auto">
        <Link href="/">
          <img
            src="/logo.png"
            draggable="false"
            loading="lazy"
            alt="Logo"
            className="h-12"
          />
        </Link>

        <div className="items-center space-x-8 hidden md:flex">
          {showNavLinks.map((link) => (
            <Link
              key={link.name}
              href={link.url}
              className={`pb-1 text-white text-sm hover:text-[#F2E9E4] ${
                pathname === link.url
                  ? "border-b-2 border-white font-bold"
                  : "border-b-2 border-transparent"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <button
          className="text-white md:hidden focus:ring-2 focus:ring-white rounded-lg px-2 py-0.5"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <FontAwesomeIcon icon={faBars} size="2x" className="py-[0.1rem]" />
        </button>
      </div>

      <div
        className={`
            absolute flex flex-col bg-[#E9A79B] items-center space-y-4 md:hidden border-t-2 border-white transition-all w-full origin-top duration-100 ease-in-out ${
              showMobileMenu ? "opacity-100 py-4" : "opacity-0"
            } ${showMobileMenu ? "scale-y-100" : "scale-y-0 h-0"}
            `}
      >
        {showNavLinks.map((link) => (
          <Link
            key={link.name}
            href={link.url}
            className={`text-white sm:text-lg hover:text-[#F2E9E4] ${
              pathname === link.url
                ? "border-b-2 border-white font-bold"
                : "border-b-2 border-transparent"
            }`}
            onClick={() => {
              window.scrollTo(0, 0);
              setShowMobileMenu(!showMobileMenu);
            }}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
