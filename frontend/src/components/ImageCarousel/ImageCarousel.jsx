
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const ImageCarousel = () => {
  const images = [
    'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg',
    'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg',
    'https://images.pexels.com/photos/703016/pexels-photo-703016.jpeg',
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Slider {...settings}>
      {images.map((url, index) => (
        <div key={index}>
          <img src={url} alt={`Slide ${index + 1}`} style={{ width: '100%' }} />
        </div>
      ))}
    </Slider>
  );
};

export default ImageCarousel;
