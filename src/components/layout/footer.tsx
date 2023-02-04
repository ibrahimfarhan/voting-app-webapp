import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import styles from './footer.module.scss';

const Footer = () => {
  return (
    <footer>
      <p className={styles.sentence}>Developed and maintained by Ibrahim Farhan</p>
      <div className={styles.icons}>
        <a target="blank" className={styles.icon} href="https://linkedin.com/in/ibrahimahmadfarhan">
          <FaLinkedin
            color="#0072B1"
            size="2rem"
          />
        </a>
        <a className={styles.icon} target="blank" href="https://github.com/ibrahimfarhan">
          <FaGithub size="2rem" color="black" />
        </a>
      </div>
    </footer>
  )
}

export default Footer;
