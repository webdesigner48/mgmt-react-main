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
}

const ViewRangliste: React.FC<Props> = ({ isEyeIconClicked, onEyeClick, data }) => {
  return (
    <>
      <h1>Rangliste</h1>
      <div className="admin-panel-content-area">
        {data.map((company) => (
          <div className="rangliste-item" key={company.id}>
            <div className="rangliste-company-name">{company.name}</div>

            <div className="rangliste-rating-details-container">
              <div className="rangliste-hover-boxes-container">
                {/* Dummy sub-ratings — customize as needed */}
                <div className="hover-box blue-border">1.0</div>
                <div className="hover-box orange-border">2.0</div>
                <div className="hover-box red-border">3.0</div>
                <div className="hover-box green-border">4.0</div>
              </div>

              <div className="rangliste-company-rating">{company.rating.toFixed(1)}</div>

             
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ViewRangliste;
