import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {  Navbar, Nav, Container  } from 'react-bootstrap';
import { motion } from 'framer-motion';
import "./NavBar.css"
const NavBar = () => {
  const [isAnimating, setIsAnimating] = useState(true);

  const navItems = [
    { text: "Home", to: "/" },
    { text: "About Us", to: "/about-us" },
    { text: "Request", to: "/request" },
    { text: "Basket", to: "/basket" },
    {text:"Our products", to:"/products"}
  ];

  return (
    <Navbar bg="dark" expand="lg">
      <Container>
        {/* Animated Design Studio Logo */}
        <Navbar.Brand as={Link} to="/" onClick={() => setIsAnimating(!isAnimating)}>
          <motion.ul
            className="item"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {["D", "e", "s", "i", "g", "n", "S", "t", "u", "d", "i", "o"].map(
              (letter, index) => (
                <li key={index} className={!isAnimating ? "stop-animation" : ""}>
                  {letter}
                </li>
              )
            )}
          </motion.ul>
        </Navbar.Brand>

        {/* Navbar Links with Hover Animation */}
        <Navbar.Toggle aria-controls="navbar-nav"className="custom-toggler" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav className="navbar-nav">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link className="btn" to={item.to}>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  {item.text}
                </Link>
              </li>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default NavBar;
