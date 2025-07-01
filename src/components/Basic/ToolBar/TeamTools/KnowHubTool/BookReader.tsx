import React, { useState, useEffect } from 'react';
import "./BookReader.css";
interface BookPage {
  id: number;
  title: string;
  content: string;
  isBookmark?: boolean;
}

interface BookReaderProps {
  isVisible: boolean;
  onClose: () => void;
}

const BookReader: React.FC<BookReaderProps> = ({ isVisible, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);

  // Sample book content
  const pages: BookPage[] = [
    {
      id: 0,
      title: "Document Library",
      content: `Welcome to your Document Library. This interactive book contains all your important documents and files.

Navigate through the pages using the arrow buttons or click on bookmarks to jump to saved pages.

You can bookmark any page by clicking the bookmark icon in the top-left corner.

This is your starting point for exploring the document collection.`
    },
    {
      id: 1,
      title: "Chapter 1: Getting Started",
      content: `This chapter covers the basics of document management.

• How to organize your files
• Setting up categories
• Creating shortcuts
• Understanding file types

The system is designed to be intuitive and user-friendly. Each document type has its own icon and category for easy identification.

Remember to bookmark important pages for quick access later.`
    },
    {
      id: 2,
      title: "Chapter 2: Advanced Features",
      content: `Advanced document management features:

• Full-text search across all documents
• Version control and history
• Collaborative editing
• Automated backup systems
• Integration with external tools

These features help you work more efficiently and keep your documents organized and secure.

The search function can find text within documents, making it easy to locate specific information.`
    },
    {
      id: 3,
      title: "Chapter 3: Document Types",
      content: `Different types of documents in the system:

• Drop Documents - Quick reference materials
• Flow Charts - Process documentation
• Descriptions - Detailed explanations
• Reports - Data analysis and summaries
• Templates - Reusable document formats

Each type serves a specific purpose and has tailored viewing options to enhance readability and usability.`
    },
    {
      id: 4,
      title: "Chapter 4: Best Practices",
      content: `Best practices for document management:

• Use clear, descriptive file names
• Maintain consistent folder structures
• Regular backup and archiving
• Set appropriate access permissions
• Keep documents up to date

Following these practices ensures your document library remains organized and accessible to all team members.

Regular maintenance keeps the system running smoothly.`
    },
    {
      id: 5,
      title: "Chapter 5: Troubleshooting",
      content: `Common issues and solutions:

• Document not loading: Check file format
• Search not working: Rebuild search index  
• Access denied: Verify permissions
• Slow performance: Clear browser cache
• Version conflicts: Use merge tools

Most issues can be resolved quickly by following these troubleshooting steps.

Contact support if problems persist.`
    },
    {
      id: 6,
      title: "Appendix",
      content: `Additional resources and references:

• User manual download links
• Video tutorials
• FAQ section
• Support contact information
• System requirements
• Update notifications

This appendix contains supplementary information to help you get the most out of the document management system.

Bookmark this page for quick access to help resources.`
    }
  ];

  useEffect(() => {
    // Load bookmarks from memory (simulating localStorage)
    const savedBookmarks = sessionStorage.getItem('bookReader_bookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }

    // Load last read page
    const lastPage = sessionStorage.getItem('bookReader_lastPage');
    if (lastPage) {
      setCurrentPage(parseInt(lastPage));
    }
  }, []);

  useEffect(() => {
    // Save current page to memory
    if (isVisible) {
      sessionStorage.setItem('bookReader_lastPage', currentPage.toString());
    }
  }, [currentPage, isVisible]);

  const nextPage = () => {
    if (currentPage < pages.length - 2 && !isAnimating) {
      setIsAnimating(true);
      setAnimationDirection('right');
      
      setTimeout(() => {
        setCurrentPage(currentPage + 2);
        setTimeout(() => setIsAnimating(false), 400);
      }, 400);
    }
  };

  const prevPage = () => {
    if (currentPage > 1 && !isAnimating) {
      setIsAnimating(true);
      setAnimationDirection('left');
      
      setTimeout(() => {
        setCurrentPage(currentPage - 2);
        setTimeout(() => setIsAnimating(false), 400);
      }, 400);
    }
  };

  const toggleBookmark = () => {
    const newBookmarks = bookmarks.includes(currentPage)
      ? bookmarks.filter(page => page !== currentPage)
      : [...bookmarks, currentPage];
    
    setBookmarks(newBookmarks);
    sessionStorage.setItem('bookReader_bookmarks', JSON.stringify(newBookmarks));
  };

  const goToBookmark = (pageNum: number) => {
    if (pageNum !== currentPage && !isAnimating) {
      // Ensure we go to an even page number for left page display
      const targetPage = pageNum % 2 === 0 ? pageNum : pageNum - 1;
      setIsAnimating(true);
      setAnimationDirection(targetPage > currentPage ? 'right' : 'left');
      setTimeout(() => {
        setCurrentPage(targetPage);
        setTimeout(() => setIsAnimating(false), 400);
      }, 400);
      setShowBookmarks(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  // Calculate which pages to show
  const leftPageIndex = currentPage;
  const rightPageIndex = currentPage + 1;

  return (
    <div className="book-reader-overlay" onClick={onClose}>
      <div className="book-reader-container" onClick={(e) => e.stopPropagation()}>
       
        
        {/* Book Header */}
        <div className="book-header">
          <div className="book-controls-left">
            {/* Bookmark Button */}
            <button 
              className={`bookmark-btn ${bookmarks.includes(leftPageIndex) ? 'active' : ''}`}
              onClick={toggleBookmark}
              title={bookmarks.includes(leftPageIndex) ? 'Remove bookmark' : 'Add bookmark'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 2H7C5.9 2 5 2.9 5 4V22L12 19L19 22V4C19 2.9 18.1 2 17 2Z" 
                      fill={bookmarks.includes(leftPageIndex) ? "#FFD700" : "none"} 
                      stroke="currentColor" 
                      strokeWidth="2"/>
              </svg>
            </button>

            {/* Bookmarks List Button */}
            <button 
              className="bookmarks-list-btn"
              onClick={() => setShowBookmarks(!showBookmarks)}
              title="View bookmarks"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className="book-title">Document Library</div>
          
          <button className="book-close-btn" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Bookmarks Dropdown */}
        {showBookmarks && (
          <div className="bookmarks-dropdown">
            <h4>Bookmarked Pages</h4>
            {bookmarks.length === 0 ? (
              <p className="no-bookmarks">No bookmarks yet</p>
            ) : (
              <ul className="bookmarks-list">
                {bookmarks.map(pageNum => (
                  <li key={pageNum} onClick={() => goToBookmark(pageNum)}>
                    <span className="bookmark-icon">🔖</span>
                    <span>Page {pageNum + 1}: {pages[pageNum]?.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Book Container */}
        <div className="book-container">
          {/* Left Page */}
          <div className="book-page left-page">
            {pages[leftPageIndex] && (
              <div className="page-content">
                <div className="page-number">Page {leftPageIndex + 1}</div>
                <h2 className="page-title">{pages[leftPageIndex].title}</h2>
                <div className="page-text">
                  {pages[leftPageIndex].content.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Page */}
          <div className="book-page right-page">
            {pages[rightPageIndex] && (
              <div className="page-content">
                <div className="page-number">Page {rightPageIndex + 1}</div>
                <h2 className="page-title">{pages[rightPageIndex].title}</h2>
                <div className="page-text">
                  {pages[rightPageIndex].content.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Animated turning page */}
          {isAnimating && animationDirection === 'right' && pages[rightPageIndex] && (
            <div className="turning-page flip-right">
              <div className="page-content">
                <div className="page-number">Page {rightPageIndex + 1}</div>
                <h2 className="page-title">{pages[rightPageIndex].title}</h2>
                <div className="page-text">
                  {pages[rightPageIndex].content.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {isAnimating && animationDirection === 'left' && pages[leftPageIndex - 2] && (
            <div className="turning-page flip-left">
              <div className="page-content">
                <div className="page-number">Page {leftPageIndex - 1}</div>
                <h2 className="page-title">{pages[leftPageIndex - 2].title}</h2>
                <div className="page-text">
                  {pages[leftPageIndex - 2].content.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Arrows */}
          <button 
            className={`nav-arrow left-arrow ${currentPage === 0 ? 'disabled' : ''}`}
            onClick={prevPage}
            disabled={currentPage === 0 || isAnimating}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button 
            className={`nav-arrow right-arrow ${rightPageIndex >= pages.length - 1 ? 'disabled' : ''}`}
            onClick={nextPage}
            disabled={rightPageIndex >= pages.length - 1 || isAnimating}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Page Progress */}
        <div className="book-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((leftPageIndex + 1) / pages.length) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text">{leftPageIndex + 1}-{Math.min(rightPageIndex + 1, pages.length)} of {pages.length}</span>
        </div>
      </div>
    </div>
  );
};

export default BookReader;