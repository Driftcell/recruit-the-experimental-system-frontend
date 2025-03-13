/* eslint-disable @next/next/no-img-element */
"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import Link from "next/link";
import { QRCodeDialog } from "@/components/qrcode";
import { Suspense } from "react";
import Chat from "@/components/chat";

function Description() {
  const features = [
    { name: "私密", border: "border-[#D2DFB3]" },
    { name: "科学", border: "border-[#EFC0B6]" },
    { name: "创新", border: "border-[#FCCF8E]" },
    { name: "有爱", border: "border-[#E9A79B]" },
  ];

  return (
    <div className="px-4 sm:px-8 relative">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
        className="mx-auto md:ml-0 md:w-[200%] max-md:mt-[10vh] md:absolute text-[6.5vw] md:text-[min(4vw,3rem)] tracking-widest leading-[5.5rem]"
        style={{ fontFamily: "ZhiMangXing,Slidexiaxing" }}
      >
        <span className="inline-block translate-y-[1vw] text-[20vw] md:text-[min(12vw,9rem)] text-[#CA7F72] mr-2 leading-3">
          博
        </span>
        众人之
        <span className="text-[12vw] md:text-[min(8vw,5rem)] text-[#CA7F72]">
          智
        </span>
        ，<br />
        助千万华人妈妈
        <span className="inline-block translate-y-[0.5vw] text-[16vw] md:text-[min(9vw,5.5rem)] text-[#CA7F72]">
          身心
        </span>
        健康
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
        className="md:pt-[min(24vw,12.5rem)] sm:text-lg text-gray-700 indent-10 tracking-wide !leading-10 md:!leading-[2rem] lg:!leading-[3rem]"
      >
        我们致力于帮助妈妈群体应对孕产期身心挑战，使妈妈们能够从容享受和宝宝及家人相处的幸福时光。在孕育新生命的旅程中，我们不但同样是妈妈，更是您的盟友。
      </motion.p>

      <hr className="my-4 hidden md:block" />

      <div className="px-4 md:hidden pb-8">
        <img
          className="w-full"
          src="/phone-lg.jpg"
          draggable="false"
          loading="lazy"
          alt="hero page image"
          width="500"
          height="488"
        />
      </div>

      <div className="flex flex-col max-md:space-y-4 md:flex-row justify-between items-center">
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, delay: index * 0.15 + 1 }}
              viewport={{ once: true }}
              className={`flex text-sm md:text-[min(1.5vw,1rem)] items-center space-x-2 border rounded-full px-4 md:px-[min(1vw,1rem)] py-0.5 ${feature.border}`}
            >
              <p>{feature.name}</p>
            </motion.div>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="md:text-[min(1.5vw,1rem)]"
        >
          自助 / 互助 / 团助
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="mt-4 my-8 sm:my-8 px-2 sm:px-4 flex flex-col md:items-start"
      >
        <Link
          href="/login"
          className="px-6 py-2 text-center sm:text-lg tracking-wider rounded-full bg-[#E9A79B] text-white transition-all duration-300 ease-in-out hover:shadow-xl"
        >
          登录 <FontAwesomeIcon icon={faArrowRight} />
        </Link>
      </motion.div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="max-w-6xl items-center grid-cols-2 mx-auto overflow-x-hidden md:grid md:py-14 min-h-[calc(100vh-4.5rem)]">
        <Description />

        <div className="hidden md:block my-4 md:pl-[min(6vw,2.5rem)]">
          <motion.img
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="w-full"
            src="/phone-lg.jpg"
            draggable="false"
            loading="lazy"
            alt="hero page image"
            width="500"
            height="488"
          />
        </div>
      </div>
      <Suspense>
        <Chat />
      </Suspense>
      <QRCodeDialog />
    </div>
  );
}
