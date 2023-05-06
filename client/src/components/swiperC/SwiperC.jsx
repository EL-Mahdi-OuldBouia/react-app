// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import './SwiperC.css';

// Import Swiper styles
import 'swiper/css';
import Story from '../story/Story';

const SwiperC = () => {
    return (
        <Swiper
            spaceBetween={20}
            slidesPerView={3}
            // centeredSlides={true}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
        >
            <SwiperSlide><Story storyNumber={1} /></SwiperSlide>
            <SwiperSlide><Story storyNumber={2} /></SwiperSlide>
            <SwiperSlide><Story storyNumber={3} /></SwiperSlide>
            <SwiperSlide><Story storyNumber={4} /></SwiperSlide>
            <SwiperSlide><Story storyNumber={5} /></SwiperSlide>
            <SwiperSlide><Story storyNumber={6} /></SwiperSlide>

        </Swiper>
    );
};
export default SwiperC;