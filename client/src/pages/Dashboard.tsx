/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const socket = useSocket();

  const [usernameToAdd, setUsernameToAdd] = useState("");
  const [pendingSent, setPendingSent] = useState([]);
  const [pendingReceived, setPendingReceived] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedUserMutuals, setSelectedUserMutuals] = useState<any[]>([]);
  const [viewingUsername, setViewingUsername] = useState<string | null>(null);
  const fetchAll = async () => {
    try {
        const res = await API.get("/friends/pending");
        setPendingSent(res.data.sent);
        setPendingReceived(res.data.received);
    
        const fRes = await API.get("/friends/list");
        setFriends(fRes.data);

        setSelectedUserMutuals([]);
        setViewingUsername(null);
    } catch (err) {
         toast.error("Failed to fetch data.");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

    // ✅ Socket listener for real-time notifications
  useEffect(() => {
    if (!socket) return;

    socket.on("new_request", (data: any) => {
      toast(`New friend request from ${data.from}`, {
        action: {
          label: "View",
          onClick: () => {
            fetchAll();
          },
        },
      });
    });

    return () => {
      socket.off("new_request");
    };
  }, [socket]);

  const sendRequest = async () => {
    try {
      const { data } = await API.get(`/user/search/${usernameToAdd}`);
      await API.post("/friends/send", { to: data._id });
      setUsernameToAdd("");
      fetchAll();
    } catch (err:any) {
      if (err.response?.data?.error) {
      toast.error(err.response.data.error);
    } else {
      toast.error("Something went wrong.");
    }
      // alert("User not found or request already sent.");
    }
  };

  const respondRequest = async (id: string, action: "accept" | "reject") => {
    await API.post("/friends/respond", { requestId: id, action });
    fetchAll();
  };

  const cancelRequest = async (id: string) => {
  try {
    await API.post("/friends/cancel", { requestId: id });
    fetchAll();
    toast.success("Friend request cancelled.");
  } catch (err) {
    toast.error("Failed to cancel request.");
  }
};
  const fetchMutualFriends = async (userId: string, username: string) => {
    try {   
      const res = await API.get(`/friends/mutual/${userId}`);
      const mutuals = Array.isArray(res.data) ? res.data : res.data?.mutualFriends ?? [];
      setSelectedUserMutuals(mutuals);
      setViewingUsername(username);
      toast.success("Mutual friends fetched.");
    } catch (err) {
      toast.error("Failed to fetch mutual friends.");
      setSelectedUserMutuals([]);
    setViewingUsername(null);
    }
  };
  const confirmRemoveFriend = (friendId: string, username: string) => {
  toast.error(`Remove ${username} from your friends?`, {
    action: {
      label: "Confirm ",
      onClick: () => removeFriend(friendId),
    },
    duration: 5000,
  });
};

  const removeFriend = async (friendId: string) => {
  try {
    await API.post("/friends/remove", { friendId });
    toast.success("Friend removed");
    fetchAll(); // refresh the list
  } catch (err) {
    toast.error("Failed to remove friend");
    console.error("Remove friend error:", err);

  }
};


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Send Friend Request</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            placeholder="Enter username"
            value={usernameToAdd}
            onChange={(e) => setUsernameToAdd(e.target.value)}
          />
          <Button onClick={sendRequest}>Send</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Received Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingReceived.map((req: any) => (
              <div key={req._id} className="flex justify-between items-center">
                <span>{req.from.username}</span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => respondRequest(req._id, "accept")}>Accept</Button>
                  <Button size="sm" variant="destructive" onClick={() => respondRequest(req._id, "reject")}>Reject</Button>
                </div>
              </div>
            ))}
            {pendingReceived.length === 0 && <p className="text-muted-foreground">No received requests.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sent Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingSent.map((req: any) => (
              <div key={req._id} className="flex justify-between">
                <span>{req.to.username}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 italic">Pending</span>
                  <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => cancelRequest(req._id)}
                  >
                  Cancel
                  </Button>
                </div>
              </div>
            ))}
            {pendingSent.length === 0 && <p className="text-muted-foreground">No sent requests.</p>}
          </CardContent>
        </Card>
      </div>

     <Card>
        <CardHeader>
          <CardTitle>Your Friends</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {friends.map((f: any) => (
            <div key={f._id} className="flex justify-between items-center">
              <span>{f.username} ({f.email})</span>
              <div className="flex items-center gap-3">
                
              <Button size="sm" variant="outline" onClick={() => fetchMutualFriends(f._id, f.username)}>
                Mutual Friends
              </Button>
                <Button size="sm" variant="destructive" onClick={() => confirmRemoveFriend(f._id, f.username)}>
                 Remove Friend
                </Button>
                </div>
            </div>
          ))}
          {friends.length === 0 && <p className="text-muted-foreground">No friends yet.</p>}
        </CardContent>
      </Card>
      {viewingUsername && (
  <Card>
    <CardHeader>
      <CardTitle>Mutual Friends with {viewingUsername}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-1">
      {selectedUserMutuals.length > 0 ? (
        selectedUserMutuals.map((mf: any) => (
          <p key={mf._id}>
            {mf.username} ({mf.email})
          </p>
        ))
      ) : (
        <p className="text-muted-foreground">No mutual friends.</p>
      )}
    </CardContent>
  </Card>
)}
       <div className="flex items-center justify-between gap-3">
        <div className="flex items-center justify-between gap-3">

      <div className="text-center">
        <Button
          variant="secondary"
          onClick={() => navigate("/profile")}
          className="mb-4"
          >
          Manage Blocked Users
        </Button>
      </div>
      <div className="text-center">
        <Button
          variant="secondary"
          onClick={() => navigate("/audit-log")}
          className="mb-4"
        >
          View Audit Log
        </Button>
      </div>
          </div>

      {/* Logout */}
      <div className="text-center">
        <Button
          variant="destructive"
          onClick={() => {
            logout();
            navigate("/");
            toast.success("Logged out successfully.");
          }}
        >
          Logout
        </Button>
      </div>      
      </div>
    </div>
  );
}
