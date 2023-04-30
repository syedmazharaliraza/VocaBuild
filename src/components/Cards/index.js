import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper";
import CardContent from "./CardContent";
import useSavedWords from "../../hooks/useSavedWords";

const Cards = ({ datevalue }) => {
  const savedWords = useSavedWords();
  return (
    <>
      <Swiper
        effect={"cards"}
        grabCursor
        modules={[EffectCards]}
        className="mySwiper"
        style={{ zIndex: 0 }}
      >
        {savedWords.map((each, idx) => (
          <SwiperSlide>
            <CardContent data={each} index={idx} total={savedWords.length} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default Cards;
