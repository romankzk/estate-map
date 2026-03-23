import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-white dark:bg-[#111827] h-[100vh] pb-[120px] md:pb-[50px] lg:pb-[70px]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[50px] py-[30px] lg:py-[50px]">
        <div className="max-w-3xl">
          <h1 className="text-gray-900 dark:text-[#F3F4F6] text-[28px] md:text-[36px] lg:text-[42px] font-normal mb-[15px] lg:mb-[20px]">Реєстр маєтків XVI-XVIII ст.</h1>
          <p className="text-gray-700 dark:text-white text-[15px] md:text-[16px] lg:text-[18px] opacity-80 mb-[25px] lg:mb-[35px]">Легко шукайте та знаходьте староства, ключі та їхній склад на карті</p>
          <div className="flex-1 relative">
            <Button
              size="lg"
              className="p-6 cursor-pointer bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors"
              asChild
            >
              <a href="/estate-map">
                Перейти до карти <ArrowRight />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
