import { useState, useEffect } from "react";

export default function MyAccount() {
  const [accountInfo, setAccountInfo] = useState<any>(null);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await fetch('/api/myaccount');
        const data = await response.json();
        setAccountInfo(data);
      } catch (error) {
        console.error("Error fetching account info", error);
      }
    };

    fetchAccountInfo();
  }, []);

  const handleUpdate = () => {
    console.log("Update Account");
  };

  const handleDelete = async () => {
    try {
      const response = await fetch("/api/myaccount", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: accountInfo.id }),
      });
      if (response.ok) {
        console.log("Account deleted successfully");
      } else {
        console.error("Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account", error);
    }
  };

  if (!accountInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>My Account</h1>
      <img src={accountInfo.profilePic || "default-pic-url"} alt="Profile Picture" />
      <ul>
        <li>{accountInfo.firstname} {accountInfo.lastname}</li>
        <li>{accountInfo.email}</li>
        <li>{accountInfo.username}</li>
      </ul>
      <button onClick={handleUpdate}>Update Account</button>
      <button onClick={handleDelete}>Delete Account</button>
    </div>
  );
}
