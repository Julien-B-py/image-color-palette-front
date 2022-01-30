function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      ©{currentYear === 2022 ? currentYear : `2022-${currentYear}`},
      <a href="https://github.com/Julien-B-py">
        {" Julien BEAUJOIN"} <i className="fab fa-github"></i>
      </a>
    </footer>
  );
}

export default Footer;
