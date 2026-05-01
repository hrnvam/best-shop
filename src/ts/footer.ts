export function renderFooter(container: HTMLElement | null): void {
  if (!container) return;

  container.innerHTML = `
    <div class="back__container">
        <div class="benefits">
          <p class="benefits__title">Our Benefits</p>
          <div class="benefits__box">
            <div class="benefit">
              <img
                src="/src/assets/images/footer/benefit-1.png"
                alt="benefit"
                class="benefit__image"
              />
              <p class="benefit__text">
                Velit nisl sodales eget donec quis. volutpat orci.
              </p>
            </div>
            <div class="benefit">
              <img
                src="/src/assets/images/footer/benefit-2.png"
                alt="benefit"
                class="benefit__image"
              />
              <p class="benefit__text">
                Dolor eu varius. Morbi fermentum velit nisl.
              </p>
            </div>
            <div class="benefit">
              <img
                src="/src/assets/images/footer/benefit-3.png"
                alt="benefit"
                class="benefit__image"
              />
              <p class="benefit__text">
                Malesuada fames ac ante ipsum primis in faucibus.
              </p>
            </div>
            <div class="benefit">
              <img
                src="/src/assets/images/footer/benefit-4.png"
                alt="benefit"
                class="benefit__image"
              />
              <p class="benefit__text">
                Nisl sodales eget donec quis. volutpat orci.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="footer-left">
          <div class="footer-column">
            <a href="/src/html/about.html"><h3>About Us</h3></a>
            <ul>
              <li><a href="/src/html/about.html">Organisation</a></li>
              <li><a href="/src/html/about.html">Partners</a></li>
              <li><a href="/src/html/about.html">Clients</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3>Interesting Links</h3>
            <ul>
              <li><a href="#">Photo Gallery</a></li>
              <li><a href="#">Our Team</a></li>
              <li><a href="#">Socials</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3>Achievements</h3>
            <ul>
              <li><a href="#">Winning Awards</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Our Amazing Clients</a></li>
            </ul>
          </div>
          <div class="shipping-info footer-column">
            <h3>Shipping Information</h3>
            <p>
              Nulla eleifend pulvinar purus, molestie euismod odio imperdiet ac.
              Ut sit amet erat nec nibh rhoncus varius in non lorem. Donec
              interdum, lectus in convallis pulvinar, enim elit porta sapien,
              vel finibus erat felis sed neque. Etiam aliquet neque sagittis
              erat tincidunt aliquam.
            </p>
          </div>
        </div>

        <div class="footer-right">
          <div class="footer-column contact-text">
            <a href="/src/html/contact.html"><h3>Contact Us</h3></a>
            <p>
              Bendum dolor eu varius. Morbi fermentum velitsodales egetonec.
              volutpat orci. Sed ipsum felis, tristique egestas et, convallis ac
              velitn consequat nec luctus.
            </p>
          </div>

          <div class="contact-details">
            <div class="contact-item">
              <img src="/src/assets/images/footer/contact/phone.png" alt="phone">
              <span>Phone: (+63) 236 6322</span>
            </div>
            <div class="contact-item">
              <img src="/src/assets/images/footer/contact/email.png" alt="email">
              <span>public@news.com</span>
            </div>
            <div class="contact-item">
              <img src="/src/assets/images/footer/contact/time.png" alt="time">
              <span>Mon - Fri: 10am - 6pm<br />Sat - Sun: 10am - 6pm</span>
            </div>
            <div class="contact-item">
              <img src="/src/assets/images/footer/contact/location.png" alt="location">
              <span>639 Jade Valley, <br />Washington Dc</span>
            </div>
          </div>
        </div>
      </div>
      <div class="copyright">© Copyright 2025</div>`;
}
