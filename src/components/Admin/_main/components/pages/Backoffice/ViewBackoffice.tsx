import React from 'react';

interface Company {
  id: number;
  name: string;
  rating: number;
}

interface Props {
  isEyeIconClicked: boolean;
  onEyeClick: () => void;
  data: Company[];
  onClose: () => void;
}

const ViewBackoffice: React.FC<Props> = ({ isEyeIconClicked, onEyeClick, data, onClose }) => {
  
  // Function to get display text (either original or asterisks)
  const getDisplayText = (text: string, isHidden: boolean) => {
    return isHidden ? '*'.repeat(text.length) : text;
  };

  // Function to get display rating (either original or asterisks)
  const getDisplayRating = (rating: number, isHidden: boolean) => {
    const ratingText = `${rating.toFixed(1)} / 10`;
    return isHidden ? '*'.repeat(ratingText.length) : ratingText;
  };

  return (
    <>
      <h1>Backoffice</h1>
      <div className="admin-panel-content-area">
        {data.map((company) => (
          <div className="content-rectangle" key={company.id}>
            <div className="company-name">
              {getDisplayText(company.name, isEyeIconClicked)}
              <span className="icons-group">
                {/* Trash Icon */}
                <div className="hover-icon-container trash-icon-container" onClick={onClose}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g id="_01_align_center" data-name="01 align center">
                      <path fill="#ececec" d="M22,4H17V2a2,2,0,0,0-2-2H9A2,2,0,0,0,7,2V4H2V6H4V21a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V6h2ZM9,2h6V4H9Zm9,19a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V6H18Z"/>
                      <rect fill="#ececec" x="9" y="10" width="2" height="8"/>
                      <rect fill="#ececec" x="13" y="10" width="2" height="8"/>
                    </g>
                  </svg>
                </div>

                {/* Eye Icon */}
                <div className="hover-icon-container" onClick={onEyeClick}>
                  {isEyeIconClicked ? (
                    // Eye Off Icon
                    <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24">
                      <path fill="#ececec" d="M23.271,9.419A15.866,15.866,0,0,0,19.9,5.51l2.8-2.8a1,1,0,0,0-1.414-1.414L18.241,4.345A12.054,12.054,0,0,0,12,2.655C5.809,2.655,2.281,6.893.729,9.419a4.908,4.908,0,0,0,0,5.162A15.866,15.866,0,0,0,4.1,18.49l-2.8,2.8a1,1,0,1,0,1.414,1.414l3.052-3.052A12.054,12.054,0,0,0,12,21.345c6.191,0,9.719-4.238,11.271-6.764A4.908,4.908,0,0,0,23.271,9.419ZM2.433,13.534a2.918,2.918,0,0,1,0-3.068C3.767,8.3,6.782,4.655,12,4.655A10.1,10.1,0,0,1,16.766,5.82L14.753,7.833a4.992,4.992,0,0,0-6.92,6.92l-2.31,2.31A13.723,13.723,0,0,1,2.433,13.534ZM15,12a3,3,0,0,1-3,3,2.951,2.951,0,0,1-1.285-.3L14.7,10.715A2.951,2.951,0,0,1,15,12ZM9,12a3,3,0,0,1,3-3,2.951,2.951,0,0,1,1.285.3L9.3,13.285A2.951,2.951,0,0,1,9,12Zm12.567,1.534C20.233,15.7,17.218,19.345,12,19.345A10.1,10.1,0,0,1,7.234,18.18l2.013-2.013a4.992,4.992,0,0,0,6.92-6.92l2.31-2.31a13.723,13.723,0,0,1,3.09,3.529A2.918,2.918,0,0,1,21.567,13.534Z"/>
                    </svg>
                  ) : (
                    // Eye On Icon
                    <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24">
                      <path fill="#ececec" d="M23.271,9.419C21.72,6.893,18.192,2.655,12,2.655S2.28,6.893.729,9.419a4.908,4.908,0,0,0,0,5.162C2.28,17.107,5.808,21.345,12,21.345s9.72-4.238,11.271-6.764A4.908,4.908,0,0,0,23.271,9.419Zm-1.705,4.115C20.234,15.7,17.219,19.345,12,19.345S3.766,15.7,2.434,13.534a2.918,2.918,0,0,1,0-3.068C3.766,8.3,6.781,4.655,12,4.655s8.234,3.641,9.566,5.811A2.918,2.918,0,0,1,21.566,13.534Z"/>
                      <path fill="#ececec" d="M12,7a5,5,0,1,0,5,5A5.006,5.006,0,0,0,12,7Zm0,8a3,3,0,1,1,3-3A3,3,0,0,1,12,15Z"/>
                    </svg>
                  )}
                </div>

                {/* Arrow Icon */}
                <div className="hover-icon-container">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ececec" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </span>
            </div>
            <div className="company-rating">{getDisplayRating(company.rating, isEyeIconClicked)}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ViewBackoffice;