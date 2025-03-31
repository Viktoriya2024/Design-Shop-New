import React, {useState} from "react";
import { Container, Row, Col, Button , Carousel} from "react-bootstrap";
import "../style/Home.css"; 
import backImage from "../assets/image/home-bg.jpeg";
import image1 from "../assets/image/design3.jpg";
import image2 from "../assets/image/design5.webp"
import image3 from "../assets/image/design4.jpg"


const carouselData = [
    {
      image: image1,
      title: "INTERIOR DECORATION",
      subtitle: "The final touch that will complete your new interior.",
      description: "Detailed information about the selected design feature, including any additional context or description you want to add here.",
      bgColor: "#0dcaf0"
    },
    {
      image: image2,
      title: "DESIGN PROJECT OF THE PREMISES.",
      subtitle: "A comprehensive solution for the complete renovation ",
      description: "Detailed information about the selected design feature, including any additional context or description you want to add.",
      bgColor: "#0dcaf0"
    },
    {
      image: image3,
      title: "SELECTION OF DETAILS",
      subtitle: "The final touch that will complete your new interior.",
      description: "Detailed information about the selected design feature, including any additional context or description you want to add here.",
      bgColor: "#0dcaf0"
    },
  ];
const Home = () => {
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
      };
    

    return (
        <Container
          fluid
          className="home-page"
          style={{
            backgroundImage: `url(${backImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Row
        className="align-items-center justify-content-center home-wrapper"
        style={{ background: carouselData[index].bgColor }}
      >
        {/* LEFT - IMAGE CAROUSEL */}
        <Col md={6} className="home-image">
          <Carousel activeIndex={index} onSelect={handleSelect} interval={3000}>
            {carouselData.map((item, idx) => (
              <Carousel.Item key={idx}>
                <img src={item.image} alt={`Design ${idx + 1}`} className="d-block w-100" />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>

        {/* RIGHT - TEXT CONTENT */}
        <Col md={6} className="home-content text-center">
          <h2>{carouselData[index].title}</h2>
          <h3>{carouselData[index].subtitle}</h3>
          <p>{carouselData[index].description}</p>
          <Button variant="primary">More Details</Button>
        </Col>
      </Row>

      <Button className="discount-btn">Get 5% Discount</Button>
    </Container>
  );
};

export default Home;
