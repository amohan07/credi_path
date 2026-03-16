import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/cards/StatCard";
import { getLoans } from "../../services/loanService";
import { useAuth } from "../../hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await getLoans();
      const loans = res;

      setStats({
        total: loans.length,
        approved: loans.filter((l) => l.status === "approved").length,
        pending: loans.filter((l) => l.status === "pending").length,
        rejected: loans.filter((l) => l.status === "rejected").length,
        completed: loans.filter((l) => l.status === "completed").length,
      });
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
        Dashboard
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Loans" value={stats.total} />

        {user.role === "admin" ? (
          <>
            <StatCard title="Pending Approvals" value={stats.pending} />
            <StatCard title="Approved Loans" value={stats.approved} />
            <StatCard title="Rejected Loans" value={stats.rejected} />
            <StatCard title="Completed Loans" value={stats.completed} />
          </>
        ) : (
          <>
            <StatCard title="Approved Loans" value={stats.approved} />
            <StatCard title="Pending Loans" value={stats.pending} />
            <StatCard title="Rejected Loans" value={stats.rejected} />
            <StatCard title="Completed Loans" value={stats.completed} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
