import styles from "./ManageUser.module.scss";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { UserData } from "../../models/User";
import Button from "../../components/Button/Button";

const ManageUser = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  

  const Status = ({ isBanned }: { isBanned: boolean }) => {
    return (
      <div
        className={
          isBanned ? styles.bannedIndicator : styles.availableIndicator
        }
      >
        {isBanned ? "Banned" : "Available"}
      </div>
    );
  };

  const handleBan = async (id : number, isBanned : boolean) => {
    try {
        const response = await fetch(
          `http://127.0.0.1:3000/api/user/${isBanned ?  "unban" : "ban"}/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        if (!response.ok) {
          console.log(await response.json());
          throw new Error("Failed to ban/unban user");
        }
  
        fetchUser();
        alert("Ban/Unban Successful");
      } catch (error) {
        console.error("Error banning:", error);
        alert("Ban/Unban Unsuccessful");
      }
    };

    const fetchUser = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3000/api/user/get");
        if (!response.ok) throw new Error(response.statusText);

        const data = await response.json();
        setUsers(data);
        console.log(data)
      } catch (error) {
        console.log("Network Error");
      }
    };

    useEffect(() => {
    
        fetchUser();
      }, []);

  return (
    <div className={styles.container}>
      <Header>Manage User</Header>
      <div className={styles.tableContainer}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>No</th>
              <th>User's Full Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>
                  {user.first_name} {user.last_name}
                </td>
                <td>{user.email}</td>
                <td>{user.phone_number}</td>
                <td>
                  <Status isBanned={user.banned}></Status>
                </td>
                <td>
                    <Button onClick={() => handleBan(user.id, user.banned)}  primary>
                        {user.banned ? "Unban" : "Ban"}
                    </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
 }

export default ManageUser;
