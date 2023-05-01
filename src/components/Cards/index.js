import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper";
import CardContent from "./CardContent";
import useSavedWords from "../../hooks/useSavedWords";
import NoContentScreen from "../NoContentScreen";

const Cards = ({ datevalue }) => {
  const { savedWords, deleteWord } = useSavedWords(
    datevalue.toLocaleString().slice(0, 8)
  );
  return (
    <>
      {savedWords.length === 0 ? (
        <NoContentScreen />
      ) : (
        <Swiper
          effect={"cards"}
          grabCursor
          modules={[EffectCards]}
          className="mySwiper"
          style={{ zIndex: 0 }}
        >
          {savedWords.map((each, idx) => (
            <SwiperSlide>
              <CardContent
                data={each}
                index={idx}
                total={savedWords.length}
                deleteWord={deleteWord}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
};

export default Cards;
