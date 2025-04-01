import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MyAccount.css";

const MyAccount = () => {
  const [myAccountInfo, setMyAccountInfo] = useState([]); 
  const [userTeams, setUserTeams] = useState([]);
  const [username, setUsername] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsername(payload.username);
        console.log("Extracted username:", payload.username);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  const fetchMyAccountInfo = async () => {
    if (!username) return;

    try {
      const response = await fetch(`/api/users/myaccountinfo/${username}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  const data = await response.json();
  console.log("fetched account info", data);
      const myAccountInfoList = await response.json();
      console.log("MyAccountInfoList: ", myAccountInfoList);
      setMyAccountInfo(myAccountInfoList);
      getAllTeams(myAccountInfoList); 
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const getAllTeams = (myAccountInfo) => {
    const tempUserTeams = {};
    for (let i = 0; i < myAccountInfo.length; i++) {
      if (myAccountInfo[i].team_name in tempUserTeams) {
        console.log('skipping');
      } else {
        tempUserTeams[myAccountInfo[i].team_name] = 1;
      }
    }

    let teams = [];
    for (const key in tempUserTeams) {
      teams.push(key);
    }
    setUserTeams(teams);
  };

  useEffect(() => {
    if (username) {
      const wait = async () => {
        await fetchMyAccountInfo();
      };
      wait();
    }
  }, [username]);

  console.log(`MY ACCOUNT INFO`, myAccountInfo);
  console.log(userTeams);

  return (
    <div className="profile-container">
      <h2>My Account</h2>
      {myAccountInfo.length > 0 ? (  
        <div className="profile-details">
          <div className="avatar-container">
            <img src="./johndoe.webp" alt="User Avatar" className="avatar" />
          </div>
          <div className="user-info">
            <p><strong>First Name: </strong> {myAccountInfo[0].user_first_name || "N/A"}</p>
            <p><strong>Last Name: </strong> {myAccountInfo[0].user_last_name || "N/A"}</p>
            <p><strong>Username: </strong> {myAccountInfo[0].user_username || "N/A"}</p>
            <p><strong>Team Members: </strong>{myAccountInfo.map((teamMember) => teamMember.teammate_first_name).join(', ')}</p>
            <p><strong>My Teams: </strong> {userTeams?.map((teams) => teams).join(', ')}</p>
          </div>
        </div>
      ) : (
        <p>Loading account information...</p>
      )}
    </div>
  );
};

export default MyAccount;
