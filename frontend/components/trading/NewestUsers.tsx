import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "components/ui/table";
import axios from "axios";
import Card from "components/Card";
import { truncateAddress } from "utils";
import { formatDistance } from "date-fns";
import type { User } from "@prisma/client";
import { useState, useEffect } from "react";

export default function NewestUsers({
  users: defaultUsers,
}: {
  users: User[];
}) {
  // Newest users list
  const [users, setUsers] = useState<User[]>(defaultUsers);

  /**
   * Collect users and update
   */
  async function updateUsers() {
    const {
      data: { users },
    } = await axios.get("/api/stats/newest");
    setUsers(users);
  }

  // Collect new users every 15s
  useEffect(() => {
    async function run() {
      await updateUsers();
    }

    // Update every 15s
    const interval = setInterval(() => run(), 1000 * 15);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card title="Newest Users">
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Supply</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <a
                    href={`https://basescan.org/address/${user.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {truncateAddress(user.address, 8)}
                  </a>
                </TableCell>
                <TableCell>{user.supply}</TableCell>
                <TableCell>
                  {formatDistance(new Date(user.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}