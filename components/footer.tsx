export default function Footer() {
  return (
    <footer className="py-6 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto flex-col mt-2 flex justify-between items-center font-bold">
        <p className="text-xs sm:text-sm">
          © 2024 北京博智酝育医疗科技有限公司
        </p>
        <p className="text-xs sm:text-sm">
          联系电话: 010-89493162
        </p>
        <p className="text-xs sm:text-sm">
          联系地址: 北京市大兴区庞各庄镇隆新大街3号1幢平房153
        </p>
        <a
          className="text-xs sm:text-sm underline"
          href="https://beian.miit.gov.cn/"
          target="_blank"
        >
          京ICP备2024068426号-2
        </a>
      </div>
    </footer>
  );
}
