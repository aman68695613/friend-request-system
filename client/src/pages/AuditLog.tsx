
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

interface AuditLogEntry {
  action: string;
  targetUser?: {
    username: string;
  };
  timestamp: string;
}

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/user/audit-log").then((res) => setLogs(res.data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <Button variant="outline" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Audit Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Target User</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.targetUser?.username || "Unknown"}</TableCell>
                    <TableCell className="text-right">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No logs yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
