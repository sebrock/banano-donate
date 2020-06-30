import React, { useState, useEffect } from "react";
import { getSendURI } from "banano-uri-generator";
import QRCode from "qrcode";
import BigNumber from "bignumber.js";
import NotFoundUser from "./NotFoundUser";
BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_UP });
const BananoUser = ({ user, ...props }) => {
  const [userpage, setUserPage] = useState({});
  const [banValue, setBanValue] = useState();
  const [activeBan, setActiveBan] = useState(false);
  const [entries, setEntries] = useState([{}]);
  const [qrBan, setQR] = useState("");

  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    console.log(tabs);
    try {
      console.log(tabs[0].id);
      const userTab = user[tabs[0].id];
      if (userTab) {
        const { banActive, bananoDonateEntries } = userTab;
        setActiveBan(banActive);
        if (!banActive) {
          history.push("/not-found");
        }
        if (bananoDonateEntries) {
          setUserPage(userTab);
          setEntries(bananoDonateEntries);
        } else {
          history.push("/not-found");
        }
      }
    } catch (e) {
      history.push("/not-found");
    }
  });

  const convertUnitBan = (value) => {
    //multiply number by ten then multiply to 10**28
    let data = Number(value * 10) * Math.pow(10, 28);
    return BigNumber(data).toFixed();
  };

  const sendBananas = (e, banAddress) => {
    e.preventDefault();
    console.log(convertUnitBan(banValue));
    QRCode.toDataURL(
      getSendURI(banAddress, convertUnitBan(banValue), `Banano donate tip`),
      {
        type: "svg",
      },
      function (error, value) {
        if (value) {
          setQR(value);
        }
      }
    );
  };

  if (!activeBan) {
    return <NotFoundUser />;
  }

  return (
    <>
	<table align="bottom">
		<td>
		<img src="../../images/icon128.png"></img>
		</td>
		<td>
		  <section>
			<h1>Donate BAN to the current website:</h1>
			<h2>{userpage.url}</h2>
			{qrBan ? <img src={qrBan} /> : null}
			{entries.map((user, index) => {
			  return (
				<form key={index} onSubmit={(e) => sendBananas(e, user.address)}>
				  <section className="user__form-tip">
					<input className="styleOfInput" 
					  type="text"
					  value={banValue}
					  onChange={(e) => setBanValue(e.target.value)}
					  placeholder={`Enter donation amount`}
					/>
					<button type="submit">Create QR code</button>
				  </section>
				</form>
			  );
			})}
		  </section>
	  	</td>
	</table>
   </>
  );
};
export default BananoUser;
