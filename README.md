# CreditDNA — Credit for Every Indian

Your UPI history is your credit history. CreditDNA builds a 300–900 credit score on your device.

## About

CreditDNA is a modern web application that provides accessible credit scoring for Indians by leveraging their existing UPI transaction history. Rather than relying on traditional credit bureaus, CreditDNA analyzes UPI patterns to generate a credit score, making financial inclusion possible for millions.

## Features

- **Device-Based Credit Score** – Secure, on-device credit score calculation
- **UPI-Powered Analytics** – Analyze transaction history for creditworthiness
- **300–900 Score Range** – Industry-standard credit score range
- **Mobile-First Design** – Responsive and accessible on all devices
- **3D Visualizations** – Engaging DNA-themed visualizations

## How It Works

CreditDNA analyzes UPI transaction patterns to determine creditworthiness:

1. **Transaction Analysis** – Your UPI history is securely processed locally on your device
2. **Pattern Recognition** – Machine learning algorithms identify payment behavior and reliability
3. **Score Generation** – A credit score between 300–900 is generated based on transaction patterns
4. **Secure & Private** – All calculations happen on your device; no data is sent to external servers

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- HTTPS connection
- UPI account with transaction history

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/creditdna.git
   cd creditdna
   ```

2. Open `index.html` in your browser or serve with a local server:
   ```bash
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

## Architecture

### Frontend Components
- **Navigation Bar** – Mobile-responsive navigation with authentication tabs
- **Hero Section** – Main landing page with 3D DNA visualization
- **Score Calculator** – Interactive interface to analyze UPI transactions
- **User Dashboard** – View personalized credit insights
- **Authentication** – Login and registration flows

### Design System
- **Colors** – Accent orange (#d4500f), inviting greens, and neutral inks
- **Typography** – Bricolage Grotesque for headings, Plus Jakarta Sans for body text
- **Components** – Custom buttons, cards, forms, and input fields
- **Responsive** – Mobile-first design that scales from 320px to 4K displays

## Key Features Deep Dive

### Privacy-First Approach
Your financial data never leaves your device. All credit scoring happens locally using secure algorithms, ensuring your privacy is always protected.

### Accessibility
CreditDNA is designed to be accessible to all Indians, including those with:
- Limited digital literacy
- No traditional credit history
- UPI-only banking usage
- Device or connectivity constraints

### 3D Experience
Interactive DNA helix animations powered by Three.js create an engaging visual representation of your credit profile evolution.

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile, Samsung Internet)

## Performance

- Fully responsive design with optimized animations
- Fast local credit score calculation
- Minimal network requests (only for external assets)
- Smooth 60fps animations on modern devices

## Tech Stack

- **Frontend Framework** – HTML5, Tailwind CSS
- **Styling** – Custom Tailwind configuration with accent colors and typography
- **3D Graphics** – Three.js for DNA helix visualizations
- **Fonts** – Bricolage Grotesque (display), Plus Jakarta Sans (body)
- **Responsiveness** – Mobile-first CSS with viewport meta tags
- **Animation** – CSS keyframes and requestAnimationFrame

## File Structure

```
creditdna/
├── index.html          # Main application file
├── README.md          # Project documentation
└── [additional assets] # CSS, JS, and media files
```

## Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Team

This project was built with passion by:

- **Simon Paul** – Lead Developer
- **Varsha Rani** – Design & UX
- **Mayank Bansal** – Backend & Architecture
- **Deva Nandha** – Product & Research

## License

This project is licensed under the MIT License – see LICENSE file for details.

## Contact & Support

- 📧 Email: contact@creditdna.com
- 🐦 Twitter: @CreditDNA
- 📱 Website: creditdna.com

---

**Making credit accessible to every Indian.**
