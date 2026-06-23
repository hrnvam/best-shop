import { renderFeatures, Feature } from './features.js';

const aboutData: Feature[] = [
  {
    id: 1,
    icon: './assets/images/about_us/icons/accuracy.png',
    title: 'Superior Accuracy',
    description: 'Qewist vestibulum elit vel neque pharetra vulputate scelerisque nisi urna.'
  },
  {
    id: 2,
    icon: './assets/images/about_us/icons/awards.png',
    title: 'Awards',
    description: 'Vestibulum elit vel neque pharetra vulputate. Quisque scelerisque nisi urna.'
  },
  {
    id: 3,
    icon: './assets/images/about_us/icons/ecological.png',
    title: 'Ecological',
    description: 'Elit vel neque duis vestibulum pharetra vulputateuisque scelerisque nisi urna.'
  },
  {
    id: 4,
    icon: './assets/images/about_us/icons/shipping.png',
    title: 'Shipping Worldwide',
    description: 'Quisque scelerisque nisi urna. Duis vestibulum elit vel neque pharetra vulputate.'
  }
];

const featuresContainer = document.getElementById('company-features');
renderFeatures(featuresContainer, aboutData);