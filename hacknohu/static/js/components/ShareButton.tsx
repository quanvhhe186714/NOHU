import React from "react";
import "../../css/components/ShareButton.css";

const ShareButtons: React.FC = () => {
  const handleTelegramShare = () => {
    window.open('https://t.me/WebbuffMXH', '_blank');
  };

  const handleZaloShare = () => {
    window.open("https://zalo.me/0929092575", "_blank");
  };

  return (
    <div className="share-buttons-container">
      <button 
        className="share-button telegram-share"
        onClick={handleTelegramShare}
        title="Chia sẻ qua Telegram"
      >
        <svg className="share-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.48.33-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.178.121.13.156.307.165.43-.001.14-.023.315-.077.524z"/>
        </svg>
        {/* <span className="share-text">Telegram</span> */}
      </button>
      
      <button 
        className="share-button zalo-share"
        onClick={handleZaloShare}
        title="Chia sẻ qua Zalo"
      >
        <svg className="share-icon" viewBox="0 0 48 48" fill="currentColor">
          <defs>
            <style>{`.b{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;}`}</style>
          </defs>
          <polyline className="b" points="12.466 19.2658 19.182 19.2658 12.466 29.4028 19.182 29.4028"/>
          <path className="b" d="m41.517,4.5018l-29.011.0354C3.882,11.9372,1.282,21.9552,8.976,36.4482c.4875,1.7082-.359,3.42-1.9992,5.1283,2.3642.3218,4.7693-.1218,6.863-1.266,13.983,6.27,21.919,2.1805,29.644-2.7323l.0355-31.074c.0013-1.1046-.8931-2.001-1.9977-2.0023-.0015,0-.003,0-.0045,0h0Z"/>
          <path className="b" d="m25.63,26.791c0,1.4425-1.2196,2.6118-2.724,2.6118s-2.724-1.1694-2.724-2.6118v-1.6978c0-1.4425,1.2196-2.6118,2.724-2.6118s2.724,1.1694,2.724,2.6118"/>
          <path className="b" d="m34.7606,22.483h0c1.4987,0,2.7136,1.2149,2.7136,2.7136v1.4948c0,1.4987-1.2149,2.7136-2.7136,2.7136h0c-1.4987,0-2.7136-1.2149-2.7136-2.7136v-1.4948c0-1.4987,1.2149-2.7136,2.7136-2.7136Z"/>
          <line className="b" x1="25.63" y1="29.403" x2="25.63" y2="22.482"/>
          <path className="b" d="m28.311,18.955v9.1434c0,.7214.5848,1.3062,1.3062,1.3062h.3918"/>
        </svg>
        {/* <span className="share-text">Zalo</span> */}
      </button>
    </div>
  );
};

export default ShareButtons; 