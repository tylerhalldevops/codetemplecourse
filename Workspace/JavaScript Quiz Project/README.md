# JavaScript Fundamentals Quiz

An interactive JavaScript quiz application built with vanilla JavaScript, HTML, and CSS. Test your knowledge of JavaScript fundamentals through an engaging quiz experience.

## Features

- ✅ Interactive question-by-question quiz format
- ✅ Immediate visual feedback (green for correct, red for incorrect)
- ✅ Score tracking throughout the quiz
- ✅ Final score display with restart functionality
- ✅ Modern, responsive design
- ✅ Smooth animations and transitions

## Setup Instructions

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A local web server (optional, but recommended)

### Installation

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd "JavaScript Quiz Project"
   ```

2. **Open the project**
   - Option 1: Simply open `index.html` in your web browser
   - Option 2: Use a local web server for better development experience:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (if you have http-server installed)
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```
     Then navigate to `http://localhost:8000` in your browser

3. **Start the quiz**
   - The quiz will automatically load when you open the page
   - Click on an answer option to select it
   - Click "Next Question" to proceed
   - View your final score at the end
   - Click "Restart Quiz" to try again

## Project Structure

```
JavaScript Quiz Project/
├── index.html      # HTML structure
├── style.css       # Styling and visual design
├── script.js       # Quiz logic and functionality
└── README.md       # This file
```

## How It Works

1. **Quiz Data**: Questions are stored in the `quizData` array in `script.js`
2. **Question Loading**: Each question is displayed one at a time with multiple choice options
3. **Answer Selection**: Users click an option, which triggers immediate visual feedback
4. **Score Tracking**: Correct answers increment the score counter
5. **Results Display**: After all questions, the final score is shown
6. **Restart**: Users can restart the quiz to try again

## Customization

### Adding More Questions

Edit the `quizData` array in `script.js`:

```javascript
{
    question: "Your question here?",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    answer: 0  // Index of the correct answer (0-3)
}
```

### Styling

Modify `style.css` to change colors, fonts, spacing, or layout. The current design uses:
- Purple gradient background
- White card containers
- Green (#4caf50) for correct answers
- Red (#f44336) for incorrect answers

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available for educational purposes.
