import React, { useState, useRef, useEffect, FC } from 'react';
import './MainChat.css';

interface MainChatProps {
  isVisible?: boolean;
}

const MainChat: FC<MainChatProps> = ({ isVisible = true }) => {
  const [targetInputValue, setTargetInputValue] = useState<string>(''); // User's actual full input
  const [displayedInputValue, setDisplayedInputValue] = useState<string>(''); // What's shown with animation
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [applyTopFade, setApplyTopFade] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null); // To manage timeouts

  const checkAndUpdateFade = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setApplyTopFade(false);
      return;
    }

    const styles = getComputedStyle(textarea);
    const maxHeight = parseFloat(styles.maxHeight);

    // Check if the textarea's rendered height is at or very near its max-height
    const isAtMaxHeight = Math.abs(textarea.offsetHeight - maxHeight) < 2;
    const hasOverflowingContent = textarea.scrollHeight > textarea.clientHeight;
    const isScrolledDown = textarea.scrollTop > 5; // Small threshold

    if (isAtMaxHeight && hasOverflowingContent && isScrolledDown) {
      setApplyTopFade(true);
    } else {
      setApplyTopFade(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTargetInputValue(event.target.value); // Update the target value
  };

  useEffect(() => {
    // Clear any ongoing animation timeout if targetInputValue changes rapidly
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    // If target is shorter (e.g., deletion), update display immediately
    if (targetInputValue.length < displayedInputValue.length) {
      setDisplayedInputValue(targetInputValue);
      return;
    }

    // If target is same as display, nothing to do
    if (targetInputValue === displayedInputValue) {
      return;
    }

    // Animate the appearance of new characters
    const animateNextCharacter = (currentIndex: number) => {
      if (currentIndex < targetInputValue.length) {
        // Update displayed input to show one more character
        setDisplayedInputValue(targetInputValue.substring(0, currentIndex + 1));
        
        // Schedule the next character
        animationTimeoutRef.current = setTimeout(() => {
          animateNextCharacter(currentIndex + 1);
        }, 30); // Adjust delay for typing speed effect (e.g., 30-50ms)
      }
    };

    // Start animation from the current length of displayedInputValue
    animateNextCharacter(displayedInputValue.length);

    // Cleanup timeout on component unmount or if dependencies change before animation completes
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [targetInputValue, displayedInputValue]); // Changed displayedInputValue.length to displayedInputValue

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const originalScrollTop = textarea.scrollTop;
      const computedStyle = getComputedStyle(textarea);

      // Reset height to 'auto' to allow the browser to calculate the natural scrollHeight
      textarea.style.height = 'auto';

      requestAnimationFrame(() => {
        if (textareaRef.current) { // Re-check ref as component might have unmounted
          let newCalculatedHeight = textareaRef.current.scrollHeight;

          // If box-sizing is border-box, scrollHeight doesn't include borders.
          // The style.height needs to account for them.
          if (computedStyle.boxSizing === 'border-box') {
            const borderTopWidth = parseFloat(computedStyle.borderTopWidth) || 0;
            const borderBottomWidth = parseFloat(computedStyle.borderBottomWidth) || 0;
            newCalculatedHeight += borderTopWidth + borderBottomWidth;
          }

          // Ensure the calculated height respects the CSS max-height
          const maxHeightString = computedStyle.maxHeight;
          let finalHeight = newCalculatedHeight;

          if (maxHeightString && maxHeightString !== 'none') {
            const maxHeightPx = parseFloat(maxHeightString);
            if (!isNaN(maxHeightPx) && newCalculatedHeight > maxHeightPx) {
              finalHeight = maxHeightPx; // Cap the height at max-height
            }
          }

          textareaRef.current.style.height = `${finalHeight}px`;
          // Restore scroll position before checking fade, critical for correct scrollTop value
          textareaRef.current.scrollTop = originalScrollTop; 
          checkAndUpdateFade(); // Check fade after height adjustment and scroll restoration
        }
      });
    }
  }, [displayedInputValue]); // Auto-resize effect now depends on displayedInputValue

  const handleScroll = () => {
    checkAndUpdateFade();
  };

  return (
    <div className={`main-chat-container ${isVisible ? '' : 'hidden'}`}>
      <div className="main-display-text">
        Hallo! Wie kann ich dir heute helfen?
      </div>
      <div className="main-input-area">
        <textarea
          ref={textareaRef}
          value={displayedInputValue} // Bind to displayedInputValue
          onChange={handleInputChange}
          onScroll={handleScroll} // Added onScroll handler
          className={applyTopFade ? 'fade-top-text' : ''} // Added conditional class
          placeholder="Eingabe..."
          rows={1}
          spellCheck="false" 
        />
        <div className="send-button" onClick={() => console.log('Send clicked - implement me!')}>
          <svg className="send-icon" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MainChat;
