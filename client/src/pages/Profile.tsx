/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import API from "../api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [blockedIds, setBlockedIds] = useState<string[]>([]);

  // Fetch users & blocked list when user is loaded
  useEffect(() => {

    fetchUsers();
    fetchBlocked();
  }, [user]);

  // Fetch all other users
  const fetchUsers = async () => {
    try {
      const res = await API.get("/user/all");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  // Fetch who the current user has blocked
  const fetchBlocked = async () => {
    try {
      const res = await API.get(`/user/search/${user.username}`);
     const ids = res.data.blocked; // already an array of IDs
    console.log("Blocked IDs (raw):", ids);
    setBlockedIds(ids);
    } catch (err) {
      toast.error("Failed to fetch blocked users");
    }
  };

  // Toggle block/unblock
  const toggleBlock = async (id: string) => {
    if (!user || !id) return;

    if (user._id === id) {
      toast.error("You can't block yourself.");
      return;
    }

    try {
      const isBlocked = blockedIds.includes(id);
      const userToToggle = users.find((u) => u._id === id);

      if (isBlocked) {
        await API.post(`/user/unblock/${id}`);
        toast.success(`Unblocked ${userToToggle?.username}`);
      } else {
        await API.post(`/user/block/${id}`);
        toast.success(`Blocked ${userToToggle?.username}`);
      }

      // Refresh state
      await fetchBlocked();
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to toggle block");
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {users.map((u) => (
            <div
              key={u._id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">{u.username}</p>
                <p className="text-muted-foreground text-sm">{u.email}</p>
              </div>
              <Button
                variant={
                  blockedIds.includes(u._id) ? "destructive" : "default"
                }
                onClick={() => toggleBlock(u._id)}
              >
                {blockedIds.includes(u._id) ? "Unblock" : "Block"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
