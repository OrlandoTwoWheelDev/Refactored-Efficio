import { useState, useEffect } from 'react';

export default function MyAccount() {
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await fetch(`/api/myaccount?username=${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        const result = await response.json();
        setAccountInfo({ ...result.user, teammates: result.teammates });
      } catch (error) {
        console.error('Error fetching account info', error);
      }
    };

    fetchAccountInfo();
  }, [username]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountInfo((prevInfo: any) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch('/api/myaccount', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountInfo),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setAccountInfo(updatedData);
        setIsEditing(false);
        alert('Account updated successfully');
      } else {
        console.error('Failed to update account');
      }
    } catch (error) {
      console.error('Error updating account', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch('/api/myaccount', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: accountInfo.id }),
      });
      if (response.ok) {
        console.log('Account deleted successfully');
      } else {
        console.error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account', error);
    }
  };

  if (!accountInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="form">
      <div className="inner-form">
        <h1>My Account</h1>
        <img
          src={accountInfo?.profilePic || 'default-pic-url'}
          alt="Profile Picture"
        />
        <input
          type="text"
          name="firstname"
          className="form-control"
          value={accountInfo.firstname}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <input
          type="text"
          name="lastname"
          className="form-control"
          value={accountInfo.lastname}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <input
          type="email"
          name="email"
          className="form-control"
          value={accountInfo.email}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <input
          type="text"
          name="username"
          className="form-control"
          value={accountInfo.username}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <h2>Team: {accountInfo?.teamname ?? 'No team'}</h2>

        {accountInfo?.teammates?.length > 0 ? (
          <>
            <h3>Teammates:</h3>
            <ul>
              {accountInfo.teammates.map((teammate: any, index: number) => (
                <li key={index}>
                  {teammate.firstname} {teammate.lastname} – {teammate.email}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No teammates yet.</p>
        )}
      </div>

      <button className='btn btn-secondary' onClick={() => setIsEditing((prev) => !prev)}>
        {isEditing ? 'Cancel' : 'Edit Account'}
      </button>

      {isEditing && <button className='btn btn-primary' onClick={handleUpdate}>Update Account</button>}
      <button className='btn btn-danger btn-sm' onClick={handleDelete}>Delete Account</button>
    </div>
  );
}
