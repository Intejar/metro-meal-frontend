import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthProvider/AuthProvider";
import toast from "react-hot-toast";

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [varify, setVarify] = useState([]);

  useEffect(() => {
    fetch(`https://metromeal-server-tfxl.vercel.app/allUsers`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  }, []);
  useEffect(() => {
    fetch(`https://metromeal-server-tfxl.vercel.app/AllVarifyReq`)
      .then((res) => res.json())
      .then((data) => {
        setVarify(data);
        console.log("v", data);
      });
  }, []);

  const handleVarify = async (id, userId, role) => {
    try {
      console.log(id, userId, role);

      // Step 1: Update User Role
      const updateRoleResponse = await fetch(
        `https://metromeal-server-tfxl.vercel.app/users/varify/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }),
        }
      );

      const updateRoleData = await updateRoleResponse.json();

      if (updateRoleData.acknowledged) {
        // Step 2: Delete Verification Request
        const deleteResponse = await fetch(
          `https://metromeal-server-tfxl.vercel.app/varifyUser/${id}`,
          {
            method: "DELETE",
          }
        );

        const deleteData = await deleteResponse.json();

        if (deleteData.deletedCount > 0) {
          console.log("Verification request deleted successfully.");
          window.location.reload();
        } else {
          console.log("Failed to delete verification request.");
        }
      } else {
        console.log("Role update failed:", updateRoleData.message);
      }
    } catch (error) {
      console.error("Error during verification:", error);
    }
  };

  return (
    <div className="overflow-x-auto mx-5 min-h-screen mt-5">
      <div role="tablist" className="tabs tabs-bordered">
        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab text-green-600"
          aria-label="Users Information"
          defaultChecked
        />
        <div role="tabpanel" className="tab-content p-10">
          <div role="tablist" className="tabs tabs-lifted">
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              className="tab text-green-600"
              aria-label="All Users"
              defaultChecked
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 rounded-box p-6"
            >
              {users.length > 0 ? (
                <table className="table w-full">
                  {/* Table head */}
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>User Role</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Table body */}
                    {users.map((user, i) => (
                      <tr key={i}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle h-12 w-12">
                                <img src={user.img} alt="Avatar" />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{user.name}</div>
                              <div className="text-sm opacity-50">
                                {user.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.roleCategory}</td>
                        <td>{user.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No users found.</p>
              )}
            </div>
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              className="tab text-green-600"
              aria-label="Varification Request"
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 rounded-box p-6"
            >
              {varify.length > 0 ? (
                <table className="table w-full">
                  {/* Table head */}
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>User Role</th>
                      <th>Image Proof</th>
                      <th>Approve</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Table body */}
                    {varify.map((user, i) => (
                      <tr key={i}>
                        <td>{user.userName}</td>
                        <td>{user.userEmail}</td>
                        <td>{user.roleCategory}</td>
                        <td>
                          <div className="avatar">
                            <div className="mask mask-squircle h-12 w-12">
                              <img src={user.img} alt="Avatar" />
                            </div>
                          </div>
                        </td>

                        <td>
                          <span
                            className="btn btn-sm btn-success"
                            onClick={() =>
                              handleVarify(
                                user._id,
                                user.userId,
                                user.roleCategory
                              )
                            }
                          >
                            Approve
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No users found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUser;
